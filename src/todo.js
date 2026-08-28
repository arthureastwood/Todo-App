export class Todo{
    constructor(title, description, dueDate, priority, notes='', checklist=false){
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
        this.checklist = checklist;
        this.id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    }

    toggleComplete(){
        this.checklist = !this.checklist;
    }

    update(title, description, dueDate, priority, notes, checklist=false){
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
        this.checklist = checklist;
    }
}