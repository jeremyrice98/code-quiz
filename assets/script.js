function countdown() {
    var timeLeft = 5;
    var timeInterval = setInterval(function() {
        countdownEl.textContent = timeLeft;
        timeLeft--;

        if (timeLeft === 0) {
            countdownEl.textContent = "Times up!"
                //clearInterval(timeInterval);
        }

    }, 1000)
}







countdown();