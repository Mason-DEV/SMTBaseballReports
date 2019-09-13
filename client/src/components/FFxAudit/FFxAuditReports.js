import React, { Component } from "react";
import AppNavBar from "../AppNavbar";
//import ShoppingList from './components/ShoppingList';
//import ItemModal from './components/ItemModal';
import { Container } from "reactstrap";

import { Provider } from "react-redux";
import store from "../../store";


//import "../../assests/css/bootstrap.min.css";
import "../../App.css";

export default class FFxAuditReport extends Component {
	render() {
		return (
			<React.Fragment>
				<AppNavBar></AppNavBar>
				<div>Audit Page</div>
			</React.Fragment>
		);
	}
}
