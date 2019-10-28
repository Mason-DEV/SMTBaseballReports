import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form,	FormGroup,	Row, Col, Label, Input } from 'reactstrap';
import axios from 'axios';
import logger from "../../../components/helpers/logger";


class ModalExample extends React.Component {
	constructor(props) {
		super(props);
		//General Binds
		this.toggle = this.toggle.bind(this);
		this.onSubmit = this.onSubmit.bind(this);

		//Editing Binds
		this.onChangeGamestring = this.onChangeGamestring.bind(this);
		this.onChangeOperator = this.onChangeOperator.bind(this);
		this.onChangeAuditor = this.onChangeAuditor.bind(this);
		this.onChangeGDPitches = this.onChangeGDPitches.bind(this);
		this.onChangeFFxPitches = this.onChangeFFxPitches.bind(this);
		this.onChangeMissedPitches = this.onChangeMissedPitches.bind(this);
		this.onChangeMissedBIP = this.onChangeMissedBIP.bind(this);
		this.onChangeAddedPitches = this.onChangeAddedPitches.bind(this);
		this.onChangeAddedPicks = this.onChangeAddedPicks.bind(this);

		//States
		this.state = {
			modal: false,
			modalType: "View",
			data: {}
		};
  }

  componentDidMount(){
    this.setDataDefault()
  }
  
  setDataDefault(){
 
    this.setState({
      data: {
        _id: this.props.data.element._id,
        gamestring: this.props.data.element.gamestring,
        operator: this.props.data.element.operator,
        auditor: this.props.data.element.auditor,
        gdPitches: this.props.data.element.gdPitches,
        ffxPitches: this.props.data.element.ffxPitches,
        missedPitches: this.props.data.element.missedPitches,
        missedBIP: this.props.data.element.missedBIP,
        addedPitches: this.props.data.element.pitchesAdd,
        addedPicks: this.props.data.element.pickAdd,
      }})
  }

	onChangeGamestring(e) {
		this.setState({
			data : {...this.state.data, gamestring: e.target.value}
		});
	}
	onChangeOperator(e) {
		this.setState({
      data : {...this.state.data, operator: e.target.value}
		});
	}
	onChangeAuditor(e) {
		this.setState({
      data : {...this.state.data, auditor: e.target.value}
		});
	}
	onChangeGDPitches(e) {
		this.setState({
			data : {...this.state.data, gdPitches: e.target.value}
		});
	}
	onChangeFFxPitches(e) {
		this.setState({
			data : {...this.state.data, ffxPitches: e.target.value}
		});
	}
	onChangeMissedPitches(e) {
		this.setState({
			data : {...this.state.data, missedPitches: e.target.value}
		});
	}
	onChangeMissedBIP(e) {
		this.setState({
			data : {...this.state.data, missedBIP: e.target.value}
		});
	}
	onChangeAddedPitches(e) {
		this.setState({
			data : {...this.state.data, addedPitches: e.target.value}
		});
	}
	onChangeAddedPicks(e) {
		this.setState({
			data : {...this.state.data, addedPicks: e.target.value}
		});
	}

	toggle() {
    this.setDataDefault();
		this.setState(prevState => ({
			modal: !prevState.modal,
			modalType: this.props.data.name
		}));
	}

	onSubmit(e) {
		e.preventDefault();
	
		//Build object that we are going to update based on its current state
		const auditObj = {
			_id: this.state.data._id,
			gamestring: this.state.data.gamestring,
			operator: this.state.data.operator,
			auditor: this.state.data.auditor,
			gdPitches: this.state.data.gdPitches,
			ffxPitches: this.state.data.ffxPitches,
			missedPitches: this.state.data.missedPitches,
			missedBIP: this.state.data.missedBIP,
			addedPitches: this.state.data.addedPitches,
			addedPicks: this.state.data.addedPicks,
		};

		axios.put('/api/audits/update/'+auditObj._id, auditObj)
		  .then(res => console.log(res.data))
		  .catch(function (error) {
			logger("error", error);
        })

        
    //Show a yay we updated! 
        
    //Now close 
    this.toggle();
    //reset state so that when we are done, it resets to parms
    //this.setDataDefault();

	}

