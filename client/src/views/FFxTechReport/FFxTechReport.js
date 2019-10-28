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
	Row
} from "reactstrap";
import axios from "axios";

import lgLogo from "../../../src/assests/images/SMT_Report_Tag.jpg";
import spinner from "../../assests/images/smtSpinner.gif";
import logger from "../../components/helpers/logger";

class FFxTechReport extends Component {
	constructor(props) {
		super(props);

		//Binding states
		this.onDismissSuccess = this.onDismissSuccess.bind(this);
		this.onDismissError = this.onDismissError.bind(this);
		this.onDismissDuplicate = this.onDismissDuplicate.bind(this);
		//States
		this.state = {
			isLoading: true,
			success: false,
			error: false,
			duplicate: false,
			operators: {},
			venues: {},
			support: {},
			fieldData: {
				ipCamIssues: "",
				fgdIssues: "",
				resolverIssues: "",
				hardwareIssues: "",
				miscNotes: "",
				supportNotes: "",
				bisonSet: "",
				backupTask: "",
				backupNote: ""
			}
		};
	}

	currentDate() {
		var curr = new Date();
		curr.setDate(curr.getDate());
		return curr.toISOString().substr(0, 10);
	}

	cancelReport = () => {
		document.getElementById("ffx-tech-report").reset();
	};

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

	onDismissSuccess() {
		this.setState({ success: false });
	}

	onDismissError() {
		this.setState({ error: false });
	}

	onDismissDuplicate() {
		this.setState({ duplicate: false });
	}

	onSubmitReport(e) {
		//^\d{4}[_][a-zA-Z]{6}[_][a-zA-Z]{6}[_]\d{1}    REGEX for gamestrings, if want to implement this
		e.preventDefault();
		this.setState({ isLoading: true });
		//Build new report
		const report = {
			venue: this.state.fieldData.venue,
			operator: this.state.fieldData.operator,
			support: this.state.fieldData.support,
			date: this.state.fieldData.date,
			logIn: this.state.fieldData.logIn,
			logOut: this.state.fieldData.logOut,
			firstPitch: this.state.fieldData.firstPitch,
			gameID: this.state.fieldData.gameID,
			ipCamIssues: this.state.fieldData.ipCamIssues,
			fgdIssues: this.state.fieldData.fgdIssues,
			resolverIssues: this.state.fieldData.resolverIssues,
			hardwareIssues: this.state.fieldData.hardwareIssues,
			miscNotes: this.state.fieldData.miscNotes,
			supportNotes: this.state.fieldData.supportNotes,
			bisonSet: this.state.fieldData.bisonSet,
			backupTask: this.state.fieldData.backupTask,
			backupNote: this.state.fieldData.backupNote
		};

		axios
			.post("/api/ffxTech/create", report)
			.then(adding => {
				this.setState({ isLoading: false, fieldData: {}, success: true });
			})
			.catch(error => {
				if (error.response.status === 403) {
					logger("error", "FFxTech Add === " + error);
					this.setState({ isLoading: false, duplicate: true });
				} else {
					this.setState({ isLoading: false, error: true });
					logger("error", "FFxTech Add === " + error);
				}
			});
	}

