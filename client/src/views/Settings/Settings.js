import React, { Component } from "react";
import {
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
import axios from "axios";
import spinner from "../../assests/images/smtSpinner.gif";

class Settings extends Component {
	constructor(props) {
		super(props);
		this.toggle = this.toggle.bind(this);
		this.state = {
			activeTab: 1
		};
	}

	toggle(tab) {
		if (this.state.activeTab !== tab) {
			this.setState({
				activeTab: tab
			});
		}
	}

	render() {
		return (
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
									style={{ cursor: "pointer" }}
									onClick={() => this.toggle(0)}
									action
									active={this.state.activeTab === 0}
								>
									OPs Announcement
								</ListGroupItem>
								<ListGroupItem
									style={{ cursor: "pointer" }}
									onClick={() => this.toggle(1)}
									action
									active={this.state.activeTab === 1}
								>
									Support Announcement
								</ListGroupItem>
								{/* <ListGroupItem disabled onClick={() => this.toggle(2)} action active={this.state.activeTab === 2}>
									Tab 3
								</ListGroupItem>
								<ListGroupItem disabled onClick={() => this.toggle(3)} action active={this.state.activeTab === 3}>
									tab 4
								</ListGroupItem> */}
							</ListGroup>
						</Col>
						<Col xs="8">
							<TabContent activeTab={this.state.activeTab}>
								<TabPane tabId={0}>
									<Form>
										<FormGroup>
											<Label htmlFor="opAnnounce">Op Announcement</Label>
											<Input
												// onChange={e => this.change(e)}
												id="opAnnounce"
												type="textarea"
												name="opAnnounce"
												style={{ height: 200 }}
												defaultValue="Cupidatat quis ad sint excepteur laborum in esse qui. Et excepteur consectetur ex nisi eu do cillum ad laborum. Mollit et eu officia dolore sunt Lorem culpa qui commodo velit ex amet id ex. Officia anim incididunt laboris deserunt anim aute dolor incididunt veniam aute dolore do exercitation. Dolor nisi culpa ex ad irure in elit eu dolore. Ad laboris ipsum reprehenderit irure non commodo enim culpa commodo veniam incididunt veniam ad."
											></Input>
										</FormGroup>
										<Button type="submit" size="sm" color="success">
											<i className="fa fa-check"></i> Post
										</Button>{" "}
										<Button type="reset" size="sm" color="danger">
											<i className="fa fa-ban"></i> Clear
										</Button>
									</Form>
								</TabPane>
								<TabPane tabId={1}>
									<Form>
										<FormGroup>
                                            <Label htmlFor="supportAnnounce">Support Announcement</Label>
											<Input
												// onChange={e => this.change(e)}
												id="supportAnnounce"
												type="textarea"
												name="supportAnnounce"
												style={{ height: 200 }}
												defaultValue="Cupidatat quis ad sint excepteur laborum in esse qui. Et excepteur consectetur ex nisi eu do cillum ad laborum. Mollit et eu officia dolore sunt Lorem culpa qui commodo velit ex amet id ex. Officia anim incididunt laboris deserunt anim aute dolor incididunt veniam aute dolore do exercitation. Dolor nisi culpa ex ad irure in elit eu dolore. Ad laboris ipsum reprehenderit irure non commodo enim culpa commodo veniam incididunt veniam ad."
											></Input>
										</FormGroup>
										<Button type="submit" size="sm" color="success">
											<i className="fa fa-check"></i> Post
										</Button>{" "}
										<Button type="reset" size="sm" color="danger">
											<i className="fa fa-ban"></i> Clear
										</Button>
									</Form>
								</TabPane>
								<TabPane tabId={2}>
									<p>
										Ut ut do pariatur aliquip aliqua aliquip exercitation do nostrud commodo reprehenderit aute ipsum
										voluptate. Irure Lorem et laboris nostrud amet cupidatat cupidatat anim do ut velit mollit consequat
										enim tempor. Consectetur est minim nostrud nostrud consectetur irure labore voluptate irure. Ipsum
										id Lorem sit sint voluptate est pariatur eu ad cupidatat et deserunt culpa sit eiusmod deserunt.
										Consectetur et fugiat anim do eiusmod aliquip nulla laborum elit adipisicing pariatur cillum.
									</p>
								</TabPane>
								<TabPane tabId={3}>
									<p>
										Irure enim occaecat labore sit qui aliquip reprehenderit amet velit. Deserunt ullamco ex elit
										nostrud ut dolore nisi officia magna sit occaecat laboris sunt dolor. Nisi eu minim cillum occaecat
										aute est cupidatat aliqua labore aute occaecat ea aliquip sunt amet. Aute mollit dolor ut
										exercitation irure commodo non amet consectetur quis amet culpa. Quis ullamco nisi amet qui aute
										irure eu. Magna labore dolor quis ex labore id nostrud deserunt dolor eiusmod eu pariatur culpa
										mollit in irure.
									</p>
								</TabPane>
							</TabContent>
						</Col>
					</Row>
				</CardBody>
			</Card>
		);
	}
}

export default Settings;
