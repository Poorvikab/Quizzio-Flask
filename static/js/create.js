<<<<<<< HEAD
// Create an audio object
let clickSound = new Audio("/static/audio/click2.wav"); // Replace with your actual sound file
    
document.getElementById("addbtn").addEventListener("click", function (event) {
    event.preventDefault();

    // Play sound
    clickSound.play();

    // Show popup
    document.getElementById("popup").style.display = "block";
    document.getElementById("inputBox").focus();
});

document.getElementById("inputBox").addEventListener("keypress", function (event) {
    if (event.key === "Enter" && this.value.trim() !== "") {
        event.preventDefault();
        let name = this.value.trim();

        // Create folder element
        let folderDiv = document.createElement("div");
        folderDiv.classList.add("folder");

        let img = document.createElement("img");
        img.src = "/static/images/folderpng.png"; // Folder Image

        let span = document.createElement("span");
        span.innerText = name;

        folderDiv.appendChild(img);
        folderDiv.appendChild(span);
        document.getElementById("folderContainer").appendChild(folderDiv);

        // Hide popup
        document.getElementById("popup").style.display = "none";
        this.value = ""; // Clear input
    }
});
=======

let clickSound = new Audio("/static/audio/click2.wav"); 
    
document.getElementById("addbtn").addEventListener("click", function (event) {
    event.preventDefault();

    
    clickSound.play();

    
    document.getElementById("popup").style.display = "block";
    document.getElementById("inputBox").focus();
});

document.getElementById("inputBox").addEventListener("keypress", function (event) {
    if (event.key === "Enter" && this.value.trim() !== "") {
        event.preventDefault();
        let name = this.value.trim();

        // Send to server
        fetch("/create_folder", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `folder_name=${encodeURIComponent(name)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();  // Refresh page to show updated folder list
            } else {
                alert("Failed to create folder: " + data.error);
            }
        });

        // Hide popup and reset input
        document.getElementById("popup").style.display = "none";
        this.value = "";
    }
});

>>>>>>> e361375 (Initial push of Flask and Frontend code)
