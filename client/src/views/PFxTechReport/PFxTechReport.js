import React, { Component } from "react";
import {
	Alert,
	Badge,
	Button,
	Card,
	CardBody,
	CardHeader,
	CardFooter,
	Col,
	Label,
	Input,
	Form,
	FormGroup,
	FormFeedback,
	Modal,
	ModalHeader,
	Row
} from "reactstrap";
import lgLogo from "../../../src/assests/images/SMT_Report_Tag.jpg";
import Table from "../PFxTechReport/Table";
import axios from "axios";
import spinner from "../../assests/images/smtSpinner.gif";
import logger from "../../components/helpers/logger";

class PFxTechReport extends Component {
	constructor(props) {
		super(props);

		//Binding states
		this.toggle = this.toggle.bind(this);
		this.onDismissSuccess = this.onDismissSuccess.bind(this);
		this.onDismissError = this.onDismissError.bind(this);

		//States
		this.state = {
			isLoading: true,
			success: false,
			error: false,
			dropdownOpen: false,
			operators: {},
			venues: {},
			fieldData: {
				hwswIssues: "",
				t1Notes: "",
				correctionData: ""
			}
		};
	}

	callbackFunction = childData => {
		this.setState({ fieldData: { ...this.state.fieldData, correctionData: childData } });
	};

	currentDate() {
		var curr = new Date();
		curr.setDate(curr.getDate());
		return curr.toISOString().substr(0, 10);
	}

	toggle() {
		this.setState({
			dropdownOpen: !this.state.dropdownOpen
		});
	}
	onDismissSuccess() {
		this.setState({ success: false });
	}

	onDismissError() {
		this.setState({ error: false });
	}

	change(e) {
		if (e.target.name === "date") {
			this.setState({
				fieldData: { ...this.state.fieldData, [e.target.name]: new Date(e.target.value).toISOString() }
			});
		} else {
			this.setState({
				fieldData: { ...this.state.fieldData, [e.target.name]: e.target.value }
			});
		}
	}

	onSubmitReport(e) {
		e.preventDefault();
		this.setState({ isLoading: true });
		//Build new report
		const report = {
			venue: this.state.fieldData.venue,
			operator: this.state.fieldData.operator,
			date: this.state.fieldData.date,
			logIn: this.state.fieldData.logIn,
			logOut: this.state.fieldData.logOut,
			firstPitch: this.state.fieldData.firstPitch,
			hwswIssues: this.state.fieldData.hwswIssues,
			t1Notes: this.state.fieldData.t1Notes,
			corrections: this.state.fieldData.correctionData
		};

		axios
			.post("/api/pfxTech/create", report)
			.then(adding => {
				this.setState({ isLoading: false, fieldData: {}, success: true });
			})
			.catch(error => {
				this.setState({ isLoading: false, fieldData: {}, error: true });
				logger("error", "PFxTech Add === " + error);
			});
	}
	cancelReport = () => {
		document.getElementById("pfx-tech-report").reset();
	};

	componentDidMount() {
		Promise.all([axios.get("/api/staff/operators"), axios.get("/api/venue/pitchFx")])
			.then(([opResponse, venueResponse]) => {
				const ops = opResponse.data.map(obj => ({ name: obj.name }));
				const venues = venueResponse.data.map(obj => ({ name: obj.name }));
				this.setState({ operators: ops, venues });
			})
			.then(isLoading => this.setState({ isLoading: false }));
	}

