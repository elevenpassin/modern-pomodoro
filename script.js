const timer = document.querySelector("#timer");
const timerTextTime = document.querySelector("#timer__text-time");
const timerTextA = document.querySelector("#timer__text-a");
const timerControlToggle = document.querySelector("#timer-control-toggle");
const timerControlEdit = document.querySelector("#timer-control-edit");

const editor = document.querySelector("#editor");

const SECOND = 1000;
const MINUTE = SECOND * 60;

class Pomodoro {
  constructor() {
    this.defaultRoundTime = 10 * SECOND; // 25 minutes * 60 seconds * 1000 milliseconds
    this.defaultBreakTime = 5 * SECOND; // 5 minutes * 60 seconds * 1000 milliseconds
    this.roundTime = this.defaultRoundTime; // Initialize roundTime
    this.breakTime = this.defaultBreakTime; // Initialize breakTime
    this.timerRunning = false;
    this.isEditing = false;
    this.isRound = true;
    this.timeRemaining = this.isRound ? this.roundTime : this.breakTime;
    
    editor.style.display = "none";
    timerControlToggle.addEventListener("click", this.toggleTimer.bind(this));
    timerControlEdit.addEventListener("click", this.toggleEditor.bind(this));
  }
  
  toggleTimer(){
    if (!this.timerRunning) {
      this.timerRunning = true;
      timerTextA.innerText = "next break in";
      timerControlToggle.innerText = "stop";
      this.timeoutRef = setInterval(() => {
        
        if (this.isRound && this.timeRemaining <= 0) {
          this.isRound = false;
          this.timeRemaining = this.breakTime;
        }

        if (!this.isRound && this.timeRemaining <= 0) {
          this.isRound = true;
          this.timeRemaining = this.roundTime;
        }
        if (this.isRound) {
          timerTextA.innerText = "next break in";
        } else {
          timerTextA.innerText = "next round in";
        }

        this.timeRemaining -= SECOND;
        timerTextTime.innerText = this.toSeconds(this.timeRemaining);
      }, SECOND);
    } else if (this.timerRunning) {
      this.timerRunning = false;
      this.timeRemaining = this.isRound ? this.roundTime : this.breakTime;
      clearInterval(this.timeoutRef);
      timerTextTime.innerText = this.toSeconds(0);
      timerTextA.innerText = "next break in";
      timerControlToggle.innerText = "start";
    }
  }
  
  toggleEditor() {
    if (this.isEditing) {
      this.isEditing = false;
      editor.style.display = "none";
      timer.style.display = "block";
      timerControlEdit.innerText = "Edit";
    } else if (!this.isEditing) {
      this.isEditing = true;
      editor.style.display = "block";
      timer.style.display = "none";
      timerControlEdit.innerText = "Save";
    }
  }
  
  toSeconds(timeInMilliseconds) {
    const timeInSeconds = Math.floor(timeInMilliseconds / 1000);
    return timeInSeconds > 9 ? timeInSeconds : `0${timeInSeconds}`;
  }
}

const app = new Pomodoro();