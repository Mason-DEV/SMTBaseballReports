import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import {  UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem } from 'reactstrap';
import PropTypes from 'prop-types';
import { AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import lgLogo from '../../../src/assests/images/HeaderLogo.png';
import smLogo from '../../../src/assests/images/HeaderLogoS.png';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  constructor(props){
    super(props)
    this.state = {
      name: this.props.whoAmI,
      permission: this.props.permission
    }
    
  }
  
  render() {
    const disabled = this.props.permission.extrasPermission === false ? true : false;
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: lgLogo,  width: 89, height: 30, alt: 'SMT Logo' }}
          minimized={{  src: smLogo, width: 30, height: 30, alt: 'SMT Logo' }}
          href={'/'}
          >
           
          </AppNavbarBrand>
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            MiLB Reporting and Dashboard Site
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
        <NavItem className="d-sm-down-none">
            Logged in as, {' '} <span style={{color: 'green', fontWeight: 'bold'}}> { this.props.whoAmI}</span>
          </NavItem>
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
            <i className="fa fa-gears"></i>
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem>
              <DropdownItem tag={NavLink} disabled={disabled}  exact to="/settings"><i className="fa fa-wrench"></i>Configure</DropdownItem>

              {/* <DropdownItem header tag="div" className="text-center"><strong>Account</strong></DropdownItem> */}
              <DropdownItem tag={NavLink} disabled exact to="/profile"><i className="fa fa-user"></i> Profile</DropdownItem>

              <DropdownItem onClick={e => this.props.onLogout(e)}><i className="fa fa-lock"></i> Logout</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
