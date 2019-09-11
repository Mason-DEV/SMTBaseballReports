import React, {Component} from 'react';
import AppNavBar from './components/AppNavbar';
import ShoppingList from './components/ShoppingList';
import ItemModal from './components/ItemModal';
import { Container } from 'reactstrap';

import { Provider } from 'react-redux';
import store from './store';

//import 'bootstrap/dist/css/bootstrap.min.css';
import './assests/css/bootstrap.min.css'
import './App.css';

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="app">
          <AppNavBar></AppNavBar>
          <Container>
            <ItemModal></ItemModal>
            <ShoppingList></ShoppingList>
          </Container>
        </div>
      </Provider>
    );
  }
}

