import React, { Component } from "react";
import AppNavBar from "../../components/AppNavbar";
import {
	Card,
	CardGroup,
	Container,
	CardImg,
	CardText,
	CardBody,
	CardTitle,
	CardSubtitle,
	Button,
	Row,
	Col
} from "reactstrap";
import { Pane, Text, Table } from "evergreen-ui";

import AppNavbar from "../../components/AppNavbar";

export default class Dash extends Component {
	render() {
		return (
			<React.Fragment>
				<AppNavBar></AppNavBar>
				{/* <Container>
					<Row>
						<Pane background="base">
							<Text>Audit Leaderboard</Text>
							<Pane padding={24} marginBottom={16}>
								<Table.Head>
									<Table.TextHeaderCell>Age</Table.TextHeaderCell>
									<Table.TextHeaderCell>Email</Table.TextHeaderCell>
								</Table.Head>
							</Pane>
						</Pane>
					</Row>
				</Container> */}
			</React.Fragment>
		);
	}
}
