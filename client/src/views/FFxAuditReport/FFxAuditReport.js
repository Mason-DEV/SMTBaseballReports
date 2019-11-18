import React, { Component } from "react";
import {
	Alert,
	Badge,
	Button,
	Card,
	CardBody,
	CardHeader,
	CardFooter,
	CustomInput,
	Col,
	Label,
	Input,
	Form,
	FormGroup,
	FormFeedback,
	Row
} from "reactstrap";
import lgLogo from "../../../src/assests/images/SMT_Report_Tag.jpg";
import spinner from "../../assests/images/smtSpinner.gif";
import logger from "../../components/helpers/logger";
import axios from "axios";

class FFxAuditReport extends Component {
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
			auditor: {},
			fieldData: {
				commentsBall: "None",
				commentsMisc: "None",
				commentsPlayer: "None",
				missedBIPVidGaps: "0",
				missedPitchesVidGaps: "0",
				numBIPasPC: "0",
				numFBasPC: "0",
				numPicksAdded: "0",
				numPitchesAdded: "0",
				vidGaps: "None",
				timeAccuracy: "0",
				timeCompletion: "0",
				timeResolving: "0",
				ffxPitches: "",
				gdPitches: ""
			}
		};
	}

	currentDate() {
		var curr = new Date();
		curr.setDate(curr.getDate());
		return curr.toISOString().substr(0, 10);
	}

	change(e) {
		if(e.target.name === "stepResolving" ||e.target.name === "stepAccuracy"|| e.target.name === "stepCompletion"  ){
			this.setState({
				fieldData: { ...this.state.fieldData, [e.target.name]: e.target.checked }
			});
		}
		else if (e.target.name === "date") {
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

	cancelReport = () => {
		document.getElementById("ffx-audit-report").reset();
	};

	onSubmitReport(e) {
		//^\d{4}[_][a-zA-Z]{6}[_][a-zA-Z]{6}[_]\d{1}    REGEX for gamestrings, if want to implement this
		e.preventDefault();
		this.setState({ isLoading: true });
		//Build new report

		const report = {
			gamestring: this.state.fieldData.gamestring,
			commentsBall: this.state.fieldData.commentsBall,
			commentsMisc: this.state.fieldData.commentsMisc,
			commentsPlayer: this.state.fieldData.commentsPlayer,
			logIn: this.state.fieldData.logIn,
			logOut: this.state.fieldData.logOut,
			missedBIPVidGaps: this.state.fieldData.missedBIPVidGaps,
			missedPitchesVidGaps: this.state.fieldData.missedPitchesVidGaps,
			numBIPasPC: this.state.fieldData.numBIPasPC,
			numFBasPC: this.state.fieldData.numFBasPC,
			numPicksAdded: this.state.fieldData.numPicksAdded,
			numPitchesAdded: this.state.fieldData.numPitchesAdded,
			operator: this.state.fieldData.operator,
			auditor: this.state.fieldData.auditor,
			readyShare: this.state.fieldData.readyShare,
			stepAccuracy: this.state.fieldData.stepAccuracy  ? true : false,
			stepCompletion: this.state.fieldData.stepCompletion  ? true : false,
			stepResolving: this.state.fieldData.stepResolving ? true : false,
			timeAccuracy: this.state.fieldData.timeAccuracy,
			timeCompletion: this.state.fieldData.timeCompletion,
			timeResolving: this.state.fieldData.timeResolving,
			ffxPitches: this.state.fieldData.ffxPitches,
			gdPitches: this.state.fieldData.gdPitches,
			vidGaps: this.state.fieldData.vidGaps,
		};

		axios
			.post("/api/FFxAudit/create", report)
			.then(adding => {
				this.setState({ isLoading: false, fieldData: {}, success: true });
			})
			.catch(error => {
				if (error.response.status === 403) {
					logger("error", "FFxAudit Add === " + error);
					this.setState({ isLoading: false, duplicate: true });
				} else {
					this.setState({ isLoading: false, error: true });
					logger("error", "FFxAudit Add === " + error);
				}
			});
	}

	componentDidMount() {
		Promise.all([
			axios.get("/api/staff/ffxOperators"),
			axios.get("/api/venue/fieldFx"),
			axios.get("/api/staff/support"),
			axios.get("/api/staff/auditors")
		])
			.then(([opResponse, venueResponse, supportResponse, auditorResponse]) => {
				const ops = opResponse.data.map(obj => ({ name: obj.name, email: obj.email }));
				const venues = venueResponse.data.map(obj => ({ name: obj.name }));
				const support = supportResponse.data.map(obj => ({ name: obj.name }));
				const auditor = auditorResponse.data.map(obj => ({ name: obj.name }));
				this.setState({ operators: ops, venues, support, auditor });
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
						<strong>
							A game report for this gamestring {this.state.fieldData.gameID} already exist, please check your
							gamestring and alert support if this issue continues.
						</strong>
					</Alert>

					<div className="animated fadeIn">
						<br />
						<Card className="card-accent-success">
							<Form id="ffx-audit-report" onSubmit={e => this.onSubmitReport(e)}>
								<CardHeader>
									<strong>FIELDf/x Audit Report</strong>
								</CardHeader>
								<CardBody>
									<Row>
										<Col>
											<FormGroup>
												<Label htmlFor="gameID">Game ID</Label>
												<Input
													onChange={e => this.change(e)}
													type="text"
													className="form-control-warning"
													id="gameID"
													name="gamestring"
													placeholder="2019_01_01_smtafa_smtafa_1"
													required
												/>
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
												<Label htmlFor="auditor">Auditor</Label>
												<Input onChange={e => this.change(e)} type="select" name="auditor" id="operator" required>
													<option key="-1"></option>
													{this.state.auditor.map((auditor, idx) => {
														return <option key={idx}>{auditor.name}</option>;
													})}
												</Input>
											</FormGroup>
											<FormGroup>
												<Label htmlFor="numPitchesAdded">Number of Pitches Added</Label>
												<Input
													onChange={e => this.change(e)}
													type="number"
													min="0"
													name="numPitchesAdded"
													id="numPitchesAdded"
												></Input>
											</FormGroup>
											<FormGroup>
												<Label htmlFor="numBIPasPC">Number of Balls in Play marked as P/C</Label>
												<Input
													onChange={e => this.change(e)}
													type="number"
													min="0"
													name="numBIPasPC"
													id="numBIPasPC"
												></Input>
											</FormGroup>
											<FormGroup>
												<Label htmlFor="numFBasPC">Number of Foul Balls marked as P/C</Label>
												<Input
													onChange={e => this.change(e)}
													type="number"
													min="0"
													name="numFBasPC"
													id="numFBasPC"
												></Input>
											</FormGroup>
											<FormGroup>
												<Label htmlFor="numPicksAdded">Number of Pickoffs Added</Label>
												<Input
													onChange={e => this.change(e)}
													type="number"
													min="0"
													name="numPicksAdded"
													id="numPicksAdded"
												></Input>
											</FormGroup>
											<FormGroup>
												<Label htmlFor="vidGaps">Video Gaps</Label>
												<Input onChange={e => this.change(e)} type="text" name="vidGaps" id="vidGaps"></Input>
											</FormGroup>
											<FormGroup>
												<Label htmlFor="missedPitchesVidGaps">Number of Missed Pitches due to Video Gaps</Label>
												<Input
													onChange={e => this.change(e)}
													type="number"
													min="0"
													name="missedPitchesVidGaps"
													id="missedPitchesVidGaps"
												></Input>
											</FormGroup>
											<FormGroup>
												<Label htmlFor="missedBIPVidGaps">Number of Missed BIP due to Video Gaps</Label>
												<Input
													onChange={e => this.change(e)}
													type="number"
													min="0"
													name="missedBIPVidGaps"
													id="missedBIPVidGaps"
												></Input>
											</FormGroup>
											<FormGroup>
												<Label htmlFor="commentsPlayer">Comments on Player Pathing</Label>
												<Input
													onChange={e => this.change(e)}
													type="textarea"
													name="commentsPlayer"
													id="commentsPlayer"
												></Input>
											</FormGroup>
											<FormGroup>
												<Label htmlFor="commentsBall">Comments on Ball Trajectories</Label>
												<Input
													onChange={e => this.change(e)}
													type="textarea"
													name="commentsBall"
													id="commentsBall"
												></Input>
											</FormGroup>
											<FormGroup>
												<Label htmlFor="commentsMisc">Miscellaneous Comments</Label>
												<Input
													onChange={e => this.change(e)}
													type="textarea"
													name="commentsMisc"
													id="commentsMisc"
												></Input>
											</FormGroup>
										</Col>
										<Col>
											<FormGroup>
												<Label htmlFor="logIn">
													Log In <Badge>Eastern Time</Badge>
												</Label>
												<Input onChange={e => this.change(e)} id="logIn" type="time" name="logIn" required></Input>
											</FormGroup>
											<FormGroup>
												<Label htmlFor="logOut">
													Log Out <Badge>Eastern Time</Badge>
												</Label>
												<Input onChange={e => this.change(e)} id="logOut" type="time" name="logOut" required></Input>
											</FormGroup>

											<Label htmlFor="stepsCompleted">Steps Completed (check all that apply)</Label>
											<FormGroup>
												<CustomInput
													type="checkbox"
													id="resolvingCustomCheckbox"
													label="Finished Resolving the Game"
													name="stepResolving"
													onClick={e => this.change(e)}
												/>
												<CustomInput
													id="completionCustomCheckbox"
													type="checkbox"
													label="Confirmed all Pitches, Pickoffs & Steals"
													name="stepCompletion"
													onClick={e => this.change(e)}
												/>
												<CustomInput
													id="accuracyCustomCheckbox"
													type="checkbox"
													label="Checked all Hits for Accuracy"
													name="stepAccuracy"
													onClick={e => this.change(e)}
												/>
											</FormGroup>
											<br />
											{this.state.fieldData.stepResolving === true ? (
												<FormGroup>
													<Label htmlFor="timeResolving">
														Time Spent Finishing Resolving <Badge color="info"># of Min</Badge>
													</Label>
													<Input
														required
														onChange={e => this.change(e)}
														type="number"
														min="0"
														name="timeResolving"
														id="timeResolving"
													/>
												</FormGroup>
											) : (
												<FormGroup>
													<Label htmlFor="timeResolving">
														Time Spent Finishing Resolving <Badge color="info"># of Min</Badge>
													</Label>
													<Input
														onChange={e => this.change(e)}
														type="number"
														min="0"
														name="timeResolving"
														id="timeResolving"
													/>
												</FormGroup>
											)}
											{this.state.fieldData.stepCompletion === true ? (
												<FormGroup>
													<Label htmlFor="timeCompletion">
														Time Spent on Completion <Badge color="info"># of Min</Badge>
													</Label>
													<Input
														required
														onChange={e => this.change(e)}
														type="number"
														min="0"
														name="timeCompletion"
														id="timeCompletion"
													/>
												</FormGroup>
											) : (
												<FormGroup>
													<Label htmlFor="timeCompletion">
														Time Spent on Completion <Badge color="info"># of Min</Badge>
													</Label>
													<Input
														onChange={e => this.change(e)}
														type="number"
														min="0"
														name="timeCompletion"
														id="timeCompletion"
													/>
												</FormGroup>
											)}
											{this.state.fieldData.stepAccuracy === true ? (
												<FormGroup>
													<Label htmlFor="timeAccuracy">
														Time Spent Checking Hits for Accuracy <Badge color="info"># of Min</Badge>
													</Label>
													<Input
														required
														onChange={e => this.change(e)}
														type="number"
														min="0"
														name="timeAccuracy"
														id="timeAccuracy"
													/>
												</FormGroup>
											) : (
												<FormGroup>
													<Label htmlFor="timeAccuracy">
														Time Spent Checking Hits for Accuracy <Badge color="info"># of Min</Badge>
													</Label>
													<Input
														onChange={e => this.change(e)}
														type="number"
														min="0"
														name="timeAccuracy"
														id="timeAccuracy"
													/>
												</FormGroup>
											)}

											<FormGroup>
												<Label htmlFor="readyShare">Ready for Share?</Label>
												<Input onChange={e => this.change(e)} type="select" name="readyShare" id="readyShare" required>
													<option></option>
													<option>No</option>
													<option>Yes</option>
												</Input>
											</FormGroup>

											{this.state.fieldData.readyShare === "Yes" ? (
												<FormGroup>
													<Label htmlFor="gdPitches"># Gameday Pitches</Label>
													<Input onChange={e => this.change(e)}  required type="text" name="gdPitches" id="gdPitches"></Input>
													<Label htmlFor="ffxPitches"># Fieldfx Pitches</Label>
													<Input onChange={e => this.change(e)}  required type="text" name="ffxPitches" id="ffxPitches"></Input>
												</FormGroup>
											) : (
												<FormGroup>
													<Label htmlFor="gdPitches"># Gameday Pitches</Label>
													<Input disabled type="text" name="gdPitches" id="gdPitches"></Input>
													<Label htmlFor="ffxPitches"># Fieldfx Pitches</Label>
													<Input disabled type="text" name="ffxPitches" id="ffxPitches"></Input>
												</FormGroup>
											)}

											<FormGroup>
												<Label htmlFor="screenShots">Screenshots</Label>
												<Row>
													<Col>
														<Input type="file" name="screenShots1" id="screenShots1"></Input>
														<br />
														<Input type="file" name="screenShots2" id="screenShots2"></Input>
													</Col>

													<Col>
														<Input type="file" name="screenShots3" id="screenShots3"></Input>
														<br />
														<Input type="file" name="screenShots4" id="screenShots4"></Input>
													</Col>
												</Row>
											</FormGroup>

											<img src={lgLogo} alt="SMT Logo"></img>
										</Col>
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
export default FFxAuditReport;
