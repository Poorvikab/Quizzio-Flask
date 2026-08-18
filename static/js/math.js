let currentQuestion = 0;  
const totalQuestions = 10;
const questions = [
    {
        image: "/static/images/openquiz.png",
        text: "WHAT IS THE SUM OF 130+125+191 ?",
        options: ["335", "456", "446"],
        correctIndex: 2
    },
    {
        image: "/static/images/openquiz.png",
        text: "IF WE MINUS 712 FROM 1500, HOW MUCH DO WE GET ?",
        options: ["788", "778", "758"],
        correctIndex: 0
    },
    {
        image: "/static/images/openquiz.png",
        text: "50 TIMES OF 8 IS EQUAL TO ?",
        options: ["800", "400", "4000"],
        correctIndex: 1
    },
    {
        image: "/static/images/openquiz.png",
        text: "110 DIVIDED BY 10 IS ?",
        options: ["11", "5", "10"],
        correctIndex: 0
    },
    {
        image: "/static/images/openquiz.png",
        text: "20+(90÷2) IS EQUAL TO:",
        options: ["50", "55", "65"],
        correctIndex: 2
    },
    {
        image: "/static/images/openquiz.png",
        text: "SOLVE: 300 – (150×2)",
        options: ["0", "150", "100"],
        correctIndex: 0
    },

    {
        image: "/static/images/openquiz.png",
        text: "WHAT IS THE AREA OF A CIRCLE WITH RADIUS OF 5cm ?",
        options: ["50 cm²", "78.5 cm²", "25 cm²"],
        correctIndex: 1
    },

    {
        image: "/static/images/openquiz.png",
        text: "WHAT IS THE AREA OF A CIRCLE WITH RADIUS OF 5cm ?",
        options: ["50 cm²", "78.5 cm²", "25 cm²"],
        correctIndex: 1
    },

    {
        image: "/static/images/openquiz.png",
        text: "WHAT IS THE VALUE OF X IN THE EQUATION 2X+5=11 ?",
        options: ["7", "3", "8"],
        correctIndex: 1
    },

    {
        image: "/static/images/openquiz.png",
        text: "What is the decimal equivalent of the fraction 1/4?",
        options: ["0.14", "0.50", "0.25"],
        correctIndex: 2
    },


];

let score = [];  

function checkAnswer(button, isCorrect) {
    let image = button.querySelector("img");
    let options = document.querySelectorAll(".option");

   
    options.forEach(btn => btn.disabled = true);

 
    image.src = isCorrect ? "/static/images/openquizc.png" : "/static/images/openquizw.png";

    let correctSound = document.getElementById("correctSound");
    let incorrectSound = document.getElementById("incorrectSound");
    
    if (isCorrect) {
        correctSound.currentTime = 0;  
        correctSound.play();  
    } else {
        incorrectSound.currentTime = 0;  
        incorrectSound.play();  
    }

    
    score.push(isCorrect ? 1 : 0);
    localStorage.setItem("quizScore", JSON.stringify(score));

   
    setTimeout(nextQuestion, 1000);
}

function nextQuestion() {
    if (currentQuestion < totalQuestions - 1) {
        currentQuestion++;

        let q = questions[currentQuestion];

        document.getElementById("question-text").innerText = q.text;

        let answers = document.querySelectorAll("h3");
        let buttons = document.querySelectorAll(".option");

        
        buttons.forEach((button, index) => {
            button.querySelector("img").src = "/static/images/openquiz1.png";
            button.onclick = () => checkAnswer(button, index === q.correctIndex);
            answers[index].innerText = q.options[index];
            button.disabled = false;
        });

    } else {
        submitScore();  
    }
}

function submitScore() {
    let finalScore = score.reduce((a, b) => a + b, 0); 

    fetch('/submit_quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: finalScore })  
    }).then(response => response.json())
      .then(data => {
          console.log("Score submitted:", data);  
          window.location.href = "/score";
      }).catch(error => console.error("Error submitting score:", error));
}