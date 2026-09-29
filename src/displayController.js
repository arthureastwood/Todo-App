import { format, parseISO } from 'date-fns';
import { TodoApp } from './appLogic.js';

export class DisplayController{
    constructor(){
        this.projectController = new TodoApp();

        //DOM elements
        this.projectList = document.getElementById('project-list');
        this.newProjectBtn = document.getElementById('new-project-btn');
        this.todoList = document.getElementById('todo-list');
        this.newTodoBtn = document.getElementById('new-todo-btn');
        this.currentProjectTitle = document.getElementById('current-project-title');
        this.newProjectFormContainer = document.getElementById('new-project-form-container')
        this.newProjectForm = document.getElementById('new-project-form-content');
        this.projectTitleInput = document.getElementById('project-title-input');
        this.addProjectBtn = document.getElementById('add-project-btn');
        this.cancelProjectBtn = document.getElementById('cancel-project-btn');
        this.addTodoForm = document.getElementById('add-todo-form');
        this.todoModal = document.getElementById('todo-modal');
        this.addTodoBtn = document.getElementById('add-todo-btn');
        this.closeDialogBtn = document.getElementById('close-dialog');
        this.todoDetailsModal = document.getElementById('todo-details-modal');
        this.closeDetailsModalBtn = document.getElementById('close-details-btn');
        this.detailsTitle = document.getElementById('details-title');
        this.detailsDescription = document.getElementById('details-description');
        this.detailsDueDate = document.getElementById('details-dueDate');
        this.detailsPriority = document.getElementById('details-priority');
        this.detailsNotes = document.getElementById('details-notes');
        this.editTodoBtn = document.getElementById('edit-todo-btn');
        this.deleteTodoBtn = document.getElementById('delete-todo-btn');
        this.todoTitleInput = document.getElementById('todo-title');
        this.todoDescriptionInput = document.getElementById('todo-description');
        this.todoDateInput = document.getElementById('todo-date');
        this.todoPriorityInput = document.getElementById('todo-priority');
        this.todoTextInput = document.getElementById('todo-notes');
        this.activeTodo = null;
    }

    init(){
        this.initEventListeners();
        this.renderProjects();
        this.renderTodos();
    }

