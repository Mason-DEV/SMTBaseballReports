import React, { Component } from "react";
import { Link } from "react-router-dom";
// import { getJwt } from "../../components/helpers/jwt";
import { getkickBack } from "../../components/helpers/kickback";

import {
	Alert,
	Button,
	Card,
	CardBody,
	CardGroup,
	Col,
	Container,
	Form,
	Input,
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	Row
} from "reactstrap";
import logo from "../../assests/images/white_HeaderLogo.png";
import axios from "axios";

const getKick = () =>  getkickBack();
 

class Login extends Component {
	constructor(props) {
		super(props);

		this.change = this.change.bind(this);
		this.onDismiss = this.onDismiss.bind(this);
		this.onShow = this.onShow.bind(this);
		this.submit = this.submit.bind(this);

		this.state = {
			username: "",
			password: "",
			invalidUser: false,
			noToken: false
		};
	}

	componentDidMount() {
		if (getKick() === "No Token") {
			this.onShow("noToken");
		}
	}

	change(e) {
		this.setState({ [e.target.name]: e.target.value });
	}

	onDismiss(name) {
		this.setState({
			[name]: false
		});
	}

	onShow(name) {
		this.setState({
			[name]: true
		});
	}

	submit(e) {
		e.preventDefault();
		axios
			.post("/getToken", {
				//Ignores case on username, forces all usercase to match DB
				username: this.state.username.toLowerCase(),
				password: this.state.password
			})
			.then(res => {
				localStorage.setItem("smt-jwt", res.data);
				this.props.history.push("/dashboard");
			})
			.catch(err => {
				//Caught error from the server saying this user doesnt exist & show error
				let errMsg = err.response.data.message;
				if (errMsg === "Invalid User") {
					this.onShow("invalidUser");
				}
				console.log(err.response);
			});
	}

	render() {
		return (
			<div className="app flex-row align-items-center">
				<Container>
					<Row className="justify-content-center">
						<Col md="8">
							<Alert
								name="invalidUser"
								color="danger"
								isOpen={this.state.invalidUser}
								toggle={name => this.onDismiss("invalidUser")}
							>
								Incorrect username or password, please try again!
							</Alert>
							<Alert
								name="noToken"
								color="danger"
								isOpen={this.state.noToken}
								toggle={name => this.onDismiss("noToken")}
							>
								Your session has expired, please login.
							</Alert>
							<CardGroup>
								<Card className="p-4">
									<CardBody>
										<Form onSubmit={e => this.submit(e)}>
											<h1>Login</h1>
											<p className="text-muted">Sign In to your account</p>
											<InputGroup className="mb-3">
												<InputGroupAddon addonType="prepend">
													<InputGroupText>
														<i className="icon-user"></i>
													</InputGroupText>
												</InputGroupAddon>
												<Input
													type="text"
													name="username"
													onChange={e => this.change(e)}
													value={this.state.username}
													placeholder="username"
													autoComplete="username"
												/>
											</InputGroup>
											<InputGroup className="mb-4">
												<InputGroupAddon addonType="prepend">
													<InputGroupText>
														<i className="icon-lock"></i>
													</InputGroupText>
												</InputGroupAddon>
												<Input
													type="password"
													name="password"
													onChange={e => this.change(e)}
													value={this.state.password}
													placeholder="password"
													autoComplete="current-password"
												/>
											</InputGroup>
											<Row>
												<Col xs="6">
													<Button
														color="success"
														type="submit"
														value="Log in"
														className="px-4"
													>
														Login
													</Button>
												</Col>
												<Col xs="6" className="text-right"></Col>
											</Row>
										</Form>
									</CardBody>
								</Card>
								<Card
									className="bg-dark text-light py-5 d-md-down-none"
									style={{ width: "44%", background: "grey" }}
								>
									<CardBody className="text-center">
										<div>
											<h1>
												<img src={logo}></img>
											</h1>
											<h5>MiLB Reporting and Dashboard Site</h5>
										</div>
									</CardBody>
								</Card>
							</CardGroup>
						</Col>
					</Row>
				</Container>
			</div>
		);
	}
}

export default Login;
