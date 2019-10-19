import React, { Component, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import * as router from "react-router-dom";
import { Container } from "reactstrap";
import { getJwt } from "../../components/helpers/jwt";
import { withRouter } from "react-router-dom";
import axios from 'axios';

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
import navigationOP from "../../_navOP";
// routes config
// import routes from "../../routes";
import routesOP from "../../routesOP";
import routesSupport from "../../routesSupport";
const AuthComponent = React.lazy(() =>
	import("../../components/AuthComponent")
);

const DefaultFooter = React.lazy(() => import("./DefaultFooter"));
const DefaultHeader = React.lazy(() => import("./DefaultHeader"));

class DefaultLayout extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: ""
		};
	}

	loading = () => (
		<div className="animated fadeIn pt-1 text-center">Loading...</div>
	);

	signOut(e) {
		e.preventDefault();
		localStorage.removeItem("smt-jwt");
		this.props.history.push("/login");
	}
	componentDidMount() {
		//Setting the state for the Prop we will set for whoIAm
		let token = localStorage.getItem('smt-jwt');
		axios.get("/getUser", { headers: { Authorization: `Bearer ${token}` } })
			.then(res => {
				this.setState({ name: res.data });
			})
			.catch(function(error) {
				console.log("defaultLayout",error);
			});

	}

	//We filter routes availible based on who is logged in
	filterRoutes(array){
		var arrayFilter = [];
		array.reduce(function(filtered, option) {
			if (option.auth !== "required") {
				arrayFilter.push(option);
			}
		}, []);
		return arrayFilter
	}

	render() {
		if(this.state.name === ''){
			return(<div></div>)
		}
		//This is where we do our check for which nav to show depending on user type
		const nav = this.state.name == 'op' ? navigationOP : navigation;
		return (
				<div className="app">
					<AppHeader fixed>
						<Suspense fallback={this.loading()}>
							<DefaultHeader onLogout={e => this.signOut(e)} whoAmI={this.state.name} />
						</Suspense>
					</AppHeader>
					<div className="app-body">
						<AppSidebar fixed display="lg">
							<AppSidebarHeader />
							<AppSidebarForm />
							<Suspense>
								<AppSidebarNav 
									navConfig={ nav}
									{...this.props}
									router={router}
								/>
							</Suspense>
							<AppSidebarMinimizer />
						</AppSidebar>
						<main className="main">
							<Container fluid style={{ marginTop: "10px" }}>
								<Suspense fallback={this.loading()}>
									<Switch>
										{	
											this.state.name === 'op' ? routesOP.map((route, idx) => {
											return route.component ? (
												<Route
													key={idx}
													path={route.path}
													exact={route.exact}
													name={route.name }
													whoAmI={""}
													render={props => (
														<AuthComponent>
															<route.component whoAmI={this.state.name} {...props} />
														</AuthComponent>
													)}
												/>
											) : null;
										}): routesSupport.map((route, idx) => {
											return route.component ? (
												<Route
													key={idx}
													path={route.path}
													exact={route.exact}
													name={route.name }
													whoamI={""}
													render={props => (
														<AuthComponent>
															<route.component whoAmI={this.state.name} {...props} />
														</AuthComponent>
													)}
												/>
											) : null;
										})
									}
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
