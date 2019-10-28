import React, { Component } from "react";
import axios from "axios";
import spinner from "../../assests/images/smtSpinner.gif";
import logger from "../../components/helpers/logger";
import {
	Badge,
	Card,
	CardBody,
	CardHeader,
	Container,
	CustomInput,
	Modal,
	Form,
	Col,
	FormGroup,
	Label,
	Input,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Nav,
	NavItem,
	NavLink,
	Button,
	Row,
	Table,
	TabContent,
	TabPane,
	CardTitle,
	CardText
} from "reactstrap";

class FFxTechData extends Component {
	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);

		this.showEdit = this.showEdit.bind(this);
		this.hideEdit = this.hideEdit.bind(this);
		this.submitEdit = this.submitEdit.bind(this);
		this.changeEditData = this.changeEditData.bind(this);

		this.showDelete = this.showDelete.bind(this);
		this.hideDelete = this.hideDelete.bind(this);
		this.submitDelete = this.submitDelete.bind(this);

		this.state = {
			isLoading: true,
			activeTab: new Array(3).fill("1"),
			venues: {},
			operators: {},
			support: {},
			allGameData: {},
			todayGameData: {},
			editModal: false,
			deleteModal: false,
			isAdding: false,
			isDeleting: false,
			needToReload: false,
			editData: {},
			deleteData: {}
		};
	}

	toggle(tabPane, tab) {
		const newArray = this.state.activeTab.slice();
		newArray[tabPane] = tab;
		this.setState({
			activeTab: newArray
		});
	}

	removeBlur() {
		let el = document.querySelector(":focus");
		if (el) el.blur();
	}

	tabPane() {
		return (
			<>
				<TabPane tabId="1">
					<Table bordered striped responsive size="sm">
						<thead>
							<tr>
								<th width="">Actions</th>
								<th width="">Date</th>
								<th width="">Gamestring</th>
								<th width="">Venue</th>
								<th width="">Operator</th>
								<th width="">Support Notes</th>
								<th width="">Backup Task</th>
							</tr>
						</thead>
						<tbody>
							{this.state.todayGameData.map((data, i) => {
								return (
									<tr key={i}>
										<td>
											<Button onClick={e => this.showEdit(data._id)} color="warning" size="sm">
												Edit
											</Button>{" "}
											<Button onClick={e => this.showDelete(data._id, data.gameID)} color="danger" size="sm">
												Delete
											</Button>
										</td>
										<td>{data.date.substr(0, 10)}</td>
										<td>{data.gameID}</td>
										<td>{data.venue}</td>
										<td>{data.operator}</td>
										<td>{data.supportNotes}</td>
										<td>{data.backupTask}</td>
									</tr>
								);
							})}
						</tbody>
					</Table>
				</TabPane>
				<TabPane tabId="2">
					{
						<Table bordered striped responsive size="sm">
							<thead>
								<tr>
									<th width="">Actions</th>
									<th width="">Date</th>
									<th width="">Gamestring</th>
									<th width="">Venue</th>
									<th width="">Operator</th>
									<th width="">Support Notes</th>
									<th width="">Backup Task</th>
								</tr>
							</thead>
							<tbody>
								{this.state.allGameData.map((data, i) => {
									return (
										<tr key={i}>
											<td>
												<Button onClick={e => this.showEdit(data._id)} color="warning" size="sm">
													Edit
												</Button>{" "}
												<Button onClick={e => this.showDelete(data._id)} color="danger" size="sm">
													Delete
												</Button>
											</td>
											<td>{data.date.substr(0, 10)}</td>
											<td>{data.gameID}</td>
											<td>{data.venue}</td>
											<td>{data.operator}</td>
											<td>{data.supportNotes}</td>
											<td>{data.backupTask}</td>
										</tr>
									);
								})}
							</tbody>
						</Table>
					}
				</TabPane>
				{/* <TabPane tabId="3">{`Select`}</TabPane> */}
			</>
		);
	}

	//#region Edit Functions
	getEditDate(date) {
		if (date) {
			const editDate = date.substr(0, 10);
			return editDate;
		}
		return date;
	}

	hideEdit() {
		this.setState({
			editModal: !this.state.editModal,
			editData: {},
			needToReload: false
		});
	}

	changeEditData(e) {
		if (e.target.name === "date") {
			this.setState({
				editData: { ...this.state.editData, [e.target.name]: new Date(e.target.value).toISOString() }
			});
		} else {
			this.setState({
				editData: { ...this.state.editData, [e.target.name]: e.target.value }
			});
		}
	}
	showEdit(id) {
		axios
			.get("/api/ffxTech/ffxReportByID", {
				headers: { ID: id }
			})
			.then(res => {
				this.setState({ editData: res.data });
			})
			.catch(function(error) {
				logger("error", "FfxReport Show edit === " + error);
			});

		this.setState({
			editModal: !this.state.editModal
		});
		this.removeBlur();
	}
	submitEdit(e) {
		e.preventDefault();
		const editedReport = {
			venue: this.state.editData.venue,
			operator: this.state.editData.operator,
			support: this.state.editData.support,
			date: this.state.editData.date,
			logIn: this.state.editData.logIn,
			logOut: this.state.editData.logOut,
			firstPitch: this.state.editData.firstPitch,
			gameID: this.state.editData.gameID,
			ipCamIssues: this.state.editData.ipCamIssues,
			fgdIssues: this.state.editData.fgdIssues,
			resolverIssues: this.state.editData.resolverIssues,
			hardwareIssues: this.state.editData.hardwareIssues,
			miscNotes: this.state.editData.miscNotes,
			supportNotes: this.state.editData.supportNotes,
			bisonSet: this.state.editData.bisonSet,
			backupTask: this.state.editData.backupTask,
			backupNote: this.state.editData.backupNote
		};
		this.setState({ isEditing: true });
		axios
			.put("/api/ffxTech/update/" + this.state.editData._id, editedReport)
			.then(editing => {
				this.setState({ isEditing: false, needToReload: true });
			})
			.catch(error => {
				this.setState({ isEditing: false });
				logger("error", "FfxTech Submit === " + error);
			});
		this.hideEdit();
	}
	//#endregion Edit Functions

	//#region Delete Functions
	hideDelete() {
		this.setState({
			deleteModal: !this.state.deleteModal,
			deleteData: {},
			needToReload: false
		});
	}

	showDelete(id, gameID) {
		this.setState({
			deleteModal: !this.state.deleteModal,
			deleteData: { _id: id, gameID }
		});
		this.removeBlur();
	}
	submitDelete(e) {
		e.preventDefault();
		this.setState({ isDeleting: true });
		axios
			.delete("/api/FFxTech/delete/", {
				headers: { ID: this.state.deleteData._id }
			})
			.then(deleteing => {
				this.setState({ isDeleting: false, needToReload: true });
			})
			.catch(error => {
				this.setState({ isDeleting: false });
				logger("error", error);
			});
		this.hideDelete();
	}
	//#endregion Delete Functions

	componentDidMount() {
		// Axios api call to get all data
		Promise.all([
			axios.get("/api/FFxTech/"),
			axios.get("/api/FFxTech/today"),
			axios.get("/api/staff/operators"),
			axios.get("/api/staff/support"),
			axios.get("/api/venue/fieldFx")
		])
			.then(([allResponse, todayResponse, opResponse, supportResponse, venueResponse]) => {
				const all = allResponse.data;
				const today = todayResponse.data;
				const ops = opResponse.data.map(obj => ({ name: obj.name }));
				const venues = venueResponse.data.map(obj => ({ name: obj.name }));
				const support = supportResponse.data.map(obj => ({ name: obj.name }));
				this.setState({ allGameData: all, todayGameData: today, operators: ops, support, venues });
			})
			.then(isLoading => this.setState({ isLoading: false }));
	}

	componentDidUpdate() {
		//Checking if we need to make an Axios api call to get all venueData
		if (this.state.needToReload === true) {
			Promise.all([
				axios.get("/api/FFxTech/"),
				axios.get("/api/FFxTech/today"),
				axios.get("/api/staff/operators"),
				axios.get("/api/venue/fieldFx")
			])
				.then(([allResponse, todayResponse, opResponse, venueResponse]) => {
					const all = allResponse.data;
					const today = todayResponse.data;
					const ops = opResponse.data.map(obj => ({ name: obj.name }));
					const venues = venueResponse.data.map(obj => ({ name: obj.name }));
					this.setState({ allGameData: all, todayGameData: today, operators: ops, venues });
				})
				.then(reloading => this.setState({ needToReload: false }));
		}
	}

	render() {
		if (this.state.isLoading) {
			return <img src={spinner} height="150" width="150" alt="spinner" align="center" style={{ height: "100%" }} />;
		} else {
			return (
				<React.Fragment>
					<Card className="card-accent-success">
						<CardHeader tag="h5">
							<i className="icon-globe"></i> FieldFx Reports Data Table
							<div className="card-header-actions">
								{/* <Button color="success" size="sm" onClick={e => this.reload(e)}>
									<i className="fa fa-refresh"></i> Reload
								</Button> */}
							</div>
						</CardHeader>
						<CardBody>
							<Nav tabs>
								<NavItem>
									<NavLink
										active={this.state.activeTab[0] === "1"}
										onClick={() => {
											this.toggle(0, "1");
										}}
									>
										Today's Games
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink
										active={this.state.activeTab[0] === "2"}
										onClick={() => {
											this.toggle(0, "2");
										}}
									>
										All Games
									</NavLink>
								</NavItem>
							</Nav>
							<TabContent activeTab={this.state.activeTab[0]}>{this.tabPane()}</TabContent>
						</CardBody>
					</Card>

					{/* Edit Modal */}
					<div>
						{this.state.isEditing ? (
							<Modal color="success" isOpen={this.state.editModal}>
								<ModalHeader style={{ backgroundColor: "#ffc107", color: "Black" }}>
									<i className="fa fa-pencil"></i> Edit FieldFx Report
								</ModalHeader>
								<ModalBody>
									<img src={spinner} height="150" width="150" alt="spinner" align="center" style={{ height: "100%" }} />
								</ModalBody>
							</Modal>
						) : (
							// <Modal size="lg" style={{maxWidth: '1600px', width: '80%'}} color="success" isOpen={this.state.editModal}>
							<Modal size="lg" color="success" isOpen={this.state.editModal}>
								<Form onSubmit={e => this.submitEdit(e)}>
									<ModalHeader style={{ backgroundColor: "#ffc107", color: "Black" }} toggle={this.hideEdit}>
										<i className="fa fa-pencil"></i> Edit FieldFx Report
									</ModalHeader>
									<ModalBody>
										<Row>
											<Col>
												<FormGroup>
													<Label htmlFor="venue">Venue</Label>
													<Input
														type="select"
														name="venue"
														id="venue"
														onChange={e => this.changeEditData(e)}
														required
														value={this.state.editData.venue}
													>
														{this.state.venues.map((venue, idx) => {
															return <option key={idx}>{venue.name}</option>;
														})}
													</Input>
												</FormGroup>
												<FormGroup>
													<Label htmlFor="operator">Operator</Label>
													<Input
														type="select"
														name="operator"
														id="operator"
														onChange={e => this.changeEditData(e)}
														required
														value={this.state.editData.operator}
													>
														{this.state.operators.map((op, idx) => {
															return <option key={idx}>{op.name}</option>;
														})}
													</Input>
												</FormGroup>
												<FormGroup>
													<Label htmlFor="support">Support</Label>
													<Input
														value={this.state.editData.support}
														onChange={e => this.changeEditData(e)}
														type="select"
														name="support"
														id="support"
														required
													>
														{this.state.support.map((support, idx) => {
															return <option key={idx}>{support.name}</option>;
														})}
													</Input>
												</FormGroup>

												<FormGroup>
													<Label htmlFor="gameID">Game ID</Label>
													<Input
														onChange={e => this.changeEditData(e)}
														type="text"
														className="form-control-warning"
														id="gameID"
														name="gameID"
														defaultValue={this.state.editData.gameID}
														required
													/>
												</FormGroup>
											</Col>
											<Col>
												<FormGroup>
													<Label htmlFor="date">Date</Label>
													<Input
														id="date"
														type="date"
														name="date"
														onChange={e => this.changeEditData(e)}
														required
														defaultValue={this.getEditDate(this.state.editData.date)}
													></Input>
												</FormGroup>
												<FormGroup>
													<Label htmlFor="logIn">
														Log In <Badge>Eastern Time</Badge>
													</Label>
													<Input
														defaultValue={this.state.editData.logIn}
														onChange={e => this.changeEditData(e)}
														id="logIn"
														type="time"
														name="logIn"
														required
													></Input>
												</FormGroup>
												<FormGroup>
													<Label htmlFor="firstPitch">
														First Pitch <Badge>Eastern Time</Badge>
													</Label>
													<Input
														defaultValue={this.state.editData.firstPitch}
														onChange={e => this.changeEditData(e)}
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
													<Input
														defaultValue={this.state.editData.logOut}
														onChange={e => this.changeEditData(e)}
														id="logOut"
														type="time"
														name="logOut"
														required
													></Input>
												</FormGroup>
											</Col>
										</Row>
										<Row>
											<Col>
												<FormGroup>
													<Label htmlFor="ipCamIssues">IPCamRelay Issues?</Label>
													<Input
														onChange={e => this.changeEditData(e)}
														value={this.state.editData.ipCamIssues}
														type="textarea"
														name="ipCamIssues"
														id="ipCamIssues"
													></Input>
												</FormGroup>
												<FormGroup>
													<Label htmlFor="fgdIssues">Foreground Detector Issues?</Label>
													<Input
														value={this.state.editData.fgdIssues}
														onChange={e => this.changeEditData(e)}
														type="textarea"
														name="fgdIssues"
														id="fgdIssues"
													></Input>
												</FormGroup>
												<FormGroup>
													<Label htmlFor="resolverIssues">Resolver Issues?</Label>
													<Input
														onChange={e => this.changeEditData(e)}
														value={this.state.editData.resolverIssues}
														type="textarea"
														name="resolverIssues"
														id="resolverIssues"
													></Input>
												</FormGroup>
												<FormGroup>
													<Label htmlFor="hardwareIssues">Hardware Issues?</Label>
													<Input
														value={this.state.editData.hardwareIssues}
														onChange={e => this.changeEditData(e)}
														type="textarea"
														name="hardwareIssues"
														id="hardwareIssues"
													></Input>
												</FormGroup>
												<FormGroup>
													<Label htmlFor="miscNotes">Misc Notes</Label>
													<Input
														value={this.state.editData.miscNotes}
														onChange={e => this.changeEditData(e)}
														type="textarea"
														name="miscNotes"
														id="miscNotes"
													></Input>
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
															value={this.state.editData.supportNotes}
															type="textarea"
															onChange={e => this.changeEditData(e)}
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
															defaultValue={this.state.editData.bisonSet}
															onChange={e => this.changeEditData(e)}
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
														<Input
															value={this.state.editData.backupTask}
															onChange={e => this.changeEditData(e)}
															type="select"
															name="backupTask"
															id="backupTask"
														>
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
													<Label  htmlFor="backupNotes">
														Backup Notes
													</Label>
													{this.props.permission === "support" ? (
														<Input
															defaultValue={this.state.editData.backupNote}
															onChange={e => this.changeEditData(e)}
															type="text"
															name="backupNotes"
															id="backupNotes"
														/>
													) : (
														<Input disabled type="text" name="backupNotes" id="backupNotes" />
													)}
												</FormGroup>
												{/* <img src={lgLogo} alt="SMT Logo"></img> */}
											</Col>
										</Row>
									</ModalBody>
									<ModalFooter>
										<Button color="success" type="submit" value="Add Venue" className="px-4">
											Update
										</Button>
										<Button color="secondary" onClick={this.hideEdit}>
											Cancel
										</Button>
									</ModalFooter>
								</Form>
							</Modal>
						)}
					</div>

					{/* Delete Modal */}
					<div>
						{this.state.isDeleting ? (
							<Modal color="success" isOpen={this.state.deleteModal}>
								<ModalHeader style={{ backgroundColor: "#f86c6b", color: "Black" }}>
									<i className="fa fa-warning"></i> Delete FieldFx Report
								</ModalHeader>
								<ModalBody>
									<img src={spinner} height="150" width="150" alt="spinner" align="center" style={{ height: "100%" }} />
								</ModalBody>
							</Modal>
						) : (
							<Modal color="success" isOpen={this.state.deleteModal}>
								<Form onSubmit={e => this.submitDelete(e)}>
									<ModalHeader style={{ backgroundColor: "#f86c6b", color: "Black" }} toggle={this.hideDelete}>
										<i className="fa fa-warning"></i> Delete FieldFx Report
									</ModalHeader>
									<ModalBody>
										<Row>
											<Col>
												<FormGroup>
													<Label htmlFor="name">
														Are you sure you want to delete {this.state.deleteData.gameID}'s report?
													</Label>
												</FormGroup>
											</Col>
										</Row>
									</ModalBody>
									<ModalFooter>
										<Button color="danger" type="submit" value="Add Venue" className="px-4">
											Delete
										</Button>
										<Button color="secondary" onClick={this.hideDelete}>
											Cancel
										</Button>
									</ModalFooter>
								</Form>
							</Modal>
						)}
					</div>
				</React.Fragment>
			);
		}
	}
}

export default FFxTechData;