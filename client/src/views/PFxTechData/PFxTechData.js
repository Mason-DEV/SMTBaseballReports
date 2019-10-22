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
	CardTitle,
	CardText
} from "reactstrap";
import axios from "axios";
import spinner from "../../assests/images/smtSpinner.gif";
import logger from "../../components/helpers/logger";
import classnames from "classnames";

class PFxTechData extends Component {
	constructor(props) {
		super(props);
		this.toggle = this.toggle.bind(this);

		this.state = {
			isLoading: false,
			reportData: {},
			activeTab: new Array(4).fill("1")
		};
	}

	toggle(tabPane, tab) {
		const newArray = this.state.activeTab.slice();
		newArray[tabPane] = tab;
		this.setState({
			activeTab: newArray
		});
	}
	lorem() {
		return "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.";
	}

	tabPane() {
		return (
			<>
				<TabPane tabId="1">{
                    <Table bordered striped responsive size="sm">
                    <thead>
                        <tr>
                            <th width="">Date</th>
                            <th width="">Venue</th>
                            <th width="">Operator</th>
                            <th width="">HW/SW Issues</th>
                            <th width="">T1 Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {this.state.reportData.map((venue, i) => {
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
                        })} */}
                    </tbody>
                </Table>
                }</TabPane>
				<TabPane tabId="2">{`2. ${this.lorem()}`}</TabPane>
				<TabPane tabId="3">{`3. ${this.lorem()}`}</TabPane>
			</>
		);
	}

	componentDidMount() {
		//Axios api call to get all venueData
		// axios
		// 	.get("/api/pfxTech/")
		// 	.then(res => {
		// 		this.setState({ reportData: res.data });
		// 	})
		// 	//Data is loaded, so change from loading state
		// 	.then(isLoading => this.setState({ isLoading: false }))
		// 	.catch(function(error) {
		// 		console.log(error);
		// 	});
	}

	render() {
		if (this.state.isLoading) {
			return <img src={spinner} height="150" width="150" alt="spinner" align="center" style={{ height: "100%" }} />;
		} else {
			console.log("State", this.state);
			return (
				<React.Fragment>
					<Card className="card-accent-success">
						<CardHeader tag="h5">
							<i className="icon-globe"></i> PitchFx Reports Data Table
							<div className="card-header-actions">
								{/* <Button color="success" size="sm" onClick={this.showAdd}>
									<i className="fa fa-plus"></i> New Venue
								</Button> */}
							</div>
						</CardHeader>
						<CardBody>
							<Nav tabs>
								<NavItem>
									<NavLink
										active={this.state.activeTab[0] === "1"}
										onClick={() => {
											this.toggle(0, "1");
										}}
									>
										Todays Games
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink
										active={this.state.activeTab[0] === "2"}
										onClick={() => {
											this.toggle(0, "2");
										}}
									>
										All Games
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink
										active={this.state.activeTab[0] === "3"}
										onClick={() => {
											this.toggle(0, "3");
										}}
									>
										Select Date
									</NavLink>
								</NavItem>
							</Nav>
							<TabContent activeTab={this.state.activeTab[0]}>{this.tabPane()}</TabContent>
						</CardBody>
					</Card>
				</React.Fragment>
			);
		}
	}
}

//	{/* <Table bordered striped responsive size="sm">
{
	/* <thead>
<tr>
    <th width="">Actions</th>
    <th width="">Name</th>
    <th width="">Types</th>
</tr>
</thead>
<tbody>
{/* {this.state.reportData.map((report, i) => {
    return (
        <tr key={i}>
            <td>
                <Button onClick={e => this.showEdit(report._id)} color="warning" size="sm">
                    Edit
                </Button>{" "}
                <Button onClick={e => this.showDelete(report._id, report.name)} color="danger" size="sm">
                    Delete
                </Button>
            </td>
            <td>{report.name}</td>
            <td>
                {report.fieldFx ? <Badge color="info">Field Fx</Badge> : null}{" "}
                {report.pitchFx ? <Badge color="secondary">Pitch Fx</Badge> : null}
            </td>
        </tr>
    );
})} 
</tbody>
</Table>  */
}

export default PFxTechData;
