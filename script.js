
const DueDate = new Date("2026-04-16T11:00:00Z");
const CardSelector = '[data-testid="test-todo-card"]';
const TitleSelector = '[data-testid="test-todo-title"]';
const TimeRemainingSelector = '[data-testid="test-todo-time-remaining"]';
const CompleteToggleSelector = '[data-testid="test-todo-complete-toggle"]';
const StatusSelector = '[data-testid="test-todo-status"]';
const EditButtonSelector = '[data-testid="test-todo-edit-button"]';
const DeleteButtonSelector = '[data-testid="test-todo-delete-button"]';

let TodoCard = document.querySelector(CardSelector);
let TimeRemainingEl = document.querySelector(TimeRemainingSelector);
let CompleteToggle = document.querySelector(CompleteToggleSelector);
let StatusEl = document.querySelector(StatusSelector);
let EditButton = document.querySelector(EditButtonSelector);
let DeleteButton = document.querySelector(DeleteButtonSelector);


document.addEventListener("DOMContentLoaded", function () {
  Init();
});



// Update time remaining
function UpdateTimeRemaining() {
  const now = new Date();
  const diffMs = DueDate - now;

  if (diffMs <= 0) {
    TimeRemainingEl.textContent = "Overdue!";
    TimeRemainingEl.style.color = "#e53e3e";
    return;
  }

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  let message;
  if (diffDays > 0) {
    message = `Due in ${diffDays} ${diffDays === 1 ? "day" : "days"}`;
  } else if (diffHours > 0) {
    message = `Due in ${diffHours} ${diffHours === 1 ? "hour" : "hours"}`;
  } else if (diffMinutes > 0) {
    message = `Due in ${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"}`;
  } else {
    message = "Due now!";
  }

  TimeRemainingEl.textContent = message;
}

// Checkbox toggle functionality
function SetupToggle() {
  CompleteToggle.addEventListener("change", function () {
    const isCompleted = this.checked;

    TodoCard.classList.toggle("completed", isCompleted);
    const titleEl = document.querySelector(TitleSelector);
    titleEl.classList.toggle("completed", isCompleted);

    if (isCompleted) {
      StatusEl.textContent = "Done";
      StatusEl.classList.add("completed");
    } else {
      StatusEl.textContent = "Pending";
      StatusEl.classList.remove("completed");
    }
  });
  
  
}

// Button event listeners
  EditButton.addEventListener("click", function () {
    console.log("Edit clicked");
  });

  DeleteButton.addEventListener("click", function () {
      alert("Delete clicked!");
  });


// Initialize everything
function Init() {
  UpdateTimeRemaining();

  // Update time remaining every 30 seconds
  setInterval(UpdateTimeRemaining, 30000);

  SetupToggle();
}



