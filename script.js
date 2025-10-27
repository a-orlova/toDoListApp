document.addEventListener('DOMContentLoaded', function() {
    class TodoApp {
        constructor() {
            this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            this.currentFilter = 'all';
            this.isSortByDate = false;
            this.isEditing = false;
            this.editingTaskId = null;
            
            this.init();
        }

        init() {
            this.createDOMStructure();
            this.bindEvents();
            this.renderTasks();
            this.updateTaskCount();
            this.toggleEmptyMessage();
        }

        // структура сайта
        createDOMStructure() {
            // основной контейнер
            this.todoContainer = document.createElement('div');
            this.todoContainer.className = 'todo';
            document.body.appendChild(this.todoContainer);

            // заголовок
            const header = document.createElement('header');
            header.className = 'todo__header';
            
            const title = document.createElement('h1');
            title.className = 'todo__title';
            title.textContent = 'to-do list';
            
            header.appendChild(title);
            this.todoContainer.appendChild(header);

            // +задача
            this.createAddForm();

            // поиск
            this.createSearchForm();

            this.createInfoSection();

            // список задач
            this.taskList = document.createElement('section');
            this.taskList.className = 'todo__list';
            this.taskList.innerHTML = '<ul id="tasks-container"></ul>';
            this.todoContainer.appendChild(this.taskList);

            // форма редактирования 
            this.createEditForm();

            // сообщение, что нет задач
            this.createEmptyMessage();

            // контейнер для задач
            this.tasksContainer = document.getElementById('tasks-container');
        }

        createAddForm() {
            const controlsSection = document.createElement('section');
            controlsSection.className = 'todo__controls';

            this.addForm = document.createElement('form');
            this.addForm.className = 'todo__form';
            this.addForm.id = 'task-form';

            const nameLabel = document.createElement('label');
            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.name = 'task';
            nameInput.placeholder = 'add new task';
            nameInput.required = true;
            nameLabel.appendChild(nameInput);

            const dateLabel = document.createElement('label');
            const dateInput = document.createElement('input');
            dateInput.type = 'date';
            dateInput.name = 'date';
            
            dateLabel.appendChild(dateInput);

            const addBtn = document.createElement('button');
            addBtn.type = 'submit';
            addBtn.className = 'btn btn--add';
            addBtn.title = 'add task';
            addBtn.textContent = 'add';

            this.addForm.appendChild(nameLabel);
            this.addForm.appendChild(dateLabel);
            this.addForm.appendChild(addBtn);
            controlsSection.appendChild(this.addForm);
            this.todoContainer.appendChild(controlsSection);
        }

        createSearchForm() {
            const searchSection = document.createElement('form');
            searchSection.className = 'todo__search';

            const searchLabel = document.createElement('label');
            const searchInput = document.createElement('input');
            searchInput.type = 'search';
            searchInput.name = 'search';
            searchInput.placeholder = 'search task';
            
            searchLabel.appendChild(searchInput);
            searchSection.appendChild(searchLabel);
            this.todoContainer.appendChild(searchSection);
        }

        createInfoSection() {
            const infoSection = document.createElement('section');
            infoSection.className = 'todo__info';

            const totalPara = document.createElement('p');
            totalPara.className = 'todo__total';
            totalPara.innerHTML = 'total: <span id="task-count">0</span>';
            
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'todo__actions';

            const sortBtn = document.createElement('button');
            sortBtn.className = 'btn btn--filter';
            sortBtn.title = 'sort by date';
            sortBtn.innerHTML = '<img src="images/sortByDate.svg" alt="sort by date">';

            const filterBtn = document.createElement('button');
            filterBtn.className = 'btn btn--filter';
            filterBtn.title = 'filter by complete status';
            filterBtn.innerHTML = '<img src="images/filter.svg" alt="filter by complete status">';

            const deleteAllBtn = document.createElement('button');
            deleteAllBtn.className = 'btn btn--delete-all';
            deleteAllBtn.title = 'delete all';
            deleteAllBtn.innerHTML = '<img src="images/dalateAllBtn.svg" alt="delete all">';

            actionsDiv.appendChild(sortBtn);
            actionsDiv.appendChild(filterBtn);
            actionsDiv.appendChild(deleteAllBtn);
            
            infoSection.appendChild(totalPara);
            infoSection.appendChild(actionsDiv);
            this.todoContainer.appendChild(infoSection);
        }

        createEditForm() {
            const editSection = document.createElement('section');
            editSection.className = 'todo__edit';
            editSection.style.display = 'none';

            this.editForm = document.createElement('form');
            this.editForm.id = 'edit-form';

            const nameLabel = document.createElement('label');
            this.editNameInput = document.createElement('input');
            this.editNameInput.type = 'text';
            nameLabel.appendChild(this.editNameInput);

            const dateLabel = document.createElement('label');
            this.editDateInput = document.createElement('input');
            this.editDateInput.type = 'date';
            
            dateLabel.appendChild(this.editDateInput);

            const saveBtn = document.createElement('button');
            saveBtn.type = 'submit';
            saveBtn.className = 'btn btn--save';
            saveBtn.textContent = 'save';

            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.className = 'btn btn--cancel';
            cancelBtn.textContent = 'cancel';

            this.editForm.appendChild(nameLabel);
            this.editForm.appendChild(dateLabel);
            this.editForm.appendChild(saveBtn);
            this.editForm.appendChild(cancelBtn);
            editSection.appendChild(this.editForm);
            this.todoContainer.appendChild(editSection);

            this.editSection = editSection;
        }

        createEmptyMessage() {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'todo__empty';
            emptyDiv.style.display = 'none';
            
            const emptyPara = document.createElement('p');
            emptyPara.textContent = "u don't have any tasks yet 😔";
            
            emptyDiv.appendChild(emptyPara);
            this.todoContainer.appendChild(emptyDiv);

            this.emptyMessage = emptyDiv;
        }

        bindEvents() {
            this.addForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addTask();
            });

            const searchInput = document.querySelector('input[name="search"]');
            searchInput.addEventListener('input', (e) => {
                this.searchTasks(e.target.value);
            });

            const actionsDiv = document.querySelector('.todo__actions');
            actionsDiv.children[0].addEventListener('click', () => this.toggleSortByDate());
            actionsDiv.children[1].addEventListener('click', () => this.toggleFilter());
            actionsDiv.children[2].addEventListener('click', () => this.deleteAllTasks());

            this.editForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveEditedTask();
            });

            const cancelBtn = this.editForm.querySelector('.btn--cancel');
            cancelBtn.addEventListener('click', () => this.cancelEdit());
        }

        generateId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        }

        addTask() {
            const formData = new FormData(this.addForm);
            const taskName = formData.get('task').trim();
            const taskDate = formData.get('date');

            if (!taskName) return;

            const task = {
                id: this.generateId(),
                name: taskName,
                date: taskDate || new Date().toISOString().split('T')[0],
                completed: false,
                createdAt: new Date().toISOString()
            };

            this.tasks.push(task);
            this.saveToLocalStorage();
            this.renderTasks();
            this.updateTaskCount();
            this.toggleEmptyMessage();
            this.addForm.reset();
        }

        deleteTask(taskId) {
            this.tasks = this.tasks.filter(task => task.id !== taskId);
            this.saveToLocalStorage();
            this.renderTasks();
            this.updateTaskCount();
            this.toggleEmptyMessage();
        }

        toggleTaskCompletion(taskId) {
            const task = this.tasks.find(t => t.id === taskId);
            if (task) {
                task.completed = !task.completed;
                this.saveToLocalStorage();
                this.renderTasks();
            }
        }

        startEditTask(taskId) {
            const task = this.tasks.find(t => t.id === taskId);
            if (task) {
                this.isEditing = true;
                this.editingTaskId = taskId;
                this.editNameInput.value = task.name;
                this.editDateInput.value = task.date;
                this.editSection.style.display = 'block';
                this.taskList.style.display = 'none';
            }
        }

        saveEditedTask() {
            const task = this.tasks.find(t => t.id === this.editingTaskId);
            if (task) {
                task.name = this.editNameInput.value.trim();
                task.date = this.editDateInput.value;
                this.saveToLocalStorage();
                this.cancelEdit();
                this.renderTasks();
            }
        }

        cancelEdit() {
            this.isEditing = false;
            this.editingTaskId = null;
            this.editSection.style.display = 'none';
            this.taskList.style.display = 'block';
        }

        searchTasks(query) {
            this.currentSearchQuery = query.toLowerCase();
            this.renderTasks();
        }

        toggleSortByDate() {
            this.isSortByDate = !this.isSortByDate;
            this.renderTasks();
        }

        toggleFilter() {
            const filters = ['all', 'active', 'completed'];
            const currentIndex = filters.indexOf(this.currentFilter);
            this.currentFilter = filters[(currentIndex + 1) % filters.length];
            this.renderTasks();
        }

        deleteAllTasks() {
            if (confirm('Are you sure you want to delete all tasks?')) {
                this.tasks = [];
                this.saveToLocalStorage();
                this.renderTasks();
                this.updateTaskCount();
                this.toggleEmptyMessage();
            }
        }

        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('ru-RU');
        }

        renderTasks() {
            this.tasksContainer.innerHTML = '';

            let filteredTasks = [...this.tasks];

            if (this.currentSearchQuery) {
                filteredTasks = filteredTasks.filter(task => 
                    task.name.toLowerCase().includes(this.currentSearchQuery)
                );
            }

            if (this.currentFilter === 'active') {
                filteredTasks = filteredTasks.filter(task => !task.completed);
            } else if (this.currentFilter === 'completed') {
                filteredTasks = filteredTasks.filter(task => task.completed);
            }

            if (this.isSortByDate) {
                filteredTasks.sort((a, b) => new Date(a.date) - new Date(b.date));
            }

            filteredTasks.forEach(task => {
                const taskElement = this.createTaskElement(task);
                this.tasksContainer.appendChild(taskElement);
            });

            this.makeTasksDraggable();
        }

        createTaskElement(task) {
            const li = document.createElement('li');
            li.className = `task ${task.completed ? 'task--completed' : ''}`;
            li.draggable = true;
            li.dataset.taskId = task.id;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => this.toggleTaskCompletion(task.id));

            const nameSpan = document.createElement('span');
            nameSpan.className = 'task__name';
            nameSpan.textContent = task.name;

            const time = document.createElement('time');
            time.className = 'task__date';
            time.textContent = this.formatDate(task.date);

            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn--edit';
            editBtn.title = 'edit';
            editBtn.innerHTML = '<img src="images/editTask.svg" alt="edit">';
            editBtn.addEventListener('click', () => this.startEditTask(task.id));

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn--delete';
            deleteBtn.title = 'delete';
            deleteBtn.innerHTML = '<img src="images/del_task_unbtn.svg" alt="delete task">';
            deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

            li.appendChild(checkbox);
            li.appendChild(nameSpan);
            li.appendChild(time);
            li.appendChild(editBtn);
            li.appendChild(deleteBtn);

            return li;
        }

        makeTasksDraggable() {
            const tasks = this.tasksContainer.querySelectorAll('.task');
            let draggedTask = null;

            tasks.forEach(task => {
                task.addEventListener('dragstart', function() {
                    draggedTask = this;
                    setTimeout(() => this.style.opacity = '0.4', 0);
                });

                task.addEventListener('dragend', function() {
                    setTimeout(() => this.style.opacity = '1', 0);
                    draggedTask = null;
                });

                task.addEventListener('dragover', function(e) {
                    e.preventDefault();
                });

                task.addEventListener('dragenter', function(e) {
                    e.preventDefault();
                    this.style.backgroundColor = '#f0f0f0';
                });

                task.addEventListener('dragleave', function() {
                    this.style.backgroundColor = '';
                });

                task.addEventListener('drop', function(e) {
                    e.preventDefault();
                    this.style.backgroundColor = '';
                    
                    if (draggedTask && draggedTask !== this) {
                        const allTasks = Array.from(this.parentNode.children);
                        const fromIndex = allTasks.indexOf(draggedTask);
                        const toIndex = allTasks.indexOf(this);
                        
                        if (fromIndex < toIndex) {
                            this.parentNode.insertBefore(draggedTask, this.nextSibling);
                        } else {
                            this.parentNode.insertBefore(draggedTask, this);
                        }
                        
                        app.reorderTasks(fromIndex, toIndex);
                    }
                });
            });
        }

        reorderTasks(fromIndex, toIndex) {
            const taskToMove = this.tasks[fromIndex];
            this.tasks.splice(fromIndex, 1);
            this.tasks.splice(toIndex, 0, taskToMove);
            this.saveToLocalStorage();
        }

        updateTaskCount() {
            const taskCountElement = document.getElementById('task-count');
            if (taskCountElement) {
                taskCountElement.textContent = this.tasks.length;
            }
        }

        toggleEmptyMessage() {
            if (this.tasks.length === 0) {
                this.emptyMessage.style.display = 'block';
                this.taskList.style.display = 'none';
            } else {
                this.emptyMessage.style.display = 'none';
                this.taskList.style.display = 'block';
            }
        }

        saveToLocalStorage() {
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
        }
    }

    const app = new TodoApp();
});