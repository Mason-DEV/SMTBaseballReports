//Layout for the OPS
import React, { Component } from "react";
import PropTypes from "prop-types";import {
	Button,
	ButtonDropdown,
	ButtonGroup,
    Card,
    CardText,
    CardTitle,
    CardFooter,
	Collapse,
	CardBody,
	CardHeader,
	Col,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	Row,
	Table
} from "reactstrap";

//Assests
import spinner from "../../assests/images/smtSpinner.gif";

const propTypes = {
	children: PropTypes.node
};

// const defaultProps = {};

class CardsOP extends Component {
	constructor(props) {
        super(props);
        console.log(this.props);
        

		//Binding states
		this.toggleAnnouc = this.toggleAnnouc.bind(this);

		//States
		this.state = {
			collapse: true,
			isLoading: false
		};
	}

	toggleAnnouc() {
		this.setState({ collapse: !this.state.collapse });
    }
    
    ffxAuditClick(){
        this.props.history.push("/ffxauditreport");
    }
    ffxTechClick(){
        this.props.history.push("/ffxtechreport");
    }
    pfxTechClick(){
        this.props.history.push("/pfxtechreport");
    }

	render() {
		// eslint-disable-next-line
        // const { children, ...attributes } = this.props;

		if (this.state.isLoading) {
			return (
				<img
					src={spinner}
					height="150"
					width="150"
					alt="spinner"
					align="center"
					style={{ height: "100%" }}
				/>);
		} else {
			return (
				<React.Fragment>
					<Row>
						<Col>
							<Card className="text-dark" >
								<CardHeader>
									<i className="fa fa-bullhorn"></i>
									<strong>Things To Know</strong>
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
									<CardBody>12345</CardBody>
								</Collapse>
							</Card>
						</Col>
					</Row>
					<Row>
						<Col>
							<Card>
								<CardHeader tag="h5">PFx Tech Report</CardHeader>
								<CardBody>
									<CardTitle>Report Page for Pitch F/x </CardTitle>
									<CardText></CardText>
									<Button color="success" onClick={e => this.pfxTechClick()}>Go To Report</Button>
								</CardBody>
							</Card>
						</Col>
						<Col>
							<Card>
								<CardHeader tag="h5">FFx Tech Report</CardHeader>
								<CardBody>
									<CardTitle>Report Page for Field F/x </CardTitle>
									<CardText></CardText>
									<Button color="success" onClick={e => this.ffxTechClick()}>Go To Report</Button>
								</CardBody>
							</Card>
						</Col>
						<Col>
							<Card>
								<CardHeader tag="h5">FFx Audit Report</CardHeader>
								<CardBody>
									<CardTitle>Audit Report Page for Field F/x </CardTitle>
									<CardText></CardText>
									<Button color="success" onClick={e => this.ffxAuditClick()}>Go To Report</Button>
								</CardBody>
							</Card>
						</Col>
					</Row>
				</React.Fragment>
			);
		}
	}
}

CardsOP.propTypes = propTypes;
// CardsOP.defaultProps = defaultProps;

export default CardsOP;
