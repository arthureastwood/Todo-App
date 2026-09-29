export class Todo{
    constructor(title, description, dueDate, priority, notes='', checklist=false){
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
        this.checklist = checklist;
        this.id = crypto.randomUUID();
    }

    addTodo(todo){
        this.todos.push(todo);
    }

    toggleComplete(){
        this.checklist = !this.checklist;
    }

    deleteTodo(todos, id){
        return todos.filter(todo => todo.id !== id);
    }

    updateTodo(title, description, dueDate, priority, notes, checklist){
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
        this.checklist = checklist ?? this.checklist;
    }

    openTodo(todos, id){
        return todos.find(todo => todo.id === id);
    }
}