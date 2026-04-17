window.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM fully loaded!");

    document.getElementById("addQuestionBtn").addEventListener("click", () => addQuestion());
    document.getElementById("quizForm").addEventListener("submit", handleSubmit);

    if (typeof savedQuestions !== "undefined" && savedQuestions.length > 0) {
        savedQuestions.forEach(q => addQuestion(q));
    }

    // AI button click event
    document.getElementById("aiBtn").addEventListener("click", () => {
        document.getElementById("aiPopup").style.display = "block"; // Show the topic input popup
    });
});

let questionCount = 0;
const maxQuestions = 10;

function addQuestion(q = null) {
    if (questionCount >= maxQuestions) {
        alert("Max 10 questions!");
        return;
    }

    questionCount++;

    const container = document.createElement("div");
    container.className = "question-block";
    container.id = `question-${questionCount}`;

    // Ensure options are correctly filled in
    const optionA = q?.options ? q.options[0] : '';
    const optionB = q?.options ? q.options[1] : '';
    const optionC = q?.options ? q.options[2] : '';

    container.innerHTML = `
        <h3>Q${questionCount}</h3>
        <input type="text" name="question${questionCount}" value="${q?.question || ''}" placeholder="Enter your question..." required><br>

        <div class="options-container">
            <label>A: <input type="text" name="optionA${questionCount}" value="${optionA}" required></label>
            <label>B: <input type="text" name="optionB${questionCount}" value="${optionB}" required></label>
            <label>C: <input type="text" name="optionC${questionCount}" value="${optionC}" required></label>
        </div>

        <label>Select Correct Option:
            <select name="correct${questionCount}" required>
                <option value="">--Select--</option>
                <option value="A" ${q?.correct === 'A' ? 'selected' : ''}>A</option>
                <option value="B" ${q?.correct === 'B' ? 'selected' : ''}>B</option>
                <option value="C" ${q?.correct === 'C' ? 'selected' : ''}>C</option>
            </select>
        </label>

        <button type="button" class="delete-btn">DELETE</button>
    `;

    document.getElementById("questionsContainer").appendChild(container);

    container.querySelector(".delete-btn").addEventListener("click", () => {
        container.remove();
        questionCount--;
        reNumberQuestions();
    });
}


function reNumberQuestions() {
    const blocks = document.querySelectorAll(".question-block");
    let num = 1;
    blocks.forEach(block => {
        block.querySelector("h3").innerText = `Q${num}`;
        num++;
    });
}

async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const questions = [];

    for (let i = 1; i <= questionCount; i++) {
        const question = {
            question: formData.get(`question${i}`),
            optionA: formData.get(`optionA${i}`),
            optionB: formData.get(`optionB${i}`),
            optionC: formData.get(`optionC${i}`),
            correct: formData.get(`correct${i}`)
        };
        questions.push(question);
    }

    const response = await fetch(window.location.pathname, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions })
    });

    const data = await response.json();

    if (data.success) {
        document.getElementById("quizCode").textContent = data.code;
        document.getElementById("displayCode").value = data.code;
        document.getElementById("codePopup").style.display = "block";
    }
}

function closePopup() {
    document.getElementById("codePopup").style.display = "none";
}

function closeAIPopup() {
    document.getElementById("aiPopup").style.display = "none";
}

function generateWithAI() {
    const topic = document.getElementById("aiTopicInput").value.trim();
    if (!topic) {
        alert("Please enter a topic.");
        return;
    }

    fetch('/generate_questions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ topic })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            const questions = data.questions;
            questions.forEach((q, index) => {
                addQuestion({
                    question: q.question,
                    options: q.options,
                    correct: q.correct
                });
            });
            closeAIPopup();
        } else {
            alert("Failed to generate questions: " + data.error);
        }
    })
    .catch(err => {
        alert("Error: " + err.message);
    });
}



