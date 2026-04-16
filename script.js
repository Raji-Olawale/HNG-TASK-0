let DueDate = new Date("2026-04-17T23:59:00Z");
const CardSelector = '[data-testid="test-todo-card"]';
const TitleSelector = '[data-testid="test-todo-title"]';
const TimeRemainingSelector = '[data-testid="test-todo-time-remaining"]';
const CompleteToggleSelector = '[data-testid="test-todo-complete-toggle"]';
const StatusSelector = '[data-testid="test-todo-status"]';
const StatusControlSelector = '[data-testid="test-todo-status-control"]';
const EditButtonSelector = '[data-testid="test-todo-edit-button"]';
const DeleteButtonSelector = '[data-testid="test-todo-delete-button"]';
const EditFormSelector = '[data-testid="test-todo-edit-form"]';
const ViewContentSelector = '[data-testid="test-todo-view-content"]';
const PriorityBadgeSelector = '[data-testid="test-todo-priority"]';
const DueDateTimeSelector = '[data-testid="test-todo-due-date"]';
const EditModalSelector = "#edit-modal";
const BackdropSelector = "#modal-backdrop";
const ModalCloseSelector = ".modal-close";

let TodoCard = document.querySelector(CardSelector);
let TimeRemainingEl = document.querySelector(TimeRemainingSelector);
let CompleteToggle = document.querySelector(CompleteToggleSelector);
let StatusEl = document.querySelector(StatusSelector);
let StatusControl = document.querySelector(StatusControlSelector);
let EditButton = document.querySelector(EditButtonSelector);
let DeleteButton = document.querySelector(DeleteButtonSelector);
let EditModal = document.querySelector(EditModalSelector);
let Backdrop = document.querySelector(BackdropSelector);
let ModalClose = document.querySelector(ModalCloseSelector);
let PriorityBadge = document.querySelector(PriorityBadgeSelector);
let DueDateTime = document.querySelector(DueDateTimeSelector);

let todoData = {};
let currentStatus = "pending";

// Remove unused
// let ViewContent = ...;

document.addEventListener("DOMContentLoaded", function () {
  Init();
});

// Update time remaining
function UpdateTimeRemaining() {
  if (currentStatus === "done") {
    TimeRemainingEl.textContent = "Completed";
    return;
  }

  const now = new Date();
  const diffMs = DueDate - now;
  const OverdueIndicator = document.querySelector(
    '[data-testid="test-todo-overdue-indicator"]',
  );

  if (diffMs <= 0) {
    const overdueMs = -diffMs;
    const overdueSeconds = Math.floor(overdueMs / 1000);
    const overdueMinutes = Math.floor(overdueSeconds / 60);
    const overdueHours = Math.floor(overdueMinutes / 60);
    const overdueDays = Math.floor(overdueHours / 24);

    TimeRemainingEl.textContent =
      overdueDays > 0
        ? `Overdue by ${overdueDays} day${overdueDays === 1 ? "" : "s"}`
        : overdueHours > 0
          ? `Overdue by ${overdueHours} hour${overdueHours === 1 ? "" : "s"}`
          : `Overdue by ${overdueMinutes} minute${overdueMinutes === 1 ? "" : "s"}`;
    TimeRemainingEl.style.color = "#e53e3e";
    OverdueIndicator.textContent = "Overdue";
    OverdueIndicator.style.display = "inline-block";
    return;
  } else {
    OverdueIndicator.style.display = "none";
    OverdueIndicator.textContent = "";
  }

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  let message;
  if (diffDays > 0) {
    message = `Due in ${diffDays} day${diffDays === 1 ? "" : "s"}`;
  } else if (diffHours > 0) {
    message = `Due in ${diffHours} hour${diffHours === 1 ? "" : "s"}`;
  } else if (diffMinutes > 0) {
    message = `Due in ${diffMinutes} minute${diffMinutes === 1 ? "" : "s"}`;
  } else {
    message = "Due now!";
  }

  TimeRemainingEl.textContent = message;
  TimeRemainingEl.style.color = "";
}

// Checkbox toggle functionality
function SetupToggle() {
  CompleteToggle.addEventListener("change", function () {
    const targetStatus = this.checked ? "done" : "pending";
    setStatus(targetStatus);
  });
}

// Status control setup
function setupStatusControl() {
  StatusControl.addEventListener("change", function () {
    setStatus(this.value);
  });
}

// Central status setter - syncs everything
function setStatus(status) {
  currentStatus = status;
  StatusControl.value = status;
  CompleteToggle.checked = status === "done";

  // Update badge
  const displayText =
    status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ");
  StatusEl.textContent = displayText;
  StatusEl.className = `status-badge status-${status}`;

  // Update visuals
  const isDone = status === "done";
  TodoCard.classList.toggle("completed", isDone);
  const titleEl = document.querySelector(TitleSelector);
  titleEl.classList.toggle("completed", isDone);
}

