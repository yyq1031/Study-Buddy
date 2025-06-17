require('dotenv').config();

const express = require("express");
const admin = require('firebase-admin')
const authenticate = require('./middleware/auth');
const router = express.Router();

const serviceAccount = require('./firebase-server-account.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

router.post("/getprofile", authenticate, async (req, res) => {
    try {
        const uid = req.user.uid;
        const userDocRef = db.collection("users").doc(uid);
        const userDoc = await userDocRef.get();
        if (!userDoc.exists) {
            const newUser = {
                name: req.body.name || 'Jane Doe',
                email: req.body.email,
                role: 'student',
                createdAt: new Date().toISOString(),
                classes: []
            }
            await userDocRef.set(newUser);
            return res.json(newUser);
        }
        return res.json(userDoc.data());
    } catch (err) {
        console.error("Error in /getprofile:", err);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.get("/getClasses", authenticate, async (req, res) => {
    try {
        const uid = req.user.uid;
        const userDoc = await db.collection("users").doc(uid).get();
        if (!userDoc.exists) {
            return res.status(404).json({message: "User data not found"});
        }
        const classes = userDoc.data()?.classes || [];
        const detailedClasses = [];
        for (const classId of classes) {
            const classDocRef = await db.collection("classes").doc(classId);
            const classDoc = await classDocRef.get();
            detailedClasses.push(classDoc.data());
        }
        return res.json(detailedClasses);
    } catch (err) {
        console.error("Error in /getClasses:", err);
        res.status(500).json({ message: "Internal server error" });
    }
})

// teacher creates new class, then return new list of the teacher's classes
router.post("/createClass", authenticate, async (req, res) => {
    try {
        const uid = req.user.uid;
        const userDocRef = db.collection("users").doc(uid);
        const userDoc = await userDocRef.get();
        if (userDoc.data()?.role !== "teacher") {
            console.error("Only teachers can create classes");
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
        }
        const classDocRef = await db.collection("classes").add(newClass);
        classes.push(classDocRef.id);
        // update the teacher's classes
        await db.collection("users").doc(uid).update({
            classes: classes
        });
        return res.json(classes);
    } catch (err) {
        console.error("Error in /createClass:", err);
        res.status(500).json({ message: "Internal server error" });
    }
})

// assign a student to a class
router.post("/assignStudentToClass/:classId/:studentId", authenticate, async (req, res) => {
    try {
        const uid = req.user.uid;
        const userDoc = await db.collection("users").doc(uid).get();
        if (userDoc.data()?.role !== "teacher") {
            console.error("Only teachers can create classes");
            return res.status(401).json({ message: "Only teachers can create classes" });
        }

        const { classId, studentId } = req.params;

        const studentDocRef = await db.collection("users").doc(studentId).get();
        const studentClasses = studentDocRef.data()?.classes || [];
        studentClasses.push(classId)
        await db.collection("users").doc(studentId).update({ classes: studentClasses });

        const classDocRef = await db.collection("classes").doc(classId).get();
        const studentIds = classDocRef.data()?.studentIds || [];
        studentIds.push(studentId)
        await db.collection("classes").doc(classId).update({ studentIds: studentIds });

        return res.json({ message: `Student ${studentDocRef.data()?.name} has been successfully enrolled in class ${classDocRef.data()?.name}` });
    } catch (err) {
        console.error("Error in /assignStudentToClass:", err);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.get("/getAllProgress/:classId/:lessonId", authenticate, async (req, res) => {
  try {
    const uid = req.user.uid;
    const userDoc = await db.collection("users").doc(uid).get();
    if (userDoc.data()?.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can access this data" });
    }

    const { classId, lessonId } = req.params;
    const progressCollection = db.collection(`progress/${classId}_${lessonId}/studentProgress`);
    const snapshot = await progressCollection.get();

    const allProgress = [];
    snapshot.forEach(doc => {
      allProgress.push({
        studentId: doc.id,
        ...doc.data()
      });
    });

    return res.json(allProgress);
  } catch (err) {
    console.error("Error in /getAllProgress:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/getStudentProgress/:classId/:lessonId", authenticate, async (req, res) => {
  try {
    const studentId = req.user.uid; // or req.params.studentId if you’re getting for someone else (like a teacher)
    const { classId, lessonId } = req.params;
    const progressDocPath = `progress/${classId}_${lessonId}/studentProgress/${studentId}`;

    const progressDoc = await db.doc(progressDocPath).get();

    if (!progressDoc.exists) {
      return res.status(404).json({ message: "Progress not found" });
    }

    return res.json(progressDoc.data());
  } catch (err) {
    console.error("Error in /getStudentProgress:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/updateProgress/:classId/:lessonId/:quizId", authenticate, async (req, res) => {
  const { classId, lessonId, quizId } = req.params;
  const uid = req.user.uid;
  const { answers, score, timeTaken } = req.body;

  const progressRef = db
    .collection(`progress/${classId}_${lessonId}/studentProgress`)
    .doc(uid);

  await progressRef.set({
    [quizId]: {
      answers,
      score,
      timeTaken,
      submittedAt: new Date().toISOString()
    }
  }, { merge: true });

  res.json({ message: "Submission recorded." });
});

module.exports = router;