import React, { Component, lazy, Suspense } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
	Badge,
	Button,
	ButtonDropdown,
	ButtonGroup,
	ButtonToolbar,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	CardTitle,
	Col,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	Progress,
	Row,
	Table
} from "reactstrap";
//import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { getStyle, hexToRgba } from "@coreui/coreui/dist/js/coreui-utilities";

//const Widget03 = lazy(() => import('../../views/Widgets/Widget03'));

const brandPrimary = getStyle("--primary");
const brandSuccess = getStyle("--success");
const brandInfo = getStyle("--info");
const brandWarning = getStyle("--warning");
const brandDanger = getStyle("--danger");

// Card Chart 4 Data
const cardChartData4 = {
	labels: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	datasets: [
		{
			label: "My First dataset",
			backgroundColor: "rgba(255,255,255,.3)",
			borderColor: "transparent",
			//data: [78, 81, 80, 45, 34, 12, 40, 75, 34, 89, 32, 68, 54, 72, 18, 98]
			data: getRandom(16, 100, 50)
		}
	]
};

function getRandom(length, max, min) { 
  return Array(length).fill().map(() => Math.round(Math.random() * (max - min) + min));
}
// Card Chart 4 Option
const cardChartOpts4 = {
	tooltips: {
		enabled: false
		//custom: CustomTooltips
	},
	maintainAspectRatio: false,
	legend: {
		display: false
	},
	scales: {
		xAxes: [
			{
				display: false,
				barPercentage: 0.6
			}
		],
		yAxes: [
			{
				display: false
			}
		]
	}
};

const avgAuditFakeData = {
	Month: {
		data: 95.22
	},
	Day: {
		data: 3.54
	}
};

function test(params) {
	console.log(params);
}

class Dashboard extends Component {
	constructor(props) {
		super(props);

		//Binding states
		this.toggle = this.toggle.bind(this);
		this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
		this.changeValueAvgAudit = this.changeValueAvgAudit.bind(this);
		this.changeValueTotalAudit = this.changeValueTotalAudit.bind(this);

		//States
		this.state = {
			dropdownOpen: false,
			radioSelected: 2,
			avgAuditdropDownValue: "Day",
			totalAuditdropDownValue: "Season"
		};
	}

	getData() {
		this.setState({ avgAuditData: avgAuditFakeData });
		console.log(this.state);
	}

	toggle() {
		this.setState({
			dropdownOpen: !this.state.dropdownOpen
		});
	}

	onRadioBtnClick(radioSelected) {
		this.setState({
			radioSelected: radioSelected
		});
	}
	changeValue(e) {
		this.setState({ dropDownValue: e.currentTarget.textContent });
	}
	changeValueAvgAudit(e) {
		this.setState({ avgAuditdropDownValue: e.currentTarget.textContent });
	}
	changeValueTotalAudit(e) {
		this.setState({ totalAuditdropDownValue: e.currentTarget.textContent });
	}

	render() {
		return (
			<div className="animated fadeIn">
				<Row>
					<Col xs="12" sm="6" lg="3">
						<Card className="text-white bg-success border-secondary">
							<CardHeader>
								Average Audits {this.state.avgAuditdropDownValue}
								<ButtonGroup className="float-right">
									<ButtonDropdown
										id="avgAuditCard"
										isOpen={this.state.avgAuditCard}
										toggle={() => {
											this.setState({ avgAuditCard: !this.state.avgAuditCard });
										}}
									>
										<DropdownToggle caret className="p-0" color="transparent">
											<i className="icon-settings"></i>{" "}
										</DropdownToggle>
										<DropdownMenu right>
											<DropdownItem
												id="test"
												onClick={this.changeValueAvgAudit}
											>
												Month
											</DropdownItem>
											<DropdownItem
												id="test"
												onClick={this.changeValueAvgAudit}
											>
												Week
											</DropdownItem>
											<DropdownItem onClick={this.changeValueAvgAudit}>
												Day
											</DropdownItem>
										</DropdownMenu>
									</ButtonDropdown>
								</ButtonGroup>
							</CardHeader>
							<CardBody className="pb-0">
								<div
									id="avgAuditDataDiv"
									className="text-value"
									style={{ fontSize: "30px" }}
								>
									{/* This is how we change data based on state. This should probably be done different.
                   Will this work on report submit? Or will we have to refresh */}
									{this.state.avgAuditdropDownValue == "Day"
										? JSON.stringify(avgAuditFakeData.Day.data)
										: JSON.stringify(avgAuditFakeData.Month.data)}
								</div>
							</CardBody>
							<div className="chart-wrapper mx-3" style={{ height: "70px" }}>
								<Bar
									data={cardChartData4}
									options={cardChartOpts4}
									height={70}
								/>
							</div>
						</Card>
					</Col>
					<Col xs="12" sm="6" lg="3">
						<Card className="text-white bg-primary border-secondary">
							<CardHeader>
								Total Audits {this.state.totalAuditdropDownValue}
								<ButtonGroup className="float-right">
									<ButtonDropdown
										id="totalAuditCard"
										isOpen={this.state.totalAuditCard}
										toggle={() => {
											this.setState({
												totalAuditCard: !this.state.totalAuditCard
											});
										}}
									>
										<DropdownToggle caret className="p-0" color="transparent">
											<i className="icon-settings"></i>{" "}
										</DropdownToggle>
										<DropdownMenu right>
											<DropdownItem onClick={this.changeValueTotalAudit}>
												Season
											</DropdownItem>
											<DropdownItem onClick={this.changeValueTotalAudit}>
												Week
											</DropdownItem>
											<DropdownItem onClick={this.changeValueTotalAudit}>
												Month
											</DropdownItem>
										</DropdownMenu>
									</ButtonDropdown>
								</ButtonGroup>
							</CardHeader>
							<CardBody className="pb-0">
								<div
									id="totalAuditDataDiv"
									className="text-value"
									style={{ fontSize: "30px" }}
								>
									{/* This is how we change data based on state. This should probably be done different.
                   Will this work on report submit? Or will we have to refresh */}
									{this.state.totalAuditdropDownValue == "Month"
										? JSON.stringify(avgAuditFakeData.Day.data)
										: JSON.stringify(avgAuditFakeData.Month.data)}
								</div>
							</CardBody>
							<div className="chart-wrapper mx-3" style={{ height: "70px" }}>
								<Bar
									data={cardChartData4}
									options={cardChartOpts4}
									height={70}
								/>
							</div>
						</Card>
					</Col>
				</Row>
			</div>
		);
	}
}
export default Dashboard;

