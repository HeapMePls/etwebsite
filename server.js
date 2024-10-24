const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const app = express();
const port = 3000;
const path = require('path');
const nodemailer = require('nodemailer');
const multer = require('multer');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// temp

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads'); // Directory where files will be stored
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname); // Custom filename
    }
});

const upload = multer({ storage: storage });

// File upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    // File information is available in req.file
    console.log('File uploaded:', req.file);

    res.status(200).json({
        message: 'File uploaded successfully!',
        file: req.file
    });
});

//

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

        const queryUserQuiz = `INSERT INTO quiz (user_id, selected_answer) VALUES (?, ?)`;
        await db.query(queryUserQuiz, [userId, userAnswersJson]);

        res.status(200).json({ message: 'Quiz data saved successfully!' });
    } catch (err) {
        console.error('Error saving data:', err);
        res.status(500).json({ message: 'Error saving data' });
    }
});

app.post('/api/send-email', async (req, res) => {
    const { name, email, phone, userAnswers } = req.body;

    try {
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const formattedAnswers = userAnswers.map((answer, index) => {
            return `Question ${index + 1}: ${answer.selectedAnswer} (Type: ${answer.selectedType})`;
        }).join('\n');

        let mailOptions = {
            from: 'info.espaciotres@gmail.com', // Sender address
            to: 'info.espaciotres@gmail.com',             // Recipient address
            subject: 'Nuevo usuario terminó cuestionario',                // Subject line
            text: `Un usuario contestó el cuestionario!\n\nNombre: ${name}\nE-mail: ${email}\nTeléfono: ${phone}\n\nRespuestas:\n${formattedAnswers}`
        };

        let info = await transporter.sendMail(mailOptions);

        console.log('Email sent: ' + info.response);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
