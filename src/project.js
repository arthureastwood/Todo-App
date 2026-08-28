export class Project{
    constructor(name){
        this.name = name;
        this.todos = [];
        this.id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    }

    addTodo(todo){
        this.todos.push(todo);
    }

    removeTodo(todoId){
        this.todos = this.todos.filter(todo => todo.id !== todoId);
    }

    getTodos(){
        return this.todos;
    }
}