const timerTextTime = document.querySelector("#timer__text-time");
const timerTextA = document.querySelector("#timer__text-a");
const timerTextB = document.querySelector("#timer__text-b");
const timerControlToggle = document.querySelector("#timer-control-toggle");
const timerControlEdit = document.querySelector("#time-control-edit");


class Pomodoro {
  constructor() {
    this.defaultRoundTime = 10 * 1000; // 25 minutes * 60 seconds * 1000 milliseconds
    this.defaultBreakTime = 5 * 1000; // 5 minutes * 60 seconds * 1000 milliseconds
    this.roundTime = this.defaultRoundTime; // Initialize roundTime
    this.breakTime = this.defaultBreakTime; // Initialize breakTime
    this.timerRunning = false;
    this.isRound = true;
    this.timeElapsed = 0;
  }
  
  init(){
    console.log("started");
    this.timerRunning = true;
    this.startTime = new Date();
    this.timeoutRef = setInterval(() => {
      
      if (this.isRound === true && this.timeElapsed >= this.roundTime) {
        console.log("round time up yo");
        this.isRound = false;
        this.startTime = new Date();
      }
      
      if (!this.isRound === true && this.timeElapsed >= this.breakTime) {
        console.log("break time up yo");
        this.isRound = true;
        this.startTime = new Date();
      }
      
      console.log(this);
    }, 1000);
  }
}

const app = new Pomodoro();
app.init();
