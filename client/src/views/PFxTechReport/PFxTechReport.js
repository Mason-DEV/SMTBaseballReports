import React, { Component,  } from "react";
import {Badge,	Button,Card,	CardBody,CardHeader,CardFooter, Col,Label,	Input,	Form,FormGroup,FormFeedback,Modal, ModalHeader, Row, } from "reactstrap";
//import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

import lgLogo from '../../../src/assests/images/SMT_Report_Tag.jpg';
import Table from  '../PFxTechReport/Table';

//const Widget03 = lazy(() => import('../../views/Widgets/Widget03'));


class PFxTechReport extends Component {
	constructor(props) {
		super(props);

		//Binding states
		this.toggle = this.toggle.bind(this);

		//States
		this.state = {
			dropdownOpen: false,
		};
	}

	toggle() {
		this.setState({
			dropdownOpen: !this.state.dropdownOpen
		});
	}
	onSubmit(event) {
		event.preventDefault();
		
	  }


	render() {
		return (
			<div className="animated fadeIn">
				<br />
				<Card className="card-accent-success">
					<CardHeader>
						<strong>Pitchf/x Tech Report</strong>
					</CardHeader>
					<CardBody>
						<Form>
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
										<Label htmlFor="date">Date</Label>
										<Input id="date" type="date" name="date"></Input>
									</FormGroup>
									<FormGroup>
										<Label htmlFor="login-time">
											Log In <Badge>Eastern Time</Badge>
										</Label>
										<Input
											id="login-time"
											type="time"
											name="login-time"
										></Input>
									</FormGroup>
									<FormGroup>
										<Label htmlFor="first-pitch">
											First Pitch <Badge>Eastern Time</Badge>
										</Label>
										<Input
											id="first-pitch"
											type="time"
											name="first-pitch"
										></Input>
									</FormGroup>
									<FormGroup>
										<Label htmlFor="logout-time">
											Log Out <Badge>Eastern Time</Badge>
										</Label>
										<Input
											id="logout-time"
											type="time"
											name="logout-time"
										></Input>
									</FormGroup>
									<FormGroup>
										<Label htmlFor="hwswIssues">Hardware/Software Issues</Label>
										<Input
											id="hwswIssues"
											type="textarea"
											name="hwswIssues"
										></Input>
									</FormGroup>
								</Col>
								<Col>
									<Label>
										<h5 style={{ color: "green" }}>
											Corrections/Changes Section
										</h5>
									</Label>
									<Table />
									<Label>
										<h5 style={{ color: "red" }}>
											Support Section - Not accessible via OP login
										</h5>
									</Label>
									<FormGroup>
										<Label htmlFor="t1Notes">T1 Notes</Label>
										<Input
											disabled
											type="textarea"
											name="t1Notes"
											id="t1Notes"
										></Input>
									</FormGroup>
									<img src={lgLogo} alt="SMT Logo"></img>
								</Col>
							</Row>

							<Row>
								<Col></Col>
								<Col></Col>
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
export default PFxTechReport;