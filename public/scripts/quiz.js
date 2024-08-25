const quizData = [
    {
        question: "What is the capital of France?",
        answers: ["Paris", "London", "Berlin", "Rome"],
        correct: 0
    },
    {
        question: "Which planet is closest to the Sun?",
        answers: ["Earth", "Venus", "Mercury", "Mars"],
        correct: 2
    },
    {
        question: "Who wrote 'To Kill a Mockingbird'?",
        answers: ["Harper Lee", "J.K. Rowling", "Ernest Hemingway", "Mark Twain"],
        correct: 0
    }
];

let currentQuestionIndex = 0;
let userAnswers = [];

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
        selectedAnswer: quizData[currentQuestionIndex].answers[answerIndex],
        isCorrect: answerIndex === quizData[currentQuestionIndex].correct
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

    // Add an event listener to capture form submission
    form.addEventListener('submit', handleFormSubmit);

    answersEl.appendChild(form);

    document.querySelector('.quiz-container').classList.add('fade-in');
}

function handleFormSubmit(event) {
    event.preventDefault();

    const name = event.target.querySelector('input[type="text"]').value;
    const email = event.target.querySelector('input[type="email"]').value;
    const phone = event.target.querySelector('input[type="tel"]').value;

    console.log("Quiz Results:");
    userAnswers.forEach((answer, index) => {
        console.log(`${index + 1}. ${answer.question}`);
        console.log(`   Selected Answer: ${answer.selectedAnswer}`);
        console.log(`   Correct: ${answer.isCorrect ? "Yes" : "No"}`);
    });

    console.log("\nUser Information:");
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Phone: ${phone}`);

    // You can display this information in the UI or handle it further as per your need
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.quiz-container').classList.add('fade-in');
    loadQuestion();
});
