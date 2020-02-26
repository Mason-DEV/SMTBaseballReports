import React, { Component } from "react";

class Logout extends Component {
	constructor(props) {
		super(props);
		this.state = {};
    }
    
	componentDidMount() {
		localStorage.removeItem("smt-jwt");
        this.props.history.push("/login");
	}

	render() {
		return (
			<div className="app flex-row align-items-center">
			</div>
		);
	}
}

export default Logout;
