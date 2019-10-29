import React, { Component } from "react";
import {
	Badge,
	Card,
	CardBody,
	CardHeader,
	CardFooter,
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
	Pagination,
	PaginationLink,
	PaginationItem
} from "reactstrap";
import axios from "axios";
import spinner from "../../assests/images/smtSpinner.gif";
import logger from "../../components/helpers/logger";
import EditTable from "./EditTable";

class PFxTechData extends Component {
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

		//Sets the amount of staff on a single page
		this.pageSize = 1;

		this.state = {
			currentPage: 0,
			pagesCountToday: 0,
			pagesCountAll: 0,
			isLoading: true,
			allGameData: {},
			todayGameData: {},
			activeTab: new Array(3).fill("1"),
			editModal: false,
			deleteModal: false,
			isAdding: false,
			isDeleting: false,
			needToReload: false,
			editData: {},
			deleteData: {},
			venues: {},
			operators: {}
		};
	}

	//Click handler for pagniation
	handleClick(e, index) {
		e.preventDefault();

		this.setState({
			currentPage: index
		});
	}

	removeBlur() {
		let el = document.querySelector(":focus");
		if (el) el.blur();
	}

	callbackFunction = childData => {
		this.setState({ editData: { ...this.state.editData, corrections: childData } });
	};

	//#region Edit Functions
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
			.get("/api/pfxTech/pfxReportByID", {
				headers: { ID: id }
			})
			.then(res => {
				this.setState({ editData: res.data });
			})
			.catch(function(error) {
				logger("error", "PfxReport Show edit === " + error);
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
			date: this.state.editData.date,
			logIn: this.state.editData.logIn,
			logOut: this.state.editData.logOut,
			firstPitch: this.state.editData.firstPitch,
			hwswIssues: this.state.editData.hwswIssues,
			t1Notes: this.state.editData.t1Notes,
			corrections: this.state.editData.corrections[0]
		};
		this.setState({ isEditing: true });
		axios
			.put("/api/pfxTech/update/" + this.state.editData._id, editedReport)
			.then(editing => {
				this.setState({ isEditing: false, needToReload: true });
			})
			.catch(error => {
				this.setState({ isEditing: false });
				logger("error", "PfxTech Submit === " + error);
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

	showDelete(id, name) {
		this.setState({
			deleteModal: !this.state.deleteModal,
			deleteData: { _id: id }
		});
		this.removeBlur();
	}
	submitDelete(e) {
		e.preventDefault();
		this.setState({ isDeleting: true });
		axios
			.delete("/api/PFxTech/delete/", {
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

	toggle(tabPane, tab) {
		const newArray = this.state.activeTab.slice();
		newArray[tabPane] = tab;
		this.setState({
			activeTab: newArray,
			currentPage: 0
		});
	}

	getEditDate(date) {
		if (date) {
			const editDate = date.substr(0, 10);
			return editDate;
		}
		return date;
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
								<th width="">Date</th>
								<th width="">Venue</th>
								<th width="">Operator</th>
								<th width="">HW/SW Issues</th>
								<th width="">T1 Notes</th>
							</tr>
						</thead>
						<tbody>
							{this.state.todayGameData
							.slice(currentPage * this.pageSize, (currentPage + 1) * this.pageSize)
							.map((data, i) => {
								return (
									<tr key={i}>
										<td>
											<Button onClick={e => this.showEdit(data._id)} color="warning" size="sm">
												Edit
											</Button>{" "}
											<Button onClick={e => this.showDelete(data._id, data.name)} color="danger" size="sm">
												Delete
											</Button>
										</td>
										<td>{data.date.substr(0, 10)}</td>
										<td>{data.venue}</td>
										<td>{data.operator}</td>
										<td>{data.hwswIssues}</td>
										<td>{data.t1Notes}</td>
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
									<th width="">Venue</th>
									<th width="">Operator</th>
									<th width="">HW/SW Issues</th>
									<th width="">T1 Notes</th>
								</tr>
							</thead>
							<tbody>
								{this.state.allGameData
								.slice(currentPage * this.pageSize, (currentPage + 1) * this.pageSize)
								.map((data, i) => {
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
											<td>{data.venue}</td>
											<td>{data.operator}</td>
											<td>{data.hwswIssues}</td>
											<td>{data.t1Notes}</td>
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

	componentDidMount() {
		// Axios api call to get all venueData
		Promise.all([
			axios.get("/api/PFxTech/"),
			axios.get("/api/PFxTech/today"),
			axios.get("/api/staff/operators"),
			axios.get("/api/venue/pitchFx")
		])
			.then(([allResponse, todayResponse, opResponse, venueResponse]) => {
				const all = allResponse.data;
				const today = todayResponse.data;
				const ops = opResponse.data.map(obj => ({ name: obj.name }));
				const venues = venueResponse.data.map(obj => ({ name: obj.name }));
				this.setState({ allGameData: all, todayGameData: today, operators: ops, venues });
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
		//Checking if we need to make an Axios api call to get all venueData
		if (this.state.needToReload === true) {
			Promise.all([
				axios.get("/api/PFxTech/"),
				axios.get("/api/PFxTech/today"),
				axios.get("/api/staff/operators"),
				axios.get("/api/venue/pitchFx")
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
							<i className="icon-globe"></i> PitchFx Reports Data Table
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
								{/* <NavItem>
									<NavLink
										active={this.state.activeTab[0] === "3"}
										onClick={() => {
											this.toggle(0, "3");
										}}
									>
										Select Date
									</NavLink>
								</NavItem> */}
							</Nav>
							<TabContent activeTab={this.state.activeTab[0]}>{this.tabPane()}</TabContent>
						</CardBody>
						<CardFooter>
							{/* Check for which page we are on  */}
							{this.state.activeTab[0]  === "1" ? (
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
									<i className="fa fa-pencil"></i> Edit PitchFx Report
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
										<i className="fa fa-pencil"></i> Edit PitchFx Report
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
													<Label htmlFor="date">Date</Label>
													<Input
														id="date"
														type="date"
														name="date"
														// defaultValue={this.state.editData.date}
														onChange={e => this.changeEditData(e)}
														required
														defaultValue={this.getEditDate(this.state.editData.date)}
													></Input>
												</FormGroup>

												<FormGroup>
													<Label htmlFor="hwswIssues">Hardware/Software Issues</Label>
													<Input
														id="hwswIssues"
														type="textarea"
														onChange={e => this.changeEditData(e)}
														value={this.state.editData.hwswIssues}
														name="hwswIssues"
													></Input>
												</FormGroup>
											</Col>
											<Col>
												<FormGroup>
													<Label htmlFor="login-time">
														Log In <Badge>Eastern Time</Badge>
													</Label>
													<Input
														id="login-time"
														type="time"
														name="logIn"
														defaultValue={this.state.editData.logIn}
														onChange={e => this.changeEditData(e)}
														required
													></Input>
												</FormGroup>
												<FormGroup>
													<Label htmlFor="first-pitch">
														First Pitch <Badge>Eastern Time</Badge>
													</Label>
													<Input
														id="first-pitch"
														type="time"
														name="firstPitch"
														defaultValue={this.state.editData.firstPitch}
														onChange={e => this.changeEditData(e)}
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
														defaultValue={this.state.editData.logOut}
														onChange={e => this.changeEditData(e)}
														required
													></Input>
												</FormGroup>
												<FormGroup>
													<Label htmlFor="t1Notes">T1 Notes</Label>
													<Input
														type="textarea"
														value={this.state.editData.t1Notes}
														onChange={e => this.changeEditData(e)}
														name="t1Notes"
														id="t1Notes"
													></Input>
												</FormGroup>
											</Col>
										</Row>
										<Col>
											<Label>
												<h5 style={{ color: "green" }}>Corrections/Changes Section</h5>
											</Label>
											<EditTable
												correctionData={this.state.editData.corrections}
												parentCallback={this.callbackFunction}
											/>
										</Col>
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
									<i className="fa fa-warning"></i> Delete PitchFx Report
								</ModalHeader>
								<ModalBody>
									<img src={spinner} height="150" width="150" alt="spinner" align="center" style={{ height: "100%" }} />
								</ModalBody>
							</Modal>
						) : (
							<Modal color="success" isOpen={this.state.deleteModal}>
								<Form onSubmit={e => this.submitDelete(e)}>
									<ModalHeader style={{ backgroundColor: "#f86c6b", color: "Black" }} toggle={this.hideDelete}>
										<i className="fa fa-warning"></i> Delete PitchFx Report
									</ModalHeader>
									<ModalBody>
										<Row>
											<Col>
												<FormGroup>
													<Label htmlFor="naame">Are you sure you want to delete this report?</Label>
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

export default PFxTechData;