// Edit mode functions
function enterEditMode() {
  // Store current data
  todoData = {
    title: document.querySelector(TitleSelector).textContent,
    description: document.querySelector('[data-testid="test-todo-description"]')
      .textContent,
    priority: PriorityBadge.textContent,
    dueDateStr: DueDateTime.getAttribute("datetime"),
    dueDate: new Date(DueDate),
  };

  // Populate form
  document.querySelector('[data-testid="test-todo-edit-title-input"]').value =
    todoData.title;
  document.querySelector(
    '[data-testid="test-todo-edit-description-input"]',
  ).value = todoData.description;
  document.querySelector(
    '[data-testid="test-todo-edit-priority-select"]',
  ).value = todoData.priority;
  document.querySelector(
    '[data-testid="test-todo-edit-due-date-input"]',
  ).value = todoData.dueDate.toISOString().slice(0, 16);

  // Enter edit mode
  EditModal.classList.remove("hidden");
  Backdrop.classList.remove("hidden");
  EditModal.querySelector('[data-testid="test-todo-edit-title-input"]').focus();
}

function exitEditMode() {
  EditModal.classList.add("hidden");
  Backdrop.classList.add("hidden");
  EditButton.focus();
}

function saveChanges() {
  // Read form
  const titleInput = document.querySelector(
    '[data-testid="test-todo-edit-title-input"]',
  );
  const descInput = document.querySelector(
    '[data-testid="test-todo-edit-description-input"]',
  );
  const prioritySelect = document.querySelector(
    '[data-testid="test-todo-edit-priority-select"]',
  );
  const dueInput = document.querySelector(
    '[data-testid="test-todo-edit-due-date-input"]',
  );

  const newTitle = titleInput.value.trim();
  const newDesc = descInput.value.trim();
  const newPriority = prioritySelect.value;
  const newDueDate = new Date(dueInput.value + ":00Z");

  if (!newTitle) return; // Prevent empty title

  // Update display
  document.querySelector(TitleSelector).textContent = newTitle;
  document.querySelector('[data-testid="test-todo-description"]').textContent =
    newDesc;
  PriorityBadge.textContent = newPriority;
  PriorityBadge.className = `priority-badge priority-${newPriority.toLowerCase()}`;
  DueDateTime.setAttribute("datetime", newDueDate.toISOString());
  DueDateTime.textContent = newDueDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  DueDate = newDueDate; // Update global for countdown

  exitEditMode();
  UpdateTimeRemaining(); // Refresh immediately
}

function cancelEdit() {
  // Restore original
  document.querySelector(TitleSelector).textContent = todoData.title;
  document.querySelector('[data-testid="test-todo-description"]').textContent =
    todoData.description;
  PriorityBadge.textContent = todoData.priority;
  DueDateTime.setAttribute("datetime", todoData.dueDateStr);
  DueDateTime.textContent = `Due ${new Date(todoData.dueDateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;
  DueDate = todoData.dueDate;

  exitEditMode();
  UpdateTimeRemaining();
}

// Button event listeners
let ToggleButton = document.querySelector(
  '[data-testid="test-toggle-details"]',
);
let DetailsSection = document.getElementById("todo-description-section");

function setupToggleDetails() {
  ToggleButton.addEventListener("click", function () {
    const isExpanded = DetailsSection.hidden;
    DetailsSection.hidden = !isExpanded;
    ToggleButton.setAttribute("aria-expanded", !isExpanded);
    ToggleButton.querySelector(".toggle-icon").textContent = isExpanded
      ? "▲"
      : "▼";
  });
}

EditButton.addEventListener("click", enterEditMode);

DeleteButton.addEventListener("click", function () {
  alert("Delete clicked!");
});

// Initialize everything
function Init() {
  UpdateTimeRemaining();

  // Update time remaining every 30 seconds
  setInterval(UpdateTimeRemaining, 30000);

  // Initialize status
  setStatus("pending");
  SetupToggle();
  setupStatusControl();
  setupToggleDetails();

  // Edit form listeners
  document
    .querySelector('[data-testid="test-todo-save-button"]')
    .addEventListener("click", saveChanges);
  document
    .querySelector('[data-testid="test-todo-cancel-button"]')
    .addEventListener("click", cancelEdit);

  // Focus trap (bonus)
  EditModal.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      const focusable = EditModal.querySelectorAll(
        'button:not(.modal-close), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    if (e.key === "Escape") {
      cancelEdit();
    }
  });

  // Backdrop and close button
  Backdrop.addEventListener("click", cancelEdit);
  ModalClose.addEventListener("click", cancelEdit);
}
