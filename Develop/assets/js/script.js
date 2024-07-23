// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
let dateInputEl = $('#datePicker');


// Now you can use taskList and nextId in your code
console.log(taskList);
console.log(nextId);

// Todo: create a function to generate a unique task id
function generateTaskId() {
let id = nextId++;
localStorage.setItem("nextId", JSON.stringify(nextId));
return id;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    let card = $('<div>').addClass('task-card');

    card.attr('data-task-id', task.id);

    let title = $('<h3>').text(task.title);
    let deadline = $('<p>').text('deadline:' + task.deadline);
    let description = $('<p>').text(task.description);

    card.append(title, deadline, description);
    return card;

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

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
            });
            }
         
//     $( function() {
//         $( "#draggable" ).draggable();
//         card.draggable();
//       } );
// }

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    let task = $("#task").val();
    let dueDate = $("#datePicker").val();
    let taskDescription = $("#taskDescription").val();
   
    let addTask = {
        id: generateTaskId(),
        task: task,
        description: taskDescription,
        deadline: dueDate,
        progress: "todo"
    };

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    let taskId = $(event.target).closest('.task-card').data('task-id');
    taskList = taskList.filter(task => task.id !== taskId);

    localStorage.setItem('task', json.stringify(taskList));

    $(event.target).closest('.task-card').remove();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
        let taskId = ui.draggable.data('task-id');
        let newStatus = $(event.target).closest('.lane').attr('id');

        let taskToUpdate = taskList.find(task => task.id === taskId);
        if (taskToUpdate) {
            taskToUpdate.status = newStatus;
        }

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

});
