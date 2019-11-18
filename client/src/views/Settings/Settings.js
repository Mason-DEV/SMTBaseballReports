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
		this.onSubmit = this.onSubmit.bind(this);
		this.onDismissError = this.onDismissError.bind(this);

		this.changePFXFields = this.changePFXFields.bind(this);
		this.generateTestPFxPDF = this.generateTestPFxPDF.bind(this);

		this.state = {
			isLoading: true,
			error: false,
			activeTab: 2,
			pfxEmails: [],
			pfxFields: {
				operator: false,
				corrections: false,
				date: false,
				firstPitch: false,
				hwswIssues: false,
				logIn: false,
				logOut: false,
				t1Notes: false,
				venue: false
			}
		};
	}

	changePFXFields(e) {
		this.setState({
			pfxFields: { ...this.state.pfxFields, [e.target.name]: e.target.checked }
		});
		// this.setState({
		// 	editData: {
		// 		...this.state.editData,
		// 		roles: {
		// 			...this.state.editData.roles,
		// 			[e.target.name]: e.target.checked
		// 		}
		// 	}
		// });
	}

	generateTestPFxPDF(e){
		console.log("need to gen pfx PDF with fields", this.state.pfxFields);
	}

	onDismissError() {
		this.setState({ error: false });
	}
	handlePFXEmailChange(tags) {
		this.setState({ pfxEmails : tags });
	}

	onSubmit(e) {
		e.preventDefault();
	}

	toggle(tab) {
		if (this.state.activeTab !== tab) {
			this.setState({
				activeTab: tab
			});
		}
	}

	componentDidMount() {
		Promise.all([axios.get("/api/settings/opAnnouncement"), axios.get("/api/settings/supportAnnouncement")])
			.then(([opResponse, supportResponse]) => {
				const opAnnounce = opResponse.data;
				const supportAnnounce = supportResponse.data;
				this.setState({ opAnnounce: opAnnounce, supportAnnounce: supportAnnounce });
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
			console.log(this.state);
			return (
				<React.Fragment>
					<Alert color="danger" isOpen={this.state.error} toggle={this.onDismissError}>
						<strong>This is not a valid Email format.</strong>
					</Alert>
					<Card>
						<CardHeader>
							<i className="fa fa-cogs"></i>
							<strong>Configuration Page</strong>
							<div className="card-header-actions">{/* <Badge>NEW</Badge> */}</div>
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
											<Form id="supportAnnounceForm" onSubmit={e => this.onSubmit(e)}>
												<FormGroup>
													<Label htmlFor="supportAnnounce">Support Announcement</Label>
													<Input
														// onChange={e => this.change(e)}
														id="supportAnnounce"
														type="textarea"
														name="supportAnnounce"
														style={{ height: 100 }}
														defaultValue={
															this.state.supportAnnounce ? this.state.supportAnnounce.details.AnnouncementText : ""
														}
													></Input>
													<CustomInput
														type="checkbox"
														id="supportAnnoucmentVisible"
														label="Hide Support Announcement Field"
														name="supportAnnoucmentVisible"
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
										<TabPane tabId={2}>
											<Form id="pfxEmailForm">
												<FormGroup>
													<Label htmlFor="pfxEmail">Email Receipents</Label>
													<TagsInput
														value={this.state.pfxEmails}
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
																	onClick={e => this.changePFXFields(e)}
																/>
																<CustomInput
																	type="checkbox"
																	id="pfxoperatorCustomCheckbox"
																	label="Operator"
																	name="operator"
																	onClick={e => this.changePFXFields(e)}
																/>
																<CustomInput
																	type="checkbox"
																	id="dateCustomCheckbox"
																	label="Date"
																	name="date"
																	onClick={e => this.changePFXFields(e)}
																/>
																<CustomInput
																	type="checkbox"
																	id="logInCustomCheckbox"
																	label="Log In"
																	name="logIn"
																	onClick={e => this.changePFXFields(e)}
																/>
																<CustomInput
																	type="checkbox"
																	id="logOutCustomCheckbox"
																	label="Log Out"
																	name="logOut"
																	onClick={e => this.changePFXFields(e)}
																/>
															</Col>
															<Col>
																<CustomInput
																	type="checkbox"
																	id="firstPitchCustomCheckbox"
																	label="First Pitch"
																	name="firstPitch"
																	onClick={e => this.changePFXFields(e)}
																/>
																<CustomInput
																	type="checkbox"
																	id="hwswIssuesCustomCheckbox"
																	label="Hardware/Software Issues"
																	name="hwswIssues"
																	onClick={e => this.changePFXFields(e)}
																/>
																<CustomInput
																	type="checkbox"
																	id="t1NotesCustomCheckbox"
																	label="T1 Notes"
																	name="t1Notes"
																	onClick={e => this.changePFXFields(e)}
																/>
																<CustomInput
																	type="checkbox"
																	id="correctionsCustomCheckbox"
																	label="Corrections"
																	name="corrections"
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
												<Button onClick={e=> this.generateTestPFxPDF(e)} size="sm" color="warning">
													<i className="fa fa-file-pdf-o"></i> Preview PDF
												</Button>
											</Form>
										</TabPane>
										<TabPane tabId={3}>
											<p>
												Irure enim occaecat labore sit qui aliquip reprehenderit amet velit. Deserunt ullamco ex elit
												nostrud ut dolore nisi officia magna sit occaecat laboris sunt dolor. Nisi eu minim cillum
												occaecat aute est cupidatat aliqua labore aute occaecat ea aliquip sunt amet. Aute mollit dolor
												ut exercitation irure commodo non amet consectetur quis amet culpa. Quis ullamco nisi amet qui
												aute irure eu. Magna labore dolor quis ex labore id nostrud deserunt dolor eiusmod eu pariatur
												culpa mollit in irure.
											</p>
										</TabPane>
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