    renderProjects(){
        this.projectList.innerHTML = '';
        this.projectController.getProjects().forEach((project,index) => {
            const li = document.createElement('li');
            li.classList.add('project-item');
            if(index === this.projectController.currentProjectIndex){
                li.classList.add('active');
            }

            const label = document.createElement('span');
            label.textContent = project.name;
            li.addEventListener('click', () => {
                this.projectController.setCurrentProject(index);
                this.renderProjects();
                this.renderTodos();
            });

            li.appendChild(label);

            if(project.name !== 'Default'){
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'x';
                deleteBtn.classList.add('delete-project-btn');
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.projectController.deleteProject(project.id);
                    this.renderProjects();
                    this.renderTodos();
                });
                li.appendChild(deleteBtn);
            }
            this.projectList.appendChild(li);
        });
    }

    renderTodos(){
        const currentProject = this.projectController.getCurrentProject();
        this.currentProjectTitle = this.currentProjectTitle;
        if(this.currentProjectTitle){
            this.currentProjectTitle.textContent = currentProject.name;
        }
        this.todoList.innerHTML = '';

        currentProject.getTodos().forEach((todo) => {
            const li = document.createElement('li');
            li.classList.add('todo-item', `priority-${todo.priority.toLowerCase()}`);
            if(todo.checklist){
                li.classList.add('completed');
            }

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.checklist;
            checkbox.addEventListener('change', () => {
                this.projectController.toggleTodoComplete(todo.id);
                this.renderTodos();
            });

            const todoInfo = document.createElement('div');
            todoInfo.classList.add('todo-info');

            const title = document.createElement('span');
            title.classList.add('todo-title');
            title.textContent = todo.title;

            const date = document.createElement('span');
            date.classList.add('todo-date');
            date.textContent = format(parseISO(todo.dueDate), 'MMM dd yyyy');

            todoInfo.appendChild(title);
            todoInfo.appendChild(date);

            const inlineDeleteBtn = document.createElement('button');
            inlineDeleteBtn.innerHTML = '&#128465;';
            inlineDeleteBtn.classList.add('inline-delete-todo-btn');

            inlineDeleteBtn.addEventListener('click', (e)=> {
                e.stopPropagation();
                this.projectController.deleteTodo(todo.id);
                this.renderTodos();
            });

            li.appendChild(checkbox);
            li.appendChild(todoInfo);
            li.appendChild(inlineDeleteBtn);

            li.addEventListener('click', (e) => {
                if(e.target.tagName !== 'INPUT' && !e.target.classList.contains('inline-delete-todo-btn')){
                    this.showTodoDetails(todo);
                }
            });

            this.todoList.appendChild(li);
        });
    }

    initEventListeners(){
        this.newProjectBtn.addEventListener('click', () => {
            this.newProjectForm.classList.remove('hidden');
            this.newProjectFormContainer.showModal();
        });

        this.newTodoBtn.addEventListener('click', () => {
            this.todoModal.classList.remove('hidden');
            this.todoModal.showModal();  
        });

        this.cancelProjectBtn.addEventListener('click', () => {
            this.projectTitleInput.value = '';
            this.newProjectFormContainer.close();
        });

        this.newProjectForm.addEventListener('submit', (e) => {
            e.preventDefault();

        });

        this.addProjectBtn.addEventListener('click', () => {
            const name = this.projectTitleInput.value.trim();
            if(name){
                this.projectController.addProject(name);
                this.projectTitleInput.value = '';
                this.newProjectFormContainer.close();
                this.newProjectForm.classList.add('hidden');
                this.renderProjects();
            }
        });

        this.closeDialogBtn.addEventListener('click', () => {
            this.todoModal.close();
        });

        this.addTodoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(this.addTodoForm);
            const todoData = {
                title: formData.get('todo-title')?.trim(),
                description: formData.get('todo-description')?.trim() || '',
                dueDate: formData.get('todo-date') || '',
                priority: formData.get('todo-priority') || 'Medium',
                notes: formData.get('todo-notes')?.trim() || '',
            };

            if(!todoData.title || !todoData.dueDate){
                return;
            }

            if(this.activeTodo){
                this.projectController.updateTodo(this.activeTodo.id, todoData);
            } else{
                this.projectController.addTodo(todoData);
            }

            this.addTodoForm.reset();
            this.todoModal.close();
            this.todoModal.classList.add('hidden');
            this.activeTodo = null;
            this.renderTodos();
        });

        this.closeDetailsModalBtn.addEventListener('click', () => {
            this.todoDetailsModal.classList.add('hidden');
            this.activeTodo = null;
        });

        this.editTodoBtn.addEventListener('click', () => {
            if(!this.activeTodo){
                return;
            }

            this.todoDetailsModal.classList.add('hidden');
            this.todoModal.classList.remove('hidden');
            this.todoModal.showModal();
            this.todoTitleInput.value = this.activeTodo.title;
            this.todoDescriptionInput.value = this.activeTodo.description;
            this.todoDateInput.value = this.activeTodo.dueDate;
            this.todoPriorityInput.value = this.activeTodo.priority;
            this.todoTextInput.value = this.activeTodo.notes;
            
        });

        this.deleteTodoBtn.addEventListener('click', () => {
            if(!this.activeTodo){
                return;
            }

            this.projectController.deleteTodo(this.activeTodo.id);
            this.todoDetailsModal.classList.add('hidden');
            this.renderTodos();
        });
    }

    showTodoDetails(todo){
        this.activeTodo = todo;
        if(this.detailsTitle){
            this.detailsTitle.textContent = todo.title;
        }
        if(this.detailsDescription){
            this.detailsDescription.textContent = todo.description || 'No description';
        }
        if(this.detailsPriority){
            this.detailsPriority.textContent = todo.priority;
        }
        if(this.detailsNotes){
            this.detailsNotes.textContent = todo.notes || 'No notes';
        }
        

        if(this.detailsDueDate && todo.dueDate){
            try{
                this.detailsDueDate.textContent = format(parseISO(todo.dueDate), 'MMM dd, yyyy');
            } catch (e) {
                this.detailsDueDate.textContent = todo.dueDate;
            }
            
        }

        this.todoDetailsModal.classList.remove('hidden');
    }
}