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
    }

    const app = new TodoApp();
});