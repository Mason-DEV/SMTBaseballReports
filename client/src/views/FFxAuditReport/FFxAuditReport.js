import React, { Component, lazy, Suspense } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
	Badge,
	Button,
	ButtonDropdown,
	ButtonGroup,
	ButtonToolbar,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	CardTitle,
	Col,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	Label,
	Input,
	Form,
	FormGroup,
	FormText,
	FormFeedback,
	Progress,
	Row,
	Table
} from "reactstrap";
//import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { getStyle, hexToRgba } from "@coreui/coreui/dist/js/coreui-utilities";

import lgLogo from '../../../src/assests/images/SMT_Report_Tag.jpg';

//const Widget03 = lazy(() => import('../../views/Widgets/Widget03'));

const brandPrimary = getStyle("--primary");
const brandSuccess = getStyle("--success");
const brandInfo = getStyle("--info");
const brandWarning = getStyle("--warning");
const brandDanger = getStyle("--danger");

function test(params) {
	console.log(params);
}

class FFxAuditReport extends Component {
	constructor(props) {
		super(props);

		//Binding states
		this.toggle = this.toggle.bind(this);
		this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

		//States
		this.state = {
			dropdownOpen: false,
			radioSelected: 2
		};
	}

	toggle() {
		this.setState({
			dropdownOpen: !this.state.dropdownOpen
		});
	}

	onRadioBtnClick(radioSelected) {
		this.setState({
			radioSelected: radioSelected
		});
	}

