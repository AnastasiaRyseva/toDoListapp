const createsTaskForm = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const allTasksList = document.querySelector('.allTasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

getItemLocalStorage()

changeEmptyList();

//добавляет новую задачу
createsTaskForm.addEventListener('submit', addTask);
//удаляет задачу
allTasksList.addEventListener('click', deleteTask);
//отмечает, что задача в процессе выполнения
allTasksList.addEventListener('click', progressTask);
//отмечает задачу выполненной
allTasksList.addEventListener('click', doneTask);



// функции

function addTask (event) {

    event.preventDefault();

    const textTask = taskInput.value;

    const newTask = {
        id: Date.now(),
        text: textTask,
        done: false,
        progress: false,
    };

    tasks.push(newTask);

    //сохранение задачи в LocalStorage
    saveToLocalStorage();

    //рендеринг задачи
    renderTask(newTask);

    taskInput.value = '';
    taskInput.focus();

    changeEmptyList();

    saveToLocalStorage();
};

// функция для измения отображения разметки блока "список задач пуст"
function changeEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `<li id="emptyList" class="emptyList">
        <img src="./img/logo.svg" alt="Empty" width="50px" class="empty-list__logo">
        <div class="empty-list__title">Список дел пуст</div>
    </li> `
        allTasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }

    if (tasks.length > 0) {
        const taskListElement = document.querySelector('#emptyList')
        taskListElement ? taskListElement.remove() : null;
    }
}

function deleteTask (event) {
    if(event.target.dataset.action !== 'delete') {
        return
    }

    const parentNode = event.target.closest('.task-item');

    // определяет id задачи
    const id = Number(parentNode.id);

    //удаление задачи через фильтрацию массива
    tasks = tasks.filter( function(task) {
        if(task. id === id) {
            return false
        } else {
            return true
        }
    });

    parentNode.remove();

    changeEmptyList();

    saveToLocalStorage();
}

function progressTask(event) {
    if (event.target.dataset.action !== 'progress') return;

    const parentNode = event.target.closest('.task-item');

    //определение id задачи
    const id = Number(parentNode.id);

    const task = tasks.find( (task) => task.id === id);

    task.progress = !task.progress;

    saveToLocalStorage();

    parentNode.classList.toggle('progress');
    parentNode.classList.remove('done');

    saveToLocalStorage()
};

function doneTask(event) {
    if (event.target.dataset.action !== 'done') return;

    const parentNode = event.target.closest('.task-item');

    const id = Number(parentNode.id);

    const task = tasks.find( (task) => task.id === id);

    task.done = !task.done;

    saveToLocalStorage();

    parentNode.classList.toggle('done');
    parentNode.classList.remove('progress');

    saveToLocalStorage();

}
// сохранение данных в LocalStorage
function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};
// получение данных из LocalStorage
function getItemLocalStorage() {
    if (localStorage.getItem('tasks')) {
        tasks = JSON.parse(localStorage.getItem('tasks'));
        tasks.forEach( (task) => renderTask(task));
    };
};

function renderTask(task) {
    //формирование нужного класса
    const cssClassDone = task.done ? `task-item done` : `task-item`;
    const cssClassProgress = task.progress ? `task-item progress` : `task-item`;

    // разметка для новой задачи
    const taskHTML = `<li id="${task.id}" class="${cssClassDone} ${cssClassProgress}">
        <span class="task-title">
            ${task.text}
        </span>
        <div class="task-item__buttons">
        <button type="button" data-action="progress" class="task-item__buttons_btn">
            <img src="./img/progress.svg" alt="Progress" width="10" height="10">
        </button>
        <button type="button" data-action="done" class="task-item__buttons_btn">
            <img src="./img/tick.svg" alt="Done" width="10" height="10">
        </button>
        <button type="button" data-action="delete" class="task-item__buttons_btn">
            <img src="./img/cross.svg" alt="Delete" width="10" height="10">
        </button>
        </div>
    </li>`

    // добавляет задачу на страницу
    allTasksList.insertAdjacentHTML('beforeend', taskHTML);

    saveToLocalStorage()
};


