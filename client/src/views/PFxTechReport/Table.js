import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Input } from "reactstrap";

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
class Table extends Component {
	constructor(props) {
		super(props);

		//Binding states

		//States
		this.state = {
			rows: [{}],
			data: {}
		};
	}
	handleChange = idx => e => {
		const { name, value } = e.target;
		const rows = [...this.state.rows];
		rows[idx] = {
			[name]: value
		};
		this.setState({
			rows
		});
	};
	handleAddRow = () => {
		const item = {
			name: "",
			mobile: ""
		};
		this.setState({
			rows: [...this.state.rows, item]
		});
	};
	handleRemoveSpecificRow = idx => () => {
		const rows = [...this.state.rows];
		rows.splice(idx, 1);
		this.setState({ rows });
	};

	changeAB(e, key) {
		// console.log(this.state.data[key]);
		// let location = data[key].atBat;
		// console.log("location",location)
		this.setState({
			data:{...this.state.data, [key]: { ...this.state.data[key] , atBat:e.target.value}}
		})
		// this.setState({
		// 	data: { ...this.state.data, [key]{atBat}: { ...this.state.data.key, atBat: e.target.value } }
		// });
	}
	changeReason(e, key) {
		this.setState({
			data: {...this.state.data,
			[key]:{
				...this.state.data.key, changeReason: e.target.value 
			}}
		});
	}

	render() {
		// eslint-disable-next-line
		const { children, ...attributes } = this.props;
		console.log(this.state);

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
							<tr id="addr0" key={idx}>
								<td>
									<Input type="select" name="inning" id="inning">
										<option key="-1"></option>
										{innings.map((inning, idx) => {
											return (
												<option key={idx} onSelect={e => this.change(e, idx)}>
													{inning}
												</option>
											);
										})}
									</Input>
								</td>
								<td>
									<Input
										key={idx}
										id="atBat"
										type="text"
										name="atBat"
										// value={this.state.rows[idx].name}
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
										// value={this.state.rows[idx].mobile}
										className="form-control"
										onChange={e => this.changeReason(e, idx)}
									></Input>
								</td>
								<td className="text-center">
									<Button type="button" className="btn btn-danger">
										<i className="fa fa-trash"></i>
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</React.Fragment>
		);
	}
}

Table.propTypes = propTypes;
Table.defaultProps = defaultProps;

export default Table;
