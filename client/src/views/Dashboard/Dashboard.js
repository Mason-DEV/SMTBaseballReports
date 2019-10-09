import React, { Component } from "react";
import { Bar, Line } from "react-chartjs-2";
import {Button, ButtonDropdown,	ButtonGroup,Card, Collapse,CardBody,CardHeader,Col,DropdownItem,DropdownMenu,	DropdownToggle,	Row, Table,} from "reactstrap";
import axios from 'axios';
import spinner from "../../assests/images/smtSpinner.gif";

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
	return Array(length)
		.fill()
		.map(() => Math.round(Math.random() * (max - min) + min));
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


class Dashboard extends Component {
	constructor(props) {
		super(props);

		//Binding states
		this.toggle = this.toggle.bind(this);
		this.toggleAnnouc = this.toggleAnnouc.bind(this);
		this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
		this.changeValueAvgAudit = this.changeValueAvgAudit.bind(this);
		this.changeValueTotalAudit = this.changeValueTotalAudit.bind(this);
		this.changeValuePitches = this.changeValuePitches.bind(this);

		//States
		this.state = {
			collapse: false,
			isLoading: true,
			data: {},
			accordion: [true, false, false],
			dropdownOpen: false,
			radioSelected: 2,
			avgAuditdropDownValue: "Day",
			totalAuditdropDownValue: "Season",
      pitchesdropDownValue: "Season",
      dashData: {
          playsResolved: 0,
          gdSync: 0,
          missedPitches: 0,
          missedBIP: 0, 
          addedPitches: 0, 
        }
		};
	}

	// Fetch audit data on first mount
	componentDidMount() {
		axios.get('/api/audits')
			.then(res => { this.setState({ data: res.data }); })
			.then(isLoading =>{ this.setState({ isLoading: false }); })
			.then(resDash =>{ this.setState({ dashData: {
				...this.state.dashData,
				playsResolved: this.calcPlaysResolved(),
				gdSync: this.calcGDSync(),
				missedPitches: this.calcMissedPitches(),
				missedBIP: this.calcMissedBIP(),
				addedPitches: this.calcAddedPitches(),
				}}); })
			.catch(function (error) {
			console.log(error);
			})
	}

	toggle() {
		this.setState({
			dropdownOpen: !this.state.dropdownOpen
		});
	}
	toggleAnnouc() {
		this.setState({ collapse: !this.state.collapse });
	  }

	onRadioBtnClick(radioSelected) {
		this.setState({
			radioSelected: radioSelected
		});
	}

	changeValueAvgAudit(e) {
		this.setState({ avgAuditdropDownValue: e.currentTarget.textContent });
	}
	changeValueTotalAudit(e) {
		this.setState({ totalAuditdropDownValue: e.currentTarget.textContent });
	}
	changeValuePitches(e) {
		this.setState({ pitchesdropDownValue: e.currentTarget.textContent });
	}

  //Calulations for DataonDash
  
  //getsTotalFFxPlaysResolved
	calcPlaysResolved() {
		var plays=[];
		this.state.data.forEach(element => {
      plays.push(+element.ffxPitches)
			
    });
    const sum = plays.reduce((partial_sum, a) => partial_sum + a,0);
   // console.log("sum",sum);
    return sum
  }
  //gets totalSync for all games
	calcGDSync() {
		var rawData=[];
		this.state.data.forEach(element => {
      //console.log()
      var perct = (+element.ffxPitches / +element.gdPitches).toFixed(2);
      if(!isNaN(perct))

      rawData.push(+perct)
    });
    const sum = rawData.reduce((partial_sum, a) => partial_sum + a,0);
    const avg = ((sum / rawData.length) * 100).toFixed(2);
    return avg;
  }
  //gets totalMissedPitches for all games
	calcMissedPitches() {
    var rawData=[];
		this.state.data.forEach(element => {
      var missed = +element.missedPitches
      rawData.push(isNaN(missed) ? 0 : missed)
      
    });
    const sum = rawData.reduce((partial_sum, a) => partial_sum + a,0);
    return sum
  }

  //gets totalMissedBIP for all games
	calcMissedBIP() {
    var rawData=[];
		this.state.data.forEach(element => {
      var missed = +element.missedBIP
      rawData.push(isNaN(missed) ? 0 : missed)

    });
    const sum = rawData.reduce((partial_sum, a) => partial_sum + a,0);

    return sum
  }

