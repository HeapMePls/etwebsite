const quizData = [
    {
        question: "¿Qué quieres lograr?",
        answers: [
            { text: "Mejorar mi condición cognitiva, mi estado de ánimo o aliviar estrés.", type: "Cognitive" },
            { text: "Mejorar mi condición física para sentirme fuerte y seguro.", type: "Physical" },
            { text: "Aumentar mis vínculos sociales para salir, conocer gente y organizar mi tiempo libre.", type: "Social" }
        ]
    },
    {
        question: "Señala tu situación actual:",
        answers: [
            { text: "Permanezco en la cama la mayor parte del día.", type: "Physical" },
            { text: "Camino con ayuda de un familiar, con bastón o andador.", type: "Physical" },
            { text: "Camino sin dificultad y me mantengo en actividad.", type: "Physical" }
        ]
    },
    {
        question: "Señala tus objetivos:",
        answers: [
            { text: "Mantener memoria y agilidad mental, manejar mis emociones y autonomía.", type: "Cognitive" },
            { text: "Me gustaría sentirme fuerte y activo para pasear, viajar y hacer ejercicios físicos en forma rutinaria.", type: "Physical" },
            { text: "Concurrir a eventos sociales, familiares y salir con amigos.", type: "Social" }
        ]
    },
    {
        question: "Señala si tienes algunas de estos problemas:",
        answers: [
            { text: "Dolores limitantes.", type: "Physical" },
            { text: "Olvidos frecuentes o pérdida de memoria.", type: "Cognitive" },
            { text: "Falta de motivación para salir o no tengo con quien hacerlo.", type: "Social" }
        ]
    },
    {
        question: "¿Cuáles de estas actividades realizas y disfrutas?",
        answers: [
            { text: "Lectura, cine o música.", type: "Cognitive" },
            { text: "Caminar, hacer gimnasia o bailar.", type: "Physical" },
            { text: "Viajar, interactuar en redes sociales o realizar actividades grupales.", type: "Social" }
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
            tallySelectedTypes();
            
            
        }
    }, 500);
}

function tallySelectedTypes() {
    const typeCount = {};

    userAnswers.forEach(answer => {
        const type = answer.selectedType;
        if (typeCount[type]) {
            typeCount[type]++;
        } else {
            typeCount[type] = 1;
        }
    });

    const mostFrequentType = Object.keys(typeCount).reduce((a, b) => typeCount[a] > typeCount[b] ? a : b);

    return mostFrequentType;
}


function showQuizCompletionForm() {
    const questionEl = document.getElementById('question');
    const answersEl = document.getElementById('answers');
    
    questionEl.textContent = "¡Fin del cuestionario!";
    answersEl.innerHTML = '';

    const mostFrequentType = tallySelectedTypes();

    const message = document.createElement('p');
    switch (mostFrequentType) {
        case 'Cognitive':
            message.textContent = 'Parece que tus objetivos se centran en mejorar tu condición cognitiva.';
            break;
        case 'Physical':
            message.textContent = 'Parece que estás más interesado en mejorar tu condición física.';
            break;
        case 'Social':
            message.textContent = 'Tus respuestas muestran que te gustaría fortalecer tus vínculos sociales.';
            break;
        default:
            message.textContent = 'Gracias por completar el cuestionario.';
            break;
    }
    
    // Append the message
    answersEl.appendChild(message);

    // Create the form
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
