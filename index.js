document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTask');
    const taskList = document.getElementById('taskList');
    const clearAllButton = document.getElementById('clearAll');
    const apiUrl = 'http://localhost:9010/tasks'; URL
    
    // Load tasks from server on page load
    loadTasks();
  
    // Event listener for adding a task
    addTaskButton.addEventListener('click', addTask);
  
    // Event listener to mark a task as completed or removing it
    taskList.addEventListener('click', function(event) {
        if (event.target.tagName === 'LI') {
            event.target.classList.toggle('completed');
            saveTasks();
        } else if (event.target.classList.contains('remove-task')) {
            event.target.parentElement.remove();
            saveTasks();
        }
    });
  
    // Event listener to clear all tasks
    clearAllButton.addEventListener('click', function() {
        taskList.innerHTML = '';
        saveTasks();
    });
  
    // Function to add a task to the list
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const li = document.createElement('li');
            li.textContent = taskText;
            li.innerHTML += '<button class="remove-task">Remove</button>';
            taskList.appendChild(li);
            saveTasks();
            taskInput.value = '';
        }
    }
  
    // Function to save tasks to the server
    function saveTasks() {
        const tasks = Array.from(taskList.querySelectorAll('li')).map(li => li.textContent);
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tasks),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to save tasks');
            }
        })
        .catch(error => console.error('Error saving tasks:', error));
    }
  
    // Function to load tasks from the server
    function loadTasks() {
        fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            return response.json();
        })
        .then(tasks => {
            taskList.innerHTML = '';
            tasks.forEach(task => {
                const li = document.createElement('li');
                li.textContent = task;
                li.innerHTML += '<button class="remove-task">Remove</button>';
                taskList.appendChild(li);
            });
        })
        .catch(error => console.error('Error loading tasks:', error));
    }
  });
  