{
	/* <Col xs="12" sm="6" lg="3">
						<Card className="text-white bg-primary">
							<CardBody className="pb-0">
								<ButtonGroup className="float-right">
									<Dropdown
										id="card2"
										isOpen={this.state.card2}
										toggle={() => {
											this.setState({ card2: !this.state.card2 });
										}}
									>
										<DropdownToggle className="p-0" color="transparent">
											<i className="icon-settings"></i>
										</DropdownToggle>
										<DropdownMenu right>
											<DropdownItem>Action</DropdownItem>
											<DropdownItem>Another action</DropdownItem>
											<DropdownItem>Something else here</DropdownItem>
										</DropdownMenu>
									</Dropdown>
								</ButtonGroup>
								<div className="text-value">325</div>
								<div>Total Audits This Season</div>
							</CardBody>
							<div className="chart-wrapper mx-3" style={{ height: "70px" }}>
								<Line
									data={cardChartData1}
									options={cardChartOpts1}
									height={70}
								/>
							</div>
						</Card>
					</Col>

					<Col xs="12" sm="6" lg="3">
						<Card className="text-white bg-warning">
							<CardBody className="pb-0">
								<ButtonGroup className="float-right">
									<Dropdown
										id="card3"
										isOpen={this.state.card3}
										toggle={() => {
											this.setState({ card3: !this.state.card3 });
										}}
									>
										<DropdownToggle caret className="p-0" color="transparent">
											<i className="icon-settings"></i>
										</DropdownToggle>
										<DropdownMenu right>
											<DropdownItem>Action</DropdownItem>
											<DropdownItem>Another action</DropdownItem>
											<DropdownItem>Something else here</DropdownItem>
										</DropdownMenu>
									</Dropdown>
								</ButtonGroup>
								<div className="text-value">123</div>
								<div>Total Pitches Added This Season</div>
							</CardBody>
							<div className="chart-wrapper" style={{ height: "70px" }}>
								<Line
									data={cardChartData3}
									options={cardChartOpts3}
									height={70}
								/>
							</div>
						</Card>
					</Col>

					<Col xs="12" sm="6" lg="3">
						<Card className="text-white bg-danger">
							<CardBody className="pb-0">
								<ButtonGroup className="float-right">
									<ButtonDropdown
										id="card4"
										isOpen={this.state.card4}
										toggle={() => {
											this.setState({ card4: !this.state.card4 });
										}}
									>
										<DropdownToggle caret className="p-0" color="transparent">
											<i className="icon-settings"></i>
										</DropdownToggle>
										<DropdownMenu right>
											<DropdownItem>Action</DropdownItem>
											<DropdownItem>Another action</DropdownItem>
											<DropdownItem>Something else here</DropdownItem>
										</DropdownMenu>
									</ButtonDropdown>
								</ButtonGroup>
								<div className="text-value">98%</div>
								<div>Average Operator Resolve Percentage</div>
							</CardBody>
							<div className="chart-wrapper mx-3" style={{ height: "70px" }}>
								<Bar
									data={cardChartData4}
									options={cardChartOpts4}
									height={70}
								/>
                </div>
                </Card>
                </Col> */
}