	componentDidMount() {
		Promise.all([axios.get("/api/staff/operators"), axios.get("/api/venue/fieldFx"), axios.get("/api/staff/support")])
			.then(([opResponse, venueResponse, supportResponse]) => {
				const ops = opResponse.data.map(obj => ({ name: obj.name }));
				const venues = venueResponse.data.map(obj => ({ name: obj.name }));
				const support = supportResponse.data.map(obj => ({ name: obj.name }));
				this.setState({ operators: ops, venues, support });
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
					<Alert color="danger" isOpen={this.state.duplicate} toggle={this.onDismissDuplicate}>
						<strong>A game report for this gamestring  {this.state.fieldData.gameID} already exist, please check your gamestring and alert support if this issue continues.</strong>
					</Alert>

					<div className="animated fadeIn">
						<br />
						<Card className="card-accent-success">
							<Form id="ffx-tech-report" onSubmit={e => this.onSubmitReport(e)}>
								<CardHeader>
									<strong>FIELDf/x Tech Report</strong>
								</CardHeader>
								<CardBody>
									<Row>
										<Col>
											<FormGroup>
												<Label htmlFor="venue">Venue</Label>
												<Input onChange={e => this.change(e)} type="select" name="venue" id="venue" required>
													<option key="-1"></option>
													{this.state.venues.map((venue, idx) => {
														return <option key={idx}>{venue.name}</option>;
													})}
												</Input>
											</FormGroup>
											<FormGroup>
												<Label htmlFor="operator">Operator</Label>
												<Input onChange={e => this.change(e)} type="select" name="operator" id="operator" required>
													<option key="-1"></option>
													{this.state.operators.map((op, idx) => {
														return <option key={idx}>{op.name}</option>;
													})}
												</Input>
											</FormGroup>
											<FormGroup>
												<Label htmlFor="support">Support</Label>
												<Input onChange={e => this.change(e)} type="select" name="support" id="support" required>
													<option key="-1"></option>
													{this.state.support.map((support, idx) => {
														return <option key={idx}>{support.name}</option>;
													})}
												</Input>
											</FormGroup>
											<FormGroup>
												<Label htmlFor="gameID">Game ID</Label>
												<Input
													onChange={e => this.change(e)}
													type="text"
													className="form-control-warning"
													id="gameID"
													name="gameID"
													placeholder="2020_01_01_smtafa_smtafa_1"
													required
												/>
											</FormGroup>
										</Col>
										<Col>
											<FormGroup>
												<Label htmlFor="date">Date</Label>
												<Input onChange={e => this.change(e)} id="date" type="date" name="date" required></Input>
											</FormGroup>
											<FormGroup>
												<Label htmlFor="logIn">
													Log In <Badge>Eastern Time</Badge>
												</Label>
												<Input onChange={e => this.change(e)} id="logIn" type="time" name="logIn" required></Input>
											</FormGroup>
											<FormGroup>
												<Label htmlFor="firstPitch">
													First Pitch <Badge>Eastern Time</Badge>
												</Label>
												<Input
													onChange={e => this.change(e)}
													id="firstPitch"
													type="time"
													name="firstPitch"
													required
												></Input>
											</FormGroup>
											<FormGroup>
												<Label htmlFor="logOut">
													Log Out <Badge>Eastern Time</Badge>
												</Label>
												<Input onChange={e => this.change(e)} id="logOut" type="time" name="logOut" required></Input>
											</FormGroup>
										</Col>
									</Row>
									<Row>
										<Col>
											<FormGroup>
												<Label htmlFor="ipCamIssues">IPCamRelay Issues?</Label>
												<Input
													onChange={e => this.change(e)}
													type="textarea"
													name="ipCamIssues"
													id="ipCamIssues"
												></Input>
											</FormGroup>
											<FormGroup>
												<Label htmlFor="fgdIssues">Foreground Detector Issues?</Label>
												<Input onChange={e => this.change(e)} type="textarea" name="fgdIssues" id="fgdIssues"></Input>
											</FormGroup>
											<FormGroup>
												<Label htmlFor="resolverIssues">Resolver Issues?</Label>
												<Input
													onChange={e => this.change(e)}
													type="textarea"
													name="resolverIssues"
													id="resolverIssues"
												></Input>
											</FormGroup>
											<FormGroup>
												<Label htmlFor="hardwareIssues">Hardware Issues?</Label>
												<Input
													onChange={e => this.change(e)}
													type="textarea"
													name="hardwareIssues"
													id="hardwareIssues"
												></Input>
											</FormGroup>
											<FormGroup>
												<Label htmlFor="miscNotes">Misc Notes</Label>
												<Input onChange={e => this.change(e)} type="textarea" name="miscNotes" id="miscNotes"></Input>
											</FormGroup>
										</Col>
										<Col>
											<Label>
												{this.props.permission === "support" ? (
													<h5 style={{ color: "red" }}>Support Section</h5>
												) : (
													<h5 style={{ color: "red" }}>Support Section - Not accessible via OP login</h5>
												)}
											</Label>
											<FormGroup>
												<Label htmlFor="supportNotes">Support Notes</Label>
												{this.props.permission === "support" ? (
													<Input
														type="textarea"
														onChange={e => this.change(e)}
														name="supportNotes"
														id="supportNotes"
													></Input>
												) : (
													<Input disabled type="textarea" name="supportNotes" id="supportNotes"></Input>
												)}
											</FormGroup>
											<FormGroup>
												<Label htmlFor="bisonSet">
													Bison Set <Badge>R Drive </Badge>
												</Label>
												{this.props.permission === "support" ? (
													<Input
														onChange={e => this.change(e)}
														type="text"
														name="bisonSet"
														id="bisonSet"
														placeholder="Bison_A"
													/>
												) : (
													<Input disabled type="text" name="bisonSet" id="bisonSet" placeholder="Bison_A" />
												)}
											</FormGroup>
											<FormGroup>
												<Label htmlFor="backupTask">Backup Task Initiated</Label>
												{this.props.permission === "support" ? (
													<Input onChange={e => this.change(e)} type="select" name="backupTask" id="backupTask">
														<option key="-1"></option>
														<option>Default</option>
														<option>Copy Full Video Only</option>
														<option>Copy Data only no Video Copy</option>
														<option>No Backup</option>
													</Input>
												) : (
													<Input disabled type="select" name="backupTask" id="backupTask">
														<option>Default</option>
														<option>Copy Full Video Only</option>
														<option>Copy Data only no Video Copy</option>
														<option>No Backup</option>
													</Input>
												)}
											</FormGroup>
											<FormGroup>
												<Label htmlFor="backupNotes">Backup Notes </Label>
												{this.props.permission === "support" ? (
													<Input
														onChange={e => this.change(e)}
														type="text"
														name="backupNotes"
														id="bisonbackupNotesSet"
													/>
												) : (
													<Input disabled type="text" name="backupNotes" id="bisonbackupNotesSet" />
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
										<Button type="reset" size="sm" onClick={this.cancelReport} color="danger">
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
export default FFxTechReport;
