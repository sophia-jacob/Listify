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
