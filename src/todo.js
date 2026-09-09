export class Todo{
    constructor(title, description, dueDate, priority, notes='', checklist=false){
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
        this.checklist = checklist;
        this.id = crypto.randomUUID();
        this.todos = [];
    }

    addTodo(todo){
        this.todos.push(todo);
    }

    getTodos(){
        return this.todos;
    }

    toggleComplete(todos, id){
        const todo = todos.find(
            todo => todo.id === id
        );
        if(!todo){
            return todos;
        } else{
            this.checklist = !this.checklist;
            return todos;
        }
    }

    deleteTodo(todos, id){
        return todos.filter(todo => todo.id !== id);
    }

    updateTodo(todos, id, newTitle, newDescription, newDueDate, newPriority, newNotes, newChecklist=false){
        const todo = todos.find(todo => todo.id === id);
        if(!todo){
            return todos;
        }

        todo.title = newTitle;
        todo.description = newDescription;
        todo.dueDate = newDueDate;
        todo.priority = newPriority;
        todo.notes = newNotes;
        todo.checklist = newChecklist;

        return todos;
    }

    openTodo(todos, id){
        return todos.find(todo => todo.id === id);
    }
}