  //gets totalAddedPitches for all games
	calcAddedPitches() {
    var rawData=[];
		this.state.data.forEach(element => {
      var added = +element.pitchesAdd
      rawData.push(isNaN(added) ? 0 : added)

    });
    const sum = rawData.reduce((partial_sum, a) => partial_sum + a,0);

    return sum
  }

	render() {
		//Loading State Show Spinner
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
			//Not Loading show compenents
     		console.log(this.state);
			return (
				
				<div className="animated fadeIn">
					{/* Announcement ROW */}
					<Row>
						<Col>
						<Card className="bg-secondary">
								<CardHeader>
								<i className="fa fa-bullhorn"></i>
									<strong>Announcements</strong>
								<div className="card-header-actions">
									 {/*eslint-disable-next-line*/}
								<a style={{cursor: 'pointer'}} className="card-header-action btn btn-minimize" data-target="#collapseExample" onClick={this.toggleAnnouc}><i className="icon-arrow-down"></i></a>
								
								</div>
								</CardHeader>
								<Collapse isOpen={this.state.collapse} id="collapseExample">
								<CardBody>
									12345
								</CardBody>
								</Collapse>
							</Card>
					
						</Col>
					</Row>
					{/* Cards ROW 1 */}
					<Row>
						{/* Card 1 - Average Audits */}
						<Col xs="12" sm="6" lg="3">
							<Card className="text-white bg-success border-secondary">
								<CardHeader>
									Average Audits {this.state.avgAuditdropDownValue}
									<ButtonGroup className="float-right">
										<ButtonDropdown
											id="avgAuditCard"
											isOpen={this.state.avgAuditCard}
											toggle={() => {
												this.setState({
													avgAuditCard: !this.state.avgAuditCard
												});
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
										1234
									</div>
								</CardBody>
								<div className="chart-wrapper mx-3" style={{ height: "70px" }}>
									<Line
										data={cardChartData4}
										options={cardChartOpts4}
										height={70}
									/>
								</div>
							</Card>
						</Col>
						{/* Card 2 - Total Audits */}
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
										1234
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

						{/* Card 3 - Average Operator Resolve */}
						<Col xs="12" sm="6" lg="3">
							<Card className="text-white bg-danger border-secondary">
								<CardHeader>Average Op Resolve Percentage</CardHeader>
								<CardBody className="pb-0">
									<div
										id="totalAuditDataDiv"
										className="text-value"
										style={{ fontSize: "30px" }}
									>
										80%
									</div>
								</CardBody>
								<div className="chart-wrapper mx-3" style={{ height: "70px" }}>
									<Line
										data={cardChartData4}
										options={cardChartOpts4}
										height={70}
									/>
								</div>
							</Card>
						</Col>

						{/* Card 4 - Pitches Added */}
						<Col xs="12" sm="6" lg="3">
							<Card className="text-white bg-info border-secondary">
								<CardHeader>
									Total Pitches Added {this.state.pitchesdropDownValue}
									<ButtonGroup className="float-right">
										<ButtonDropdown
											id="totalPitchesCard"
											isOpen={this.state.totalPitchesCard}
											toggle={() => {
												this.setState({
													totalPitchesCard: !this.state.totalPitchesCard
												});
											}}
										>
											<DropdownToggle caret className="p-0" color="transparent">
												<i className="icon-settings"></i>{" "}
											</DropdownToggle>
											<DropdownMenu right>
												<DropdownItem onClick={this.changeValuePitches}>
													Season
												</DropdownItem>
												<DropdownItem onClick={this.changeValuePitches}>
													Week
												</DropdownItem>
												<DropdownItem onClick={this.changeValuePitches}>
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
										{this.state.dashData.addedPitches}
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
					
					<Row>
						<Col>
							<Card>
								<CardHeader>
									<i className="fa fa-folder"></i>
									<strong>PFx Stuff</strong>
								</CardHeader>
								<CardBody></CardBody>
							</Card>
						</Col>
					</Row>

					{/* Row 2 - OP / Audit Performance */}

					<Row>
						<Col>
							<Card>
								<CardHeader>
									{" "}
									<i className="fa fa-dashboard"> </i>
									<strong>Operator {" & "} Auditor Performance</strong>
								</CardHeader>
								<CardBody>
									{/* Row A - Performance Box */}

									<Row>
										<Col xs="12" md="6" xl="6">
											<Row>
												<Col sm="6">
													<div className="callout callout-success">
														<small className="text-muted">
															Current Turn Over Time
														</small>
														<br />
														<strong className="h4">25 Hours</strong>
														<div className="chart-wrapper"></div>
													</div>
												</Col>
												<Col sm="6">
													<div className="callout callout-primary">
														<small className="text-muted">
															Average Audit Time
														</small>
														<br />
														<strong className="h4">3 Hours</strong>
														<div className="chart-wrapper"></div>
													</div>
												</Col>
											</Row>
											<hr className="mt-0" />
										</Col>
										<Col xs="12" md="6" xl="6">
											<Row>
												<Col sm="6">
													<div className="callout callout-danger">
														<small className="text-muted">Plays Resolved</small>
														<br />
														<strong className="h4">
															{this.state.dashData.playsResolved}
														</strong>
														<div className="chart-wrapper"></div>
													</div>
												</Col>
												<Col sm="6">
													<div className="callout callout-info">
														<small className="text-muted">GD Sync</small>
														<br />
														<strong className="h4">
															{this.state.dashData.gdSync} %
														</strong>
														<div className="chart-wrapper"></div>
													</div>
												</Col>
											</Row>
											<hr className="mt-0" />
										</Col>
									</Row>
									<br />
									{/* Row B - Performance Box */}
									<Row>
										<Col xs="12" md="6" xl="6">
											<Row>
												<Col sm="6">
													<div className="callout callout-success">
														<small className="text-muted">
															Missed Pitches due to Video Gaps
														</small>
														<br />
														<strong className="h4">
															{this.state.dashData.missedPitches}
														</strong>
														<div className="chart-wrapper"></div>
													</div>
												</Col>
												<Col sm="6">
													<div className="callout callout-primary">
														<small className="text-muted">
															Missed BIP due to Video Gaps
														</small>
														<br />
														<strong className="h4">
															{this.state.dashData.missedBIP}
														</strong>
														<div className="chart-wrapper"></div>
													</div>
												</Col>
											</Row>
											<hr className="mt-0" />
										</Col>
										<Col xs="12" md="6" xl="6">
											<Row>
												<Col sm="6">
													<div className="callout callout-danger">
														<small className="text-muted">Data Metric</small>
														<br />
														<strong className="h4">12,345</strong>
														<div className="chart-wrapper"></div>
													</div>
												</Col>
												<Col sm="6">
													<div className="callout callout-info">
														<small className="text-muted">Data Metric</small>
														<br />
														<strong className="h4">12,345</strong>
														<div className="chart-wrapper"></div>
													</div>
												</Col>
											</Row>
											<hr className="mt-0" />
										</Col>
									</Row>

									{/* Auditor Perfarmance Table */}
									{/* <Table
										hover
										responsive
										className="table-outline mb-0 d-none d-sm-table"
									>
										<thead className="thead-light">
											<tr>
												<th>Auditor</th>
												<th className="text-center">Games Audited</th>
												<th className="text-center">Pitches Added</th>
												<th className="text-center">Average Audit Time</th>
												<th className="text-center">Activity</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>
													<div>Peter Panassow</div>
												</td>
												<td className="text-center">25</td>
												<td className="text-center">25</td>
												<td className="text-center">2 Hours</td>
												<td className="text-center">
													<strong>3 Days Ago</strong>
												</td>
											</tr>
											<tr>
												<td>
													<div>Mason Guy</div>
												</td>
												<td className="text-center">15</td>
												<td className="text-center">6</td>
												<td className="text-center">3 Hours</td>
												<td className="text-center">
													<strong>10 Days Ago</strong>
												</td>
											</tr>
										</tbody>
									</Table>
									<br />
									{/* Operator Perfarmance Table 
									<Table
										hover
										responsive
										className="table-outline mb-0 d-none d-sm-table"
									>
										<thead className="thead-light">
											<tr>
												<th>Operator</th>
												<th className="text-center">Games Operated</th>
												<th className="text-center">Average Resolve %</th>
												<th className="text-center">Average Game Audit Time</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>
													<div>Thomas Rice</div>
												</td>
												<td className="text-center">40</td>
												<td className="text-center">100%</td>
												<td className="text-center" style={{ color: "green" }}>
													0 Hours
												</td>
											</tr>
											<tr>
												<td>
													<div>Miles McKinnon</div>
												</td>
												<td className="text-center">26</td>
												<td className="text-center" style={{ color: "red" }}>
													30%
												</td>
												<td className="text-center">3 Hours</td>
											</tr>
										</tbody>
									</Table> */}
								</CardBody>
							</Card>
						</Col>
					</Row>
				</div>
			);
		}
	}
}

export default Dashboard;
