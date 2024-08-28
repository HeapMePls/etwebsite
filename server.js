const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const app = express();
const port = 3000;
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const db = mysql.createPool({
    host: process.env.dbhost,
    user: process.env.dbuser,
    password: process.env.dbpw,
    database: process.env.db
});

app.get('/landing', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/quiz', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'quiz.html'));
});

app.post('/api/save', async (req, res) => {
    const { name, email, phone, userAnswers } = req.body;

    try {
        const queryNewUser = `INSERT INTO users (name, email, phone) VALUES (?, ?, ?)`;
        const [userResult] = await db.query(queryNewUser, [name, email, phone]);
        const userId = userResult.insertId;

        const userAnswersJson = JSON.stringify(userAnswers);

        const queryUserQuiz = `INSERT INTO quiz (user_id, selected_answers) VALUES (?, ?)`;
        await db.query(queryUserQuiz, [userId, userAnswersJson]);

        res.status(200).json({ message: 'Quiz data saved successfully!' });
    } catch (err) {
        console.error('Error saving data:', err);
        res.status(500).json({ message: 'Error saving data' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
