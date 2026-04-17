<<<<<<< HEAD
document.getElementById('button').addEventListener('click', function () {
    let clickSound = document.getElementById('clickSound');
    clickSound.play();
});
=======
document.getElementById('button').addEventListener('click', function () {
    let clickSound = document.getElementById('clickSound');
    clickSound.currentTime = 0; 
    clickSound.volume = 1.0;  
    clickSound.play();
});
>>>>>>> e361375 (Initial push of Flask and Frontend code)
