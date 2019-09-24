import React, { Component} from "react";

import {

	Card,
	CardBody,
	CardHeader,

} from "reactstrap";

import { MDBDataTable  } from 'mdbreact';

//import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

// import lgLogo from "../../../src/assests/images/SMT_Report_Tag.jpg";
import spinner from "../../assests/images/smtSpinner.gif";

import ModalComponent from './Modals/ModalComponent'

//const Widget03 = lazy(() => import('../../views/Widgets/Widget03'));


const tableData = {
	columns: [
		{
			label: '',
			field: 'edit',
			sort: 'asc'
			
		},
		{
			label: "Gamestring",
			field: "gamestring",
			sort: "asc",

		},
		{
			label: "Operator",
			field: "operator",
			sort: "asc"
		},
		{
			label: "Auditor",
			field: "auditor",
			sort: "asc"
		},
		{
			label: "GD Pitches",
			field: "gdpitches",
			sort: "asc"
		},
		{
			label: "FFx Pitches",
			field: "ffxpitches",
			sort: "asc"
		},
		
		{
			label: "Missed Pitches",
			field: "missedpitches",
			sort: "asc"
		},
		{
			label: "Missed BIP",
			field: "missedbip",
			sort: "asc"
		},
		{
			label: "Added Pitches",
			field: "addedpitches",
			sort: "asc"
		},
		{
			label: "Added Picks",
			field: "addedpicks",
			sort: "asc"
		}
	],
	rows: [{}]
};

class FFxAuditData extends Component {
	constructor(props) {
		super(props);
		console.log(props)

		//Binding states
		this.toggle = this.toggle.bind(this);
		this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
		//Table stuff
		this.pageSize = 50;

		//States
		this.state = {
			dropdownOpen: false,
			radioSelected: 2,
			isLoading: true,
			data: {},
			modalOpen: false
		};
	}

	handleClick(e, index) {
		e.preventDefault();

		this.setState({
			currentPage: index
		});
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

	// Fetch audit data on first mount
	componentDidMount() {
		this.getAuditData();
		
	}
	// Retrieves the data of from the Express api
	getAuditData = () => {
		fetch("/api/audits")
			.then(res => res.json())
			.then(data => this.setState({ data }))
			//Data is loaded, so change from loading state
			.then(isLoading => this.setState({ isLoading: false }));
			
	};

	_viewRecord(_id) {    
		console.log("mongo _id", _id);
		this.setState({modalOpen: true});	
		console.log(this.state)
    }
	_editRecord(_id) {    
		console.log("mongo _id", _id);
    }

	dataPopulate() {
		//console.log("pop",this.state.data);
		this.state.data.forEach(element => {
			tableData.rows.push({
						edit: <div>
									<ModalComponent props={{element, color:"success", name: "View"}}></ModalComponent>
									<ModalComponent props={{element, color:"danger", name:"Edit"}}></ModalComponent>
									
									{/* <Button  color="danger" size="sm" onClick={() => {this._editRecord(element._id)}}>Edit</Button>  */}
									</div>,
						gamestring: element.gamestring,
						operator: element.operator,
						auditor: element.auditor,
						gdpitches: element.gdPitches,
						ffxpitches: element.ffxPitches,
						missedpitches: element.missedPitches,
						missedbip: element.missedBIP,
						addedpitches: element.pitchesAdd,
						addedpicks: element.pickAdd
						})
		});

	}

	render() {
		if (!this.state.isLoading) {

			this.dataPopulate();
			return (
				<div className="animated fadeIn">
				
					<br />
					
					<Card className="card-accent-success">
						<CardHeader>
							<i className="icon-globe"></i> FieldFx Audit Reports Data Table
						</CardHeader>
						<CardBody>

							<MDBDataTable
							style={{cursor: "pointer"}}
							//responsive
							hover
							entries={20} 
							displayEntries={false}
							striped bordered small data={tableData}></MDBDataTable>
						</CardBody>
					</Card>
					
				</div>
			);
		} else {
			return  <img src={spinner} height="150" width="150" alt="spinner" align="center" style={{height: "100%"}}/>
		}
	}
}
export default FFxAuditData;
