import React, { Component } from "react";
import {
	Alert,
	Card,
	CardBody,
	CardHeader,
	Container,
	CustomInput,
	Form,
	Col,
	FormGroup,
	Label,
	ListGroup,
	ListGroupItem,
	Input,
	Button,
	Row,
	TabPane,
	TabContent
} from "reactstrap";
import TagsInput from "react-tagsinput";
import axios from "axios";
import spinner from "../../assests/images/smtSpinner.gif";
import logger from "../../components/helpers/logger";
import "./settingStyles.css";
import { saveAs } from 'file-saver';

const EMAIL_VALIDATION_REGEX = /^[-a-z0-9~!$%^&*_=+}{'?]+(\.[-a-z0-9~!$%^&*_=+}{'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(com|edu|gov|info|net|org|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

class Settings extends Component {
	constructor(props) {
		super(props);
		this.toggle = this.toggle.bind(this);
		this.onDismissError = this.onDismissError.bind(this);
		this.showError = this.showError.bind(this);

		this.onDismissSuccess = this.onDismissSuccess.bind(this);
		this.showSuccess = this.showSuccess.bind(this);
		//Announcement functions
		this.onSubmitSupport = this.onSubmitSupport.bind(this);
		this.changeSupport = this.changeSupport.bind(this);
		this.onSubmitOP = this.onSubmitOP.bind(this);
		this.changeOP = this.changeOP.bind(this);
		//Daily Summary Functions
		this.changePFXFields = this.changePFXFields.bind(this);
		this.onSubmitPFxDaily = this.onSubmitPFxDaily.bind(this);

		this.generateTestPFxPDF = this.generateTestPFxPDF.bind(this);

		this.state = {
			isLoading: true,
			error: false,
			success: false,
			activeTab: 0,
			editSupportText: "",
			editOP: "",
			pfxDailyEmail: {
				details: {
					Emails: [],
					Fields: {}
				}
			},
			ffxDailyEmail: {
				details: {
					Emails: [],
					Fields: {}
				}
			}
		};
	}

	changePFXFields(e) {
		e.persist();
		this.setState(prevState => ({
			...prevState,
			pfxDailyEmail: {
				...prevState.pfxDailyEmail,
				details: {
					...prevState.pfxDailyEmail.details,
					Fields: {
						...prevState.pfxDailyEmail.details.Fields,
						[e.target.name]: e.target.checked
					}
				}
			}
		}));
	}

	onSubmitPFxDaily(e) {
		e.preventDefault();
		// console.log("need to edit DB for pfxSummary edits", this.state.pfxDailyEmail.details);
		const details = this.state.pfxDailyEmail.details;
		const edit = { details };
		console.log(edit);
		console.log(this.state);
		axios
			.put("/api/settings/updatePFxDaily/" + this.state.pfxDailyEmail._id, edit)
			.then(editing => {
				this.showSuccess();
			})
			.catch(error => {
				logger("error", "PFxDaily Announce Submit === " + error);
			});
	}

	handlePFXEmailChange(tags) {
		this.setState(prevState => ({
			...prevState,
			pfxDailyEmail: {
				...prevState.pfxDailyEmail,
				details: {
					...prevState.pfxDailyEmail.details,
					Emails: tags
				}
			}
		}));
	}
	generateTestPFxPDF(e) {
		// console.log("need to gen pfx PDF with fields", this.state.pfxDailyEmail.details);
		const Fields = this.state.pfxDailyEmail.details.Fields;
		const details = {Fields}
		axios.post('/api/pdf/testPDF', details, { responseType: 'blob' })
		.then((res) => {
			const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
			saveAs(pdfBlob, 'testPFx.pdf');
			})
		.catch(error => {
			logger("error", "OP Announce Submit === " + error);
		});

	}

	showError() {
		this.setState({ error: true });
		//Kill the error message after 5 seconds
		setTimeout(e => this.onDismissError(), 5000);
	}
	showSuccess() {
		this.setState({ success: true });
		//Kill the success message after 5 seconds
		setTimeout(e => this.onDismissSuccess(), 5000);
	}

	onDismissError() {
		this.setState({ error: false });
	}
	onDismissSuccess() {
		this.setState({ success: false });
	}

	changeOP(e) {
		if (e.target.name === "hidden") {
			this.setState({
				editOP: { ...this.state.editOPText, [e.target.name]: e.target.checked }
			});
		} else {
			this.setState({
				editOP: { ...this.state.editOPText, [e.target.name]: e.target.value }
			});
		}
	}
	onSubmitOP(e) {
		e.preventDefault();
		const details = {
			hidden:
				this.state.editOP.hidden === true || this.state.editOP.hidden === false
					? this.state.editOP.hidden
					: this.state.opAnnounce.details.hidden,
			AnnouncementText: this.state.editOP.AnnouncementText
				? this.state.editOP.AnnouncementText
				: this.state.opAnnounce.details.AnnouncementText
		};
		const edit = { details };
		console.log(edit);
		axios
			.put("/api/settings/updateAnnouncement/" + this.state.opAnnounce._id, edit)
			.then(editing => {
				this.showSuccess();
			})
			.catch(error => {
				logger("error", "OP Announce Submit === " + error);
			});
	}

	changeSupport(e) {
		if (e.target.name === "hidden") {
			this.setState({
				editSupport: { ...this.state.editSupportText, [e.target.name]: e.target.checked }
			});
		} else {
			this.setState({
				editSupport: { ...this.state.editSupportText, [e.target.name]: e.target.value }
			});
		}
	}

	onSubmitSupport(e) {
		e.preventDefault();
		const details = {
			hidden:
				this.state.editSupport.hidden === true || this.state.editSupport.hidden === false
					? this.state.editSupport.hidden
					: this.state.supportAnnounce.details.hidden,
			AnnouncementText: this.state.editSupport.AnnouncementText
				? this.state.editSupport.AnnouncementText
				: this.state.supportAnnounce.details.AnnouncementText
		};
		const edit = { details };
		axios
			.put("/api/settings/updateAnnouncement/" + this.state.supportAnnounce._id, edit)
			.then(editing => {
				this.showSuccess();
			})
			.catch(error => {
				logger("error", "Support Announce Submit === " + error);
			});
	}

	toggle(tab) {
		if (this.state.activeTab !== tab) {
			this.setState({
				activeTab: tab
			});
		}
	}

	componentDidMount() {
		Promise.all([
			axios.get("/api/settings/opAnnouncement"),
			axios.get("/api/settings/supportAnnouncement"),
			axios.get("/api/settings/pfxDailyEmail")
		])
			.then(([opResponse, supportResponse, pfxDailyResponse]) => {
				const opAnnounce = opResponse.data;
				const supportAnnounce = supportResponse.data;
				const pfxDaily = pfxDailyResponse.data;

				console.log(opAnnounce);
				this.setState({ opAnnounce: opAnnounce, supportAnnounce: supportAnnounce, pfxDailyEmail: pfxDaily });
			})
			.then(isLoading =>
				this.setState({
					isLoading: false
				})
			);
	}

	render() {
		if (this.state.isLoading) {
			return <img src={spinner} height="150" width="150" alt="spinner" align="center" style={{ height: "100%" }} />;
		} else {
			console.log(this.state.pfxDailyEmail.details.Fields);
			return (
				<React.Fragment>
					<Alert color="danger" isOpen={this.state.error} toggle={this.onDismissError}>
						<strong>This is not a valid Email format.</strong>
					</Alert>
					<Alert color="success" isOpen={this.state.success} toggle={this.onDismissSuccess}>
						<strong>Setting Updated</strong>
					</Alert>
					<Card>
						<CardHeader>
							<i className="fa fa-cogs"></i>
							<strong>Configuration Page</strong>
							<div className="card-header-actions"></div>
						</CardHeader>
						<CardBody>
							<Row>
								<Col style={{ paddingBottom: "10px", maxWidth: "300px" }}>
									<ListGroup id="list-tab" role="tablist">
										<ListGroupItem
											className="configListItem"
											style={{ cursor: "pointer" }}
											onClick={() => this.toggle(0)}
											action
											active={this.state.activeTab === 0}
										>
											OPs Announcement
										</ListGroupItem>
										<ListGroupItem
											className="configListItem"
											style={{ cursor: "pointer" }}
											onClick={() => this.toggle(1)}
											action
											active={this.state.activeTab === 1}
										>
											Support Announcement
										</ListGroupItem>
										<ListGroupItem
											className="configListItem"
											style={{ cursor: "pointer" }}
											onClick={() => this.toggle(2)}
											action
											active={this.state.activeTab === 2}
										>
											PFx Daily Summary Emails
										</ListGroupItem>
										<ListGroupItem
											className="configListItem"
											style={{ cursor: "pointer" }}
											onClick={() => this.toggle(3)}
											action
											active={this.state.activeTab === 3}
										>
											FFx Daily Summary Emails
										</ListGroupItem>
										<ListGroupItem
											className="configListItem"
											style={{ cursor: "pointer" }}
											onClick={() => this.toggle(4)}
											action
											active={this.state.activeTab === 4}
										>
											Audit Report Emails
										</ListGroupItem>
									</ListGroup>
								</Col>
								<Col>
									<TabContent style={{ borderRadius: "5px" }} activeTab={this.state.activeTab}>
										<TabPane tabId={0}>
											<Form id="opAnnounceForm" onSubmit={e => this.onSubmitOP(e)}>
												<FormGroup>
													<Label htmlFor="opAnnounce">Op Announcement</Label>
													<Input
														onChange={e => this.changeOP(e)}
														id="opAnnounce"
														type="textarea"
														name="AnnouncementText"
														style={{ height: 100 }}
														defaultValue={this.state.opAnnounce ? this.state.opAnnounce.details.AnnouncementText : ""}
													></Input>
													<CustomInput
														type="checkbox"
														id="opAnnoucmentVisible"
														label="Hide OP Announcement Field"
														name="hidden"
														onClick={e => this.changeOP(e)}
													/>
												</FormGroup>
												<Button type="submit" size="sm" color="success">
													<i className="fa fa-check"></i> Save
												</Button>{" "}
											</Form>
										</TabPane>
										<TabPane tabId={1}>
											<Form id="supportAnnounceForm" onSubmit={e => this.onSubmitSupport(e)}>
												<FormGroup>
													<Label htmlFor="supportAnnounce">Support Announcement</Label>
													<Input
														onChange={e => this.changeSupport(e)}
														id="supportAnnounce"
														type="textarea"
														name="AnnouncementText"
														style={{ height: 100 }}
														defaultValue={
															this.state.supportAnnounce ? this.state.supportAnnounce.details.AnnouncementText : ""
														}
													></Input>
													<CustomInput
														type="checkbox"
														id="supportAnnoucmentVisible"
														label="Hide Support Announcement Field"
														name="hidden"
														defaultChecked={this.state.supportAnnounce.details.hidden}
														onClick={e => this.changeSupport(e)}
													/>
												</FormGroup>
												<Button type="submit" size="sm" color="success">
													<i className="fa fa-check"></i> Save
												</Button>{" "}
											</Form>
										</TabPane>
										<TabPane tabId={2}>
											<Form id="pfxEmailForm" onSubmit={e => this.onSubmitPFxDaily(e)}>
												<FormGroup>
													<Label htmlFor="pfxEmail">Email Receipents</Label>
													<TagsInput
														style={{ cursor: "text" }}
														value={this.state.pfxDailyEmail.details.Emails}
														inputProps={{ placeholder: "Add An Email" }}
														validationRegex={EMAIL_VALIDATION_REGEX}
														onValidationReject={e => this.showError(e)}
														// validate={this.validate}
														onlyUnique="true"
														onChange={e => this.handlePFXEmailChange(e)}
													/>
												</FormGroup>
												<FormGroup>
													<Label htmlFor="pfxFieldSelection">PFx Report Fields To Include</Label>
													<Container
														style={{
															border: "1px solid #e4e7ea",
															borderRadius: "0.25rem"
														}}
													>
														<Row>
															<Col>
																<CustomInput
																	type="checkbox"
																	id="venueCustomCheckbox"
																	label="Venue"
																	name="venue"
																	defaultChecked={this.state.pfxDailyEmail.details.Fields.venue}
																	onClick={e => this.changePFXFields(e)}
																/>
																<CustomInput
																	type="checkbox"
																	id="pfxoperatorCustomCheckbox"
																	label="Operator"
																	name="operator"
																	defaultChecked={this.state.pfxDailyEmail.details.Fields.operator}
																	onClick={e => this.changePFXFields(e)}
																/>
																<CustomInput
																	type="checkbox"
																	id="dateCustomCheckbox"
																	label="Date"
																	name="date"
																	defaultChecked={this.state.pfxDailyEmail.details.Fields.date}
																	onClick={e => this.changePFXFields(e)}
																/>
																<CustomInput
																	type="checkbox"
																	id="logInCustomCheckbox"
																	label="Log In"
																	name="logIn"
																	defaultChecked={this.state.pfxDailyEmail.details.Fields.logIn}
																	onClick={e => this.changePFXFields(e)}
																/>
																<CustomInput
																	type="checkbox"
																	id="logOutCustomCheckbox"
																	label="Log Out"
																	name="logOut"
																	defaultChecked={this.state.pfxDailyEmail.details.Fields.logOut}
																	onClick={e => this.changePFXFields(e)}
																/>
															</Col>
															<Col>
																<CustomInput
																	type="checkbox"
																	id="firstPitchCustomCheckbox"
																	label="First Pitch"
																	name="firstPitch"
																	defaultChecked={this.state.pfxDailyEmail.details.Fields.firstPitch}
																	onClick={e => this.changePFXFields(e)}
																/>
																<CustomInput
																	type="checkbox"
																	id="hwswIssuesCustomCheckbox"
																	label="Hardware/Software Issues"
																	name="hwswIssues"
																	defaultChecked={this.state.pfxDailyEmail.details.Fields.hwswIssues}
																	onClick={e => this.changePFXFields(e)}
																/>
																<CustomInput
																	type="checkbox"
																	id="t1NotesCustomCheckbox"
																	label="T1 Notes"
																	name="t1Notes"
																	defaultChecked={this.state.pfxDailyEmail.details.Fields.t1Notes}
																	onClick={e => this.changePFXFields(e)}
																/>
																<CustomInput
																	type="checkbox"
																	id="correctionsCustomCheckbox"
																	label="Corrections"
																	name="corrections"
																	defaultChecked={this.state.pfxDailyEmail.details.Fields.corrections}
																	onClick={e => this.changePFXFields(e)}
																/>
															</Col>
														</Row>
													</Container>
												</FormGroup>
												<Button type="submit" size="sm" color="success">
													<i className="fa fa-check"></i> Save
												</Button>{" "}
												<Button onClick={e => this.generateTestPFxPDF(e)} size="sm" color="warning">
													<i className="fa fa-file-pdf-o"></i> Preview PDF
												</Button>
											</Form>
										</TabPane>
										<TabPane tabId={3}>
											<Form id="ffxEmailForm" onSubmit={e => this.onSubmitFFxDaily(e)}>
												<FormGroup>
													<Label htmlFor="ffxEmail">Email Receipents</Label>
													<TagsInput
														style={{ cursor: "text" }}
														value={this.state.ffxDailyEmail.details.Emails}
														inputProps={{ placeholder: "Add An Email" }}
														validationRegex={EMAIL_VALIDATION_REGEX}
														onValidationReject={e => this.showError(e)}
														onlyUnique="true"
														onChange={e => this.handleFFXEmailChange(e)}
													/>
												</FormGroup>
												<FormGroup>
													<Label htmlFor="ffxFieldSelection">FFx Report Fields To Include</Label>
													<Container
														style={{
															border: "1px solid #e4e7ea",
															borderRadius: "0.25rem"
														}}
													>
														<Row>
															<Col>
																<CustomInput
																	type="checkbox"
																	id="venueCustomCheckbox"
																	label="Venue"
																	name="venue"
																	defaultChecked={this.state.ffxDailyEmail.details.Fields.venue}
																	onClick={e => this.changeFFXFields(e)}
																/>
																<CustomInput
																	type="checkbox"
																	id="ffxoperatorCustomCheckbox"
																	label="Operator"
																	name="operator"
																	defaultChecked={this.state.ffxDailyEmail.details.Fields.operator}
																	onClick={e => this.changeFFXFields(e)}
																/>
																<CustomInput
																	type="checkbox"
																	id="ffxsupprtCustomCheckbox"
																	label="Support"
																	name="support"
																	defaultChecked={this.state.ffxDailyEmail.details.Fields.support}
																	onClick={e => this.changeFFXFields(e)}
																/>
																<CustomInput
																	type="checkbox"
																	id="ffxgameIDCustomCheckbox"
																	label="Game ID"
																	name="gameID"
																	defaultChecked={this.state.ffxDailyEmail.details.Fields.gameId}
																	onClick={e => this.changeFFXFields(e)}
																/>
																<CustomInput
																	type="checkbox"
																	id="ffxbitModeCustomCheckbox"
																	label="Bit Mode"
																	name="bitMode"
																	defaultChecked={this.state.ffxDailyEmail.details.Fields.bitMode}
																	onClick={e => this.changeFFXFields(e)}
																/>
																<CustomInput
																	type="checkbox"
																	id="ffxgameStatusCustomCheckbox"
																	label="Game Status"
																	name="gameStatus"
																	defaultChecked={this.state.ffxDailyEmail.details.Fields.gameStatus}
																	onClick={e => this.changeFFXFields(e)}
																/>
																<CustomInput
																	type="checkbox"
																	id="ffxipcrIssuesCustomCheckbox"
																	label="IPCamRelay Issues"
																	name="ipcrIssues"
																	defaultChecked={this.state.ffxDailyEmail.details.Fields.ipcrIssues}
																	onClick={e => this.changeFFXFields(e)}
																/>
																<CustomInput
																	type="checkbox"
																	id="ffxfgdIssuesCustomCheckbox"
																	label="Foreground Detector Issues"
																	name="fgdIssues"
																	defaultChecked={this.state.ffxDailyEmail.details.Fields.fgdIssues}
																	onClick={e => this.changeFFXFields(e)}
																/>
																<CustomInput
																	type="checkbox"
																	id="ffxresolverIssuesCustomCheckbox"
																	label="Resolver Issues"
																	name="resolverIssues"
																	defaultChecked={this.state.ffxDailyEmail.details.Fields.resolverIssues}
																	onClick={e => this.changeFFXFields(e)}
																/>
																<CustomInput
																	type="checkbox"
																	id="ffxhardwareIssuesCustomCheckbox"
																	label="Hardware Issues"
																	name="hardwareIssues"
																	defaultChecked={this.state.ffxDailyEmail.details.Fields.hardwareIssues}
																	onClick={e => this.changeFFXFields(e)}
																/>
																<CustomInput
																	type="checkbox"
																	id="ffxmiscNotesCustomCheckbox"
																	label="Misc Notes"
																	name="miscNotes"
																	defaultChecked={this.state.ffxDailyEmail.details.Fields.miscNotes}
																	onClick={e => this.changeFFXFields(e)}
																/>
															</Col>
															<Col>
																<CustomInput
																	type="checkbox"
																	id="dateCustomCheckbox"
																	label="Date"
																	name="date"
																	defaultChecked={this.state.ffxDailyEmail.details.Fields.date}
																	onClick={e => this.changeFFXFields(e)}
																/>
																<CustomInput
																	type="checkbox"
																	id="logInCustomCheckbox"
																	label="Log In"
																	name="logIn"
																	defaultChecked={this.state.ffxDailyEmail.details.Fields.logIn}
																	onClick={e => this.changeFFXFields(e)}
																/>
																<CustomInput
																	type="checkbox"
																	id="logOutCustomCheckbox"
																	label="Log Out"
																	name="logOut"
																	defaultChecked={this.state.ffxDailyEmail.details.Fields.logOut}
																	onClick={e => this.changeFFXFields(e)}
																/>
																<CustomInput
																	type="checkbox"
																	id="firstPitchCustomCheckbox"
																	label="First Pitch"
																	name="firstPitch"
																	defaultChecked={this.state.ffxDailyEmail.details.Fields.firstPitch}
																	onClick={e => this.changeFFXFields(e)}
																/>
																<CustomInput
																	type="checkbox"
																	id="supportNotesCustomCheckbox"
																	label="Support Notes"
																	name="supportNotes"
																	defaultChecked={this.state.ffxDailyEmail.details.Fields.supportNotes}
																	onClick={e => this.changeFFXFields(e)}
																/>
																<CustomInput
																	type="checkbox"
																	id="bisonCustomCheckbox"
																	label="Bison Set"
																	name="bisonSet"
																	defaultChecked={this.state.ffxDailyEmail.details.Fields.bisonSet}
																	onClick={e => this.changeFFXFields(e)}
																/>
																<CustomInput
																	type="checkbox"
																	id="backupTaskCustomCheckbox"
																	label="Backup Task Initiated"
																	name="backupTask"
																	defaultChecked={this.state.ffxDailyEmail.details.Fields.backupTask}
																	onClick={e => this.changeFFXFields(e)}
																/>
																<CustomInput
																	type="checkbox"
																	id="backupNotesCustomCheckbox"
																	label="Backup Notes"
																	name="backupNotes"
																	defaultChecked={this.state.ffxDailyEmail.details.Fields.backupNotes}
																	onClick={e => this.changeFFXFields(e)}
																/>
															</Col>
														</Row>
													</Container>
												</FormGroup>
												<Button disabled type="submit" size="sm" color="success">
													<i className="fa fa-check"></i> Save
												</Button>{" "}
												<Button disabled onClick={e => this.generateTestPFxPDF(e)} size="sm" color="warning">
													<i className="fa fa-file-pdf-o"></i> Preview PDF
												</Button>
											</Form>
										</TabPane>
										<TabPane tabId={4}></TabPane>
									</TabContent>
								</Col>
							</Row>
						</CardBody>
					</Card>
				</React.Fragment>
			);
		}
	}
}

export default Settings;
