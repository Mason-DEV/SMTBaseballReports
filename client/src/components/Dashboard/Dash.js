import React, {Component} from 'react';
import AppNavBar from '../../components/AppNavbar';
//import ShoppingList from './components/ShoppingList';
//import ItemModal from './components/ItemModal';
import { Container } from 'reactstrap';

import { Provider } from 'react-redux';
import store from '../../store';

//import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assests/css/bootstrap.min.css'
import '../../App.css';

export default class Dash extends Component {
  render() {
    return (
        <React.Fragment>
            <AppNavBar></AppNavBar>
            <div>Home Page</div>
        </React.Fragment>
    );
  }
}