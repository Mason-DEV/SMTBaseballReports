import React, { Component } from "react";
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
import axios from "axios";
import logger from "../../components/helpers/logger";
import spinner from "../../assests/images/smtSpinner.gif";
import _ from "lodash";
// import ModalComponent from "./Modals/ModalComponent";

class FFxAuditData extends Component {
	constructor(props) {
		super(props);

		//Binding states
		this.showDelete = this.showDelete.bind(this);
		this.hideDelete = this.hideDelete.bind(this);
		this.submitDelete = this.submitDelete.bind(this);
		//Table stuff
		this.pageSize = 15;

		//States
		this.state = {
			currentPage: 0,
			pagesCount: 0,
			isLoading: true,
			data: {},
			sortedBy: "",
			editModal: false,
			deleteModal: false,
			isAdding: false,
			isDeleting: false,
			needToReload: false,
			editData: {},
			deleteData: {}
		};
	}

	sortTable(e, who) {
		const sortData = this.state.data;
		//Check if we are already sorted by this metric, if so, just flip the sort
		if (who === this.state.sortedBy) {
			this.setState({
				data: _.reverse(sortData),
				sortedBy: who
			});
		} else {
			this.setState({
				data: _.sortBy(sortData, [
					function(o) {
						return o[who];
					}
				]),
				sortedBy: who
			});
		}
	}

	showEdit(id) {
		console.log("id for this thing", id);
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

	//#region Delete Functions
	hideDelete() {
		this.setState({
			deleteModal: !this.state.deleteModal,
			deleteData: {},
			needToReload: false
		});
	}

	showDelete(id, gamestring) {
		this.setState({
			deleteModal: !this.state.deleteModal,
			deleteData: { _id: id, gamestring }
		});
		this.removeBlur();
	}
	submitDelete(e) {
		e.preventDefault();
		this.setState({ isDeleting: true });
		axios
			.delete("/api/FFxAudit/delete/", {
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
		//Axios api call to get all staffData
		axios
			.get("/api/FFxAudit/")
			.then(res => {
				this.setState({ data: res.data });
			})
			//Data is loaded, so change from loading state
			.then(isLoading =>
				this.setState({ isLoading: false, pagesCount: Math.ceil(this.state.data.length / this.pageSize) })
			)
			.catch(function(error) {
				console.log(error);
				logger("error", error);
			});
	}

	componentDidUpdate() {
		//Checking if we need to make an Axios api call to get all staffData
		if (this.state.needToReload === true) {
			axios
				.get("/api/FFxAudit/")
				.then(res => {
					this.setState({
						data: res.data,
						needToReload: false,
						pagesCount: Math.ceil(this.state.data.length / this.pageSize)
					});
				})
				.catch(function(error) {
					console.log(error);
					logger("error", "error on auditData component did update " +error.toString());
				});
			this.setState({ needToReload: false });
		}
	}

	render() {
		console.log(this.state.sortedBy);
		const { currentPage } = this.state;
		if (this.state.isLoading) {
			return <img src={spinner} height="150" width="150" alt="spinner" align="center" style={{ height: "100%" }} />;
		} else {
			return (
				<React.Fragment>
					<Card className="card-accent-success">
						<CardHeader tag="h5">
							<i className="icon-globe"></i> FieldFx Audits Data Table
							<div className="card-header-actions"></div>
						</CardHeader>
						<CardBody>
							<Table id="AuditTable" bordered striped responsive size="sm">
								<thead>
									<tr>
										<th width="">Actions</th>
										<th style={{ cursor: "pointer" }} onClick={e => this.sortTable(e, "gamestring")} width="">
											Gamestring
										</th>
										<th style={{ cursor: "pointer" }} onClick={e => this.sortTable(e, "operator")} width="">
											Operator
										</th>
										<th style={{ cursor: "pointer" }} onClick={e => this.sortTable(e, "auditor")} width="">
											Auditor
										</th>
										<th style={{ cursor: "pointer" }} onClick={e => this.sortTable(e, "gdPitches")} width="">
											GD Pitches
										</th>
										<th style={{ cursor: "pointer" }} onClick={e => this.sortTable(e, "ffxPitches")} width="">
											FFx Pitches
										</th>
										<th style={{ cursor: "pointer" }} onClick={e => this.sortTable(e, "missedPitchesVidGaps")} width="">
											Missed Pitches
										</th>
										<th style={{ cursor: "pointer" }} onClick={e => this.sortTable(e, "missedBIPVidGaps")} width="">
											Missed BIP
										</th>
										<th style={{ cursor: "pointer" }} onClick={e => this.sortTable(e, "numPitchesAdded")} width="">
											Added Pitches
										</th>
										<th style={{ cursor: "pointer" }} onClick={e => this.sortTable(e, "numPicksAdded")} width="">
											Added Picks
										</th>
									</tr>
								</thead>
								<tbody>
									{this.state.data
										.slice(currentPage * this.pageSize, (currentPage + 1) * this.pageSize)
										.map((data, i) => {
											return (
												<tr key={i}>
													<td>
														<Button onClick={e => this.showEdit(data._id)} color="warning" size="sm">
															Edit
														</Button>{" "}
														<Button onClick={e => this.showDelete(data._id, data.gamestring)} color="danger" size="sm">
															Delete
														</Button>
													</td>
													<td>{data.gamestring}</td>
													<td>{data.operator}</td>
													<td>{data.auditor}</td>
													<td>{data.gdPitches}</td>
													<td>{data.ffxPitches}</td>
													<td>{data.missedPitchesVidGaps}</td>
													<td>{data.missedBIPVidGaps}</td>
													<td>{data.numPitchesAdded}</td>
													<td>{data.numPicksAdded}</td>
												</tr>
											);
										})}
								</tbody>
							</Table>
						</CardBody>
						<CardFooter>
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
						</CardFooter>
					</Card>

					{/* Delete Modal */}
					<div>
						{this.state.isDeleting ? (
							<Modal color="success" isOpen={this.state.deleteModal}>
								<ModalHeader style={{ backgroundColor: "#f86c6b", color: "Black" }}>
									<i className="fa fa-warning"></i> Delete FieldFx Audit Report
								</ModalHeader>
								<ModalBody>
									<img src={spinner} height="150" width="150" alt="spinner" align="center" style={{ height: "100%" }} />
								</ModalBody>
							</Modal>
						) : (
							<Modal color="success" isOpen={this.state.deleteModal}>
								<Form onSubmit={e => this.submitDelete(e)}>
									<ModalHeader style={{ backgroundColor: "#f86c6b", color: "Black" }} toggle={this.hideDelete}>
										<i className="fa fa-warning"></i> Delete FieldFx Audit Report
									</ModalHeader>
									<ModalBody>
										<Row>
											<Col>
												<FormGroup>
													<Label htmlFor="name">
														{console.log(this.state)}
														Are you sure you want to delete {this.state.deleteData.gamestring}'s Audit report?
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
export default FFxAuditData;
