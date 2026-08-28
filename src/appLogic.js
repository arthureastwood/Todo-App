import { Project } from "./project.js";
import { Todo } from "./todo.js";
import { saveProjectsToStorage, loadProjectsFromStorage } from "./storage.js";

export class TodoApp{
    constructor(){
        this.projects = [];
        this.currentProjectIndex = 0;
        this.load();
    }

    load(){
        const storedProjects = loadProjectsFromStorage();
        if(storedProjects.length > 0){
            this.projects = storedProjects;
            this.currentProjectIndex = 0;
            return;
        }

        this.projects = [new Project('Default')];
        this.currentProjectIndex = 0;
        this.save();
    }

    getProjects(){
        return this.projects;
    }

    getCurrentProject(){
        return this.projects[this.currentProjectIndex] || this.projects[0];
    }

    setCurrentProject(index){
        if(index >= 0 && index < this.projects.length){
            this.currentProjectIndex = index;
            this.save();
        }
    }

    addProject(name){
        const projectName = name.trim();
        if(!projectName){
            return null;
        }

        const project = new Project(projectName);
        this.projects.push(project);
        this.currentProjectIndex = this.projects.length - 1;
        this.save();
        return project;
    }

    deleteProject(projectId){
        const projectToDelete = this.projects.find((project) => project.id === projectId);
        if(!projectToDelete || projectToDelete.name === 'Default'){
            return false;
        }

        this.projects = this.projects.filter((project) => project.id !== projectId);
        if(this.currentProjectIndex >= this.projects.length){
            this.currentProjectIndex = this.projects.length -1;
        }
        this.save();
        return true;
    }

    addTodo(todoData){
        const project = this.getCurrentProject();
        const todo = new Todo(
            todoData.title,
            todoData.description,
            todoData.dueDate,
            todoData.priority,
            todoData.notes,
            todoData.checklist || false,
        );

        project.addTodo(todo);
        this.save();
        return todo;
    }

    toggleTodoComplete(todoId){
        const todo = this.findTodo(todoId);
        if(!todo){
            return null;
        }
        todo.toggleComplete();
        this.save();
        return todo;
    }

    deleteTodo(todoId){
        const project = this.getCurrentProject();
        project.removeTodo(todoId);
        this.save();
    }

    updateTodo(todoId, todoData){
        const todo = this.findTodo(todoId);
        if(!todo){
            return null;
        }

        todo.update(
            todoData.title,
            todoData.description,
            todoData.dueDate,
            todoData.priority,
            todoData.notes,
            todoData.checklist,
        );
        this.save();
        return todo;
    }

    findTodo(todoId){
        return this.getCurrentProject().getTodos().find((todo) => todo.id === todoId) || null;
    }

    save(){
        saveProjectsToStorage(this.projects);
    }
}