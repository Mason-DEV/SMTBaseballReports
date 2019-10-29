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
	Button,
	Row,
	Table,
	Pagination,
	PaginationLink,
	PaginationItem
} from "reactstrap";
import axios from "axios";
import spinner from "../../assests/images/smtSpinner.gif";
import logger from "../../components/helpers/logger";

class Venue extends Component {
	constructor(props) {
		super(props);
		this.showEdit = this.showEdit.bind(this);
		this.hideEdit = this.hideEdit.bind(this);
		this.submitEdit = this.submitEdit.bind(this);
		this.changeEditData = this.changeEditData.bind(this);

		this.showAdd = this.showAdd.bind(this);
		this.hideAdd = this.hideAdd.bind(this);
		this.changeAddData = this.changeAddData.bind(this);
		this.submitAdd = this.submitAdd.bind(this);

		this.showDelete = this.showDelete.bind(this);
		this.hideDelete = this.hideDelete.bind(this);
		this.submitDelete = this.submitDelete.bind(this);

		//Sets the amount of venues on a single page
		this.pageSize = 15;

		this.state = {
			currentPage: 0,
			pagesCount: 0,
			addModal: false,
			editModal: false,
			deleteModal: false,
			isEditing: false,
			isAdding: false,
			isDeleting: false,
			isLoading: true,
			needToReload: false,
			venueData: {},
			editData: { roles: {} },
			addData: { roles: {} },
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

	//#region Add Functions
	showAdd() {
		this.setState({
			addModal: !this.state.addModal
		});
		this.removeBlur();
	}

	hideAdd() {
		this.setState({
			addModal: !this.state.addModal,
			addData: { roles: {} },
			needToReload: false
		});
	}
	changeAddData(e) {
		this.setState({
			addData: { ...this.state.addData, [e.target.name]: e.target.value }
		});
	}

	submitAdd(e) {
		e.preventDefault();
		this.setState({ isAdding: true });
		const venueToAdd = {
			name: this.state.addData.name,
			fieldFx: this.state.addData.fieldFx ? true : false,
			pitchFx: this.state.addData.pitchFx ? true : false
		};
		axios
			.post("/api/venue/create/", venueToAdd)
			.then(adding => {
				this.setState({ isAdding: false, needToReload: true });
			})
			.catch(error => {
				this.setState({ isAdding: false });
				logger("error", "Venue Add === " + error);
			});
		this.hideAdd();
	}
	//#endregion Add Functions

	//#region Edit Functions
	hideEdit() {
		this.setState({
			editModal: !this.state.editModal,
			editData: { roles: {} },
			needToReload: false
		});
	}
	changeEditData(e) {
		this.setState({
			editData: { ...this.state.editData, [e.target.name]: e.target.checked }
		});
	}
	showEdit(id) {
		axios
			.get("/api/venue/venueByID", {
				headers: { ID: id }
			})
			.then(res => {
				this.setState({ editData: res.data });
			})
			.catch(function(error) {
				logger("error", "Venue Show edit === " + error);
			});

		this.setState({
			editModal: !this.state.editModal
		});
		this.removeBlur();
	}
	submitEdit(e) {
		e.preventDefault();
		this.setState({ isEditing: true });
		axios
			.put("/api/venue/update/" + this.state.editData._id, this.state.editData)
			.then(editing => {
				this.setState({ isEditing: false, needToReload: true });
			})
			.catch(error => {
				this.setState({ isEditing: false });
				logger("error", "Venue Submit === " + error);
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
			deleteData: { _id: id, name }
		});
		this.removeBlur();
	}
	submitDelete(e) {
		e.preventDefault();
		this.setState({ isDeleting: true });
		axios
			.delete("/api/venue/delete/", {
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
		//Axios api call to get all venueData
		axios
			.get("/api/venue/")
			.then(res => {
				this.setState({ venueData: res.data });
			})
			//Data is loaded, so change from loading state
			.then(isLoading =>
				this.setState({ isLoading: false, pagesCount: Math.ceil(this.state.venueData.length / this.pageSize) })
			)
			.catch(function(error) {
				logger("error", error);
			});
	}

	componentDidUpdate() {
		//Checking if we need to make an Axios api call to get all venueData
		if (this.state.needToReload === true) {
			axios
				.get("/api/venue/")
				.then(res => {
					this.setState({
						venueData: res.data,
						needToReload: false,
						pagesCount: Math.ceil(this.state.venueData.length / this.pageSize)
					});
				})
				.catch(function(error) {
					logger("error", error);
				});
			this.setState({ needToReload: false });
		}
	}

	removeBlur() {
		let el = document.querySelector(":focus");
		if (el) el.blur();
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
							<i className="icon-location-pin"></i>Venue Management
							<div className="card-header-actions">
								<Button color="success" size="sm" onClick={this.showAdd}>
									<i className="fa fa-plus"></i> New Venue
								</Button>
							</div>
						</CardHeader>
						<CardBody>
							<Table bordered striped responsive size="sm">
								<thead>
									<tr>
										<th width="">Actions</th>
										<th width="">Name</th>
										<th width="">Types</th>
									</tr>
								</thead>
								<tbody>
									{this.state.venueData
										.slice(currentPage * this.pageSize, (currentPage + 1) * this.pageSize)
										.map((venue, i) => {
											return (
												<tr key={i}>
													<td>
														<Button onClick={e => this.showEdit(venue._id)} color="warning" size="sm">
															Edit
														</Button>{" "}
														<Button onClick={e => this.showDelete(venue._id, venue.name)} color="danger" size="sm">
															Delete
														</Button>
													</td>
													<td>{venue.name}</td>
													<td>
														{venue.fieldFx ? <Badge color="info">Field Fx</Badge> : null}{" "}
														{venue.pitchFx ? <Badge color="secondary">Pitch Fx</Badge> : null}
													</td>
												</tr>
											);
										})}
								</tbody>
							</Table>
						</CardBody>
						<CardFooter>
							<Pagination className="text-center">
								<PaginationItem disabled={currentPage <= 0}>
									<PaginationLink onClick={e => this.handleClick(e, 0)} first href="#" />
								</PaginationItem>
								<PaginationItem disabled={currentPage <= 0}>
									<PaginationLink onClick={e => this.handleClick(e, currentPage - 1)} previous href="#" />
								</PaginationItem>

								{[...Array(this.state.pagesCount)].map((page, i) => (
									<PaginationItem active={i === currentPage} key={i}>
										<PaginationLink onClick={e => this.handleClick(e, i)} href="#">
											{i + 1}
										</PaginationLink>
									</PaginationItem>
								))}
								<PaginationItem disabled={currentPage >= this.state.pagesCount - 1}>
									<PaginationLink onClick={e => this.handleClick(e, currentPage + 1)} next href="#" />
								</PaginationItem>
								<PaginationItem disabled={currentPage >= this.state.pagesCount - 1}>
									<PaginationLink onClick={e => this.handleClick(e, this.state.pagesCount - 1)} last href="#" />
								</PaginationItem>
							</Pagination>
						</CardFooter>
					</Card>

					{/* Add Modal */}
					<div>
						{this.state.isAdding ? (
							<Modal color="success" isOpen={this.state.addModal}>
								<ModalHeader style={{ backgroundColor: "#3EA662", color: "white" }} toggle={this.hideAdd}>
									<i className="fa fa-pencil"></i> Add New Venue
								</ModalHeader>
								<ModalBody>
									<img src={spinner} height="150" width="150" alt="spinner" align="center" style={{ height: "100%" }} />
								</ModalBody>
							</Modal>
						) : (
							<Modal color="success" isOpen={this.state.addModal}>
								<Form onSubmit={e => this.submitAdd(e)}>
									<ModalHeader style={{ backgroundColor: "#3EA662", color: "white" }} toggle={this.hideAdd}>
										<i className="fa fa-pencil"></i> Add New Venue
									</ModalHeader>
									<ModalBody>
										<Row>
											<Col>
												<FormGroup>
													<Label htmlFor="name">Venue Name</Label>
													<Input
														type="text"
														name="name"
														id="name"
														onChange={e => this.changeAddData(e)}
														required
													></Input>
												</FormGroup>
												<FormGroup>
													<Label htmlFor="type">Type</Label>
													<Container
														style={{
															border: "1px solid #e4e7ea",
															borderRadius: "0.25rem"
														}}
													>
														<CustomInput
															type="checkbox"
															id="fieldFxCustomCheckbox"
															label="FieldFx"
															name="fieldFx"
															onClick={e => this.changeAddData(e)}
														/>
														<CustomInput
															type="checkbox"
															id="pitchFxCustomCheckbox"
															label="PitchFx"
															name="pitchFx"
															onClick={e => this.changeAddData(e)}
														/>
													</Container>
												</FormGroup>
											</Col>
										</Row>
									</ModalBody>
									<ModalFooter>
										<Button color="success" type="submit" value="Add Venue" className="px-4">
											Add
										</Button>
										<Button color="secondary" onClick={this.hideAdd}>
											Cancel
										</Button>
									</ModalFooter>
								</Form>
							</Modal>
						)}
					</div>

					{/* Edit Modal */}
					<div>
						{this.state.isEditing ? (
							<Modal color="success" isOpen={this.state.editModal}>
								<ModalHeader style={{ backgroundColor: "#ffc107", color: "Black" }}>
									<i className="fa fa-pencil"></i> Edit Venue
								</ModalHeader>
								<ModalBody>
									<img src={spinner} height="150" width="150" alt="spinner" align="center" style={{ height: "100%" }} />
								</ModalBody>
							</Modal>
						) : (
							<Modal color="success" isOpen={this.state.editModal}>
								<Form onSubmit={e => this.submitEdit(e)}>
									<ModalHeader style={{ backgroundColor: "#ffc107", color: "Black" }} toggle={this.hideEdit}>
										<i className="fa fa-pencil"></i> Edit Venue
									</ModalHeader>
									<ModalBody>
										<Row>
											<Col>
												<FormGroup>
													<Label htmlFor="naame">Venue Name</Label>
													<Input
														type="text"
														name="name"
														id="name"
														defaultValue={this.state.editData.name ? this.state.editData.name : ""}
														onChange={e => this.changeEditData(e)}
														required
													></Input>
												</FormGroup>
												<FormGroup>
													<Label htmlFor="types">Types</Label>
													<Container
														style={{
															border: "1px solid #e4e7ea",
															borderRadius: "0.25rem"
														}}
													>
														<CustomInput
															type="checkbox"
															id="fieldFxCustomCheckbox"
															label="FieldFx"
															name="fieldFx"
															defaultChecked={this.state.editData.fieldFx}
															onClick={e => this.changeEditData(e)}
														/>
														<CustomInput
															type="checkbox"
															id="pitchFxCustomCheckbox"
															label="PitchFx"
															name="pitchFx"
															defaultChecked={this.state.editData.pitchFx}
															onClick={e => this.changeEditData(e)}
														/>
													</Container>
												</FormGroup>
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
									<i className="fa fa-warning"></i> Delete Venue
								</ModalHeader>
								<ModalBody>
									<img src={spinner} height="150" width="150" alt="spinner" align="center" style={{ height: "100%" }} />
								</ModalBody>
							</Modal>
						) : (
							<Modal color="success" isOpen={this.state.deleteModal}>
								<Form onSubmit={e => this.submitDelete(e)}>
									<ModalHeader style={{ backgroundColor: "#f86c6b", color: "Black" }} toggle={this.hideDelete}>
										<i className="fa fa-warning"></i> Delete Venue
									</ModalHeader>
									<ModalBody>
										<Row>
											<Col>
												<FormGroup>
													<Label htmlFor="naame">Are you sure you want to delete {this.state.deleteData.name}?</Label>
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
export default Venue;
