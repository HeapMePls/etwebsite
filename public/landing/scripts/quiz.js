const quizData = [
    {
        question: "¿Cuál es la principal área de tu vida que te gustaría mejorar?",
        answers: [
            { text: "Mantener mi mente activa y mejorar mi memoria.", type: "Cognitive" },
            { text: "Sentirme más conectado y tener más relaciones significativas.", type: "Social" },
            { text: "Aumentar mi energía y mejorar mi movilidad.", type: "Physical" }
        ]
    },
    {
        question: "¿Cómo te sientes en este momento respecto a tu bienestar general?",
        answers: [
            { text: "Motivado pero necesito un empujón extra.", type: "Physical" },
            { text: "Un poco perdido, no sé por dónde empezar.", type: "Physical" },
            { text: "Estresado o desanimado, necesito un cambio.", type: "Physical" }
        ]
    },
    {
        question: "¿Qué tan dispuesto estás a invertir en tu bienestar?",
        answers: [
            { text: "Puedo invertir en un plan a largo plazo si veo resultados.", type: "Cognitive" },
            { text: "Prefiero opciones accesibles o de bajo costo.", type: "Physical" },
            { text: "Estoy buscando opciones gratuitas o con un costo mínimo.", type: "Social" }
        ]
    }
];

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
            button.textContent = answer.text;
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
        selectedAnswer: quizData[currentQuestionIndex].answers[answerIndex].text,
        selectedType: quizData[currentQuestionIndex].answers[answerIndex].type
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
    
    questionEl.textContent = "¡Fin del cuestionario!";
    answersEl.innerHTML = '';

    // Display message based on each answer
    userAnswers.forEach((answer, index) => {
        const message = document.createElement('p');
        switch (index) {
            case 0: // For Question 1
                if (answer.selectedAnswer === quizData[0].answers[0].text) {
                    message.textContent = 'Te gustaría mantener tu mente activa y mejorar tu memoria.';
                } else if (answer.selectedAnswer === quizData[0].answers[1].text) {
                    message.textContent = 'Te gustaría sentirte más conectado y tener más relaciones significativas.';
                } else {
                    message.textContent = 'Te gustaría aumentar tu energía y mejorar tu movilidad.';
                }
                break;
            case 1: // For Question 2
                if (answer.selectedAnswer === quizData[1].answers[0].text) {
                    message.textContent = 'Te sientes motivado, pero necesitas un empujón extra.';
                } else if (answer.selectedAnswer === quizData[1].answers[1].text) {
                    message.textContent = 'Te sientes un poco perdido y no sabes por dónde empezar.';
                } else {
                    message.textContent = 'Te sientes estresado o desanimado, necesitas un cambio.';
                }
                break;
            case 2: // For Question 3
                if (answer.selectedAnswer === quizData[2].answers[0].text) {
                    message.textContent = 'Estás dispuesto a invertir en un plan a largo plazo si ves resultados.';
                } else if (answer.selectedAnswer === quizData[2].answers[1].text) {
                    message.textContent = 'Prefieres opciones accesibles o de bajo costo.';
                } else {
                    message.textContent = 'Buscas opciones gratuitas o de bajo costo.';
                }
                break;
            default:
                message.textContent = 'Gracias por completar el cuestionario.';
                break;
        }
        answersEl.appendChild(message);
    });

    // Create the form as before
    const form = document.createElement('form');
    form.classList.add('quiz-form');
    
    const nameField = document.createElement('input');
    nameField.type = 'text';
    nameField.placeholder = 'Nombre';
    nameField.required = true;

    const emailField = document.createElement('input');
    emailField.type = 'email';
    emailField.placeholder = 'Correo';
    emailField.required = true;

    const phoneField = document.createElement('input');
    phoneField.type = 'tel';
    phoneField.placeholder = 'Teléfono';
    phoneField.required = true;

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Registrar';
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


    try {
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert('Quiz data sent via email successfully!');
        } else {
            alert('Error sending email.');
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Error sending email.');
    }
}

