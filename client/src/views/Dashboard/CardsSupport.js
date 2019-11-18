//Layout for Support
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Bar, Line } from "react-chartjs-2";
import {
	Button,
	ButtonDropdown,
	ButtonGroup,
	Card,
	Collapse,
	CardBody,
	CardHeader,
	Col,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	Row,
	Table
} from "reactstrap";
import axios from 'axios'
import spinner from "../../assests/images/smtSpinner.gif";
import logger from '../../components/helpers/logger';


const propTypes = {
	children: PropTypes.node
};

const defaultProps = {};

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

function getRandom(length, max, min) {
	return Array(length)
		.fill()
		.map(() => Math.round(Math.random() * (max - min) + min));
}




class CardsSupport extends Component {
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
			collapse: true,
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
				addedPitches: 0
			}
        };
        
    }
    // Fetch audit data on first mount
	componentDidMount() {
	
		if (this.props.permission == "op") {
			this.setState({ isLoading: false });
		} else {

              Promise.all([
                axios.get("/api/FFxAudit/"),
                axios.get("/api/settings/supportAnnouncement")
            ])
                .then(([auditResponse, supportResponse]) => {
                    const data = auditResponse.data;
                    const supportAnnounce = supportResponse.data ? supportResponse.data.details.AnnouncementText : "";
                    this.setState({ data, supportAnnounce});
                })
                .then(isLoading =>
                    this.setState({
                        isLoading: false
                    })
                )
                .then(resDash => {
					this.setState({
						dashData: {
							...this.state.dashData,
							playsResolved: this.calcPlaysResolved(),
							gdSync: this.calcGDSync(),
							missedPitches: this.calcMissedPitches(),
							missedBIP: this.calcMissedBIP(),
							addedPitches: this.calcAddedPitches()
						}
					})
                })
                .catch(function(error) {
                    console.log(error);
					logger("error", error);
				});


			// axios
			// 	.get("/api/FFxAudit/")
			// 	.then(res => {
			// 		this.setState({ data: res.data });
			// 	})
			// 	.then(isLoading => {
			// 		this.setState({ isLoading: false });
			// 	})
			// 	.then(resDash => {
			// 		this.setState({
			// 			dashData: {
			// 				...this.state.dashData,
			// 				playsResolved: this.calcPlaysResolved(),
			// 				gdSync: this.calcGDSync(),
			// 				missedPitches: this.calcMissedPitches(),
			// 				missedBIP: this.calcMissedBIP(),
			// 				addedPitches: this.calcAddedPitches()
			// 			}
			// 		});
			// 	})
			// 	.catch(function(error) {
			// 		logger("error", error);
			// 	});
        }
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
		var plays = [];
		this.state.data.forEach(element => {
			plays.push(+element.ffxPitches);
		});
		const sum = plays.reduce((partial_sum, a) => partial_sum + a, 0);
		return sum;
	}
	//gets totalSync for all games
	calcGDSync() {
		var rawData = [];
		this.state.data.forEach(element => {
	
			var perct = (+element.ffxPitches / +element.gdPitches).toFixed(2);
			if (!isNaN(perct)) rawData.push(+perct);
		});
		const sum = rawData.reduce((partial_sum, a) => partial_sum + a, 0);
		const avg = ((sum / rawData.length) * 100).toFixed(2);
		return avg;
	}
	//gets totalMissedPitches for all games
	calcMissedPitches() {
		var rawData = [];
		this.state.data.forEach(element => {
			var missed = +element.missedPitches;
			rawData.push(isNaN(missed) ? 0 : missed);
		});
		const sum = rawData.reduce((partial_sum, a) => partial_sum + a, 0);
		return sum;
	}

	//gets totalMissedBIP for all games
	calcMissedBIP() {
		var rawData = [];
		this.state.data.forEach(element => {
			var missed = +element.missedBIP;
			rawData.push(isNaN(missed) ? 0 : missed);
		});
		const sum = rawData.reduce((partial_sum, a) => partial_sum + a, 0);

		return sum;
	}

	//gets totalAddedPitches for all games
	calcAddedPitches() {
		var rawData = [];
		this.state.data.forEach(element => {
			var added = +element.pitchesAdd;
			rawData.push(isNaN(added) ? 0 : added);
		});
		const sum = rawData.reduce((partial_sum, a) => partial_sum + a, 0);

		return sum;
    }
    
	render() {
		// eslint-disable-next-line
        const { children, ...attributes } = this.props;
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
                )
            }
            else{
                console.log(this.state);
                return(
                    <React.Fragment>
                    <Row>
                        <Col>
                            <Card className="bg-secondary" style={{display: "show"}}>
                                <CardHeader>
                                    <i className="fa fa-bullhorn"></i>
                                    <strong>Announcements</strong>
                                    <div className="card-header-actions">
                                        {/*eslint-disable-next-line*/}
                                        <a
                                            style={{ cursor: "pointer" }}
                                            className="card-header-action btn btn-minimize"
                                            data-target="#collapseExample"
                                            onClick={this.toggleAnnouc}
                                        >
                                            <i className="icon-arrow-down"></i>
                                        </a>
                                    </div>
                                </CardHeader>
                                <Collapse isOpen={this.state.collapse} id="collapseExample">
                                    <CardBody>{this.state.supportAnnounce}</CardBody>
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
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </React.Fragment>
                )
            }
			
	}
}

CardsSupport.propTypes = propTypes;
CardsSupport.defaultProps = defaultProps;

export default CardsSupport;
