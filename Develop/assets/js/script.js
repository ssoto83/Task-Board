// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Now you can use taskList and nextId in your code
// console.log(taskList);
// console.log(nextId);

// Todo: create a function to generate a unique task id
function generateTaskId() {
    let id = nextId++;
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return id;
   }

// Todo: create a function to create a task card
function createTaskCard(task) {
    let card = $('<div>').addClass('card task-card draggable').attr('data-task-id', task.id).attr('style', 'width: 12rem');

    let title = $('<h3>').text(task.title);
    let deadline = $('<p>').text('deadline:' + dayjs(task.deadline).format('MM-DD-YY'));
    let description = $('<p>').text(task.description);

    card.append(title, deadline, description);

    let deleteButton = $('<button>').addClass('delete-task').text('delete');
    card.append(deleteButton);

    card.draggable({
        containment: 'document'
    });

    return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $('#todo-cards, #in-progress-cards, #done-cards').empty();
    // const todoCards = $('#todo-cards');
    // todoCards.empty();
    // const inProgressCards = $('#todo-cards');
    // todoCards.empty();
    // const todoCards = $('#todo-cards');
    // todoCards.empty();

    taskList.forEach(task => {
        let card = createTaskCard(task);
            card.draggable();
            if (task.status === 'todo') {
                $('#todo-cards').append(card);
            } else if (task.status === 'inProgress') {
                $('#in-progress-cards').append(card);
            } else if (task.status === 'done') {
                $('#done-cards').append(card);
            }
            card.draggable();
        });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
   
    let task = $("#taskTitle");
    let dueDate = $("#datePicker");
    let taskDescription = $("#taskDescription");
    let formattedDate = dayjs(dueDate.val()).format('YYYY-MM-DD');
   
    let addTask = {
        id: generateTaskId(),
        title: task.val(),
        description: taskDescription.val(),
        deadline: formattedDate,
        status: "todo"
    };

    taskList.push(addTask);
    localStorage.setItem('tasks', JSON.stringify(taskList));

    renderTaskList();

    $("#taskTitle").val("");
    $("#datePicker").val("");
    $("#taskDescription").val("");
    // $('#formModal').modal('hide');
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    let taskId = $(event.target).closest('.task-card').data('task-id');
    taskList = taskList.filter(task => task.id !== taskId);

    localStorage.setItem('tasks', JSON.stringify(taskList));

    $(event.target).closest('.task-card').remove();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
        // let taskId = ui.draggable.data('task-id');
        let taskId = ui.draggable[0].dataset.taskId;
        // let newStatus = $(event.target).closest('.lane').attr('id');
        let newStatus = event.target.id;

        // let taskToUpdate = taskList.find(task => task.id === taskId);

        // if (taskToUpdate) {
        //     taskToUpdate.status= newStatus;
        // }
        for (let task of taskList) {
            if (task.id === parseInt(taskId)) {
                task.status = newStatus;
            }
        }
    localStorage.setItem('tasks', JSON.stringify(taskList));

    // ui.draggable.detach().appendTo($(event.target).closest('.card-body'));
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
        renderTaskList();

        $('#addTaskButton').on('click', handleAddTask);

        $('#todo-cards, #in-progress-cards, #done-cards').on('click', '.delete-task', handleDeleteTask);

        $('.lane').droppable({
            accept: '.draggable',
            drop: handleDrop,
        });
        $('#datePicker').datepicker({
            dateFormat: 'mm-dd-yy'
        });
});
