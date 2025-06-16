require('dotenv').config();

const express = require("express");
const cors = require("cors");

const loginRoutes = require('./auth.js');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // if you're using cookies/auth
}));

app.use('/api', loginRoutes)

app.get('/api/hello', (req, res) => {
    res.json({ message: "hihi" })
});

app.listen(PORT, () => {
    console.log('Server running on http://localhost:{PORT}');
});