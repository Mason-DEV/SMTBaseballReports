import React, { Component } from "react";
import {
	Badge,
	Card,
	CardBody,
	CardFooter,
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
import {getJwt} from "../../components/helpers/jwt";
import APIHelper from "../../components/helpers/APIHelper";


class Staff extends Component {
	constructor(props) {
		super(props);
		this.showEdit = this.showEdit.bind(this);
		this.hideEdit = this.hideEdit.bind(this);
		this.submitEdit = this.submitEdit.bind(this);
		this.changeEditData = this.changeEditData.bind(this);
		this.changeEditDataRoles = this.changeEditDataRoles.bind(this);

		this.showAdd = this.showAdd.bind(this);
		this.hideAdd = this.hideAdd.bind(this);
		this.changeAddData = this.changeAddData.bind(this);
		this.changeAddDataRoles = this.changeAddDataRoles.bind(this);
		this.submitAdd = this.submitAdd.bind(this);

		this.showDelete = this.showDelete.bind(this);
		this.hideDelete = this.hideDelete.bind(this);
		this.submitDelete = this.submitDelete.bind(this);

		//Sets the amount of staff on a single page
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
			staffData: {},
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
	changeAddDataRoles(e) {
		this.setState({
			addData: {
				...this.state.addData,
				roles: {
					...this.state.addData.roles,
					[e.target.name]: e.target.checked
				}
			}
		});
	}
	submitAdd(e) {
		e.preventDefault();
		this.setState({ isAdding: true });
		const staffToAdd = {
			name: this.state.addData.name,
			email: this.state.addData.email,
			roles: {
				auditor: this.state.addData.roles.auditor ? true : false,
				pfxOperator: this.state.addData.roles.pfxOperator ? true : false,
				ffxOperator: this.state.addData.roles.ffxOperator ? true : false,
				support: this.state.addData.roles.support ? true : false
			}
		};
		axios
			.post(APIHelper.createStaffAPI, staffToAdd , { headers: { Authorization: `Bearer ${getJwt()}` } })
			.then(adding => {
				this.setState({ isAdding: false, needToReload: true });
			})
			.catch(error => {
				this.setState({ isAdding: false });
				logger("error", "Staff Add === " + error);
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
			editData: { ...this.state.editData, [e.target.name]: e.target.value }
		});
	}
	changeEditDataRoles(e) {
		this.setState({
			editData: {
				...this.state.editData,
				roles: {
					...this.state.editData.roles,
					[e.target.name]: e.target.checked
				}
			}
		});
	}
	showEdit(id) {
		axios
			.get(APIHelper.getStaffByIdAPI, {
				headers: { ID: id , Authorization: `Bearer ${getJwt()}` }
			})
			.then(res => {
				this.setState({ editData: res.data });
			})
			.catch(function(error) {
				logger("error", "Staff Show edit === " + error);
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
			.put(APIHelper.updateStaffAPI + this.state.editData._id, this.state.editData,  { headers: { Authorization: `Bearer ${getJwt()}` } })
			.then(editing => {
				this.setState({ isEditing: false, needToReload: true });
			})
			.catch(error => {
				this.setState({ isEditing: false });
				logger("error", "Staff Submit === " + error);
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
			.delete(APIHelper.deleteStaffAPI, {
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
		axios
			.get(APIHelper.getStaffAPI,  { headers: { Authorization: `Bearer ${getJwt()}` } })
			.then(res => {
				this.setState({ staffData: res.data });
			})
			//Data is loaded, so change from loading state
			.then(isLoading =>
				this.setState({ isLoading: false, pagesCount: Math.ceil(this.state.staffData.length / this.pageSize) })
			)
			.catch(function(error) {
				logger("error", error);
			});
	}

	componentDidUpdate() {
		if (this.state.needToReload === true) {
			axios
				.get(APIHelper.getStaffAPI,  { headers: { Authorization: `Bearer ${getJwt()}` } })
				.then(res => {
					this.setState({
						staffData: res.data,
						needToReload: false,
						pagesCount: Math.ceil(this.state.staffData.length / this.pageSize)
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
							<i className="fa fa-group"></i>Staff Management
							<div className="card-header-actions">
								<Button color="success" size="sm" onClick={this.showAdd}>
									<i className="fa fa-plus"></i> New Staff
								</Button>
							</div>
						</CardHeader>
						<CardBody>
							<Table bordered striped responsive size="sm">
								<thead>
									<tr>
										<th width="">Actions</th>
										<th width="">Name</th>
										<th width="">Email</th>
										<th width="">Roles</th>
									</tr>
								</thead>
								<tbody>
									{this.state.staffData
										.slice(currentPage * this.pageSize, (currentPage + 1) * this.pageSize)
										.map((staff, i) => {
											return (
												<tr key={i}>
													<td>
														<Button onClick={e => this.showEdit(staff._id)} color="warning" size="sm">
															Edit
														</Button>{" "}
														<Button onClick={e => this.showDelete(staff._id, staff.name)} color="danger" size="sm">
															Delete
														</Button>
													</td>
													<td>{staff.name}</td>
													<td>{staff.email}</td>
													<td>
														{staff.roles.auditor ? <Badge color="warning">Auditor</Badge> : null}{" "}
														{staff.roles.pfxOperator ? <Badge color="primary">Pfx Operator</Badge> : null}{" "}
														{staff.roles.ffxOperator ? <Badge color="info">FFx Operator</Badge> : null}{" "}
														{staff.roles.support ? <Badge color="danger">Support</Badge> : null}
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
									<i className="fa fa-pencil"></i> Add New Staff Member
								</ModalHeader>
								<ModalBody>
									<img src={spinner} height="150" width="150" alt="spinner" align="center" style={{ height: "100%" }} />
								</ModalBody>
							</Modal>
						) : (
							<Modal color="success" isOpen={this.state.addModal}>
								<Form onSubmit={e => this.submitAdd(e)}>
									<ModalHeader style={{ backgroundColor: "#3EA662", color: "white" }} toggle={this.hideAdd}>
										<i className="fa fa-pencil"></i> Add New Staff Member
									</ModalHeader>
									<ModalBody>
										<Row>
											<Col>
												<FormGroup>
													<Label htmlFor="naame">Full Name</Label>
													<Input
														type="text"
														name="name"
														id="name"
														onChange={e => this.changeAddData(e)}
														required
													></Input>
												</FormGroup>
												<FormGroup>
													<Label htmlFor="email">Email</Label>
													<Input
														required
														id="email"
														type="email"
														name="email"
														onChange={e => this.changeAddData(e)}
													></Input>
												</FormGroup>
												<FormGroup>
													<Label htmlFor="roles">Roles</Label>
													<Container
														style={{
															border: "1px solid #e4e7ea",
															borderRadius: "0.25rem"
														}}
													>
														<CustomInput
															type="checkbox"
															id="auditorCustomCheckbox"
															label="Auditor"
															name="auditor"
															onClick={e => this.changeAddDataRoles(e)}
														/>
														<CustomInput
															type="checkbox"
															id="pfxoperatorCustomCheckbox"
															label="PFX Operator"
															name="pfxOperator"
															onClick={e => this.changeAddDataRoles(e)}
														/>
														<CustomInput
															type="checkbox"
															id="ffperatorCustomCheckbox"
															label="FFx Operator"
															name="ffxOperator"
															onClick={e => this.changeAddDataRoles(e)}
														/>
														<CustomInput
															type="checkbox"
															id="supportCustomCheckbox"
															label="Support"
															name="support"
															onClick={e => this.changeAddDataRoles(e)}
														/>
													</Container>
												</FormGroup>
											</Col>
										</Row>
									</ModalBody>
									<ModalFooter>
										<Button color="success" type="submit" value="Add Staff" className="px-4">
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
									<i className="fa fa-pencil"></i> Edit Staff Member
								</ModalHeader>
								<ModalBody>
									<img src={spinner} height="150" width="150" alt="spinner" align="center" style={{ height: "100%" }} />
								</ModalBody>
							</Modal>
						) : (
							<Modal color="success" isOpen={this.state.editModal}>
								<Form onSubmit={e => this.submitEdit(e)}>
									<ModalHeader style={{ backgroundColor: "#ffc107", color: "Black" }} toggle={this.hideEdit}>
										<i className="fa fa-pencil"></i> Edit Staff Member
									</ModalHeader>
									<ModalBody>
										<Row>
											<Col>
												<FormGroup>
													<Label htmlFor="naame">Full Name</Label>
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
													<Label htmlFor="email">Email</Label>
													<Input
														id="email"
														type="email"
														name="email"
														defaultValue={this.state.editData.email ? this.state.editData.email : ""}
														onChange={e => this.changeEditData(e)}
													></Input>
												</FormGroup>
												<FormGroup>
													<Label htmlFor="roles">Roles</Label>
													<Container
														style={{
															border: "1px solid #e4e7ea",
															borderRadius: "0.25rem"
														}}
													>
														<CustomInput
															type="checkbox"
															id="auditorCustomCheckbox"
															label="Auditor"
															name="auditor"
															defaultChecked={this.state.editData.roles.auditor}
															onClick={e => this.changeEditDataRoles(e)}
														/>
														<CustomInput
															type="checkbox"
															id="pfxoperatorCustomCheckbox"
															label="PFx Operator"
															name="pfxOperator"
															defaultChecked={this.state.editData.roles.pfxOperator}
															onClick={e => this.changeEditDataRoles(e)}
														/>
														<CustomInput
															type="checkbox"
															id="ffxoperatorCustomCheckbox"
															label="FFx Operator"
															name="ffxOperator"
															defaultChecked={this.state.editData.roles.ffxOperator}
															onClick={e => this.changeEditDataRoles(e)}
														/>
														<CustomInput
															type="checkbox"
															id="supportCustomCheckbox"
															label="Support"
															name="support"
															defaultChecked={this.state.editData.roles.support}
															onClick={e => this.changeEditDataRoles(e)}
														/>
													</Container>
												</FormGroup>
											</Col>
										</Row>
									</ModalBody>
									<ModalFooter>
										<Button color="success" type="submit" value="Add Staff" className="px-4">
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
									<i className="fa fa-warning"></i> Delete Staff Member
								</ModalHeader>
								<ModalBody>
									<img src={spinner} height="150" width="150" alt="spinner" align="center" style={{ height: "100%" }} />
								</ModalBody>
							</Modal>
						) : (
							<Modal color="success" isOpen={this.state.deleteModal}>
								<Form onSubmit={e => this.submitDelete(e)}>
									<ModalHeader style={{ backgroundColor: "#f86c6b", color: "Black" }} toggle={this.hideDelete}>
										<i className="fa fa-warning"></i> Delete Staff Member
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
										<Button color="danger" type="submit" value="Add Staff" className="px-4">
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
export default Staff;
