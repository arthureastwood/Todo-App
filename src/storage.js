import { Project } from "./project.js";
import { Todo } from "./todo.js";

export function saveProjectsToStorage(projects){
    localStorage.setItem('todo-projects', JSON.stringify(projects));
}

export function loadProjectsFromStorage(){
    const storedProjects = localStorage.getItem('todo-projects');
    if(!storedProjects){
        return [];
    }

    try {
        const parsed = JSON.parse(storedProjects);
        return parsed.map((projectData) => {
            const project = new Project(projectData.name);
            project.id = projectData.id;
            project.todos = (projectData.todos || []).map((todoData) => {
                const todo = new Todo(
                    todoData.title,
                    todoData.description,
                    todoData.dueDate,
                    todoData.priority,
                    todoData.notes,
                    todoData.checklist || false,
                );
                todo.id = todoData.id;
                return todo;
            });
            return project;
        });
    } catch (error){
        console.error('Unable to load projects from storage', error);
        return [];
    }
}