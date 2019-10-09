import React, { Component,  } from "react";
import {Badge,	Button,Card,	CardBody,CardHeader, CardFooter,Col,Label,	Input,	Form,FormGroup,FormFeedback,Row} from "reactstrap";

import lgLogo from '../../../src/assests/images/SMT_Report_Tag.jpg';


class FFxTechReport extends Component {
	constructor(props) {
		super(props);

		//Binding states
		this.toggle = this.toggle.bind(this);

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


	render() {
		return (
			<div className="animated fadeIn">
				<br />
				<Card className="card-accent-success">
					<CardHeader>
						<strong>FIELDf/x Tech Report</strong>
					</CardHeader>
					<CardBody>
						<Form action="" method="post">
							<Row>
								<Col>
									<FormGroup>
										<Label htmlFor="venue">Venue</Label>
										<Input type="select" name="venue" id="venue" required>
											<option>Venue 1</option>
											<option>Venue 2</option>
											<option>Venue 3</option>
											<option>Venue 4</option>
											<option>Venue 5</option>
											<option>Venue 6</option>
										</Input>
									</FormGroup>
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
									<FormGroup>
										<Label htmlFor="support">Support</Label>
										<Input type="select" name="support" id="support" required>
											<option>Support 1</option>
											<option>Support 2</option>
											<option>Support 3</option>
											<option>Support 4</option>
											<option>Support 5</option>
											<option>Support 6</option>
										</Input>
									</FormGroup>
									<FormGroup>
										<Label htmlFor="gameID">Game ID</Label>
										<Input type="text" className="form-control-warning"	id="gameID" placeholder="2019_01_01_smtafa_smtafa_1" required/>
									</FormGroup>
								</Col>
								<Col>
									<FormGroup>
										<Label htmlFor="date">Date</Label>
										<Input id="date" type="date" name="date"></Input>
									</FormGroup>
									<FormGroup>
										<Label htmlFor="login-time">Log In <Badge>Eastern Time</Badge></Label>
										<Input id="login-time" type="time" name="login-time"></Input>
									</FormGroup>
									<FormGroup>
										<Label htmlFor="first-pitch">First Pitch <Badge>Eastern Time</Badge></Label>
										<Input id="first-pitch" type="time" name="first-pitch"></Input>
									</FormGroup>
									<FormGroup>
										<Label htmlFor="logout-time">Log Out <Badge>Eastern Time</Badge></Label>
										<Input id="logout-time" type="time" name="logout-time"></Input>
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col>
									<FormGroup>
										<Label htmlFor="ipcrIssues">IPCamRelay Issues?</Label>
										<Input type="textarea" name="ipcrIssues" id="ipcrIssues"></Input>
									</FormGroup>
									<FormGroup>
										<Label htmlFor="fgdIssues">Foreground Detector Issues?</Label>
										<Input type="textarea" name="fgdIssues" id="fgdIssues"></Input>
									</FormGroup>
									<FormGroup>
										<Label htmlFor="resolverIssues">Resolver Issues?</Label>
										<Input type="textarea" name="resolverIssues" id="resolverIssues"></Input>
									</FormGroup>
									<FormGroup>
										<Label htmlFor="hardwareIssues">Hardware Issues?</Label>
										<Input type="textarea" name="hardwareIssues" id="hardwareIssues"></Input>
									</FormGroup>
									<FormGroup>
										<Label htmlFor="miscNotes">Misc Notes</Label>
										<Input type="textarea" name="miscNotes" id="miscNotes"></Input>
									</FormGroup>
								</Col>
								<Col>
									<Label>
										<h5 style={{color: 'red'}}>Support Section - Not accessible via OP login</h5>
									</Label>
									<FormGroup>
										<Label htmlFor="supportNotes">Support Notes</Label>
										<Input disabled type="textarea" name="supportNotes" id="supportNotes"></Input>
									</FormGroup>
									<FormGroup>
										<Label htmlFor="bisonSet">Bison Set <Badge>R Drive </Badge></Label>
										<Input disabled type="text" name="bisonSet" id="bisonSet" placeholder="Bison_A"/>
									</FormGroup>
									<FormGroup>
										<Label htmlFor="backupTask">Backup Task Initiated</Label>
										<Input disabled type="select" name="backupTask" id="backupTask" required>
											<option>Default</option>
											<option>Copy Full Video Only</option>
											<option>Copy Data only no Video Copy</option>
											<option>No Backup</option>
										</Input>
									</FormGroup>
									<FormGroup>
										<Label htmlFor="backupNotes">Backup Notes </Label>
										<Input disabled type="text" name="backupNotes" id="bisonbackupNotesSet"/>
									</FormGroup>
									<img src={lgLogo} alt="SMT Logo"></img>
								</Col>
							</Row>
							
							<Row>
								<Col>
									
								</Col>
								<Col>
							
								</Col>
							</Row>
						</Form>
					</CardBody>
					<CardFooter>
						<FormGroup className="form-actions text-center">
							<Button type="submit" size="lg" color="success">
								<i className="fa fa-check"></i> Submit
							</Button>
							<Button  type="reset" size="lg" color="danger">
								<i className="fa fa-ban"></i> Reset
							</Button>
						</FormGroup>
					</CardFooter>
				</Card>
			</div>
		);
	}
}
export default FFxTechReport;