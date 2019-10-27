import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Input } from "reactstrap";
import ReactDOM from "react-dom";

const propTypes = {
	children: PropTypes.node
};

const defaultProps = {};

const innings = [
	"T1",
	"B1",
	"T2",
	"B2",
	"T3",
	"B3",
	"T4",
	"B4",
	"T5",
	"B5",
	"T6",
	"B6",
	"T7",
	"B7",
	"T8",
	"B8",
	"T9",
	"B9",
	"Extras"
];

class EditTable extends Component {
	constructor(props) {
		super(props);
		//Binding states

		//States
		this.state = {
			rows: [1],
			data: {},
			propsSet: false
		};
	}
	handleAddRow = () => {
		const item = {};
		this.setState({
			rows: [...this.state.rows, item]
	
		});
	};

	handleRemoveSpecificRow = idx => {
		// Clears fields in table
		ReactDOM.findDOMNode(this.refs[`atBat${idx}`]).value = "";
		ReactDOM.findDOMNode(this.refs[`inning${idx}`]).value = "";
		ReactDOM.findDOMNode(this.refs[`changeMade${idx}`]).value = "";
		//Clears fields from state
		delete this.state.data[idx];
	};

	changeAB(e, key) {
		this.setState({
			data: {
				...this.state.data,
				[0]: {
					...this.state.data[0],
					[key]: {
						...this.state.data[0][key],
						atBat: e.target.value
					}
				}
			},
			isMakingCorrection: true
		});
	}
	changeReason(e, key) {
		this.setState({
			data: {
				...this.state.data,
				[0]: {
					...this.state.data[0],
					[key]: {
						...this.state.data[0][key],
						changeReason: e.target.value
					}
				}
			},
			isMakingCorrection: true
		});
	}

	changeInning(e, key) {
		this.setState({
			data: {
				...this.state.data,
				[0]: {
					...this.state.data[0],
					[key]: {
						...this.state.data[0][key],
						inning: e.target.value
					}
				}
			},
			isMakingCorrection: true
		});
	}

	checkForInning(idx) {
		var value = "";
		try {
			value = this.props.correctionData[0][idx].inning;
		} catch (error) {
			value = "";
		}
		return value;
	}
	checkForAtBat(idx) {
		var value = "";
		try {
			value = this.props.correctionData[0][idx].atBat;
		} catch (error) {
			value = "";
		}
		return value;
	}
	checkForReason(idx) {
		var value = "";
		try {
			value = this.props.correctionData[0][idx].changeReason;
		} catch (error) {
			value = "";
		}
		return value;
	}

	sendData = () => {
		this.props.parentCallback(this.state.data);
	};

	setRowAmount() {
		var rowsNeeded;
		try {
			rowsNeeded = Object.keys(this.props.correctionData[0]).length 
		}
		catch(error){
			rowsNeeded = 1;
		}
		var newRows = [];
		for (var i = 0; i < rowsNeeded; i++) {
			newRows.push([i]);
		}
		this.setState({ rows: newRows });
	}

	componentDidUpdate() {
		if (this.props.correctionData && !this.state.propsSet) {
			this.setRowAmount();
			this.setState({ data: this.props.correctionData, propsSet: true });
		}
		if (this.state.isMakingCorrection) {
			this.sendData();
			this.setState({
				isMakingCorrection: false
			});
		}
	}

	render() {
		const { children, ...attributes } = this.props;
		if (this.props.correctionData && this.state.propsSet) {
			return (
				<React.Fragment>
					<table className="table table-bordered table-hover" id="tab_logic">
						<thead>
							<tr>
								<th className="text-center"> Inning </th>
								<th className="text-center"> AB # </th>
								<th className="text-center"> Change Made </th>
								<th className="text-center">
									<Button type="button" className="btn btn-success" onClick={e => this.handleAddRow(e)}>
										<i className="fa fa-plus-circle"></i>
									</Button>
								</th>
							</tr>
						</thead>
						<tbody>
							{this.state.rows.map((item, idx) => (
								<tr id={`addr${idx}`} key={idx}>
									<td>
										<Input
											type="select"
											ref={`inning${idx}`}
											name="inning"
											id="inning"
											value={this.checkForInning(idx)}
											onChange={e => this.changeInning(e, idx)}
										>
											<option key="-1"></option>
											{innings.map((inning, idx) => {
												return <option key={idx}>{inning}</option>;
											})}
										</Input>
									</td>
									<td>
										<Input
											key={idx}
											id="atBat"
											type="text"
											name="atBat"
											ref={`atBat${idx}`}
											value={this.checkForAtBat(idx)}
											className="form-control"
											onChange={e => this.changeAB(e, idx)}
										></Input>
									</td>
									<td>
										<Input
											key={idx}
											type="text"
											name="changeMade"
											id="changeMade"
											ref={`changeMade${idx}`}
											value={this.checkForReason(idx)}
											className="form-control"
											onChange={e => this.changeReason(e, idx)}
										></Input>
									</td>
									<td className="text-center">
										<Button
											type="button"
											onClick={e => {
												this.handleRemoveSpecificRow(idx);
											}}
											className="btn btn-danger"
										>
											<i className="fa fa-trash"></i>
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</React.Fragment>
			);
		} else {
			return (
				<React.Fragment>
					<table className="table table-bordered table-hover" id="tab_logic">
						<thead>
							<tr>
								<th className="text-center"> Inning </th>
								<th className="text-center"> AB # </th>
								<th className="text-center"> Change Made </th>
								<th className="text-center">
									<Button type="button" className="btn btn-success" onClick={e => this.handleAddRow(e)}>
										<i className="fa fa-plus-circle"></i>
									</Button>
								</th>
							</tr>
						</thead>
					</table>
				</React.Fragment>
			);
		}
	}
}

EditTable.propTypes = propTypes;
EditTable.defaultProps = defaultProps;
export default EditTable;
