import React, { Component } from "react";
import {
	Badge,
	Card,
	CardBody,
	CardHeader,
	Container,
	CustomInput,
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
	Button,
	Pagination,
	PaginationItem,
	PaginationLink,
	Row,
	Table
} from "reactstrap";
import axios from "axios";
import { getJwt } from "../../components/helpers/jwt";
import spinner from "../../assests/images/smtSpinner.gif";

const jwt = getJwt();
const staff = [
	{
		name: "Mason Guy",
		email: "M.guy@smt.com",
		roles: {
			operator: true,
			support: true,
			auditor: true
		}
	},
	{
		name: "Shelby Guy",
		email: "s.guy@smt.com",
		roles: {
			operator: true,
			support: false,
			auditor: false
		}
	}
];
class Staff extends Component {
	constructor(props) {
		super(props);
		this.toggleAdd = this.toggleAdd.bind(this);
		this.showEdit = this.showEdit.bind(this);
		this.hideEdit = this.hideEdit.bind(this);
		this.submitEdit = this.submitEdit.bind(this);
		this.changeEditData = this.changeEditData.bind(this);
		this.changeEditDataRoles = this.changeEditDataRoles.bind(this);

		this.state = {
			addModal: false,
			editModal: false,
			isEditing: false,
			isLoading: true,
			needToReload: false,
			staffData: {},
			editData: { roles: {} }
		};
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
	toggleAdd() {
		this.setState({
			addModal: !this.state.addModal
		});
	}

	hideEdit() {
		this.setState({
			editModal: !this.state.editModal,
			editData: { roles: {} },
			needToReload: false
		});
	}
	showEdit(id) {
		axios
			.get("/api/staff/staffByID", {
				headers: { Authorization: `Bearer ${jwt}`, ID: id }
			})
			.then(res => {
				this.setState({ editData: res.data });
			})
			.catch(function(error) {
				console.log(error);
			});

		this.setState({
			editModal: !this.state.editModal
		});
	}
	submitEdit(e) {
		e.preventDefault();
		this.setState({ isEditing: true });
		axios
			.put("/api/staff/update/" + this.state.editData._id, this.state.editData)
			.then(editing => {
				this.setState({ isEditing: false, needToReload: true });
			})
			// .then(reload =>{
			// 	axios
			// 	.get("/api/staff/")
			// 	.then(res => {
			// 		this.setState({ staffData: res.data });
			// 	})
			// 	//Data is loaded, so change from loading state
			// 	.then(isLoading => this.setState({ needToReload: false }))
			// 	.catch(function(error) {
			// 		console.log(error);
			// 	});

			// })
			.catch(error => {
				this.setState({ isEditing: false });
				console.log(error);
			});
		this.hideEdit();
	}
	componentDidMount() {
		//Axios api call to get all staffData
		axios
			.get("/api/staff/")
			.then(res => {
				this.setState({ staffData: res.data });
			})
			//Data is loaded, so change from loading state
			.then(isLoading => this.setState({ isLoading: false }))
			.catch(function(error) {
				console.log(error);
			});
	}
	componentDidUpdate() {
		//Checking if we need to make an Axios api call to get all staffData
		if (this.state.needToReload === true) {
			axios
				.get("/api/staff/")
				.then(res => {
					this.setState({ staffData: res.data, needToReload: false });
				})
				.catch(function(error) {
					console.log(error);
				});
			this.setState({ needToReload: false });
		}
	}

	render() {
		if (this.state.isLoading) {
			return (
				<img
					src={spinner}
					height="150"
					width="150"
					alt="spinner"
					align="center"
					style={{ height: "100%" }}
				/>
			);
		} else {
			return (
				<React.Fragment>
					<Card>
						<CardHeader tag="h5">
							<i className="fa fa-group"></i>Staff Management
							<div className="card-header-actions">
								<Button color="success" size="sm" onClick={this.toggleAdd}>
									<i className="fa fa-plus"></i> New Staff
								</Button>
							</div>
						</CardHeader>
						<CardBody>
							<Table bordered striped responsive size="sm">
								<thead>
									<tr>
										<th width="120">Actions</th>
										<th width="300">Name</th>
										<th width="300">Email</th>
										<th width="150">Roles</th>
									</tr>
								</thead>
								<tbody>
									{this.state.staffData.map((staff, i) => {
										return (
											<tr key={i}>
												<td>
													<Button
														onClick={e => this.showEdit(staff._id)}
														color="warning"
														size="sm"
													>
														Edit
													</Button>{" "}
													<Button color="danger" size="sm">
														Delete
													</Button>
												</td>
												<td>{staff.name}</td>
												<td>{staff.email}</td>
												<td>
													{staff.roles.auditor ? (
														<Badge color="info">Auditor</Badge>
													) : null}{" "}
													{staff.roles.operator ? (
														<Badge color="warning">Operator</Badge>
													) : null}{" "}
													{staff.roles.support ? (
														<Badge color="secondary">Support</Badge>
													) : null}
												</td>
											</tr>
										);
									})}
								</tbody>
							</Table>
						</CardBody>
					</Card>

					{/* Add Modal */}
					<div>
						<Modal isOpen={this.state.addModal}>
							<ModalHeader
								style={{ backgroundColor: "#3EA662", color: "white" }}
								toggle={this.toggleAdd}
							>
								<i className="fa fa-pencil"></i> Add New Staff Member
							</ModalHeader>
							<ModalBody>
								<Form>
									<Row>
										<Col>
											<FormGroup>
												<Label htmlFor="naame">Full Name</Label>
												<Input
													type="text"
													name="name"
													id="name"
													required
												></Input>
											</FormGroup>
											<FormGroup>
												<Label htmlFor="email">Email</Label>
												<Input id="email" type="email" name="email"></Input>
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
													/>
													<CustomInput
														type="checkbox"
														id="operatorCustomCheckbox"
														label="Operator"
													/>
													<CustomInput
														type="checkbox"
														id="supportCustomCheckbox"
														label="Support"
													/>
												</Container>
											</FormGroup>
										</Col>
									</Row>
								</Form>
							</ModalBody>
							<ModalFooter>
								<input
									type="submit"
									value="Add Staff"
									// color="success"
									className="btn btn-success"
								/>
								<Button color="danger" onClick={this.toggleAdd}>
									Cancel
								</Button>
							</ModalFooter>
						</Modal>
					</div>


					{/* Edit Modal */}
					<div>
						{this.state.isEditing ? (
							<Modal color="success" isOpen={this.state.editModal}>
								<ModalHeader
									style={{ backgroundColor: "#ffc107", color: "Black" }}
								>
									<i className="fa fa-pencil"></i> Edit Staff Member
								</ModalHeader>
								<ModalBody>
									<img
										src={spinner}
										height="150"
										width="150"
										alt="spinner"
										align="center"
										style={{ height: "100%" }}
									/>
								</ModalBody>
							</Modal>
						) : (
							<Modal color="success" isOpen={this.state.editModal}>
								<Form onSubmit={e => this.submitEdit(e)}>
									<ModalHeader
										style={{ backgroundColor: "#ffc107", color: "Black" }}
										toggle={this.hideEdit}
									>
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
														defaultValue={
															this.state.editData.name
																? this.state.editData.name
																: ""
														}
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
														defaultValue={
															this.state.editData.email
																? this.state.editData.email
																: ""
														}
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
															id="operatorCustomCheckbox"
															label="Operator"
															name="operator"
															defaultChecked={
																this.state.editData.roles.operator
															}
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
										<Button
											color="success"
											type="submit"
											value="Add Staff"
											className="px-4"
										>
											Add Staff
										</Button>

										<Button color="danger" onClick={this.hideEdit}>
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
