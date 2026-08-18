
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
