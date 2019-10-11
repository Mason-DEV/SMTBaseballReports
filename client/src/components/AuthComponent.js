import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { getJwt } from "./helpers/jwt";
import spinner from "../assests/images/smtSpinner.gif";


class AuthComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: undefined
		};
	}

	componentDidMount() {
		const jwt = getJwt();
		if (!jwt) {
			this.props.history.push("/Login");
        }
		axios.get('/getUser', { headers: { Authorization: `Bearer ${jwt}`} })
            .then(res =>
            
				this.setState({
					user: res
                })
            )
			.catch(err => {
                console.log("auth Error");
                localStorage.removeItem('smt-jwt');
				this.props.history.push("/Login");
            });
	}

	render() {
        if(this.state.user === undefined){
            return(
                <img
					src={spinner}
					height="150"
					width="150"
					alt="spinner"
					align="center"
					style={{ height: "100%" }}
				/>
            )
        }
		return <div>{this.props.children}</div>;
	}
}

export default withRouter(AuthComponent);
