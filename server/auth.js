require('dotenv').config();

const express = require("express");
const admin = require('firebase-admin')

const router = express.Router();

const serviceAccount = require('./firebase-server-account.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

router.post("/getprofile", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const idToken = authHeader.split("Bearer ")[1];
    try {
        const decoded = await admin.auth().verifyIdToken(idToken);
        const uid = decoded.uid;

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
        console.error("Token verification failed:", err);
        res.status(401).json({ message: "Invalid or expired token. Sign in again." });
    }
})

router.post("/classes", async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const idToken = authHeader.split("Bearer ")[1];

    try {
        const decoded = await admin.auth().verifyIdToken(idToken);
        const uid = decoded.uid;

        const userDoc = await db.collection("users").doc(uid).get();
        if (!userDoc.exists) {
            return res.status(404).json({message: "User data not found"});
        }
        return res.json(userDoc.data());
    } catch (err) {
        console.error("Token verification failed:", err);
        res.status(401).json({ message: "Invalid or expired token. Sign in again." });
    }
})

module.exports = router;