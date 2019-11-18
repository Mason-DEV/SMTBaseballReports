import React, { Component } from "react";
import {
	Alert,
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
	ListGroup,
	ListGroupItem,
	Input,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Row,
	TabPane,
	TabContent,
	Table
} from "reactstrap";
import TagsInput from "react-tagsinput";
import axios from "axios";
import spinner from "../../assests/images/smtSpinner.gif";
import logger from "../../components/helpers/logger";
import "./settingStyles.css";

const EMAIL_VALIDATION_REGEX = /^[-a-z0-9~!$%^&*_=+}{'?]+(\.[-a-z0-9~!$%^&*_=+}{'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(com|edu|gov|info|net|org|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

class Settings extends Component {
	constructor(props) {
		super(props);
		this.toggle = this.toggle.bind(this);
		this.onDismissError = this.onDismissError.bind(this);

		this.onSubmitSupport = this.onSubmitSupport.bind(this);
		this.changeSupport = this.changeSupport.bind(this);

		this.changePFXFields = this.changePFXFields.bind(this);
		this.generateTestPFxPDF = this.generateTestPFxPDF.bind(this);

		this.state = {
			isLoading: true,
			error: false,
			activeTab: 2,
			editSupportText: "",
			pfxDailyEmail: {
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

	generateTestPFxPDF(e) {
		console.log("need to gen pfx PDF with fields", this.state.pfxFields);
	}

	onDismissError() {
		this.setState({ error: false });
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
				// this.setState({ isEditing: false, needToReload: true });
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
			return (
				<React.Fragment>
					<Alert color="danger" isOpen={this.state.error} toggle={this.onDismissError}>
						<strong>This is not a valid Email format.</strong>
					</Alert>
					<Card>
						<CardHeader>
							<i className="fa fa-cogs"></i>
							<strong>Configuration Page</strong>
							<div className="card-header-actions"></div>
						</CardHeader>
						<CardBody>
							<Row>
								<Col xs="4">
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
								<Col xs="8">
									<TabContent activeTab={this.state.activeTab}>
										<TabPane tabId={0}>
											<Form id="opAnnounceForm" onSubmit={e => this.onSubmit(e)}>
												<FormGroup>
													<Label htmlFor="opAnnounce">Op Announcement</Label>
													<Input
														// onChange={e => this.change(e)}
														id="opAnnounce"
														type="textarea"
														name="opAnnounce"
														style={{ height: 100 }}
														defaultValue={this.state.opAnnounce ? this.state.opAnnounce.details.AnnouncementText : ""}
													></Input>
													<CustomInput
														type="checkbox"
														id="opAnnoucmentVisible"
														label="Hide OP Announcement Field"
														name="opAnnoucmentVisible"
														// onClick={e => this.change(e)}
													/>
												</FormGroup>
												<Button disabled type="submit" size="sm" color="success">
													<i className="fa fa-check"></i> Save
												</Button>{" "}
												<Button disabled type="reset" size="sm" color="danger">
													<i className="fa fa-ban"></i> Clear
												</Button>
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
												<Button disabled type="reset" size="sm" color="danger">
													<i className="fa fa-ban"></i> Clear
												</Button>
											</Form>
										</TabPane>
										<TabPane tabId={2}>
											<Form id="pfxEmailForm">
												<FormGroup>
													<Label htmlFor="pfxEmail">Email Receipents</Label>
													<TagsInput
														style={{ cursor: "text" }}
														value={this.state.pfxDailyEmail.details.Emails}
														inputProps={{ placeholder: "Add An Email" }}
														validationRegex={EMAIL_VALIDATION_REGEX}
														onValidationReject={e => this.setState({ error: true })}
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
												<Button disabled type="submit" size="sm" color="success">
													<i className="fa fa-check"></i> Save
												</Button>{" "}
												<Button disabled type="reset" size="sm" color="danger">
													<i className="fa fa-ban"></i> Clear
												</Button>{" "}
												<Button onClick={e => this.generateTestPFxPDF(e)} size="sm" color="warning">
													<i className="fa fa-file-pdf-o"></i> Preview PDF
												</Button>
											</Form>
										</TabPane>
										<TabPane tabId={3}></TabPane>
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
