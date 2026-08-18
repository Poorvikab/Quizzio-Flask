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