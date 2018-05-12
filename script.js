const timerTextTime = document.querySelector("#timer__text-time");
const timerTextA = document.querySelector("#timer__text-a");
const timerTextB = document.querySelector("#timer__text-b");
const timerControlToggle = document.querySelector("#timer-control-toggle");
const timerControlEdit = document.querySelector("#time-control-edit");

const SECOND = 1000;
const MINUTE = SECOND * 60;

class Pomodoro {
  constructor() {
    this.defaultRoundTime = 10 * SECOND; // 25 minutes * 60 seconds * 1000 milliseconds
    this.defaultBreakTime = 5 * SECOND; // 5 minutes * 60 seconds * 1000 milliseconds
    this.roundTime = this.defaultRoundTime; // Initialize roundTime
    this.breakTime = this.defaultBreakTime; // Initialize breakTime
    this.timerRunning = false;
    this.isRound = false;
    this.timeElapsed = 0;
  }
  
  init(){
    console.log("started");
    this.timerRunning = true;
    this.timeoutRef = setInterval(() => {
      
      if (this.isRound === true && this.timeElapsed >= this.roundTime) {
        
        this.isRound = false;
        this.timeElapsed = 0;
      }
      
      if (!this.isRound === true && this.timeElapsed >= this.breakTime) {
        
        this.isRound = true;
        this.timeElapsed = 0;
      }

      this.timeElapsed += SECOND;
      timerTextTime.innerText = 
    }, SECOND);
  }
}

const app = new Pomodoro();
app.init();
