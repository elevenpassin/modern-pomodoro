const timer = document.querySelector("#timer");
const timerTextTime = document.querySelector("#timer__text-time");
const timerTextA = document.querySelector("#timer__text-a");
const timerControlToggle = document.querySelector("#timer-control-toggle");
const timerControlEdit = document.querySelector("#timer-control-edit");

const editor = document.querySelector("#editor");
const editorRoundTime = document.querySelector("#editor__round-time");
const editorBreakTime = document.querySelector("#editor__break-time");

const historyTableBody = document.querySelector("#history-table__body");

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
    this.roundsElapsed = 0;
    this.breaksElapsed = 0;
    this.history = [];
    
    editor.style.display = "none";
    timerControlToggle.addEventListener("click", this.toggleTimer.bind(this));
    timerControlEdit.addEventListener("click", this.toggleEditor.bind(this));
  }
  
  toggleTimer(){
    if (!this.timerRunning) {
      this.timerRunning = true;
      this.timeRemaining = this.isRound ? this.roundTime : this.breakTime;
      this.startTime = new Date();
      timerControlEdit.setAttribute("disabled", "");
      timerTextA.innerText = "next break in";
      timerControlToggle.innerText = "stop";
      this.timeoutRef = setInterval(() => {
        
        if (this.isRound && this.timeRemaining <= 0) {
          this.isRound = false;
          this.roundsElapsed += 1;
          this.timeRemaining = this.breakTime;
        }

        if (!this.isRound && this.timeRemaining <= 0) {
          this.isRound = true;
          this.breaksElapsed += 1;
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
      this.endTime = new Date();
      this.addToHistory(this.startTime, this.endTime, this.roundsElapsed, this.breaksElapsed);
      timerControlEdit.removeAttribute("disabled");
      this.timeRemaining = this.isRound ? this.roundTime : this.breakTime;
      clearInterval(this.timeoutRef);
      this.roundsElapsed = 0;
      this.breaksElapsed = 0;
      timerTextTime.innerText = this.toSeconds(0);
      timerTextA.innerText = "next break in";
      timerControlToggle.innerText = "start";
    }
  }
  
  toggleEditor() {
    if (this.isEditing) {
      this.isEditing = false;
      timerControlToggle.removeAttribute("disabled");
      editor.style.display = "none";
      timer.style.display = "block";
      timerControlEdit.innerText = "Edit";
      
      this.roundTime = editorRoundTime.value * 1000;
      this.breakTime = editorBreakTime.value * 1000;
      
    } else if (!this.isEditing) {
      this.isEditing = true;
      timerControlToggle.setAttribute("disabled", "");
      editor.style.display = "block";
      timer.style.display = "none";
      timerControlEdit.innerText = "Save";
    }
  }
  
  mapToHistoryObject(startTime, endTime, roundsElapsed, breaksElapsed) {
    const timeStampText = this.mapHistoryObjectText(startTime, endTime); 
    return {
      startTime: startTime,
      endTime: endTime,
      roundsElapsed: roundsElapsed,
      breaksElapsed: breaksElapsed,
      timeStampText: timeStampText,
    };
  }
  
  mapHistoryObjectText(startTime, endTime) {
    const [ sDate, sTime ] = startTime.toLocaleString().split(",").map((x) => x.trim());
    const [ _, eTime ] = endTime.toLocaleString().split(",").map((x) => x.trim());
    return `${sDate} - ${sTime} to ${eTime}`;
  }
  
  addToHistory(startTime, endTime, roundsElapsed, breaksElapsed) {
    const historyObject = this.mapToHistoryObject(startTime, endTime, roundsElapsed, breaksElapsed);
    this.history.push(historyObject);
    this.generateTable();
  }
  
  generateRowFromHistoryObject(historyObject) {
    const tableRow = document.createElement("tr");
    const tableDescTimespan = document.createElement("td");
    tableDescTimespan.innerText = historyObject.timeStampText;

    const tableDescRounds = document.createElement("td");
    tableDescRounds.innerText = historyObject.roundsElapsed;
    
    const tableDescBreaks = document.createElement("td");
    tableDescBreaks.innerText = historyObject.breaksElapsed;
    
    tableRow.appendChild(tableDescTimespan);
    tableRow.appendChild(tableDescRounds);
    tableRow.appendChild(tableDescBreaks);
    
    historyTableBody.appendChild(tableRow);
  }
  
  generateTable() {
    historyTableBody.innerHTML = "";
    this.history.map(historyObject => {
      this.generateRowFromHistoryObject(historyObject);
    })
  }
  
  toSeconds(timeInMilliseconds) {
    const timeInSeconds = Math.floor(timeInMilliseconds / 1000);
    return timeInSeconds > 9 ? timeInSeconds : `0${timeInSeconds}`;
  }
}

new Pomodoro();