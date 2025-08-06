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
