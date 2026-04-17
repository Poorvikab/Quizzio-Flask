<<<<<<< HEAD
// List of avatar image paths
const avatars = [
    "/static/images/avatar1.png", "/static/images/avatar2.png", "/static/images/avatar3.png", "/static/images/avatar4.png",
    "/static/images/avatar5.png", "/static/images/avatar6.png", "/static/images/avatar7.png", "/static/images/avatar8.png",
    "/static/images/avatar9.png", "/static/images/avatar10.png", "/static/images/avatar11.png", "/static/images/avatar12.png"
];

let currentIndex = 0;

const avatarImg = document.getElementById("avatar");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const selectBtn = document.getElementById("select");
const usernameInput = document.getElementById("username");
const switchForm = document.getElementById("switchForm");
const clickSound = document.getElementById("clickSound");
const errorMessage = document.getElementById("errorMessage");
const triangle = document.getElementById("triangle");

// Function to update avatar and play sound
function updateAvatar() {
    avatarImg.src = avatars[currentIndex];
    avatarImg.alt = `Avatar ${currentIndex + 1}`;

    // Play click sound
    clickSound.currentTime = 0;
    clickSound.play().catch(error => console.error("Sound playback failed:", error));
}

// Handle left arrow click (previous avatar)
prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + avatars.length) % avatars.length;
    updateAvatar();
});

// Handle right arrow click (next avatar)
nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % avatars.length;
    updateAvatar();
});

// Handle keyboard arrow keys
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        currentIndex = (currentIndex - 1 + avatars.length) % avatars.length;
        updateAvatar();
    } else if (event.key === "ArrowRight") {
        currentIndex = (currentIndex + 1) % avatars.length;
        updateAvatar();
    }
});

// Handle form submission
// Handle form submission
function submitForm() {
    const username = usernameInput.value.trim(); // Ensure username is trimmed to remove spaces

    // Log the username before saving to localStorage
    console.log("Entered Username: ", username);

    // Save the selected avatar in hidden input field (if necessary)
    document.getElementById("selectedAvatar").value = avatars[currentIndex];

    // Check if the username is empty
    if (!username) {
        errorMessage.style.display = "block";
        triangle.style.display = "block";
        return;
    } else {
        errorMessage.style.display = "none";
        triangle.style.display = "none";
    }

    // Save the username and selected avatar to localStorage
    localStorage.setItem("username", username);
    localStorage.setItem("selectedAvatar", avatars[currentIndex]);

    // Log the data in localStorage
    console.log("Saved to localStorage: Username: ", localStorage.getItem("username"));
    console.log("Saved to localStorage: Avatar: ", localStorage.getItem("selectedAvatar"));

    // Play click sound, then submit the form
    clickSound.currentTime = 0;
    clickSound.volume = 1.0;
    clickSound.play().then(() => {
        setTimeout(() => switchForm.submit(), 300);
    }).catch(() => switchForm.submit());
}

=======

const avatars = [
    "/static/images/avatar1.png", "/static/images/avatar2.png", "/static/images/avatar3.png", "/static/images/avatar4.png",
    "/static/images/avatar5.png", "/static/images/avatar6.png", "/static/images/avatar7.png", "/static/images/avatar8.png",
    "/static/images/avatar9.png", "/static/images/avatar10.png", "/static/images/avatar11.png", "/static/images/avatar12.png"
];

let currentIndex = 0;

const avatarImg = document.getElementById("avatar");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const selectBtn = document.getElementById("select");
const usernameInput = document.getElementById("username");
const switchForm = document.getElementById("switchForm");
const clickSound = document.getElementById("clickSound");
const errorMessage = document.getElementById("errorMessage");
const triangle = document.getElementById("triangle");
const avatarInput = document.getElementById("selectedAvatar");


function updateAvatar() {
    avatarImg.src = avatars[currentIndex];
    avatarImg.alt = `Avatar ${currentIndex + 1}`;

    
    clickSound.currentTime = 0;
    clickSound.play().catch(error => console.error("Sound playback failed:", error));
}


prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + avatars.length) % avatars.length;
    updateAvatar();
});

nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % avatars.length;
    updateAvatar();
});


document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        currentIndex = (currentIndex - 1 + avatars.length) % avatars.length;
        updateAvatar();
    } else if (event.key === "ArrowRight") {
        currentIndex = (currentIndex + 1) % avatars.length;
        updateAvatar();
    }
});


function submitForm(event) {
    event.preventDefault();  
    const username = usernameInput.value.trim();

    if (!username) {
        errorMessage.style.display = "block";
        triangle.style.display = "block";
        return;
    } else {
        errorMessage.style.display = "none";
        triangle.style.display = "none";
    }

   
    avatarInput.value = avatars[currentIndex];


    clickSound.currentTime = 0;
    clickSound.volume = 1.0;
    clickSound.play().then(() => {
        setTimeout(() => switchForm.submit(), 300);
    }).catch(() => switchForm.submit());
}


selectBtn.addEventListener("click", submitForm);


document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        submitForm(event);
    }
});
>>>>>>> e361375 (Initial push of Flask and Frontend code)