	render() {
		if (this.state.isLoading) {
			return <img src={spinner} height="150" width="150" alt="spinner" align="center" style={{ height: "100%" }} />;
		} else {
			return (
				<React.Fragment>
					<Alert color="success" isOpen={this.state.success} toggle={this.onDismissSuccess}>
						<strong>Report upload success!</strong>
					</Alert>
					<Alert color="danger" isOpen={this.state.error} toggle={this.onDismissError}>
						<strong>Error on report upload!</strong>
					</Alert>
					<div className="animated fadeIn">
						<br />
						<Card className="card-accent-success">
							<Form id="pfx-tech-report" onSubmit={e => this.onSubmitReport(e)}>
								<CardHeader>
									<strong>Pitchf/x Tech Report</strong>
								</CardHeader>
								<CardBody>
									<Row>
										<Col>
											<FormGroup>
												<Label htmlFor="venue">Venue</Label>
												<Input type="select" name="venue" id="venue" onChange={e => this.change(e)} required>
													<option key="-1"></option>
													{this.state.venues.map((venue, idx) => {
														return <option key={idx}>{venue.name}</option>;
													})}
												</Input>
											</FormGroup>
											<FormGroup>
												<Label htmlFor="operator">Operator</Label>
												<Input type="select" name="operator" id="operator" onChange={e => this.change(e)} required>
													<option key="-1"></option>
													{this.state.operators.map((op, idx) => {
														return <option key={idx}>{op.name}</option>;
													})}
												</Input>
											</FormGroup>
											<FormGroup>
												<Label htmlFor="date">Date</Label>
												<Input
													id="date"
													type="date"
													name="date"
													onChange={e => this.change(e)}
													required /*defaultValue={this.currentDate()}*/
												></Input>
											</FormGroup>
											<FormGroup>
												<Label htmlFor="login-time">
													Log In <Badge>Eastern Time</Badge>
												</Label>
												<Input id="login-time" type="time" name="logIn" onChange={e => this.change(e)} required></Input>
											</FormGroup>
											<FormGroup>
												<Label htmlFor="first-pitch">
													First Pitch <Badge>Eastern Time</Badge>
												</Label>
												<Input
													id="first-pitch"
													type="time"
													name="firstPitch"
													onChange={e => this.change(e)}
													required
												></Input>
											</FormGroup>
											<FormGroup>
												<Label htmlFor="logout-time">
													Log Out <Badge>Eastern Time</Badge>
												</Label>
												<Input
													id="logout-time"
													type="time"
													name="logOut"
													onChange={e => this.change(e)}
													required
												></Input>
											</FormGroup>
											<FormGroup>
												<Label htmlFor="hwswIssues">Hardware/Software Issues</Label>
												<Input id="hwswIssues" type="textarea" onChange={e => this.change(e)} name="hwswIssues"></Input>
											</FormGroup>
										</Col>
										<Col>
											<Label>
												<h5 style={{ color: "green" }}>Corrections/Changes Section</h5>
											</Label>
											<Table parentCallback={this.callbackFunction} />
											<Label>
												{this.props.permission === "support" ? (
													<h5 style={{ color: "red" }}>Support Section</h5>
												) : (
													<h5 style={{ color: "red" }}>Support Section - Not accessible via OP login</h5>
												)}
											</Label>
											<FormGroup>
												<Label htmlFor="t1Notes">T1 Notes</Label>
												{this.props.permission === "support" ? (
													<Input type="textarea" onChange={e => this.change(e)} name="t1Notes" id="t1Notes"></Input>
												) : (
													<Input disabled type="textarea" name="t1Notes" id="t1Notes"></Input>
												)}
											</FormGroup>
											<img src={lgLogo} alt="SMT Logo"></img>
										</Col>
									</Row>

									<Row>
										<Col></Col>
										<Col></Col>
									</Row>
								</CardBody>
								<CardFooter>
									<FormGroup className="form-actions text-center">
										<Button type="submit" size="sm" color="success">
											<i className="fa fa-check"></i> Submit
										</Button>{" "}
										<Button type="reset" onClick={this.cancelReport} size="sm" color="danger">
											<i className="fa fa-ban"></i> Clear
										</Button>
									</FormGroup>
								</CardFooter>
							</Form>
						</Card>
					</div>
				</React.Fragment>
			);
		}
	}
}
export default PFxTechReport;