	render() {
		if (this.state.modalType === "View") {
			return (
				<div style={{ margin: 1, float: "left" }}>
					<Button color={this.props.data.color} size="sm" onClick={this.toggle}>
						{this.props.data.name}{" "}
					</Button>
					<Modal
						isOpen={this.state.modal}
						toggle={this.toggle}
						className={this.props.className}
					>
						<ModalHeader toggle={this.toggle}>View Modal</ModalHeader>
						<ModalBody>
							<Form action="" method="post">
								<Row>
									<Col>
										<FormGroup>
											<Label htmlFor="gameID">Gamestring</Label>
											<Input
												type="text"
												className="form-control-warning"
												id="gameID"
												defaultValue={this.props.data.element.gamestring}
												disabled
											></Input>
											<Label htmlFor="operator">Operator</Label>
											<Input
												type="text"
												className="form-control-warning"
												id="operator"
												defaultValue={this.props.data.element.operator}
												disabled
											></Input>
											<Label htmlFor="auditor">Auditor</Label>
											<Input
												type="text"
												className="form-control-warning"
												id="auditor"
												defaultValue={this.props.data.element.auditor}
												disabled
											></Input>
										</FormGroup>
									</Col>
									<Col>
										<FormGroup>
											<Label htmlFor="gdPitches">GD Pitches</Label>
											<Input
												type="text"
												className="form-control-warning"
												id="gdPitches"
												defaultValue={this.props.data.element.gdPitches}
												disabled
											></Input>
											<Label htmlFor="ffxPitches">FFx Pitches</Label>
											<Input
												type="text"
												className="form-control-warning"
												id="ffxPitches"
												defaultValue={this.props.data.element.ffxPitches}
												disabled
											></Input>
										</FormGroup>
									</Col>
								</Row>
							</Form>
						</ModalBody>
						<ModalFooter>
							<Button color="warning">Generate PDF</Button>
							<Button color="secondary" onClick={this.toggle}>
								Close
							</Button>
						</ModalFooter>
					</Modal>
				</div>
			);
		} else {
			return (
				<div style={{ margin: 1, float: "left" }}>
					<Button color={this.props.data.color} size="sm" onClick={this.toggle}>
						{this.props.data.name}{" "}
					</Button>
					<Modal
						isOpen={this.state.modal}
						toggle={this.toggle}
						className={this.props.className}
					>
						<Form onSubmit={this.onSubmit}>
							<ModalHeader toggle={this.toggle}>Edit Modal</ModalHeader>
							<ModalBody>
								<Row>
									<Col>
										<FormGroup>
											<Label htmlFor="gameID">Gamestring</Label>
											<Input
												type="text"
												className="form-control-warning"
												onChange={this.onChangeGamestring}
												defaultValue={this.state.data.gamestring}
											></Input>
											<Label htmlFor="operator">Operator</Label>
											<Input
												type="text"
												className="form-control-warning"
												onChange={this.onChangeOperator}
												defaultValue={this.state.data.operator}
											></Input>
											<Label htmlFor="auditor">Auditor</Label>
											<Input
												type="text"
												className="form-control-warning"
												onChange={this.onChangeAuditor}
												defaultValue={this.state.data.auditor}
											></Input>
											<Label htmlFor="operator">Missed Pitches</Label>
											<Input
												type="text"
												className="form-control-warning"
												onChange={this.onChangeMissedPitches}
												defaultValue={this.state.data.missedPitches}
											></Input>
											<Label htmlFor="auditor">Missed BIP</Label>
											<Input
												type="text"
												className="form-control-warning"
												onChange={this.onChangeMissedBIP}
												defaultValue={this.state.data.missedBIP}
											></Input>
										</FormGroup>
									</Col>
									<Col>
										<FormGroup>
											<Label htmlFor="gdPitches">GD Pitches</Label>
											<Input
												type="text"
												className="form-control-warning"
												onChange={this.onChangeGDPitches}
												defaultValue={this.state.data.gdPitches}
											></Input>
											<Label htmlFor="ffxPitches">FFx Pitches</Label>
											<Input
												type="text"
												className="form-control-warning"
												onChange={this.onChangeFFxPitches}
												defaultValue={this.state.data.ffxPitches}
											></Input>
											<Label htmlFor="gdPitches">Added Pitches</Label>
											<Input
												type="text"
												className="form-control-warning"
												onChange={this.onChangeAddedPitches}
												defaultValue={this.state.data.addedPitches}
											></Input>
											<Label htmlFor="ffxPitches">Added Picks</Label>
											<Input
												type="text"
												className="form-control-warning"
												onChange={this.onChangeAddedPicks}
												defaultValue={this.state.data.addedPicks}
											></Input>
										</FormGroup>
									</Col>
								</Row>
							</ModalBody>
							<ModalFooter>
								<FormGroup>
									<Button color="success">Update</Button>
									<Button color="secondary" onClick={this.toggle}>
										Cancel
									</Button>
								</FormGroup>
							</ModalFooter>
						</Form>
					</Modal>
				</div>
			);
		}
	}
}

export default ModalExample;