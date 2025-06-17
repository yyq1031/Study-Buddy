require('dotenv').config();

const express = require("express");
const { admin, db } = require("./firebaseAdmin");
const authenticate = require('./middleware/auth');
const requireRole = require("./middleware/requireRole");
const { getDoc } = require("./utils");

const router = express.Router();

// Helper to fetch detailed classes from IDs
async function fetchDetailedClasses(classInfoList) {
  const detailedClasses = [];

  for (const map of classInfoList) {
    const classId = map?.classId;
    const nextLessonId = map?.lessonId;

    if (!classId || typeof classId !== "string" || classId.trim() === "") {
      console.warn("Invalid classId:", classId);
      continue; // Skip this entry
    }

    const docSnap = await db.collection("classes").doc(classId).get();
    if (!docSnap.exists) {
      console.warn(`Class with id ${classId} not found`);
      continue;
    }

    let nextLessonInfo = null;
    if (nextLessonId && nextLessonId.trim() !== "") {
      const lessonDocSnap = await db.collection("lessons").doc(nextLessonId).get();
      if (lessonDocSnap.exists) {
        nextLessonInfo = {
          id: nextLessonId,
          ...lessonDocSnap.data(),
        };
      } else {
        console.warn(`Lesson with id ${nextLessonId} not found`);
      }
    }

    detailedClasses.push({
      id: docSnap.id,
      ...docSnap.data(),
      nextLesson: nextLessonInfo
    });
  }

  return detailedClasses;
}

