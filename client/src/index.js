import 'react-app-polyfill/ie9'; // For IE 9-11 support
import 'react-app-polyfill/stable';
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { unregister } from './registerServiceWorker';
// in index.js
import packageJson from '../package.json';
import {provider} from 'react-redux';
// import store from './store';

//Redux store
import { combineReducers, createStore } from 'redux';
function productsReducer(state =[], action){
    return state;
}


function userReducer(state = '', action){
    return state;
}

const allReducers = combineReducers({
    products: productsReducer,
    user: userReducer
});

const store = createStore(allReducers, {
    products: [{name: 'iPhone'}], user: 'Mason'
});

console.log(store.getState());



unregister();
ReactDOM.render(<App />,	document.getElementById("root")
);
// registerServiceWorker();
