const mysql = require('mysql2');
require('dotenv').config();

const quizData = [
    {
        question: "What is the capital of France?",
        answers: ["Paris", "London", "Berlin", "Rome"]
    },
    {
        question: "Which planet is closest to the Sun?",
        answers: ["Earth", "Venus", "Mercury", "Mars"]
    },
    {
        question: "Who wrote 'To Kill a Mockingbird'?",
        answers: ["Harper Lee", "J.K. Rowling", "Ernest Hemingway", "Mark Twain"]
    }
];

let currentQuestionIndex = 0;
let userAnswers = [];

const db = mysql.createConnection({
    host: process.env.dbhost,
    user: process.env.dbuser,
    password: process.env.dbpw,
    database: process.env.db
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to db:', err);
        return;
    }
    //console.log('Connected to MySQL database');
});

function loadQuestion() {
    const questionEl = document.getElementById('question');
    const answersEl = document.getElementById('answers');

    const currentQuestion = quizData[currentQuestionIndex];

    document.querySelector('.quiz-container').classList.remove('fade-in');

    setTimeout(() => {
        questionEl.textContent = currentQuestion.question;
        answersEl.innerHTML = '';

        currentQuestion.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.textContent = answer;
            button.onclick = () => handleAnswerClick(index);
            const li = document.createElement('li');
            li.appendChild(button);
            answersEl.appendChild(li);
        });

        document.querySelector('.quiz-container').classList.add('fade-in');
    }, 500);
}

function handleAnswerClick(answerIndex) {
    userAnswers.push({
        question: quizData[currentQuestionIndex].question,
        selectedAnswer: quizData[currentQuestionIndex].answers[answerIndex]
    });

    currentQuestionIndex++;

    document.querySelector('.quiz-container').classList.remove('fade-in');

    setTimeout(() => {
        if (currentQuestionIndex < quizData.length) {
            loadQuestion();
        } else {
            showQuizCompletionForm();
        }
    }, 500); 
}

function showQuizCompletionForm() {
    const questionEl = document.getElementById('question');
    const answersEl = document.getElementById('answers');
    
    questionEl.textContent = "Quiz finished!";
    answersEl.innerHTML = '';

    const form = document.createElement('form');
    form.classList.add('quiz-form');
    
    const nameField = document.createElement('input');
    nameField.type = 'text';
    nameField.placeholder = 'Nombre';
    nameField.required = true;

    const emailField = document.createElement('input');
    emailField.type = 'email';
    emailField.placeholder = 'Correo electrónico';
    emailField.required = true;

    const phoneField = document.createElement('input');
    phoneField.type = 'tel';
    phoneField.placeholder = 'Telefono';
    phoneField.required = true;

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.type = 'submit';

    form.appendChild(nameField);
    form.appendChild(emailField);
    form.appendChild(phoneField);
    form.appendChild(submitButton);

    form.addEventListener('submit', handleFormSubmit);

    answersEl.appendChild(form);

    document.querySelector('.quiz-container').classList.add('fade-in');
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const name = event.target.querySelector('input[type="text"]').value;
    const email = event.target.querySelector('input[type="email"]').value;
    const phone = event.target.querySelector('input[type="tel"]').value;

    console.log("Quiz Results:");
    userAnswers.forEach((answer, index) => {
        console.log(`${index + 1}. ${answer.question}`);
        console.log(`   Selected Answer: ${answer.selectedAnswer}`);
    });

    console.log("\nUser Information:");
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Phone: ${phone}`);

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
}


document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.quiz-container').classList.add('fade-in');
    loadQuestion();
});
