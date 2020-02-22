import React, { Component } from "react";
import CardsSupport from "./CardsSupport";
import CardsOP from "./CardsOP";

class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			collapse: false,
			isLoading: false
		};
	}

	renderFilter(){
		if(this.props.permission.pfxTechDataPermission === true ||	this.props.permission.ffxTechDataPermission === true ||	this.props.permission.ffxAuditDataPermission === true){
			return <CardsSupport {...this.props}></CardsSupport>
		} else{
			return <CardsOP {...this.props}></CardsOP>
		}
	}

	render() {
		const renderCards = this.renderFilter();
			return(
				<div className="animated fadeIn">
				{renderCards}
		</div>
		) 
	}
}

export default Dashboard;
