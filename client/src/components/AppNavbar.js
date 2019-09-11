import React, {Component} from 'react';
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
    Container } from 'reactstrap';

import logo from '../assests/images/favicon.png';



export default class AppNavbar extends Component{
        state = {
            isOpen: false
        }
        
         toggle = () => {
            this.setState({
                isOpen: !this.state.isOpen
            })
         };

         render(){
             return(
                <div>
                    <Navbar color="light" dark expand="sm" className="mb-5">
                        <NavbarBrand href="/"><img src={logo}  /></NavbarBrand>
                        <NavbarBrand href="/" img src={logo}>SMT Baseball Reports Dashboard</NavbarBrand>

                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink href="/components/">API Information</NavLink>
                            </NavItem>
                            <UncontrolledDropdown nav inNavbar color="dark">
                                <DropdownToggle nav caret>
                                Account
                                </DropdownToggle>
                                <DropdownMenu right>
                                <DropdownItem>
                                    Settings
                                </DropdownItem>
                                <DropdownItem>
                                    Users
                                </DropdownItem>
                                <DropdownItem>
                                    Misc Things
                                </DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem>
                                    Logout
                                </DropdownItem>
                                </DropdownMenu>
                        </UncontrolledDropdown>
                        </Nav>
                    </Collapse>
                    </Navbar>
                </div>
                );
                
            }
        }