	render() {
		return (
			<div className="animated fadeIn">
				<br />
				<Card className="card-accent-success">
					<CardHeader>
						<strong>FIELDf/x Audit Report</strong>
					</CardHeader>
					<CardBody>
						<Form action="" method="post">
							<Row>
								<Col>
									<FormGroup>
										<Label htmlFor="gameID">Game ID</Label>
										<Input type="text" className="form-control-warning"	id="gameID" placeholder="2019_01_01_smtafa_smtafa_1" required/>
										<FormFeedback className="help-block">Please provide a valid information	</FormFeedback>
										<FormFeedback valid className="help-block">Input provided</FormFeedback>
									</FormGroup>
								</Col>
								<Col>
									<FormGroup>
										<Label htmlFor="login-time">Log In <Badge>Eastern Time</Badge></Label>
										<Input id="login-time" type="time" name="login-time"></Input>
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col>
									<FormGroup>
										<Label htmlFor="operator">Operator</Label>
										<Input type="select" name="operator" id="operator" required>
											<option>Operator 1</option>
											<option>Operator 2</option>
											<option>Operator 3</option>
											<option>Operator 4</option>
											<option>Operator 5</option>
											<option>Operator 6</option>
										</Input>
									</FormGroup>
								</Col>
								<Col>
									<FormGroup>
										<Label htmlFor="logout-time">Log Out <Badge>Eastern Time</Badge></Label>
										<Input id="logout-time"	type="time"	name="logout-time"></Input>
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col>
									<FormGroup>
										<Label htmlFor="auditor">Auditor</Label>
										<Input type="select" name="auditor" id="auditor">
											<option>Auditor 1</option>
											<option>Auditor 2</option>
											<option>Auditor 3</option>
											<option>Auditor 4</option>
											<option>Auditor 6</option>
											<option>Auditor 5</option>
										</Input>
									</FormGroup>
								</Col>
								<Col>
									<Label htmlFor="stepsCompleted">
										Steps Completed (check all that apply)
									</Label>
									<FormGroup check className="checkbox">
										<Input className="form-check-input" type="checkbox"	id="checkbox1" name="checkbox1"	value="option1"/>
										<Label check className="form-check-label" htmlFor="checkbox1"> Finished Resolving the Game</Label>									</FormGroup>
									<FormGroup check className="checkbox">
										<Input className="form-check-input" type="checkbox"	id="checkbox2" name="checkbox2"	value="option2"/>
										<Label check className="form-check-label" htmlFor="checkbox2"> Confirmed all Pitches, Pickoffs { '&' }Steals
										</Label>
									</FormGroup>
									<FormGroup check className="checkbox">
										<Input className="form-check-input"	type="checkbox"	id="checkbox3"	name="checkbox3" value="option3"/>
										<Label check className="form-check-label"htmlFor="checkbox3"> Checked all Hits for Accuracy</Label>
									</FormGroup>
								</Col>
							</Row>
							<br />
							<Row>
								<Col>
									<FormGroup>
										<Label htmlFor="numPitchesAdded">Number of Pitches Added</Label>
										<Input type="text" name="numPitchesAdded" id="numPitchesAdded"></Input>
									</FormGroup>
								</Col>
								<Col>
									<FormGroup>
										<Label htmlFor="timeResolving">Time Spent Finishing Resolving <Badge>Hour:Min Format</Badge></Label>
										<Input type="text" name="timeResolving" id="timeResolving" placeholder="00:00"/>
									</FormGroup>
								</Col>
								
							</Row>
							<Row>
								<Col>
									<FormGroup>
										<Label htmlFor="numBIPasPC">Number of Balls in Play marked as P/C</Label>
										<Input type="text" name="numBIPasPC" id="numBIPasPC"></Input>
									</FormGroup>
								</Col>
								<Col>
									<FormGroup>
										<Label htmlFor="timeCompletion">Time Spent on Completion <Badge>Hour:Min Format</Badge></Label>
										<Input type="text" name="timeCompletion" id="timeCompletion" placeholder="00:00"/>
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col>
									<FormGroup>
										<Label htmlFor="numFBasPC">Number of Foul Balls marked as P/C</Label>
										<Input type="text" name="numFBasPC" id="numFBasPC"></Input>
									</FormGroup>
								</Col>
								<Col>
									<FormGroup>
										<Label htmlFor="timeAccuracy">Time Spent Checking Hits for Accuracy <Badge>Hour:Min Format</Badge></Label>
										<Input type="text" name="timeAccuracy" id="timeAccuracy" placeholder="00:00"/>
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col>
									<FormGroup>
										<Label htmlFor="numPicksAdded">Number of Pickoffs Added</Label>
										<Input type="text" name="numPicksAdded" id="numPicksAdded"></Input>
									</FormGroup>
								</Col>
								<Col>
									<FormGroup>
											<Label htmlFor="readyShare">Ready for Share?</Label>
											<Input type="select" name="readyShare" id="readyShare">
											<option>No</option>
											<option>Yes</option>
											</Input>
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col>
									<FormGroup>
										<Label htmlFor="vidGaps">Video Gaps</Label>
										<Input type="text" name="vidGaps" id="vidGaps"></Input>
									</FormGroup>
								</Col>
								<Col>
									<FormGroup>
											<Label htmlFor="gdPitches"># Gameday Pitches</Label>
											<Input type="text" name="gdPitches" id="gdPitches"></Input>
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col>
								<FormGroup>
										<Label htmlFor="missedPitchesVidGaps">Number of Missed Pitches due to Video Gaps</Label>
										<Input type="text" name="missedPitchesVidGaps" id="missedPitchesVidGaps"></Input>
									</FormGroup>
								</Col>
								<Col>
									<FormGroup>
											<Label htmlFor="ffxPitches"># Fieldfx Pitches</Label>
											<Input type="text" name="ffxPitches" id="ffxPitches"></Input>
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col>
									<FormGroup>
										<Label htmlFor="missedBIPVidGaps">Number of Missed BIP due to Video Gaps</Label>
										<Input type="text" name="missedBIPVidGaps" id="missedBIPVidGaps"></Input>
									</FormGroup>
								</Col>
								<Col>
								</Col>
							</Row>
							<Row>
								<Col>
									<FormGroup>
										<Label htmlFor="commentsPlayer">Comments on Player Pathing</Label>
										<Input type="textarea" name="commentsPlayer" id="commentsPlayer"></Input>
									</FormGroup>
								</Col>
								<Col>
								<FormGroup>
										<Label htmlFor="commentsBall">Comments on Ball Trajectories</Label>
										<Input type="textarea" name="commentsBall" id="commentsBall"></Input>
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col>
									<FormGroup>
										<Label htmlFor="commentsMisc">Miscellaneous Comments</Label>
										<Input type="textarea" name="commentsMisc" id="commentsMisc"></Input>
									</FormGroup>
								</Col>
								<Col>
								<FormGroup>
										<Label htmlFor="screenShots">Screenshots</Label>
										<Input type="file" name="screenShots1" id="screenShots1"></Input>
										<br/>
										<Input type="file" name="screenShots2" id="screenShots2"></Input>
									</FormGroup>
								</Col>
								
							</Row>
							<Row>
								<Col>
									<FormGroup className="form-actions">
										<Button type="submit" size="sm" color="success"><i className="fa fa-dot-circle-o"></i> Submit</Button>
										<Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
									</FormGroup>
								
								</Col>
								<Col>
								<img src={lgLogo} alt="SMT Logo"></img>
								</Col>
							</Row>
						</Form>
					</CardBody>
				</Card>
			</div>
		);
	}
}
export default FFxAuditReport;