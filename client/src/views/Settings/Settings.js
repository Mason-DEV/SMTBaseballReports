import React, { Component } from "react";
import TodoStore from '../../stores/TodoStore'



class Settings extends Component {
	constructor(props) {
        super(props);
        this.state = {
            todos: TodoStore.getAll(),
        }

    }
    
    componentDidMount(){
        console.log("this.store setttings", this.state)
    }

    render() {
        return (<div>settings</div>)
    
    }
}


export default Settings;