import {EventEmitter } from 'events';


class TodoStore extends EventEmitter {
    constructor(){
        super()
        this.todos = [
            {
                id: 12232,
                text: "Go Shopping",
                complete: false
            },
            {
                id: 242545,
                text: "Play Bills",
                complete: false
            },

        ]
    }

    getAll(){
        return this.todos;
    }

}


const todoStore = new TodoStore;

export default todoStore;

