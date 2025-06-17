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

    let allLessonDetails = []
    const docSnap = await db.collection("classes").doc(classId.trim()).get();
    if (!docSnap.exists) {
      console.warn(`Class with id ${classId} not found`);
      continue;
    } else {
      const lessonIds = docSnap.data()?.lessons || [];
      for (const lId of lessonIds) {
        const lessonDocSnap = await db.collection("lessons").doc(lId.trim()).get();
        if (lessonDocSnap.exists) {
          const lessonInfo = {
            id: lId,
            ...lessonDocSnap.data(),
          };
          allLessonDetails.push(lessonInfo);
        } else {
          console.warn(`Lesson with id ${lId} not found`);
        }
      }
    }


    let nextLessonInfo = null;
    if (nextLessonId && nextLessonId.trim() !== "") {
      const lessonDocSnap = await db.collection("lessons").doc(nextLessonId.trim()).get();
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
      allLessonDetails: allLessonDetails,
      nextLesson: nextLessonInfo,
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
        const userDocRef = db.collection("users").doc(uid.trim());
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
    const userDoc = await db.collection("users").doc(uid.trim()).get();
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

// POST /createClass - teacher creates new class
router.post("/createClass", authenticate, async (req, res) => {
  try {
    const uid = req.user.uid;
    const userDocRef = db.collection("users").doc(uid.trim());
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
    const userDoc = await db.collection("users").doc(uid.trim()).get();

    if (!userDoc.exists || userDoc.data()?.role !== "teacher") {
      return res.status(401).json({ message: "Only teachers can assign students" });
    }

    const { classId, studentId } = req.params;

    // Fetch class
    const classDocRef = db.collection("classes").doc(classId.trim());
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
    const studentDocRef = db.collection("users").doc(studentId.trim());
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

// POST /updateProgress/:lessonId - update student's progress
router.post("/updateProgress/:lessonId", authenticate, async (req, res) => {
  try {
    const lessonId = req.params.lessonId.trim();
    if (!lessonId || typeof lessonId !== "string" || lessonId.includes("/")) {
      return res.status(400).json({ message: "Invalid lessonId" });
    }
    const studentId = req.user.uid;
    const { quizes = [], confidenceLevels = {} } = req.body;

    const progressRef = db.collection(`progress/${lessonId.trim()}/studentProgress`).doc(studentId.trim());
    const progressDoc = await progressRef.get();

    const previousData = progressDoc.exists ? progressDoc.data() : {};
    const existingQuestions = Array.isArray(previousData.questions) ? previousData.questions : [];

    const updatedQuestions = [...existingQuestions];

    for (const quiz of quizes) {
      const { questionId, score } = quiz;
      if (!questionId) continue;

      const existingIndex = updatedQuestions.findIndex(q => q.questionId === questionId);
      const entry = {
        questionId,
        score,
        submittedAt: new Date().toISOString()
      };

      if (existingIndex !== -1) {
        updatedQuestions[existingIndex] = entry;
      } else {
        updatedQuestions.push(entry);
      }
    }

    await progressRef.set({
      questions: updatedQuestions,
      confidenceLevels,
    }, { merge: true });

    res.json({ message: "Progress successfully updated." });

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
    const classDoc = await db.collection('classes').doc(classId.trim()).get();
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

    const userDoc = await db.collection("users").doc(studentId.trim()).get();
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
        const lessonDocSnap = await db.collection("lessons").doc(nextLessonId.trim()).get();
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
    const lessonId = req.params.lessonId.trim();
    const studentId = req.user.uid;

    const lessonDocSnap = await db.collection("lessons").doc(lessonId.trim()).get();
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
      const questionDoc = await db.collection("questions").doc(qId.trim()).get();
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

// GET /getClassAndLessons - return classes and lesson ids/names
router.get("/getClassAndLessons", authenticate, async (req, res) => {
  try {
    const uid = req.user.uid;
    const userDoc = await db.collection("users").doc(uid.trim()).get();
    if (!userDoc.exists) return res.status(404).json({ message: "User not found" });

    const classInfoList = userDoc.data()?.classes || [];
    const result = [];

    for (const entry of classInfoList) {
      const classId = entry.classId;
      if (classId == undefined) {
        continue
      }
      const classDoc = await db.collection("classes").doc(classId.trim()).get();
      if (!classDoc.exists) continue;

      const classData = classDoc.data();
      const lessonIds = classData.lessons || [];
      
      const detailedLessons = [];

      for (const lessonId of lessonIds) {
        console.log(lessonId)
        const lessonDoc = await db.collection("lessons").doc(lessonId.trim()).get();
        if (lessonDoc.exists) {
          const lessonData = lessonDoc.data();
          detailedLessons.push({
            id: lessonId,
            name: lessonData.name || "Unnamed Lesson",
            ...lessonData,
          });
        }
      }

      // const { detailedLessons: _, ...restClassData } = classData;
      result.push({
        id: classId,
        name: classData.name || "Unnamed Class",
        detailedLessons: detailedLessons,
        ... classData,
      });
    }

    res.json(result);

  } catch (err) {
    console.error("Error in /getClassAndLessons:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /createQuestion - create a new question (e.g., teacher only)
router.post("/createQuestion/:lessonId", authenticate, requireRole("teacher"), async (req, res) => {
  try {
    const lessonId = req.params.lessonId.trim();

    const {
      question,
      options,
      correctAnswer,
      explanation,
      tag,
    } = req.body;

    // Create question object
    const newQuestion = {
      contents: {
        answer: correctAnswer,
        explanation: text,
        options: options,
        question: question,
      },
      difficulty: "easy",
      type: type,
      tags: tags,
      lessonId: lessonId,
    };

    // Add to Firestore
    const questionRef = await db.collection("questions").add(newQuestion);

    // Optionally associate question with a lesson
    if (lessonId) {
      const lessonRef = db.collection("lessons").doc(lessonId.trim());
      const lessonDoc = await lessonRef.get();

      if (!lessonDoc.exists) {
        return res.status(404).json({ message: "Lesson not found" });
      }

      const lessonQuestions = lessonDoc.data().questions || [];
      lessonQuestions.push(questionRef.id);
      await lessonRef.update({ questions: lessonQuestions });
    }

    res.json({ message: "Question created", questionId: questionRef.id });

  } catch (err) {
    console.error("Error in /createQuestion:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;