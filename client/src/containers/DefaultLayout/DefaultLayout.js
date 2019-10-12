import React, { Component, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import * as router from "react-router-dom";
import { Container } from "reactstrap";
import {getJwt} from "../../components/helpers/jwt"
import { withRouter } from "react-router-dom";

import {
	AppBreadcrumb,
	AppFooter,
	AppHeader,
	AppSidebar,
	AppSidebarForm,
	AppSidebarHeader,
	AppSidebarMinimizer,
	AppSidebarNav2 as AppSidebarNav
} from "@coreui/react";
// sidebar nav config
import navigation from "../../_nav";
// routes config
import routes from "../../routes";
const AuthComponent = React.lazy(() => import("../../components/AuthComponent"));

const DefaultFooter = React.lazy(() => import("./DefaultFooter"));
const DefaultHeader = React.lazy(() => import("./DefaultHeader"));

class DefaultLayout extends Component {
	loading = () => (
		<div className="animated fadeIn pt-1 text-center">Loading...</div>
	);

	signOut(e) {
		e.preventDefault();
		localStorage.removeItem('smt-jwt');
		this.props.history.push("/login");
	}

	// componentDidMount() {
	// 	const jwt = getJwt();
	// 	console.log("jwt",jwt);
	// }

	componentDidUpdate(){
		//We changed pages here, need to make sure this is still a valid users and shouldnt be kicked out

	}



	render() {
		return (
			<div className="app">
				<AppHeader fixed>
					<Suspense fallback={this.loading()}>
						<DefaultHeader onLogout={e => this.signOut(e)} />
					</Suspense>
				</AppHeader>
				<div className="app-body">
					<AppSidebar fixed display="lg">
						<AppSidebarHeader />
						<AppSidebarForm />
						<Suspense>
							<AppSidebarNav
								navConfig={navigation}
								{...this.props}
								router={router}
							/>
						</Suspense>
						<AppSidebarMinimizer />
					</AppSidebar>
					<main className="main">
						<Container fluid style={{marginTop: "10px"}}>
							<Suspense fallback={this.loading()}>
								<Switch>
									{routes.map((route, idx) => {
										return route.component ? (
												<Route
													key={idx}
													path={route.path}
													exact={route.exact}
													name={route.name}
													//Routes wrapped by AuthComponent so on page switch, we check JWT Auth
													render={props =><AuthComponent> <route.component {...props} /></AuthComponent>}
												/>
										) : null;
									})}
									<Redirect to="/404" />
								</Switch>
							</Suspense>
						</Container>
					</main>
				</div>
					<AppFooter>
						<Suspense fallback={this.loading()}>
							<DefaultFooter />
						</Suspense>
					</AppFooter>
			</div>
		);
	}
}

export default DefaultLayout;
