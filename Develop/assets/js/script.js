// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Function to generate a unique task ID
function generateTaskId() {
    return nextId++;
}

// Function to save the task list and nextId back to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", JSON.stringify(nextId));
}

// Function to create a task card
function createTaskCard(task) {
    const color = getTaskColor(task);
    return `
        <div class="card mb-2" id="task-${task.id}" draggable="true" style="background-color: ${color};" 
             ondragstart="handleDragStart(event, ${task.id})">
            <div class="card-body">
                <h5 class="card-title">${task.title}</h5>
                <p class="card-text">${task.description}</p>
                <p class="card-text"><strong>Deadline: ${new Date(task.deadline).toLocaleDateString()}</strong></p>
                <div class="d-flex justify-content-end">
                    <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">Delete</button>
                </div>
            </div>
        </div>
    `;
}

// Function to get task color based on deadline
function getTaskColor(task) {
    const now = new Date();
    const deadline = new Date(task.deadline);
    if (deadline < now) {
        return 'red'; // Overdue
    } else if ((deadline - now) < 3 * 24 * 60 * 60 * 1000) { // Less than 3 days left
        return 'yellow'; // Nearing deadline
    }
    return 'transparent'; // No special color
}

// Function to render task list in the appropriate lanes
function renderTaskList() {
    $('#todo-cards').empty();
    $('#in-progress-cards').empty();
    $('#done-cards').empty();

    taskList.forEach(task => {
        if (task.status === 'Not Yet Started') {
            $('#todo-cards').append(createTaskCard(task));
        } else if (task.status === 'In Progress') {
            $('#in-progress-cards').append(createTaskCard(task));
        } else if (task.status === 'Completed') {
            $('#done-cards').append(createTaskCard(task));
        }
    });
}

// Function to add a task
function addTask(title, description, deadline) {
    const taskId = generateTaskId();
    const newTask = { id: taskId, title, description, deadline, status: 'Not Yet Started' };
    taskList.push(newTask);
    saveTasks();
    renderTaskList();
}

// Function to handle adding a task
function handleAddTask() {
    const title = $('#taskTitle').val().trim();
    const description = $('#taskDescription').val().trim();
    const deadline = $('#taskDeadline').val();

    if (title && description && deadline) {
        addTask(title, description, deadline);
        $('#taskForm').trigger("reset");
        $('#formModal').modal('hide');
    } else {
        alert("Please fill in all fields.");
    }
}

// Drag start
function handleDragStart(event, taskId) {
    const originalEvent = event.originalEvent || event; // Fallback for jQuery-wrapped event
    originalEvent.dataTransfer.setData('text/plain', taskId);
    const card = document.getElementById(`task-${taskId}`);
    card.classList.add('dragging'); // Add dragging class
}

// Drag over function
function handleDragOver(event) {
    event.preventDefault(); // Allow drop
}

// Drop function
function handleDrop(event) {
    event.preventDefault();
    const taskId = event.originalEvent.dataTransfer.getData('text/plain');
    const task = taskList.find(t => t.id == taskId);

    if (task) {
        const targetColumnId = $(event.target).closest('.lane').attr('id');

        if (targetColumnId === 'to-do') {
            task.status = 'Not Yet Started';
        } else if (targetColumnId === 'in-progress') {
            task.status = 'In Progress';
        } else if (targetColumnId === 'done') {
            task.status = 'Completed';
        }

        saveTasks();
        renderTaskList();
    }
}


// Example delete task function
function deleteTask(taskId) {
    taskList = taskList.filter(t => t.id !== taskId);
    saveTasks();
    renderTaskList();
}

$(document).ready(function () {
    // Initial render of tasks when the page loads
    renderTaskList();

    // Event listener for the "Add Task" button
    $('#addTaskButton').on('click', handleAddTask);

    // Event listeners for drag-and-drop events
    $('.lane').on('dragover', handleDragOver);
    $('.lane').on('drop', handleDrop);
});