// POST /getprofile - get or create user profile
router.post("/getprofile", authenticate, async (req, res) => {
  try {
    const uid = req.user.uid;
    let userData;

    try {
      const result = await getDoc(db, uid, "users");
      userData = result.data;
    } catch (err) {
      if (err.message.includes("users not found")) {
        const userDocRef = db.collection("users").doc(uid);
        const newUser = {
          name: req.body.name || "Jane Doe",
          email: req.body.email || "",
          role: "teacher",
          createdAt: new Date().toISOString(),
          classes: [],
        };
        await userDocRef.set(newUser);
        userData = newUser;
      } else {
        throw err;
      }
    }
    res.json({
      id: uid,
      ...userData
    });
  } catch (err) {
    console.error("Error in /getprofile:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /getClasses - get all classes for the authenticated user
router.get("/getClasses", authenticate, async (req, res) => {
  try {
    const uid = req.user.uid;
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) return res.status(404).json({ message: "User data not found" });

    // const classIds = userDoc.data()?.classes || [];
    // const detailedClasses = await fetchDetailedClasses(classIds);
    // res.json(detailedClasses);
    const classInfoList = userDoc.data()?.classes || [];
    const detailedClasses = await fetchDetailedClasses(classInfoList);
    res.json(detailedClasses);

  } catch (err) {
    console.error("Error in /getClasses:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /getClassesStudent/:studentId - get classes for a student (teacher access)
router.get("/getClassesStudent/:studentId", authenticate, requireRole("teacher"), async (req, res) => {
  try {
    const uid = req.user.uid;
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) return res.status(404).json({ message: "User data not found" });

    const { studentId } = req.params;
    const studentDoc = await db.collection("users").doc(studentId).get();
    if (!studentDoc.exists) return res.status(404).json({ message: "Student not found" });

    const classIds = studentDoc.data()?.classes || [];
    const detailedClasses = await fetchDetailedClasses(classIds);

    res.json(detailedClasses);
  } catch (err) {
    console.error("Error in /getClassesStudent:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /createClass - teacher creates new class
router.post("/createClass", authenticate, async (req, res) => {
  try {
    const uid = req.user.uid;
    const userDocRef = db.collection("users").doc(uid);
    const userDoc = await userDocRef.get();

    if (userDoc.data()?.role !== "teacher") {
      return res.status(401).json({ message: "Only teachers can create classes" });
    }

    const classes = userDoc.data()?.classes || [];
    const newClass = {
      name: req.body.name || 'LAG1201',
      active: req.body.active || false,
      createdAt: new Date().toISOString(),
      lessons: [],
      teacherIds: [uid],
      studentIds: [],
    };

    const classDocRef = await db.collection("classes").add(newClass);
    const newClassEntry = {
        classId: classDocRef.id,
        lessonId:  null,
      };
    classes.push(newClassEntry);

    await userDocRef.update({ classes });

    res.json(classes);
  } catch (err) {
    console.error("Error in /createClass:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /assignStudentToClass/:classId/:studentId - assign student to a class
router.post("/assignStudentToClass/:classId/:studentId", authenticate, async (req, res) => {
  try {
    const uid = req.user.uid;
    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists || userDoc.data()?.role !== "teacher") {
      return res.status(401).json({ message: "Only teachers can assign students" });
    }

    const { classId, studentId } = req.params;

    // Fetch class
    const classDocRef = db.collection("classes").doc(classId);
    const classDoc = await classDocRef.get();
    if (!classDoc.exists) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Add student to class's studentIds array if not already present
    const studentIds = classDoc.data().studentIds || [];
    if (!studentIds.includes(studentId)) {
      studentIds.push(studentId);
      await classDocRef.update({ studentIds });
    }

    // Fetch student
    const studentDocRef = db.collection("users").doc(studentId);
    const studentDoc = await studentDocRef.get();
    if (!studentDoc.exists) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Prepare student class structure { classId, lessonId }
    const studentClasses = studentDoc.data().classes || [];
    const alreadyAssigned = studentClasses.some(c => c.classId === classId);

    if (!alreadyAssigned) {
      const lessonIds = classDoc.data().lessons || [];
      const newClassEntry = {
        classId,
        lessonId: lessonIds.length > 0 ? lessonIds[0] : null,
      };
      studentClasses.push(newClassEntry);
      await studentDocRef.update({ classes: studentClasses });
    }

    res.json({
      message: `Student ${studentDoc.data().name} successfully enrolled in class ${classDoc.data().name}`,
    });

  } catch (err) {
    console.error("Error in /assignStudentToClass:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /getAllProgress/:classId/:lessonId - get all students' progress for a lesson (teacher only)
router.get("/getAllProgress/:classId/:lessonId", authenticate, requireRole("teacher"), async (req, res) => {
  try {
    const { classId, lessonId } = req.params;
    const progressCollection = db.collection(`progress/${classId}_${lessonId}/studentProgress`);
    const snapshot = await progressCollection.get();

    const allProgress = [];
    snapshot.forEach(doc => allProgress.push({ studentId: doc.id, ...doc.data() }));

    res.json(allProgress);
  } catch (err) {
    console.error("Error in /getAllProgress:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /getStudentProgress/:classId/:lessonId - get student's own progress
router.get("/getStudentProgress/:classId/:lessonId", authenticate, async (req, res) => {
  try {
    const studentId = req.user.uid;
    const { classId, lessonId } = req.params;
    const progressDocPath = `progress/${classId}_${lessonId}/studentProgress/${studentId}`;
    const progressDoc = await db.doc(progressDocPath).get();

    if (!progressDoc.exists) {
      return res.status(404).json({ message: "Progress not found" });
    }

    res.json(progressDoc.data());
  } catch (err) {
    console.error("Error in /getStudentProgress:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /updateProgress/:classId/:lessonId/:quizId - update student's progress
router.post("/updateProgress/:classId/:lessonId/:quizId", authenticate, async (req, res) => {
  try {
    const { classId, lessonId, quizId } = req.params;
    const uid = req.user.uid;
    const { answers, score, timeTaken } = req.body;

    const progressRef = db.collection(`progress/${classId}_${lessonId}/studentProgress`).doc(uid);
    await progressRef.set({
      [quizId]: {
        answers,
        score,
        timeTaken,
        submittedAt: new Date().toISOString()
      }
    }, { merge: true });

    res.json({ message: "Submission recorded." });
  } catch (err) {
    console.error("Error in /updateProgress:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /getAllStudents - get all students (teacher only)
router.get("/getAllStudents", authenticate, requireRole("teacher"), async (req, res) => {
  try {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("role", "==", "student").get();

    const students = [];
    snapshot.forEach(doc => students.push({ id: doc.id, ...doc.data() }));

    res.json(students);
  } catch (err) {
    console.error("Error in /getAllStudents:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get('/getStudentClassProgress/:classId', authenticate, async (req, res) => {
  try {
    const { classId } = req.params;
    const studentId = req.user.uid;

    // Only allow access if requester is student (self) or teacher
    // const requesterRole = req.user.role; // if you saved role in req.user
    // if (req.user.uid !== studentId && requesterRole !== 'teacher') {
    //   return res.status(403).json({ message: 'Forbidden' });
    // }

    // Get class lessons
    const classDoc = await db.collection('classes').doc(classId).get();
    if (!classDoc.exists) return res.status(404).json({ message: 'Class not found' });
    const lessons = classDoc.data().lessons || [];

    let completedCount = 0;
    const details = [];

    // For each lesson, get progress of this student
    for (const lessonId of lessons) {
      const location = `/progress/${lessonId.trim()}/studentProgress/${studentId.trim()}`
      const progressDoc = await db
        .doc(location)
        .get();

      let completed = true;
      const progressData = progressDoc.exists ? progressDoc.data() : null;
      if (progressData?.confidenceLevels) {
        for (const [tag, val] of Object.entries(progressData.confidenceLevels)) {
          if (parseInt(val) < 80) {
            completed = false;
            break;
          }
        }
      }

      if (completed) completedCount++;

      details.push({
        lessonId,
        completed,
        progress: progressData,
      });
    }

    const userDoc = await db.collection("users").doc(studentId).get();
    if (!userDoc.exists) return res.status(404).json({ message: "User data not found" });
    const classInfoList = userDoc.data()?.classes || [];

    let nextLessonInfo = null;
    for (const map of classInfoList) {
      const currClassId = map["classId"];
      if (currClassId != classId) {
        continue;
      }
      const nextLessonId = map["lessonId"];
      if (nextLessonId && nextLessonId.trim() !== "") {
        const lessonDocSnap = await db.collection("lessons").doc(nextLessonId).get();
        if (lessonDocSnap.exists) {
          nextLessonInfo = {
            id: nextLessonId,
            ...lessonDocSnap.data()
          };
        } else {
          console.warn(`Lesson with id ${nextLessonId} not found`);
        }
      }
      break;
    }


    res.json({
      nextLesson: nextLessonInfo,
      totalLessons: lessons.length,
      completedLessons: completedCount,
      details,
    });
  } catch (err) {
    console.error('Error in /getStudentClassProgress:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /getLesson - get all questions and user details of the lesson 
router.get("/getLesson/:lessonId", authenticate, requireRole("student"), async (req, res) => {
  try {
    const { lessonId } = req.params;
    const studentId = req.user.uid;

    const lessonDocSnap = await db.collection("lessons").doc(lessonId).get();
    if (!lessonDocSnap.exists) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const questionIds = lessonDocSnap.data()?.questions || [];
    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(404).json({ message: "No questions found in lesson" });
    }

    const progressDocPath = `/progress/${lessonId}/studentProgress/${studentId}`;
    const progressDoc = await db.doc(progressDocPath).get();
    const progressData = progressDoc.exists ? progressDoc.data() : {};
    const confidenceLevels = progressData?.confidenceLevels || {};
    const progressQuestions = progressData?.questions || [];

    const progressMap = {};
    for (const entry of progressQuestions) {
      if (entry?.questionId) {
        progressMap[entry.questionId] = entry;
      }
    }

    const questionDetails = [];
    for (const qId of questionIds) {
      const questionDoc = await db.collection("questions").doc(qId).get();
      if (!questionDoc.exists) {
        console.warn(`Question with id ${qId} not found`);
        continue;
      }
      const questionData = questionDoc.data();
      const progressEntry = progressMap[qId] || {};
      questionDetails.push({
        id: qId,
        ...questionData,
        score: progressEntry?.score ?? null,
      });
    }

    res.json({
      questionDetails,
      confidenceLevels,
    });

  } catch (err) {
    console.error("Error in /getLesson:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;