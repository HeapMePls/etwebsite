const quizData = [
    {
        question: "¿Qué quieres lograr?",
        answers: ["Mejorar mi condición cognitiva, mi estado de ánimo o aliviar estrés.",
                 "Mejorar mi condición física para sentirme fuerte y seguro.",
                 "Aumentar mis vínculos sociales para salir, conocer gente y organizar mi tiempo libre."
                ]
    },
    {
        question: "Señala tu situación actual:",
        answers: ["Permanezco en la cama la mayor parte del día.",
                 "Camino con ayuda de un familiar, con  bastón o andador.",
                 "Camino sin dificultad y me mantengo en actividad."
                ]
    },
    {
        question: "Señala tus objetivos:",
        answers: ["Mantener memoria y agilidad mental, manejar mis emociones y autonomía.",
                 "Me gustaría sentirme fuerte y activo para pasear, viajar y hacer ejercicios físicos en forma rutinaria.",
                 "Concurrir a eventos sociales, familiares y salir con amigos."
                ]
    },
    {
        question: "Señala si tienes algunas de estos problemas:",
        answers: ["Dolores limitantes.",
                 "Olvidos frecuentes o pérdida de memoria.",
                 "Falta de motivación para salir o no tengo con quien hacerlo."
                ]
    },
    {
        question: "¿Cuáles de estas actividades realizas y disfrutas?",
        answers: ["Lectura, cine o música.",
                 "Caminar, hacer gimnasia o bailar.",
                 "Viajar, interactuar en redes sociales o realizar actividades grupales."
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
        //question: quizData[currentQuestionIndex].question,
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
    
    questionEl.textContent = "¡Fin del cuestionario!";
    answersEl.innerHTML = '';

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
}
