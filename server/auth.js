require('dotenv').config();

const express = require("express");
const { admin, db } = require("./firebaseAdmin");
const authenticate = require('./middleware/auth');
const requireRole = require("./middleware/requireRole");
const { getDoc } = require("./utils");

const router = express.Router();

// Helper to fetch detailed classes from IDs
async function fetchDetailedClasses(classIds) {
  const detailedClasses = [];
  for (const classId of classIds) {
    const docSnap = await db.collection("classes").doc(classId).get();
    if (!docSnap.exists) {
      console.warn(`Class with id ${classId} not found`);
      continue;
    }
    detailedClasses.push({ id: docSnap.id, ...docSnap.data() });
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
          role: "student",
          createdAt: new Date().toISOString(),
          classes: [],
        };
        await userDocRef.set(newUser);
        userData = newUser;
      } else {
        throw err;
      }
    }

    res.json(userData);
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

    const classIds = userDoc.data()?.classes || [];
    const detailedClasses = await fetchDetailedClasses(classIds);

    res.json(detailedClasses);
  } catch (err) {
    console.error("Error in /getClasses:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /getClassesStudent/:studentId - get classes for a student (teacher access)
router.get("/getClassesStudent/:studentId", authenticate, async (req, res) => {
  try {
    const uid = req.user.uid;
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) return res.status(404).json({ message: "User data not found" });

    // TODO: Add access control to ensure teacher can access this student’s classes

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
    classes.push(classDocRef.id);

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

    if (userDoc.data()?.role !== "teacher") {
      return res.status(401).json({ message: "Only teachers can assign students" });
    }

    const { classId, studentId } = req.params;

    // Update student's classes
    const studentDocRef = db.collection("users").doc(studentId);
    const studentDoc = await studentDocRef.get();
    if (!studentDoc.exists) return res.status(404).json({ message: "Student not found" });

    const studentClasses = studentDoc.data()?.classes || [];
    if (!studentClasses.includes(classId)) {
      studentClasses.push(classId);
      await studentDocRef.update({ classes: studentClasses });
    }

    // Update class's studentIds
    const classDocRef = db.collection("classes").doc(classId);
    const classDoc = await classDocRef.get();
    if (!classDoc.exists) return res.status(404).json({ message: "Class not found" });

    const studentIds = classDoc.data()?.studentIds || [];
    if (!studentIds.includes(studentId)) {
      studentIds.push(studentId);
      await classDocRef.update({ studentIds });
    }

    res.json({ message: `Student ${studentDoc.data().name} successfully enrolled in class ${classDoc.data().name}` });
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

module.exports = router;