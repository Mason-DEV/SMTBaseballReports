import React, { Component } from "react";
import { Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';


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
							<i className="fa fa-align-justify"></i> Condensed Table
						</CardHeader>
						<CardBody>
							<Table bordered striped responsive size="md">
								<thead>
									<tr>
										<th>Actions</th>
										<th>Name</th>
										<th>Email</th>
										<th>Roles</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td width="150">
											<button>Edit</button> <button>Delete</button>
										</td>
										<td>Mason</td>
										<td>M.Guy@smt.com</td>
										<td>
											<Badge color="success">Support</Badge> <Badge color="warning">Operator</Badge> <Badge color="info">Auditor</Badge> <Badge color="dark">Admin</Badge>
										</td>
									</tr>
									<tr>
										<td>
											<button>Edit</button> <button>Delete</button>
										</td>
										<td>Mason</td>
										<td>M.Guy@smt.com</td>
										<td>
											<Badge color="success">Support</Badge>{" "}
											<Badge color="warning">Operator</Badge>{" "}
											<Badge color="info">Auditor</Badge>{" "}
											<Badge color="dark">Admin</Badge>
										</td>
									</tr>
								</tbody>
							</Table>
						</CardBody>
					</Card>
				);
    }
}
export default Support;