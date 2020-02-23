import React, { Component } from "react";
import PropTypes from "prop-types";
import {
	Button,
	Card,
	CardText,
	CardTitle,
	Collapse,
	CardBody,
	CardHeader,
	Col,
	Row,
} from "reactstrap";
import axios from 'axios';
import logger from "../../components/helpers/logger";
//Assests
import spinner from "../../assests/images/smtSpinner.gif";
import {getJwt} from "../../components/helpers/jwt";
import APIHelper from "../../components/helpers/APIHelper";


const propTypes = {
	children: PropTypes.node
};

class CardsOP extends Component {
	constructor(props) {
		super(props);

		//Binding states
		this.toggleAnnouc = this.toggleAnnouc.bind(this);

		//States
		this.state = {
			collapse: true,
			isLoading: true
		};
	}

	toggleAnnouc() {
		this.setState({ collapse: !this.state.collapse });
	}

	ffxAuditClick() {
		this.props.history.push("/ffxauditreport");
	}
	ffxTechClick() {
		this.props.history.push("/ffxtechreport");
	}
	pfxTechClick() {
		this.props.history.push("/pfxtechreport");
	}

	componentDidMount() {
		Promise.all([axios.get(APIHelper.getSettingsOPAnnounceAPI,  { headers: { Authorization: `Bearer ${getJwt()}` } })])
			.then(([opResponse]) => {
				const opAnnounce = opResponse.data;
				this.setState({ opAnnounce });
			})
			.then(isLoading =>
				this.setState({
					isLoading: false
				})
			)
			.catch(function(error) {
				console.log(error);
				logger("error", error);
			});
	}

	pfxTechCard() {
			if(this.props.permission.pfxTechPermission){
				return (
					<Col>
						<Card>
							<CardHeader tag="h5">PFx Tech Report</CardHeader>
							<CardBody>
								<CardTitle>Report Page for Pitch F/x </CardTitle>
								<CardText></CardText>
								<Button color="success" onClick={e => this.pfxTechClick()}>
									Go To Report
								</Button>
							</CardBody>
						</Card>
					</Col>
					)
			}else{
				return
			}
	}

	ffxTechCard() {
			if(this.props.permission.ffxTechPermission){
				return (
					<Col>
						<Card>
							<CardHeader tag="h5">FFx Tech Report</CardHeader>
							<CardBody>
								<CardTitle>Report Page for Field F/x </CardTitle>
								<CardText></CardText>
								<Button color="success" onClick={e => this.ffxTechClick()}>
									Go To Report
								</Button>
							</CardBody>
						</Card>
					</Col>
					)
			}else{
				return
			}
	}

	ffxAuditCard() {
			if(this.props.permission.ffxAuditPermission){
				return (
					<Col>
						<Card>
							<CardHeader tag="h5">FFx Audit Report</CardHeader>
							<CardBody>
								<CardTitle>Audit Report Page for Field F/x </CardTitle>
								<CardText></CardText>
								<Button color="success" onClick={e => this.ffxAuditClick()}>
									Go To Report
								</Button>
							</CardBody>
						</Card>
					</Col>
					)
			}else{
				return
			}
	}	

	render() {
		if (this.state.isLoading) {
			return <img src={spinner} height="150" width="150" alt="spinner" align="center" style={{ height: "100%" }} />;
		} else {
			const ffxTechCard = this.ffxTechCard();
			const pfxTechCard = this.pfxTechCard();
			const ffxAuditCard = this.ffxAuditCard();
			return (
				<React.Fragment>
					<Row>
						<Col>
							<Card className="text-dark" style={{display: this.state.opAnnounce.details.hidden ? "none": "show" }}>
								<CardHeader>
									<i className="fa fa-bullhorn"></i>
									<strong>Announcement</strong>
									<div className="card-header-actions">
										{/*eslint-disable-next-line*/}
										<a
											style={{ cursor: "pointer" }}
											className="card-header-action btn btn-minimize"
											data-target="#collapseExample"
											onClick={this.toggleAnnouc}
										>
											<i className="icon-arrow-down"></i>
										</a>
									</div>
								</CardHeader>
								<Collapse isOpen={this.state.collapse} id="collapseExample">
									<CardBody>{this.state.opAnnounce.details.AnnouncementText}</CardBody>
								</Collapse>
							</Card>
						</Col>
					</Row>
					<Row>
						{pfxTechCard}
						{ffxTechCard}
						
						
					</Row>
				</React.Fragment>
			);
		}
	}
}

CardsOP.propTypes = propTypes;

export default CardsOP;
