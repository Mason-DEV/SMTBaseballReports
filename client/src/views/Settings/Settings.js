import React, { Component } from "react";
import {
	Alert,
	Card,
	CardBody,
	CardHeader,
	CustomInput,
	Form,
	Col,
	FormGroup,
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
import {getJwt} from "../../components/helpers/jwt";
import "./settingStyles.css";
import { saveAs } from "file-saver";
import APIHelper from "../../components/helpers/APIHelper";

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
		this.changePFXTask = this.changePFXTask.bind(this);
		this.onSubmitPFxDaily = this.onSubmitPFxDaily.bind(this);
		this.generateTestPFxPDF = this.generateTestPFxPDF.bind(this);
		//Email Functions

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
					// Fields: {}
				}
			},
			ffxDailyEmail: {
				details: {
					Emails: [],
					// Fields: {}
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
					// Fields: {
					// 	...prevState.pfxDailyEmail.details.Fields,
					// 	[e.target.name]: e.target.checked
					// }
				}
			}
		}));
	}

	changePFXTask(e) {
		e.persist();
		this.setState(prevState => ({
			...prevState,
			pfxDailyEmail: {
				...prevState.pfxDailyEmail,
				details: {
					...prevState.pfxDailyEmail.details,
					[e.target.name]: e.target.checked
				}
			}
		}));
	}

	onSubmitPFxDaily(e) {
		e.preventDefault();
		const details = this.state.pfxDailyEmail.details;
		const edit = { details };
		axios
			.put(APIHelper.updateSettingsPFxDailyAPI + this.state.pfxDailyEmail._id, edit , { headers: { Authorization: `Bearer ${getJwt()}` } })
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
		const Fields = this.state.pfxDailyEmail.details.Fields;
		const details = { Fields };
		axios
			.post(APIHelper.buildTestPFxDailyPDFAPI, details, { responseType: "blob",   headers: { Authorization: `Bearer ${getJwt()}` }  })
			.then(res => {
				const pdfBlob = new Blob([res.data], { type: "application/pdf" });
				saveAs(pdfBlob, "PFx Daily Preview.pdf");
			})
			.catch(error => {
				logger("error", "generateTestPFxPDF Submit === " + error);
			});
	}
	generateTestFFxPDF(e) {
		const Fields = this.state.ffxDailyEmail.details.Fields;
		const details = { Fields };
		axios
			.post(APIHelper.buildTestFFxDailyPDFAPI, details, { responseType: "blob",   headers: { Authorization: `Bearer ${getJwt()}` }  })
			.then(res => {
				const pdfBlob = new Blob([res.data], { type: "application/pdf" });
				saveAs(pdfBlob, "FFx Daily Preview.pdf");
			})
			.catch(error => {
				logger("error", "generateTestFFxPDF Submit === " + error);
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
		axios
			.put(APIHelper.updateSettingsAnnouncementAPI + this.state.opAnnounce._id, edit,  { headers: { Authorization: `Bearer ${getJwt()}` } })
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
			.put(APIHelper.updateSettingsAnnouncementAPI + this.state.supportAnnounce._id, edit,  { headers: { Authorization: `Bearer ${getJwt()}` } })
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
			axios.get(APIHelper.getSettingsOPAnnounceAPI, { headers: { Authorization: `Bearer ${getJwt()}` } }),
			axios.get(APIHelper.getSettingsSupportAnnounceAPI, { headers: { Authorization: `Bearer ${getJwt()}` } }),
			axios.get(APIHelper.getSettingsPFxDailyEmailAPI, { headers: { Authorization: `Bearer ${getJwt()}` } }),
			axios.get(APIHelper.getSettingsFFxDailyEmailAPI, { headers: { Authorization: `Bearer ${getJwt()}` } })
		])
			.then(([opResponse, supportResponse, pfxDailyResponse, ffxDailyResponse]) => {
				const opAnnounce = opResponse.data;
				const supportAnnounce = supportResponse.data;
				const pfxDaily = pfxDailyResponse.data;
				const ffxDaily = ffxDailyResponse.data;
				this.setState({
					opAnnounce: opAnnounce,
					supportAnnounce: supportAnnounce,
					pfxDailyEmail: pfxDaily,
					ffxDailyEmail: ffxDaily
				});
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
											Audit Report Email Status
										</ListGroupItem>
									</ListGroup>
								</Col>
								<Col>
									<TabContent style={{ borderRadius: "5px" }} activeTab={this.state.activeTab}>
										<TabPane tabId={0}>
											<Form id="opAnnounceForm" onSubmit={e => this.onSubmitOP(e)}>
												<FormGroup>
													<h4 htmlFor="opAnnounce">Op Announcement</h4>
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
													<h4 htmlFor="supportAnnounce">Support Announcement</h4>
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
													<h4 htmlFor="pfxEmail">PFX Daily Email Receipents</h4>
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
													<CustomInput
														type="checkbox"
														id="pfxTaskVisible"
														label="Run/Send PFx Daily Summary Task"
														name="runTask"
														defaultChecked={this.state.pfxDailyEmail.details.runTask}
														onClick={e => this.changePFXTask(e)}
													/>
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
													<h4 htmlFor="ffxEmail">FFx Daily Email Receipents</h4>
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
													<CustomInput
														type="checkbox"
														id="ffxTaskVisible"
														label="Run/Send FFx Daily Summary Task"
														name="runTask"
														defaultChecked={this.state.ffxDailyEmail.details.runTask}
														onClick={e => this.changeFFXTask(e)}
													/>
												</FormGroup>
												<Button disabled type="submit" size="sm" color="success">
													<i className="fa fa-check"></i> Save
												</Button>{" "}
												<Button onClick={e => this.generateTestFFxPDF(e)} size="sm" color="warning">
													<i className="fa fa-file-pdf-o"></i> Preview PDF
												</Button>
											</Form>
										</TabPane>
										<TabPane tabId={4}>
											<h4 htmlFor="">Audit Email Sent Status</h4>
											<div style={{maxHeight: '200px', overflowY: "auto"}}>
											 {/* <ListGroup>
												<ListGroupItem>Cras justo odio</ListGroupItem>
												<ListGroupItem>Dapibus ac facilisis in</ListGroupItem>
												<ListGroupItem>Morbi leo risus</ListGroupItem>
												<ListGroupItem>Porta ac consectetur ac</ListGroupItem>
												<ListGroupItem>Vestibulum at eros</ListGroupItem>
											</ListGroup> */}
											</div>
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
