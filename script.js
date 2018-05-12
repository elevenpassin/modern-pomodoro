const timerTextTime = document.querySelector("#timer__text-time");
const timerTextA = document.querySelector("#timer__text-a");
const timerTextB = document.querySelector("#timer__text-b");
const timerControlToggle = document.querySelector("#timer-control-toggle");
const timerControlEdit = document.querySelector("#time-control-edit");


class Pomodoro {
  constructor() {
    this.defaultRoundTime = 25 * 60 * 1000; // 25 minutes * 60 seconds * 1000 milliseconds
    this.defaultBreakTime = 5 * 60 * 1000; // 5 minutes * 60 seconds * 1000 milliseconds
    this.roundTime = null; // Initialize roundTime
    this.breakTime = null; // Initialize breakTime
    this.timerRunning = false;
    this.isRound = true;
  }
  
  init(){
    console.log("started");
    this.timerRunning = true;
    this.startTime = new Date();
    this.roundTimeout = setTimeout(() => {
      this.timeElapsedInMilliseconds = new Date() - this.startTime;
      
      if (this.isRound && this.timeElapsedInMilliseconds === (1000 * 10)) {
        console.log("round time up yo");
        this.isRound = false;
      }
      
      if (!this.isRound && this.timeElapsedInMilliseconds === (1000 * 5)) {
        console.log("break time up yo");
        this.isRound = true;
      }
      
      console.log(this.timeElapsedInMilliseconds);
    }, 60 * 1000);
  }
}

const app = new Pomodoro();

app.init();
