import React, { Component } from "react";
import axios from "axios";
import spinner from "../../assests/images/smtSpinner.gif";
import logger from "../../components/helpers/logger";
import {getJwt} from "../../components/helpers/jwt";
import {
	Badge,
	Card,
	CardBody,
	CardHeader,
	CardFooter,
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
	Pagination,
	PaginationLink,
	PaginationItem
} from "reactstrap";
import APIHelper from "../../components/helpers/APIHelper";
import _ from "lodash";

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

		//Sets the amount of data on a single page
		this.pageSize = 15;

		this.state = {
			currentPage: 0,
			pagesCountToday: 0,
			pagesCountAll: 0,
			isLoading: true,
			activeTab: new Array(3).fill("1"),
			venues: {},
			operators: {},
			support: {},
			sortedBy: "",
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

	//Click handler for pagniation
	handleClick(e, index) {
		e.preventDefault();

		this.setState({
			currentPage: index
		});
	}

	toggle(tabPane, tab) {
		const newArray = this.state.activeTab.slice();
		newArray[tabPane] = tab;
		this.setState({
			activeTab: newArray,
			currentPage: 0
		});
	}

	removeBlur() {
		let el = document.querySelector(":focus");
		if (el) el.blur();
	}

	sortTableAll(e, who) {
	const sortData = this.state.allGameData;
	//Check if we are already sorted by this metric, if so, just flip the sort
		if (who === this.state.sortedBy) {
			this.setState({
				allGameData: _.reverse(sortData),
				sortedBy: who
			});
		} else {
			this.setState({
				allGameData: _.sortBy(sortData, [
					function(o) {
						return o[who];
					}
				]),
				sortedBy: who
			});
		}
	}	
	sortTableToday(e, who) {
	const sortData = this.state.todayGameData;
	//Check if we are already sorted by this metric, if so, just flip the sort
		if (who === this.state.sortedBy) {
			this.setState({
				todayGameData: _.reverse(sortData),
				sortedBy: who
			});
		} else {
			this.setState({
				todayGameData: _.sortBy(sortData, [
					function(o) {
						return o[who];
					}
				]),
				sortedBy: who
			});
		}
	}	

	tabPane() {
		const { currentPage } = this.state;
		return (
			<>
				<TabPane tabId="1">
					<Table bordered striped responsive size="sm">
						<thead>
							<tr>
								<th width="">Actions</th>
								<th style={{ cursor: "pointer" }} onClick={e => this.sortTableToday(e, "date")} width="">
									Date
								</th>
								<th style={{ cursor: "pointer" }} onClick={e => this.sortTableToday(e, "gameID")} width="">
									Gamestring
								</th>
								<th style={{ cursor: "pointer" }} onClick={e => this.sortTableToday(e, "gameStatus")} width="">
									Game Status
								</th>
								<th style={{ cursor: "pointer" }} onClick={e => this.sortTableToday(e, "venue")} width="">
									Venue
								</th>
								<th style={{ cursor: "pointer" }} onClick={e => this.sortTableToday(e, "operator")} width="">
									Operator
								</th>
								<th width="">
									Support Notes
								</th>
								<th style={{ cursor: "pointer" }} onClick={e => this.sortTableToday(e, "backupTask")} width="">
									Backup Task
								</th>
							</tr>
						</thead>
						<tbody>
							{this.state.todayGameData
								.slice(currentPage * this.pageSize, (currentPage + 1) * this.pageSize)
								.map((data, i) => {
									return (
										<tr key={i}>
											<td style={{ maxWidth: "300px" }}>
												<Button onClick={e => this.showEdit(data._id)} color="warning" size="sm">
													Edit
												</Button>{" "}
												<Button onClick={e => this.showDelete(data._id, data.gameID)} color="danger" size="sm">
													Delete
												</Button>
											</td>
											<td style={{ maxWidth: "300px", minWidth: "100px" }}>{data.date.substr(0, 10)}</td>
											<td>{data.gameID}</td>
											<td>{data.gameStatus}</td>
											<td>{data.venue}</td>
											<td>{data.operator}</td>
											<td style={{ maxWidth: "300px", minWidth: "150px", wordWrap: "break-word" }}>
												{data.supportNotes}
											</td>
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
									<th style={{ cursor: "pointer" }} onClick={e => this.sortTableAll(e, "date")} width="">
										Date
									</th>
									<th style={{ cursor: "pointer" }} onClick={e => this.sortTableAll(e, "gameID")} width="">
										Gamestring
									</th>
									<th style={{ cursor: "pointer" }} onClick={e => this.sortTableAll(e, "gameStatus")} width="">
										Game Status
									</th>
									<th style={{ cursor: "pointer" }} onClick={e => this.sortTableAll(e, "venue")} width="">
										Venue
									</th>
									<th style={{ cursor: "pointer" }} onClick={e => this.sortTableAll(e, "operator")} width="">
										Operator
									</th>
									<th width="">
										Support Notes
									</th>
									<th style={{ cursor: "pointer" }} onClick={e => this.sortTableAll(e, "backupTask")} width="">
										Backup Task
									</th>
								</tr>
							</thead>
							<tbody>
								{this.state.allGameData
									.slice(currentPage * this.pageSize, (currentPage + 1) * this.pageSize)
									.map((data, i) => {
										return (
											<tr key={i}>
												<td style={{ maxWidth: "300px" }}>
													<Button onClick={e => this.showEdit(data._id)} color="warning" size="sm">
														Edit
													</Button>{" "}
													<Button onClick={e => this.showDelete(data._id)} color="danger" size="sm">
														Delete
													</Button>
												</td>
												<td style={{ maxWidth: "300px", minWidth: "100px" }}>{data.date.substr(0, 10)}</td>
												<td>{data.gameID}</td>
												<td>{data.gameStatus}</td>
												<td>{data.venue}</td>
												<td>{data.operator}</td>
												<td style={{ maxWidth: "300px", minWidth: "150px", wordWrap: "break-word" }}>
													{data.supportNotes}
												</td>
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
			.get(APIHelper.getFFxTechReportByIDAPI, {
				headers: { ID: id, Authorization: `Bearer ${getJwt()}` }
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
			bitMode: this.state.editData.bitMode,
			gameStatus: this.state.editData.gameStatus,
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
			.put(APIHelper.updateFFxTechReportAPI + this.state.editData._id, editedReport,  { headers: { Authorization: `Bearer ${getJwt()}` } })
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
			.delete(APIHelper.deleteFFxTechReportAPI, {
				headers: { ID: this.state.deleteData._id, Authorization: `Bearer ${getJwt()}` }
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
		Promise.all([
			axios.get(APIHelper.getFFxTechAPI,  { headers: { Authorization: `Bearer ${getJwt()}` } }),
			axios.get(APIHelper.getFFxTechTodayAPI,  { headers: { Authorization: `Bearer ${getJwt()}` } }),
			axios.get(APIHelper.getFFxStaffAPI,  { headers: { Authorization: `Bearer ${getJwt()}` } }),
			axios.get(APIHelper.getSupportStaffAPI,  { headers: { Authorization: `Bearer ${getJwt()}` } }),
			axios.get(APIHelper.getFFxVenuesAPI,  { headers: { Authorization: `Bearer ${getJwt()}` } })
		])
			.then(([allResponse, todayResponse, opResponse, supportResponse, venueResponse]) => {
				const all = allResponse.data;
				const today = todayResponse.data;
				const ops = opResponse.data.map(obj => ({ name: obj.name }));
				const support = supportResponse.data.map(obj => ({ name: obj.name }));
				const venues = venueResponse.data.map(obj => ({ name: obj.name }));
				this.setState({ allGameData: all, todayGameData: today, operators: ops, support, venues });
			})
			.then(isLoading =>
				this.setState({
					isLoading: false,
					pagesCountToday: Math.ceil(this.state.todayGameData.length / this.pageSize),
					pagesCountAll: Math.ceil(this.state.allGameData.length / this.pageSize)
				})
			);
	}

	componentDidUpdate() {
		if (this.state.needToReload === true) {
			Promise.all([
				axios.get(APIHelper.getFFxTechAPI,  { headers: { Authorization: `Bearer ${getJwt()}` } }),
				axios.get(APIHelper.getFFxTechTodayAPI,  { headers: { Authorization: `Bearer ${getJwt()}` } }),
				axios.get(APIHelper.getFFxStaffAPI,  { headers: { Authorization: `Bearer ${getJwt()}` } }),
				axios.get(APIHelper.getFFxVenuesAPI,  { headers: { Authorization: `Bearer ${getJwt()}` } })
			])
				.then(([allResponse, todayResponse, opResponse, venueResponse]) => {
					const all = allResponse.data;
					const today = todayResponse.data;
					const ops = opResponse.data.map(obj => ({ name: obj.name }));
					const venues = venueResponse.data.map(obj => ({ name: obj.name }));
					this.setState({ allGameData: all, todayGameData: today, operators: ops, venues });
				})
				.then(reloading =>
					this.setState({
						needToReload: false,
						pagesCountToday: Math.ceil(this.state.todayGameData.length / this.pageSize),
						pagesCountAll: Math.ceil(this.state.allGameData.length / this.pageSize)
					})
				);
		}
	}

	render() {
		const { currentPage } = this.state;
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
						<CardFooter>
							{/* Check for which page we are on  */}
							{this.state.activeTab[0] === "1" ? (
								<Pagination className="text-center">
									<PaginationItem disabled={currentPage <= 0}>
										<PaginationLink onClick={e => this.handleClick(e, 0)} first href="#" />
									</PaginationItem>
									<PaginationItem disabled={currentPage <= 0}>
										<PaginationLink onClick={e => this.handleClick(e, currentPage - 1)} previous href="#" />
									</PaginationItem>

									{[...Array(this.state.pagesCountToday)].map((page, i) => (
										<PaginationItem active={i === currentPage} key={i}>
											<PaginationLink onClick={e => this.handleClick(e, i)} href="#">
												{i + 1}
											</PaginationLink>
										</PaginationItem>
									))}
									<PaginationItem disabled={currentPage >= this.state.pagesCountToday - 1}>
										<PaginationLink onClick={e => this.handleClick(e, currentPage + 1)} next href="#" />
									</PaginationItem>
									<PaginationItem disabled={currentPage >= this.state.pagesCountToday - 1}>
										<PaginationLink onClick={e => this.handleClick(e, this.state.pagesCountToday - 1)} last href="#" />
									</PaginationItem>
								</Pagination>
							) : (
								<Pagination className="text-center">
									<PaginationItem disabled={currentPage <= 0}>
										<PaginationLink onClick={e => this.handleClick(e, 0)} first href="#" />
									</PaginationItem>
									<PaginationItem disabled={currentPage <= 0}>
										<PaginationLink onClick={e => this.handleClick(e, currentPage - 1)} previous href="#" />
									</PaginationItem>

									{[...Array(this.state.pagesCountAll)].map((page, i) => (
										<PaginationItem active={i === currentPage} key={i}>
											<PaginationLink onClick={e => this.handleClick(e, i)} href="#">
												{i + 1}
											</PaginationLink>
										</PaginationItem>
									))}
									<PaginationItem disabled={currentPage >= this.state.pagesCountAll - 1}>
										<PaginationLink onClick={e => this.handleClick(e, currentPage + 1)} next href="#" />
									</PaginationItem>
									<PaginationItem disabled={currentPage >= this.state.pagesCountAll - 1}>
										<PaginationLink onClick={e => this.handleClick(e, this.state.pagesCountAll - 1)} last href="#" />
									</PaginationItem>
								</Pagination>
							)}
						</CardFooter>
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
												<FormGroup>
													<Label htmlFor="bitMode">Bit Mode</Label>
													<Input
														value={this.state.editData.bitMode}
														onChange={e => this.changeEditData(e)}
														type="select"
														name="bitMode"
														id="bitMode"
													>
														<option key="-1"></option>
														<option>8-Bit (Day Game)</option>
														<option>12-Bit (Night Game)</option>
													</Input>
												</FormGroup>
												<FormGroup>
													<Label htmlFor="gameStatus">Game Status</Label>
													<Input
														value={this.state.editData.gameStatus}
														onChange={e => this.changeEditData(e)}
														type="select"
														name="gameStatus"
														id="gameStatus"
													>
														<option key="-1"></option>
														<option>Fully Resolved</option>
														<option>90% Resolved</option>
														<option>80% Resolved</option>
														<option>70% Resolved</option>
														<option>60% Resolved</option>
														<option>50% Resolved</option>
														<option>Recorded Only</option>
													</Input>
												</FormGroup>
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
												<Label>
													{this.props.permission.ffxTechDataPermission ? (
														<h5 style={{ color: "red" }}>Support Section</h5>
													) : (
														<h5 style={{ color: "red" }}>Support Section - Not accessible via OP login</h5>
													)}
												</Label>
												<FormGroup>
													<Label htmlFor="supportNotes">Support Notes</Label>
													{this.props.permission.ffxTechDataPermission ? (
														<Input
															style={{ height: 100 }}
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
													{this.props.permission.ffxTechDataPermission ? (
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
													{this.props.permission.ffxTechDataPermission ? (
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
													<Label htmlFor="backupNotes">Backup Notes</Label>
													{this.props.permission.ffxTechDataPermission ? (
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
