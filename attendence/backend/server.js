const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const multer =require('multer');
const app = express();

app.use(cors());
app.use(express.json());
const upload = multer();

app.use(upload.none());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "attendence" 
});

db.connect((err) => {
    if (!err) console.log("connected");
    else console.log(err);
});

app.post('/register', (req, res) => {
    const { name, Roll_No,photo} = req.body;

    // Get current date and time
    const currentDate = new Date().toISOString().slice(0, 10);
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });

    const createUser = 'INSERT INTO late (name, Roll_No, Date, time,photo) VALUES (?, ?, ?, ?,?) ON DUPLICATE KEY UPDATE name = VALUES(name), Date = VALUES(Date), time = VALUES(time),photo=VALUES(photo) ';

    db.query(createUser, [name, Roll_No, currentDate, currentTime,photo], (e, r) => {
        if (e) {
            throw e;
            res.json({ success: false, data: 'Registration failed' });
        }
        return res.status(200).json({ success: true, data: 'User created successfully' });
    });
});

app.listen(5050, () => {
    console.log("server is running on port 5050");
});
