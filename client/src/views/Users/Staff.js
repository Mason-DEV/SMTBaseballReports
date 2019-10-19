import React, { Component } from "react";
import { Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';


const staff = [{
	name: "Mason Guy",
	email: "M.guy@smt.com",
	roles: {
		operator: true,
		support: true,
		auditor: true
	}
}, {
	name: "Shelby Guy",
	email: "s.guy@smt.com",
	roles: {
		operator: true,
		support: false,
		auditor: false
	}
}];

class Support extends Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}
	render() {

		return (
			<Card>
				<CardHeader>
					<i className="fa fa-user"></i> Staff Management Table
					<div className="card-header-actions">
						Add
					</div>
						</CardHeader>
				<CardBody>
					<Table bordered striped responsive size="sm">
						<thead>
							<tr>
								<th width="150">Actions</th>
								<th>Name</th>
								<th>Email</th>
								<th>Roles</th>
							</tr>
						</thead>
						<tbody>
							{staff.map((item, i) => {
								return (
									<tr key={i}>
										<td><button>Edit</button> <button>Delete</button></td>
										<td>{item.name}</td>
										<td>{item.email}</td>
										<td>
											{item.roles.support ? <Badge color="secondary">Support</Badge> : null}{" "}
											{item.roles.operator ? <Badge color="warning">Operator</Badge> : null}{" "}
											{item.roles.auditor ? <Badge color="info">Auditor</Badge> : null}
										</td>
									</tr>
								)
							})}
						</tbody>
					</Table>
				</CardBody>
			</Card>
		);
	}
}
export default Support;