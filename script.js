if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}

const timer = document.querySelector("#timer");
const timerTextTime = document.querySelector("#timer__text-time");
const timerTextA = document.querySelector("#timer__text-a");
const timerControlToggle = document.querySelector("#timer-control-toggle");
const timerControlEdit = document.querySelector("#timer-control-edit");

const editor = document.querySelector("#editor");
const editorRoundTime = document.querySelector("#editor__round-time");
const editorBreakTime = document.querySelector("#editor__break-time");

const historyTableBody = document.querySelector("#history-table__body");
const clearHistoryButton = document.querySelector("#clear-history");
const addToHomeScreenPrompt = document.querySelector(
  "#add-to-homescreen-prompt"
);

const aboutButton = document.querySelector("#about-toggle");
const aboutContent = document.querySelector("#about-content");

const SECOND = 1000;
const MINUTE = SECOND * 60;
let isShowingAbout = false;

class Pomodoro {
  constructor() {
    this.defaultRoundTime = 25 * MINUTE; // 25 minutes * 60 seconds * 1000 milliseconds
    this.defaultBreakTime = 5 * MINUTE; // 5 minutes * 60 seconds * 1000 milliseconds
    this.roundTime = this.defaultRoundTime; // Initialize roundTime
    this.breakTime = this.defaultBreakTime; // Initialize breakTime
    this.timerRunning = false;
    this.isEditing = false;
    this.isRound = true;
    this.roundsElapsed = 0;
    this.breaksElapsed = 0;
    this.history = [];

    this.loadFromLocalStorage();

    editor.style.display = "none";
    this.toggleClearHistoryButtonVisibility();

    timerControlToggle.addEventListener("click", this.toggleTimer.bind(this));
    timerControlEdit.addEventListener("click", this.toggleEditor.bind(this));
    clearHistoryButton.addEventListener("click", this.clearHistory.bind(this));
  }

  toggleTimer() {
    if (!this.timerRunning) {
      this.timerRunning = true;
      this.timeRemaining = this.isRound ? this.roundTime : this.breakTime;
      this.startTime = new Date();
      timerControlEdit.setAttribute("disabled", "");
      timerTextA.innerText = "next break in";
      timerControlToggle.innerText = "stop";
      timerTextTime.innerText = this.toMinutes(this.timeRemaining);
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

        this.timeRemaining -= MINUTE;
        timerTextTime.innerText = this.toMinutes(this.timeRemaining);
      }, MINUTE);
    } else if (this.timerRunning) {
      this.timerRunning = false;
      this.endTime = new Date();
      this.addToHistory(
        this.startTime,
        this.endTime,
        this.roundsElapsed,
        this.breaksElapsed
      );
      timerControlEdit.removeAttribute("disabled");
      this.timeRemaining = this.isRound ? this.roundTime : this.breakTime;
      clearInterval(this.timeoutRef);
      this.roundsElapsed = 0;
      this.breaksElapsed = 0;
      timerTextTime.innerText = this.toMinutes(0);
      timerTextA.innerText = "next break in";
      timerControlToggle.innerText = "start";
      this.toggleClearHistoryButtonVisibility();
    }
  }

  toggleEditor() {
    if (this.isEditing) {
      this.isEditing = false;
      timerControlToggle.removeAttribute("disabled");
      editor.style.display = "none";
      timer.style.display = "block";
      timerControlEdit.innerText = "Edit";

      this.roundTime = editorRoundTime.value * MINUTE;
      this.breakTime = editorBreakTime.value * MINUTE;
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
      timeStampText: timeStampText
    };
  }

  mapHistoryObjectText(startTime, endTime) {
    let [sDate, sTime] = startTime
      .toLocaleString()
      .split(isEdge ? " " : ",")
      .map(x => x.trim());
    const [_, eTime] = endTime
      .toLocaleString()
      .split(isEdge ? " " : ",")
      .map(x => x.trim());
    const today = new Date();
    if (
      today
        .toLocaleString()
        .split(",")
        .map(x => x.trim())[0] === sDate
    ) {
      sDate = "today";
    }

    const isYesterday = startTime.getDate() + 1 === today.getDate();
    const isStartTimeEndOfMonth = startTime.getMonth() + 1 === today.getMonth();
    if (isYesterday || isStartTimeEndOfMonth) {
      sDate = "yesterday";
    }

    return `${sDate} - ${sTime} to ${eTime}`;
  }

  addToHistory(startTime, endTime, roundsElapsed, breaksElapsed) {
    const historyObject = this.mapToHistoryObject(
      startTime,
      endTime,
      roundsElapsed,
      breaksElapsed
    );
    this.history.push(historyObject);
    this.generateTable();
    this.saveToLocalStorage();
  }

  generateRowFromHistoryObject(historyObject) {
    const tableRow = document.createElement("tr");
    const tableDescTimespan = document.createElement("td");
    tableDescTimespan.innerText = historyObject.timeStampText;

    const tableDescRounds = document.createElement("td");
    tableDescRounds.innerText = historyObject.roundsElapsed;

    const tableDescBreaks = document.createElement("td");
    tableDescBreaks.innerText = historyObject.breaksElapsed;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("button");
    deleteButton.innerText = "delete";

    tableRow.appendChild(tableDescTimespan);
    tableRow.appendChild(tableDescRounds);
    tableRow.appendChild(tableDescBreaks);

    historyTableBody.appendChild(tableRow);
  }

  generateTable() {
    historyTableBody.innerHTML = "";
    this.history.map(historyObject => {
      this.generateRowFromHistoryObject(historyObject);
    });
  }

  saveToLocalStorage() {
    window.localStorage.setItem("history", JSON.stringify(this.history));
  }

  loadFromLocalStorage() {
    const history = window.localStorage.getItem("history");

    if (history) {
      this.history = JSON.parse(history);
      this.generateTable();
    }
  }

  clearHistory() {
    this.history = [];
    this.saveToLocalStorage();
    this.generateTable();
    this.toggleClearHistoryButtonVisibility();
  }

  toggleClearHistoryButtonVisibility() {
    if (this.history.length > 0) {
      clearHistoryButton.style.display = "flex";
    } else {
      clearHistoryButton.style.display = "none";
    }
  }

  toMinutes(timeInMilliseconds) {
    const timeInMinutes = Math.floor(timeInMilliseconds / (60 * 1000));
    return timeInMinutes > 9 ? timeInMinutes : `0${timeInMinutes}`;
  }
}

function handleAboutToggle() {
  if (isShowingAbout) {
    aboutContent.style.display = "none";
    isShowingAbout = false;
  } else if (!isShowingAbout) {
    aboutContent.style.display = "flex";
    isShowingAbout = true;
  }
  console.log("done", aboutContent.style.display);
}

// Start the app
new Pomodoro();

// Bind non app related triggers
aboutContent.style.display = "none";
aboutButton.addEventListener("click", handleAboutToggle);

let addToHomeScreenDeferredPrompt;

window.addEventListener("beforeinstallprompt", e => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  addToHomeScreenDeferredPrompt = e;
  // Stash the event so it can be triggered later.
  addToHomeScreenDeferredPrompt = e;
  // Show UI
  addToHomeScreenPrompt.style.display = "flex";
});

addToHomeScreenPrompt.addEventListener("click", () => {
  addToHomeScreenPrompt.style.display = "none";
  // Show the prompt
  addToHomeScreenDeferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  addToHomeScreenDeferredPrompt.userChoice.then(choiceResult => {
    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the A2HS prompt");
    } else {
      console.log("User dismissed the A2HS prompt");
    }
    addToHomeScreenDeferredPrompt = null;
  });
});
