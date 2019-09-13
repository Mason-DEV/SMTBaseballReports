import React, { Component } from "react";
import {
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
	NavLink,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Container
} from "reactstrap";

import logo from "../assests/images/favicon.png";

export default class AppNavbar extends Component {
	state = {
		isOpen: false
	};

	toggle = () => {
		this.setState({
			isOpen: !this.state.isOpen
		});
	};

	render() {
		return (
			<div>
				<Navbar
					color="primary"
					dark
					expand="sm"
					className="mb-5"
					style={{ color: "white" }}
				>
					<NavbarBrand href="/">
						<img src={logo} />
					</NavbarBrand>
					<NavbarBrand href="/" img src={logo}>
						SMT Baseball Reports Dashboard
					</NavbarBrand>

					<NavbarToggler onClick={this.toggle} />
					<Collapse isOpen={this.state.isOpen} navbar>
						<Nav className="ml-auto" navbar>
							<NavItem style={{ marginRight: "2rem" }}>
								<NavLink href="/">API Information</NavLink>
							</NavItem>
							{/* Dropdown menu for Audit/Tech report selections */}
							<UncontrolledDropdown
								nav
								inNavbar
								color="primary"
								style={{ marginRight: "2rem" }}
							>
								<DropdownToggle nav caret>
									Reports
								</DropdownToggle>
								<DropdownMenu right>
									<DropdownItem>FFx Tech Reports</DropdownItem>
									<DropdownItem href="/AuditReportPage">FFx Audit Reports</DropdownItem>
								</DropdownMenu>
							</UncontrolledDropdown>
							<NavItem></NavItem>
							{/* Dropdown menu for Account Stuff selections */}
							<UncontrolledDropdown nav inNavbar color="dark">
								<DropdownToggle nav caret>
									Account
								</DropdownToggle>
								<DropdownMenu right>
									<DropdownItem>Settings</DropdownItem>
									<DropdownItem>Users</DropdownItem>
									<DropdownItem>Misc Things</DropdownItem>
									<DropdownItem divider />
									<DropdownItem>Logout</DropdownItem>
								</DropdownMenu>
							</UncontrolledDropdown>
						</Nav>
					</Collapse>
				</Navbar>
			</div>
		);
	}
}
