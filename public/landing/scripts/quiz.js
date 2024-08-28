document.addEventListener('DOMContentLoaded', () => {
    loadQuestion();
});

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
    nameField.placeholder = 'Name';
    nameField.required = true;

    const emailField = document.createElement('input');
    emailField.type = 'email';
    emailField.placeholder = 'Email';
    emailField.required = true;

    const phoneField = document.createElement('input');
    phoneField.type = 'tel';
    phoneField.placeholder = 'Phone';
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

    const payload = {
        name,
        email,
        phone,
        userAnswers
    };

    try {
        const response = await fetch('/api/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert('Quiz data saved successfully!');
        } else {
            alert('Error saving quiz data.');
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Error saving quiz data.');
    }
}
