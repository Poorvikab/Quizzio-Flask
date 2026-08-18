document.getElementById('button').addEventListener('click', function () {
    let clickSound = document.getElementById('clickSound');
    clickSound.currentTime = 0; 
    clickSound.volume = 1.0;  
    clickSound.play();
});