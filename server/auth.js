require('dotenv').config();

const bcrypt = require('bcrypt');
const express = require("express");

const { MongoClient, ServerApiVersion } = require('mongodb');
const URL = process.env.MONGODB_URL || '';
const client = new MongoClient(URL, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let db = null;
async function connectToDB() {
    if (!db) {
        await client.connect();
        db = client.db(process.env.DB_NAME)
    }
    return db;
}

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const db = await connectToDB();
        const users = db.collection('users');

        const existingUser = await users.findOne({email});
        if (existingUser) {
            return res.status(400).json({message:"User already exists"});
        }
        
        const passwordHash = await bcrypt.hash(password, 10);

        await users.insertOne({
            email: email, 
            passwordHash: passwordHash, 
            details: [],
        });

        res.json({ message: "User created" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
})
    
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const db = await connectToDB();
        const users = db.collection('users');

        const existingUser = await users.findOne({email});

        if (!existingUser || !(await bcrypt.compare(password, existingUser.passwordHash))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        res.json({message: "Login success"});

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
})

module.exports = router;