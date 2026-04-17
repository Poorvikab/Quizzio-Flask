<<<<<<< HEAD
document.addEventListener("DOMContentLoaded", () => {
    const storedUsername = localStorage.getItem("username"); // Get username from localStorage
    const storedAvatar = localStorage.getItem("selectedAvatar"); // Get avatar from localStorage

    // Log values for debugging
    console.log("Username from localStorage: ", storedUsername);
    console.log("Avatar from localStorage: ", storedAvatar);

    if (storedUsername) {
        document.getElementById("displayName").innerHTML = `<u>${storedUsername}</u>`;
    } else {
        document.getElementById("displayName").innerHTML = "<u>Unknown</u>";
    }

    if (storedAvatar) {
        document.getElementById("displayAvatar").src = storedAvatar;
    } else {
        document.getElementById("displayAvatar").src = "/static/images/default_avatar.png"; // Placeholder if no avatar is found
    }

    // Handle "Enter" key redirect to code.html
    document.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            window.location.href = "/templates/code.html"; // Redirect to code.html
        }
    });

    // Show hearts for quiz score
    const heartContainer = document.getElementById("heartContainer");
    const scoreData = JSON.parse(localStorage.getItem("quizScore")) || [];

    scoreData.forEach(result => {
        let heartImg = document.createElement("img");
        heartImg.src = result ? "/static/images/colored_heart.png" : "/static/images/empty_heart.png";
        heartImg.classList.add("heart");
        heartContainer.appendChild(heartImg);
    });
});
=======
document.addEventListener("DOMContentLoaded", () => {
    const displayNameElement = document.getElementById("displayName");
    const displayAvatarElement = document.getElementById("displayAvatar");

    const username = displayNameElement.getAttribute("data-username") || "Unknown";
    const avatar = displayAvatarElement.getAttribute("data-avatar") || "/static/images/default_avatar.png";

    displayNameElement.innerHTML = `<u>${username}</u>`;
    displayAvatarElement.src = avatar;

    const heartContainer = document.getElementById("heartContainer");
    const scoreData = JSON.parse(localStorage.getItem("quizScore")) || [];

    const totalQuestions = 10; // Ensure this matches your actual quiz length

    // Fill missing entries with incorrect answers (0)
    while (scoreData.length < totalQuestions) {
        scoreData.push(0);
    }

    // Clear previous hearts before appending new ones
    heartContainer.innerHTML = "";

    // Display correct and incorrect hearts
    scoreData.slice(0, totalQuestions).forEach(result => {
        let heartImg = document.createElement("img");
        heartImg.src = result ? "/static/images/colored_heart.png" : "/static/images/empty_heart.png";
        heartImg.classList.add("heart");
        heartContainer.appendChild(heartImg);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            window.location.href = "/code";  
        }
    });
});
>>>>>>> e361375 (Initial push of Flask and Frontend code)
