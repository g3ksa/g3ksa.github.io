const todoInput = document.querySelector('.todo-input-text');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const year = document.querySelector('#year');
const month = document.querySelector('#month');
const day = document.querySelector('#day');
const monthsArray = ['January', 'February', 'March', 'April', 'May',
							'June', 'July', 'August', 'September', 'October',
							'November', 'December'];
let tasks;

!localStorage.tasks ? tasks = [] : tasks = JSON.parse(localStorage.getItem('tasks'));
createOptionsMonths(new Date().getMonth());
addDate();

try{
	loadLocalTasks();
}catch(e){}

todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteEditCheck);
month.addEventListener('change', addDate);
year.addEventListener('change', () => createOptionsMonths());
year.addEventListener('change', addDate);



function addTodo(event) {
	event.preventDefault();

	let curMonth, curDay;
	if(+day.value < 10){
		curDay = '0' + +day.value;
	}else{
		curDay = +day.value;
	}
	if(month.options[month.selectedIndex].value < 10){
		curMonth = '0' + (+month.options[month.selectedIndex].value + 1);
	}else{
		curMonth = +month.options[month.selectedIndex].value + 1;
	}
	const deadLine = `until ${curDay}.${curMonth}.${+year.value}`

	if(todoInput.value.trim() && !checkRepeat(tasks, todoInput.value, deadLine)) {
		const todoDiv = document.createElement('div');
		todoDiv.classList.add('todo');
		todoDiv.setAttribute('num', `${tasks.length}`);

		const newTodo = document.createElement('li');
		newTodo.innerText = todoInput.value + '\n' +  deadLine;
		newTodo.classList.add('todo-item');
		todoDiv.appendChild(newTodo);

		// const btnDiv = document.createElement('div');
		// btnDiv.classList.add('task-btns');

		// const editButton = document.createElement('button');
		// editButton.innerHTML = '<i class="fa fa-pen"></i>';
		// editButton.classList.add('edit-btn');
		// btnDiv.appendChild(editButton);

		const completedButton = document.createElement('button');
		completedButton.innerHTML = '<i class="fas fa-check"></i>';
		completedButton.classList.add('complete-btn');
		todoDiv.appendChild(completedButton);

		const trashButton = document.createElement('button');
		trashButton.innerHTML = '<i class="fas fa-trash"></i>';
		trashButton.classList.add('trash-btn');
		todoDiv.appendChild(trashButton);

		// todoDiv.appendChild(btnDiv);
		
		todoList.append(todoDiv);
		if(tasks.length > 0){
			if(!checkRepeat(tasks, todoInput.value, deadLine)) {
				tasks.push(new Task(todoInput.value, deadLine, new Date(+year.value, +month.options[month.selectedIndex].value, +day.value+1)))
				updateLocalStorage()
			}
		}else if(todoInput.value) {
			tasks.push(new Task(todoInput.value, deadLine, new Date(+year.value, +month.options[month.selectedIndex].value, +day.value+1)))
			updateLocalStorage()
		}
			todoInput.value = '';
	}

	todoInput.value = '';
}

function deleteEditCheck(e) {
	const item = e.target;

	if(item.classList[0] === 'trash-btn') {
		const todo = item.parentElement;
		todo.classList.add('fall');
		tasks.splice(+todo.getAttribute('num'), 1);
		updateLocalStorage();
		document.querySelectorAll('.todo').forEach((item) => {
			if(item.getAttribute('num') >= todo.getAttribute('num')){
				item.setAttribute('num', +item.getAttribute('num') - 1);
			}
		});
		
		todo.addEventListener('transitionend', function() {
			todo.remove();
		});
	}

	if(item.classList[0] === 'complete-btn') {
		const todo = item.parentElement;

		todo.classList.toggle('completed');
		tasks.forEach((task, index) => {
			if(((task.description + '\n' +  task.deadLine == todo.querySelector('.todo-item').innerText) || (task.deadLine == todo.querySelector('.todo-item').innerText)) && index == +todo.getAttribute('num')){

				if(todo.classList.contains('completed')){
					task.completed = true;
				}else{
					task.completed = false;
				}
				
			}
		});
		updateLocalStorage();
	}

}

function addDate() {
	let startMonth = 1
	if (+year.value == new Date().getFullYear()
		&& month.options[month.selectedIndex].value == new Date().getMonth()){
			startMonth = new Date().getDate();
	}

	const date = new Date(year.value, month.options[month.selectedIndex].value, startMonth);

	let dateOptions ='';

	while(date.getMonth() == month.options[month.selectedIndex].value){
		dateOptions += '<option value="'
					+ date.getDate()
					+ '">'
					+ date.getDate()
					+'</option>';

		date.setDate(date.getDate() + 1);
	}

	day.innerHTML = dateOptions;
}

function createOptionsMonths(curMonth = 0) {
	const year = +document.querySelector('#year').value;

	if(year == new Date().getFullYear()) curMonth = new Date().getMonth();
							
	let date = new Date(year, curMonth);
	let monthOptions = '';

	while(date.getFullYear() == year){
		monthOptions += '<option value="'
					+ date.getMonth()
					+ '">'
					+ monthsArray[date.getMonth()]
					+ '</option>';
		
		date.setMonth(date.getMonth() + 1);
	}

	month.innerHTML = monthOptions;
}

function updateLocalStorage() {
	localStorage.setItem('tasks', JSON.stringify(tasks));
}

function Task(description, deadLine, dateOfDeadLine) {
	this.description = description;
	this.completed = false;
	this.deadLine = deadLine;
	this.dateOfDeadLine = dateOfDeadLine;
}

function loadLocalTasks() {
	if(localStorage.getItem('tasks').length > 0) {
		JSON.parse(localStorage.getItem('tasks')).forEach((task, index) => {
			const todoDiv = document.createElement('div');
			todoDiv.classList.add('todo');
			if(task.completed) {
				todoDiv.classList.add('completed');
			}
			todoDiv.setAttribute('num', `${index}`);

			const newTodo = document.createElement('li');
			newTodo.innerText = task.description + '\n' +  task.deadLine;
			newTodo.classList.add('todo-item');
			todoDiv.appendChild(newTodo);
			if(task.dateOfDeadLine < new Date()) {
				newTodo.classList.add('overdue');
			}

			// const btnDiv = document.createElement('div');
			// btnDiv.classList.add('task-btns');

			// const editButton = document.createElement('button');
			// editButton.innerHTML = '<i class="fa fa-pen"></i>';
			// editButton.classList.add('edit-btn');
			// btnDiv.appendChild(editButton);

			const completedButton = document.createElement('button');
			completedButton.innerHTML = '<i class="fas fa-check"></i>';
			completedButton.classList.add('complete-btn');
			todoDiv.appendChild(completedButton);

			const trashButton = document.createElement('button');
			trashButton.innerHTML = '<i class="fas fa-trash"></i>';
			trashButton.classList.add('trash-btn');
			todoDiv.appendChild(trashButton);

			// todoDiv.appendChild(btnDiv);

			todoList.append(todoDiv);
		
		})
	}


	
}

function checkRepeat(tasks, description, deadLine) {
	res = false;
	tasks.forEach((task) => {
		if(task.description == description && task.deadLine == deadLine) {
			res = true;
		}
	})
	return res;
}
