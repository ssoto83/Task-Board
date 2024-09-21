// Global variables
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

$(document).ready(function () {
    renderTaskList();

    // Listen for the save button click
    $('#saveTaskButton').on('click', handleAddTask);

    // Make lanes droppable for dropping tasks
    $('.card-body').droppable({
        accept: '.card',
        drop: handleDrop
    });
});

// Function to handle adding a task
function handleAddTask(event) {
    event.preventDefault();
    console.log('adding task');

    let taskTitle = $("#taskTitle");
    let dueDate = $("#datePicker");
    let taskDescription = $("#taskDescription");

    // Validate the date
    if (!dueDate.val() || !dayjs(dueDate.val()).isValid()) {
        alert("Please enter a valid due date.");
        return;
    }

    let formattedDate = dayjs(dueDate.val()).format('YYYY-MM-DD');

    let addTask = {
        id: generateTaskId(),
        title: taskTitle.val(),
        description: taskDescription.val(),
        deadline: formattedDate,
        status: "todo"
    };

    // Add the new task to the task list
    taskList.push(addTask);
    localStorage.setItem('tasks', JSON.stringify(taskList));

    renderTaskList();

    // Clear the input fields
    taskTitle.val("");
    dueDate.val("");
    taskDescription.val("");
    $('#formModal').modal('hide');
}

// Function to render tasks in the respective lanes
function renderTaskList() {
    // Clear existing task cards
    $('#todo-cards').empty();
    $('#in-progress-cards').empty();
    $('#done-cards').empty();

    taskList.forEach(task => {
        let taskCard = `
            <div class="card mb-2 draggable" id="task-${task.id}" data-id="${task.id}">
                <div class="card-body">
                    <h5 class="card-title">${task.title}</h5>
                    <p class="card-text">${task.description}</p>
                    <p class="card-text"><small class="text-muted">Due: ${task.deadline}</small></p>
                    <button class="btn btn-danger delete-task">Delete</button>
                </div>
            </div>`;

        if (task.status === "todo") {
            $('#todo-cards').append(taskCard);
        } else if (task.status === "in-progress") {
            $('#in-progress-cards').append(taskCard);
        } else if (task.status === "done") {
            $('#done-cards').append(taskCard);
        }
    });

    // Attach delete event handler to dynamically added buttons
    $('.delete-task').on('click', handleDeleteTask);

    // Make task cards draggable
    $('.draggable').draggable({
        revert: "invalid", // revert if not dropped on a droppable
        start: function() {
            $(this).css("opacity", "0.5");
        },
        stop: function() {
            $(this).css("opacity", "1");
        }
    });
}

// Handle task deletion
function handleDeleteTask(event) {
    const taskId = $(event.currentTarget).closest('.card').data('id');
    taskList = taskList.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();
}

// Function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable.data('id');
    const newStatus = $(this).closest('.card').parent().attr('id').replace('-cards', '');

    // Update the status of the task
    taskList.forEach(task => {
        if (task.id === taskId) {
            task.status = newStatus;
        }
    });

    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();
}

// Function to generate a unique task ID
function generateTaskId() {
    return nextId++;
}

   