// Internet Explorer 6-11
const isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+
const isEdge = !isIE && !!window.StyleMedia;

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./scripts/sw.js");
}

const audioElement = document.querySelector('audio');

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
const defaultRoundTime = 25 * MINUTE; // 25 minutes * 60 seconds * 1000 milliseconds
const defaultBreakTime = 5 * MINUTE; // 5 minutes * 60 seconds * 1000 milliseconds
let appHistory = [];

let roundTime = defaultRoundTime; // Initialize roundTime
let breakTime = defaultBreakTime; // Initialize breakTime
let isShowingAbout = false;
let timerRunning = false;
let timeRemaining = 0;
let isEditing = false;
let isRound = true;
let roundsElapsed = 0;
let breaksElapsed = 0;
let startTime = 0;
let endTime = 0;
let timeoutRef = null;

function toMinutes(timeInMilliseconds) {
  const timeInMinutes = Math.floor(timeInMilliseconds / (60 * 1000));
  return timeInMinutes > 9 ? timeInMinutes : `0${timeInMinutes}`;
}

function mapHistoryObjectText(startTime, endTime) {
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
      .split(isEdge ? " " : ",")
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

function mapToHistoryObject(startTime, endTime, roundsElapsed, breaksElapsed) {
  const timeStampText = mapHistoryObjectText(startTime, endTime);
  return {
    startTime,
    endTime,
    roundsElapsed,
    breaksElapsed,
    timeStampText
  };
}

function generateRowFromHistoryObject(historyObject) {
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

function generateTable() {
  historyTableBody.innerHTML = "";
  appHistory.map(historyObject => {
    generateRowFromHistoryObject(historyObject);
  });
}


function saveToLocalStorage() {
  window.localStorage.setItem("history", JSON.stringify(appHistory));
}

function addToHistory(startTime, endTime, roundsElapsed, breaksElapsed) {
  const historyObject = mapToHistoryObject(
    startTime,
    endTime,
    roundsElapsed,
    breaksElapsed
  );
  appHistory.push(historyObject);
  generateTable();
  saveToLocalStorage();
}

function toggleClearHistoryButtonVisibility() {
  if (appHistory.length > 0) {
    clearHistoryButton.style.display = "flex";
  } else {
    clearHistoryButton.style.display = "none";
  }
}

function toggleTimer() {
  if (!timerRunning) {
    timerRunning = true;
    timeRemaining = roundTime;
    startTime = new Date();
    timerControlEdit.setAttribute("disabled", "");
    timerTextA.innerText = "next break in";
    timerControlToggle.innerText = "stop";
    timerTextTime.innerText = toMinutes(timeRemaining);
    timeoutRef = setInterval(() => {
      timeRemaining -= MINUTE;

      if (isRound && timeRemaining <= 0) {
        isRound = false;
        roundsElapsed += 1;
        timeRemaining = breakTime;
        audioElement.play();
      }

      if (!isRound && timeRemaining <= 0) {
        isRound = true;
        breaksElapsed += 1;
        timeRemaining = roundTime;
        audioElement.play();
      }
      if (isRound) {
        timerTextA.innerText = "next break in";
      } else {
        timerTextA.innerText = "next round in";
      }

      timerTextTime.innerText = toMinutes(timeRemaining);
    }, MINUTE);
  } else if (timerRunning) {
    timerRunning = false;
    endTime = new Date();
    addToHistory(
      startTime,
      endTime,
      roundsElapsed,
      breaksElapsed
    );
    timerControlEdit.removeAttribute("disabled");
    timeRemaining = isRound ? roundTime : breakTime;
    clearInterval(timeoutRef);
    roundsElapsed = 0;
    breaksElapsed = 0;
    timerTextTime.innerText = toMinutes(0);
    timerTextA.innerText = "next break in";
    timerControlToggle.innerText = "start";
    toggleClearHistoryButtonVisibility();
  }
}

function toSeconds(timeInMilliseconds) {
  return Math.floor(timeInMilliseconds / 1000);
}

function toggleEditor() {
  if (isEditing) {
    isEditing = false;
    timerControlToggle.removeAttribute("disabled");
    editor.style.display = "none";
    timer.style.display = "block";
    timerControlEdit.innerText = "Edit";

    roundTime = editorRoundTime.value * MINUTE;
    breakTime = editorBreakTime.value * MINUTE;
  } else if (!isEditing) {
    isEditing = true;
    timerControlToggle.setAttribute("disabled", "");
    editor.style.display = "block";
    timer.style.display = "none";
    timerControlEdit.innerText = "Save";
  }
}

function loadFromLocalStorage() {
  let appHistory = window.localStorage.getItem("history");

  if (appHistory) {
    appHistory = JSON.parse(appHistory);
    generateTable();
  }
}
function clearHistory() {
  appHistory = [];
  saveToLocalStorage();
  generateTable();
  toggleClearHistoryButtonVisibility();
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

loadFromLocalStorage();


toggleClearHistoryButtonVisibility();

timerControlToggle.addEventListener("click", toggleTimer);
timerControlEdit.addEventListener("click", toggleEditor);
clearHistoryButton.addEventListener("click", clearHistory);

editor.style.display = "none";

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
