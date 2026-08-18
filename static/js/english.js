let currentQuestion = 0;
const totalQuestions = 10;

        const questions = [
            {
                image: "/static/images/openquiz.png",
                text: "I SPOKE TO __",
                options: ["SHE","HER","HE"],
                correctIndex: 1
            },
            {
                image: "/static/images/openquiz.png",
                text: "WHERE__ YOU COME FROM ?",
                options: ["DO", "IS", "IN"],
                correctIndex: 0
            },
            {
                image: "/static/images/openquiz.png",
                text: "WHAT TIME DOES SHE __ UP ?",
                options: ["GET", "GETTING", "GETS"],
                correctIndex: 0
            },
            {
                image: "/static/images/openquiz.png",
                text: "I AM SEEING HER __ 3 O'CLOCK",
                options: ["ON", "IN", "AT"],
                correctIndex: 2
            },

            {
                image: "/static/images/openquiz.png",
                text: "SHE LIVES __ LONDON",
                options: ["ON", "IN","AT" ],
                correctIndex: 1
            },
            {
                image: "/static/images/openquiz.png",
                text: "WHAT IS THE SYNONYM OF 'HAPPY' ?", 
                options: ["JOYFUL", "WEAK", "ANGRY"],
                correctIndex: 0

            },

            {
                image: "/static/images/openquiz.png",
                text: "IDENTIFY THE VERB IN THE SENTENCE 'SHE RUNS FAST' ?", 
                options: ["SHE", "FAST", "RUNS"],
                correctIndex: 2

            },

            {
                image: "/static/images/openquiz.png",
                text: "WHAT IS THE PAST TENSE OF 'GO' ?", 
                options: ["GOES", "WENT", "GOING"],
                correctIndex: 1

            },

            {
                image: "/static/images/openquiz.png",
                text: "CHOOSE THE ADJECTIVE IN THE SENTENCE 'THE SKY IS BLUE' ?", 
                options: ["SKY", "BLUE", "THE"],
                correctIndex: 1

            },

            {
                image: "/static/images/openquiz.png",
                text: "WHAT IS THE CORRECT ARTICLE FOR 'APPLE' ?", 
                options: ["AN", "A", "THE"],
                correctIndex: 0

            },

            {
                image: "/static/images/openquiz.png",
                text: "DID YOU LIKE THIS ?", 
                options: ["YES I DID", "YES I DO", "YES I DOING"],
                correctIndex: 0

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