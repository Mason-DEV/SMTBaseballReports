import React, { Component } from "react";
import PropTypes from "prop-types";
import {Button,Input } from "reactstrap";

const propTypes = {
	children: PropTypes.node
};

const defaultProps = {};

class Table extends Component {
	constructor(props) {
		super(props);

		//Binding states

		//States
		this.state = {
			rows: [{}]
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
	render() {
		// eslint-disable-next-line
		const { children, ...attributes } = this.props;

		return (
			<React.Fragment>
				<table className="table table-bordered table-hover" id="tab_logic">
					<thead>
						<tr>
							<th className="text-center"> Inning </th>
							<th className="text-center"> AB # </th>
							<th className="text-center"> Change Made </th>
							<th className="text-center">
                                <Button type="button" onClick={this.handleAddRow}className="btn btn-success"><i className="fa fa-plus-circle"></i></Button>			
							</th>
						</tr>
					</thead>
					<tbody>
						{this.state.rows.map((item, idx) => (
							<tr id="addr0" key={idx}>
								<td>
                                <Input type="select" name="inning" id="inning" value={this.state.rows[idx].name}onChange={this.handleChange(idx)} required>
											<option>T1</option>
											<option>B1</option>
											<option>T2</option>
											<option>B2</option>
											<option>T3</option>
											<option>B3</option>
											<option>T4</option>
											<option>B4</option>
											<option>T5</option>
											<option>B5</option>
											<option>T6</option>
											<option>B6</option>
											<option>T7</option>
											<option>B7</option>
											<option>T8</option>
											<option>B8</option>
											<option>T9</option>
											<option>B9</option>
											<option>Extras</option>
										</Input>
								</td>
								<td>
                                <Input id="abNumber" type="test" name="abNumber"value={this.state.rows[idx].name}onChange={this.handleChange(idx)}className="form-control"></Input>
								
								</td>
								<td>
                                <Input type="text" name="changeMade" id="changeMade" value={this.state.rows[idx].mobile} onChange={this.handleChange(idx)} className="form-control"></Input>
								
								</td>
								<td className="text-center">
                                <Button type="button" onClick={this.handleRemoveSpecificRow(idx)} className="btn btn-danger"><i className="fa fa-trash"></i></Button>		
									
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
