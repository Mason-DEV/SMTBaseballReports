import React, { Component } from "react";
import {
	Badge,
	Card,
	CardBody,
	CardHeader,
	CardFooter,
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
import logger from "../../components/helpers/logger";
import {getJwt} from "../../components/helpers/jwt";
import APIHelper from "../../components/helpers/APIHelper";
import spinner from "../../assests/images/smtSpinner.gif";
import _ from "lodash";
import lgLogo from "../../../src/assests/images/SMT_Report_Tag.jpg";

class FFxAuditData extends Component {
	constructor(props) {
		super(props);

		//Binding states
		this.showEdit = this.showEdit.bind(this);
		this.hideEdit = this.hideEdit.bind(this);
		this.submitEdit = this.submitEdit.bind(this);
		this.changeEditData = this.changeEditData.bind(this);

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

	changeEdit(e) {
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
			.get(APIHelper.getFFxAuditReportByIdAPI,  {
				headers: { ID: id , Authorization: `Bearer ${getJwt()}`}
			})
			.then(res => {
				this.setState({ editData: res.data });
			})
			.catch(function(error) {
				logger("error", "Ffx Audit Report Show edit === " + error);
			});

		this.setState({
			editModal: !this.state.editModal
		});
		this.removeBlur();
	}
	submitEdit(e) {
		e.preventDefault();
		const editedReport = {
			gamestring: this.state.editData.gamestring,
			commentsBall: this.state.editData.commentsBall,
			commentsMisc: this.state.editData.commentsMisc,
			commentsPlayer: this.state.editData.commentsPlayer,
			logIn: this.state.editData.logIn,
			logOut: this.state.editData.logOut,
			missedBIPVidGaps: this.state.editData.missedBIPVidGaps,
			missedPitchesVidGaps: this.state.editData.missedPitchesVidGaps,
			numBIPasPC: this.state.editData.numBIPasPC,
			numFBasPC: this.state.editData.numFBasPC,
			numPicksAdded: this.state.editData.numPicksAdded,
			numPitchesAdded: this.state.editData.numPitchesAdded,
			operator: this.state.editData.operator,
			auditor: this.state.editData.auditor,
			readyShare: this.state.editData.readyShare,
			stepAccuracy: this.state.editData.stepAccuracy  ? true : false,
			stepCompletion: this.state.editData.stepCompletion  ? true : false,
			stepResolving: this.state.editData.stepResolving ? true : false,
			timeAccuracy: this.state.editData.timeAccuracy,
			timeCompletion: this.state.editData.timeCompletion,
			timeResolving: this.state.editData.timeResolving,
			ffxPitches: this.state.editData.ffxPitches,
			gdPitches: this.state.editData.gdPitches,
			vidGaps: this.state.editData.vidGaps,
		};
		this.setState({ isEditing: true });
		axios
			.put(APIHelper.updateFFxAuditReportAPI + this.state.editData._id, editedReport,  { headers: { Authorization: `Bearer ${getJwt()}` } })
			.then(editing => {
				this.setState({ isEditing: false, needToReload: true });
			})
			.catch(error => {
				this.setState({ isEditing: false });
				logger("error", "FFxAudit Submit === " + error);
			});
		this.hideEdit();
	}
	//#endregion Edit Functions

	//#region Delete Functions
	changeEditData(e) {
		if(e.target.name === "stepResolving" ||e.target.name === "stepAccuracy"|| e.target.name === "stepCompletion"  ){
			this.setState({
				editData: { ...this.state.editData, [e.target.name]: e.target.checked }
			});
		}
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
			.delete(APIHelper.deleteFFxAuditReportByIdAPI, {
				headers: { ID: this.state.deleteData._id,  Authorization: `Bearer ${getJwt()}`  }
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
			axios.get(APIHelper.getFFxAuditAPI,  { headers: { Authorization: `Bearer ${getJwt()}` } }),
			axios.get(APIHelper.getFFxStaffAPI,  { headers: { Authorization: `Bearer ${getJwt()}` } }),
			axios.get(APIHelper.getAuditStaffAPI,  { headers: { Authorization: `Bearer ${getJwt()}` } })
		])
			.then(([allResponse, opResponse, auditorResponse]) => {
				const data = allResponse.data;
				const ops = opResponse.data.map(obj => ({ name: obj.name, email: obj.email }));
				const auditor = auditorResponse.data.map(obj => ({ name: obj.name }));
				this.setState({ data, operators: ops, auditor });
			})
			.then(isLoading =>
				this.setState({
					isLoading: false,
					pagesCount: Math.ceil(this.state.data.length / this.pageSize)
				})
			);
	}

	componentDidUpdate() {
		if (this.state.needToReload === true) {
			axios
				.get(APIHelper.getFFxAuditAPI, { headers: { Authorization: `Bearer ${getJwt()}` } })
				.then(res => {
					this.setState({
						data: res.data,
						needToReload: false,
						pagesCount: Math.ceil(this.state.data.length / this.pageSize)
					});
				})
				.catch(function(error) {
					logger("error", "error on auditData component did update " + error.toString());
				});
			this.setState({ needToReload: false });
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
							<i className="icon-globe"></i> FieldFx Audits Data Table
							<div className="card-header-actions"></div>
						</CardHeader>
						<CardBody>
							<Table id="AuditTable" bordered striped responsive size="sm">
								<thead>
									<tr>
										<th> style={{minWidth:"110px"}}>Actions</th>
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

					{/* Edit Modal */}
					<div>
						{this.state.isEditing ? (
							<Modal color="success" isOpen={this.state.editModal}>
								<ModalHeader style={{ backgroundColor: "#ffc107", color: "Black" }}>
									<i className="fa fa-pencil"></i> Edit FieldFx Audit Report
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
										<i className="fa fa-pencil"></i> Edit FieldFx Audit Report
									</ModalHeader>
									<ModalBody>
										<Row>
											<Col>
												<FormGroup>
													<Label htmlFor="gameID">Game ID</Label>
													<Input
														onChange={e => this.changeEdit(e)}
														type="text"
														id="gameID"
														name="gamestring"
														defaultValue={this.state.editData.gamestring}
														required
													/>
												</FormGroup>
												<FormGroup>
													<Label htmlFor="operator">Operator</Label>
													<Input value={this.state.editData.operator} onChange={e => this.changeEdit(e)} type="select" name="operator" id="operator" required>
														
														{this.state.operators.map((op, idx) => {
															return <option key={idx}>{op.name}</option>;
														})}
													</Input>
												</FormGroup>
												<FormGroup>
													<Label htmlFor="auditor">Auditor</Label>
													<Input value={this.state.editData.auditor} onChange={e => this.changeEdit(e)} type="select" name="auditor" id="operator" required>
														{this.state.auditor.map((auditor, idx) => {
															return <option key={idx}>{auditor.name}</option>;
														})}
													</Input>
												</FormGroup>
												<FormGroup>
													<Label htmlFor="numPitchesAdded">Number of Pitches Added</Label>
													<Input
														onChange={e => this.changeEdit(e)}
														defaultValue={this.state.editData.numPitchesAdded}
														type="number"
														min="0"
														name="numPitchesAdded"
														id="numPitchesAdded"
													></Input>
												</FormGroup>
												<FormGroup>
													<Label htmlFor="numBIPasPC">Number of Balls in Play marked as P/C</Label>
													<Input
														onChange={e => this.changeEdit(e)}
														defaultValue={this.state.editData.numBIPasPC}
														type="number"
														min="0"
														name="numBIPasPC"
														id="numBIPasPC"
														></Input>
												</FormGroup>
												<FormGroup>
													<Label htmlFor="numFBasPC">Number of Foul Balls marked as P/C</Label>
													<Input
														defaultValue={this.state.editData.numFBasPC}
														onChange={e => this.changeEdit(e)}
														type="number"
														min="0"
														name="numFBasPC"
														id="numFBasPC"
														></Input>
												</FormGroup>
												<FormGroup>
													<Label htmlFor="numPicksAdded">Number of Pickoffs Added</Label>
													<Input
														onChange={e => this.changeEdit(e)}
														type="number"
														defaultValue={this.state.editData.numPicksAdded}
														min="0"
														name="numPicksAdded"
														id="numPicksAdded"
													></Input>
												</FormGroup>
												<FormGroup>
													<Label htmlFor="vidGaps">Video Gaps</Label>
													<Input defaultValue={this.state.editData.vidGaps} onChange={e => this.changeEdit(e)} type="text" name="vidGaps" id="vidGaps"></Input>
												</FormGroup>
												<FormGroup>
													<Label htmlFor="missedPitchesVidGaps">Number of Missed Pitches due to Video Gaps</Label>
													<Input
														onChange={e => this.changeEdit(e)}
														type="number"
														defaultValue={this.state.editData.missedPitchesVidGaps}
														min="0"
														name="missedPitchesVidGaps"
														id="missedPitchesVidGaps"
													></Input>
												</FormGroup>
												<FormGroup>
													<Label htmlFor="missedBIPVidGaps">Number of Missed BIP due to Video Gaps</Label>
													<Input
														defaultValue={this.state.editData.missedBIPVidGaps}
														onChange={e => this.changeEdit(e)}
														type="number"
														min="0"
														name="missedBIPVidGaps"
														id="missedBIPVidGaps"
													></Input>
												</FormGroup>
												<FormGroup>
													<Label htmlFor="commentsPlayer">Comments on Player Pathing</Label>
													<Input
														value={this.state.editData.commentsPlayer}
														onChange={e => this.changeEdit(e)}
														type="textarea"
														name="commentsPlayer"
														id="commentsPlayer"
													></Input>
												</FormGroup>
												<FormGroup>
													<Label htmlFor="commentsBall">Comments on Ball Trajectories</Label>
													<Input
														value={this.state.editData.commentsBall}
														onChange={e => this.changeEdit(e)}
														type="textarea"
														name="commentsBall"
														id="commentsBall"
													></Input>
												</FormGroup>
												<FormGroup>
													<Label htmlFor="commentsMisc">Miscellaneous Comments</Label>
													<Input
														value={this.state.editData.commentsMisc}
														onChange={e => this.changeEdit(e)}
														type="textarea"
														name="commentsMisc"
														id="commentsMisc"
													></Input>
												</FormGroup>
											</Col>
											<Col>
												<FormGroup>
													<Label htmlFor="logIn">
														Log In <Badge>Eastern Time</Badge>
													</Label>
													<Input defaultValue={this.state.editData.logIn} onChange={e => this.changeEdit(e)} id="logIn" type="time" name="logIn" required></Input>
												</FormGroup>
												<FormGroup>
													<Label htmlFor="logOut">
														Log Out <Badge>Eastern Time</Badge>
													</Label>
													<Input defaultValue={this.state.editData.logOut}  onChange={e => this.changeEdit(e)} id="logOut" type="time" name="logOut" required></Input>
												</FormGroup>

												<Label htmlFor="stepsCompleted">Steps Completed (check all that apply)</Label>
												<FormGroup>
													<CustomInput
														defaultChecked={this.state.editData.stepResolving} 
														type="checkbox"
														id="resolvingCustomCheckbox"
														label="Finished Resolving the Game"
														name="stepResolving"
														onClick={e => this.changeEdit(e)}
													/>
													<CustomInput
														defaultChecked={this.state.editData.stepCompletion} 
														id="completionCustomCheckbox"
														type="checkbox"
														label="Confirmed all Pitches, Pickoffs & Steals"
														name="stepCompletion"
														onClick={e => this.changeEdit(e)}
													/>
													<CustomInput
														defaultChecked={this.state.editData.stepAccuracy}
														id="accuracyCustomCheckbox"
														type="checkbox"
														label="Checked all Hits for Accuracy"
														name="stepAccuracy"
														onClick={e => this.changeEdit(e)}
													/>
												</FormGroup>
												<br />
												{this.state.editData.stepResolving === true ? (
													<FormGroup>
														<Label htmlFor="timeResolving">
															Time Spent Finishing Resolving <Badge color="info"># of Min</Badge>
														</Label>
														<Input
															required
															defaultValue={this.state.editData.timeResolving}
															onChange={e => this.changeEdit(e)}
															type="number"
															min="0"
															name="timeResolving"
															id="timeResolving"
														/>
													</FormGroup>
												) : (
													<FormGroup>
														<Label htmlFor="timeResolving">
															Time Spent Finishing Resolving <Badge color="info"># of Min</Badge>
														</Label>
														<Input
															onChange={e => this.changeEdit(e)}
															defaultValue={this.state.editData.timeResolving}
															type="number"
															min="0"
															name="timeResolving"
															id="timeResolving"
														/>
													</FormGroup>
												)}
												{this.state.editData.stepCompletion === true ? (
													<FormGroup>
														<Label htmlFor="timeCompletion">
															Time Spent on Completion <Badge color="info"># of Min</Badge>
														</Label>
														<Input
															defaultValue={this.state.editData.timeCompletion}
															required
															onChange={e => this.changeEdit(e)}
															type="number"
															min="0"
															name="timeCompletion"
															id="timeCompletion"
														/>
													</FormGroup>
												) : (
													<FormGroup>
														<Label htmlFor="timeCompletion">
															Time Spent on Completion <Badge color="info"># of Min</Badge>
														</Label>
														<Input
															defaultValue={this.state.editData.timeCompletion}
															onChange={e => this.changeEdit(e)}
															type="number"
															min="0"
															name="timeCompletion"
															id="timeCompletion"
														/>
													</FormGroup>
												)}
												{this.state.editData.stepAccuracy === true ? (
													<FormGroup>
														<Label htmlFor="timeAccuracy">
															Time Spent Checking Hits for Accuracy <Badge color="info"># of Min</Badge>
														</Label>
														<Input
															defaultValue={this.state.editData.timeAccuracy}
															required
															onChange={e => this.changeEdit(e)}
															type="number"
															min="0"
															name="timeAccuracy"
															id="timeAccuracy"
														/>
													</FormGroup>
												) : (
													<FormGroup>
														<Label htmlFor="timeAccuracy">
															Time Spent Checking Hits for Accuracy <Badge color="info"># of Min</Badge>
														</Label>
														<Input
															defaultValue={this.state.editData.timeAccuracy}
															onChange={e => this.changeEdit(e)}
															type="number"
															min="0"
															name="timeAccuracy"
															id="timeAccuracy"
														/>
													</FormGroup>
												)}

												<FormGroup>
													<Label htmlFor="readyShare">Ready for Share?</Label>
													<Input
														value={this.state.editData.readyShare}
														onChange={e => this.changeEdit(e)}
														type="select"
														name="readyShare"
														id="readyShare"
														required
													>
														<option></option>
														<option>No</option>
														<option>Yes</option>
													</Input>
												</FormGroup>

												{this.state.editData.readyShare === "Yes" ? (
													<FormGroup>
														<Label htmlFor="gdPitches"># Gameday Pitches</Label>
														<Input
															onChange={e => this.changeEdit(e)}
															defaultValue={this.state.editData.gdPitches}
															required
															type="text"
															name="gdPitches"
															id="gdPitches"
														></Input>
														<Label htmlFor="ffxPitches"># Fieldfx Pitches</Label>
														<Input
															defaultValue={this.state.editData.ffxPitches}
															onChange={e => this.changeEdit(e)}
															required
															type="text"
															name="ffxPitches"
															id="ffxPitches"
														></Input>
													</FormGroup>
												) : (
													<FormGroup>
														<Label htmlFor="gdPitches"># Gameday Pitches</Label>
														<Input disabled type="text" name="gdPitches" id="gdPitches"></Input>
														<Label htmlFor="ffxPitches"># Fieldfx Pitches</Label>
														<Input disabled type="text" name="ffxPitches" id="ffxPitches"></Input>
													</FormGroup>
												)}

												<FormGroup>
													<Label htmlFor="screenShots">Screenshots</Label>
													<Row>
														<Col>
															<Input disabled type="file" name="screenShots1" id="screenShots1"></Input>
															<br />
															<Input disabled type="file" name="screenShots2" id="screenShots2"></Input>
														</Col>

														<Col>
															<Input disabled type="file" name="screenShots3" id="screenShots3"></Input>
															<br />
															<Input disabled type="file" name="screenShots4" id="screenShots4"></Input>
														</Col>
													</Row>
												</FormGroup>

												<img src={lgLogo} alt="SMT Logo"></img>
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
