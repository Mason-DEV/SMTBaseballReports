import React, { Component } from "react";

import { Router } from "react-router-dom";

import axios from "axios";
import spinner from "../../assests/images/smtSpinner.gif";
import CardsSupport from "./CardsSupport";
import CardsOP from "./CardsOP";

function getRandom(length, max, min) {
	return Array(length)
		.fill()
		.map(() => Math.round(Math.random() * (max - min) + min));
}

class Dashboard extends Component {
	constructor(props) {
		super(props);
		//States
		this.state = {
			collapse: false,
			isLoading: false
		};
	}

	render() {
		//Show OP or Support Cards
		return(
		<div className="animated fadeIn">
			{this.props.whoAmI === 'op' ? <CardsOP {...this.props}></CardsOP> : <CardsSupport {...this.props}></CardsSupport>}
		</div>
		) 
	}
}

export default Dashboard;
