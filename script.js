document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    // Load tasks from localStorage on page load
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(task => addTask(task.text, task.completed));

    addTaskBtn.addEventListener('click', () => addTask());
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    function addTask(taskText = null, isCompleted = false) {
        if (!taskText) {
            taskText = taskInput.value.trim();
            if (taskText === '') {
                alert('Please enter a task.');
                return;
            }
        }

        const li = document.createElement('li');
        if (isCompleted) li.classList.add('completed');
        li.innerHTML = `
            <span>${taskText}</span>
            <button class="delete-btn">Delete</button>
        `;
        taskList.appendChild(li);
        taskInput.value = ''; // Clear input

        // Save tasks after adding
        saveTasks();

        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.remove();
            saveTasks();
        });

        li.querySelector('span').addEventListener('click', () => {
            li.classList.toggle('completed');
            saveTasks();
        });
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            tasks.push({
                text: li.querySelector('span').textContent,
                completed: li.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});






// Pomodoro Timer
let timerDisplay = document.getElementById("timer");
let startBtn = document.getElementById("startBtn");
let stopBtn = document.getElementById("stopBtn");
let resetBtn = document.getElementById("resetBtn");

let focusTime = 25 * 60; // 25 minutes
let breakTime = 5 * 60;  // 5 minutes
let timeLeft = focusTime;
let isRunning = false;
let isBreak = false;
let interval;

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  interval = setInterval(() => {
    timeLeft--;
    updateDisplay();

    if (timeLeft <= 0) {
      clearInterval(interval);
      isRunning = false;
      isBreak = !isBreak;
      timeLeft = isBreak ? breakTime : focusTime;
      updateDisplay();
      alert(isBreak ? "Break time!" : "Focus time!");
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);
  isRunning = false;
}

function resetTimer() {
  clearInterval(interval);
  isRunning = false;
  isBreak = false;
  timeLeft = focusTime;
  updateDisplay();
}

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

updateDisplay();


// Rich text formatting
function format(command) {
    document.execCommand(command, false, null);
}

// Save notes to localStorage when changed
const editor = document.getElementById('editor');

editor.addEventListener('input', () => {
    localStorage.setItem('richNotes', editor.innerHTML);
});

// Load saved notes when page loads
window.addEventListener('DOMContentLoaded', () => {
    const savedNotes = localStorage.getItem('richNotes');
    if (savedNotes) {
        editor.innerHTML = savedNotes;
    }
});

const calendar = document.getElementById('calendar');
const modal = document.getElementById('eventModal');
const selectedDateSpan = document.getElementById('selectedDate');
const eventInput = document.getElementById('eventInput');
const saveEventBtn = document.getElementById('saveEventBtn');
const closeModal = document.getElementById('closeModal');
const monthYearDisplay = document.getElementById('monthYearDisplay');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');

let selectedDate = null;
let currentDate = new Date();

function formatDateKey(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function generateCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();

    calendar.innerHTML = '';
    monthYearDisplay.textContent = `${date.toLocaleString('default', { month: 'long' })} ${year}`;

    // Fill empty slots before first day
    for (let i = 0; i < firstDayIndex; i++) {
        calendar.appendChild(document.createElement('div'));
    }

    // Create day buttons
    for (let day = 1; day <= daysInMonth; day++) {
        const cellDate = new Date(year, month, day);
        const key = formatDateKey(cellDate);

        const div = document.createElement('div');
        div.classList.add('calendar-day');
        div.textContent = day;

        if (localStorage.getItem(`event-${key}`)) {
            div.classList.add('event');
        }

        div.addEventListener('click', () => {
            selectedDate = key;
            selectedDateSpan.textContent = key;
            eventInput.value = localStorage.getItem(`event-${key}`) || '';
            modal.style.display = 'block';
        });

        calendar.appendChild(div);
    }
}

// Navigation
prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar(currentDate);
});

nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar(currentDate);
});

// Save Event
saveEventBtn.addEventListener('click', () => {
    if (selectedDate) {
        const eventText = eventInput.value.trim();
        if (eventText !== '') {
            localStorage.setItem(`event-${selectedDate}`, eventText);
        } else {
            localStorage.removeItem(`event-${selectedDate}`);
        }
        modal.style.display = 'none';
        generateCalendar(currentDate);
    }
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Initial render
generateCalendar(currentDate);
