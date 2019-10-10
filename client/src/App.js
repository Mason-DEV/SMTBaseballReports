import React, { Component } from 'react';
// import { HashRouter, Route, Switch } from 'react-router-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import '@coreui/coreui';
// import { renderRoutes } from 'react-router-config';
import './App.scss';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout/DefaultLayout'));


// Pages
const Login = React.lazy(() => import('./views/Login/Login'));
const Page404 = React.lazy(() => import('./views/404/Page404'));
// const Register = React.lazy(() => import('./views/Pages/Register'));
// const Page500 = React.lazy(() => import('./views/Pages/Page500'));

class App extends Component {

  render() {
    return (
      <BrowserRouter>
          <React.Suspense fallback={loading()}>
            <Switch>
              <Route path="/login" name="Login Page" render={props => <Login {...props}/>} /> 
              <Route path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
              <Route path="/" name="Home" render={props => <DefaultLayout {...props}/>} />
            </Switch>
          </React.Suspense>
            </BrowserRouter>

    );
  }
}

export default App;
