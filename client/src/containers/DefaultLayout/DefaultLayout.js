import React, { Component, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import * as router from "react-router-dom";
import { Container } from "reactstrap";
import axios from 'axios';
import logger from "../../components/helpers/logger";
import _ from "lodash";
import {
	AppFooter,
	AppHeader,
	AppSidebar,
	AppSidebarForm,
	AppSidebarHeader,
	AppSidebarMinimizer,
	AppSidebarNav2 as AppSidebarNav
} from "@coreui/react";
import newNav from "../../nav";
import routes from "../../routes";
const AuthComponent = React.lazy(() =>	import("../../components/AuthComponent"));
const DefaultFooter = React.lazy(() => import("./DefaultFooter"));
const DefaultHeader = React.lazy(() => import("./DefaultHeader"));

class DefaultLayout extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			permission:{}
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
		let token = localStorage.getItem('smt-jwt');
		axios.get("/getUser", { headers: { Authorization: `Bearer ${token}` } })
			.then(res => {
				this.setState({ name: res.data.id, 
					permission:{
						pfxTechPermission: res.data.pfxTechPermission,
						ffxTechPermission: res.data.ffxTechPermission,
						ffxAuditPermission: res.data.ffxAuditPermission,
						pfxTechDataPermission: res.data.pfxTechDataPermission,
						ffxTechDataPermission: res.data.ffxTechDataPermission,
						ffxAuditDataPermission: res.data.ffxAuditDataPermission,
						extrasPermission: res.data.extrasPermission
					}
				});
			})
			.catch(function(error) {
				logger("error", error);
			});
	}

	//filter the nav based on who is logged in
	filterNav(){
		var granted = [];
		var navPermission = [];

		_.forEach(this.state.permission, function(value, key) {
			if(value)
			granted.push(key);
		});

		newNav.items.forEach(element => {		
			const auth = element.permission.some(r=> granted.includes(r))
			if(auth){
				navPermission.push(element);
			}
		});

		return {items: navPermission}
	}

	//We filter routes availible based on who is logged in
	filterRoutes(){
		var granted = [];
		var routePermission = [];

		_.forEach(this.state.permission, function(value, key) {
			if(value)
			granted.push(key);
		});

		routes.forEach(element => {		
			const auth = element.permission.some(r=> granted.includes(r))
			if(auth){
				routePermission.push(element);
			}
		});

		return routePermission
	}

	render() {
		if(this.state.name === ''){
			return(<div></div>)
		}

		const navAuth = this.filterNav();
		const routesAuth = this.filterRoutes();
		return (
				<div className="app">
					<AppHeader fixed>
						<Suspense fallback={this.loading()}>
							<DefaultHeader onLogout={e => this.signOut(e)} whoAmI={this.state.name} permission={this.state.permission} />
						</Suspense>
					</AppHeader>
					<div className="app-body">
						<AppSidebar fixed display="lg">
							<AppSidebarHeader />
							<AppSidebarForm />
							<Suspense>
								<AppSidebarNav 
									navConfig={navAuth}
									{...this.props}
									router={router}
								/>
							</Suspense>
							<AppSidebarMinimizer />
						</AppSidebar>
						<main className="main">
							<Container fluid style={{ marginTop: "10px" }}>
								<Suspense fallback={this.loading()}>
									{/* If we have any of the support permissions, show support cards therwise OP cards
									pass in permissions to cards so we can show hide based on permssions at card level */}
									<Switch>
										{routesAuth.map((route, idx) => {
											return route.component ? (
											<Route
												key={idx}
												path={route.path}
												exact={route.exact}
												name={route.name}
												whoAmI={""}
												permission={""}
												render={props => (
													<AuthComponent>
														<route.component 
															whoAmI={this.state.name}  
															permission={this.state.permission} 
															{...props}>
														</route.component>
													</AuthComponent>
												)} />
											) : (null);
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
