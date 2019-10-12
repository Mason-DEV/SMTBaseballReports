import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { getJwt } from "./helpers/jwt";
import { setKickBack } from "./helpers/kickback";
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
		//If we dont have a jwt at all, instantly just kick back
		if (!jwt) {
			setKickBack("No Token");
			localStorage.removeItem('smt-jwt');
			this.props.history.push("/Login");
			return;
			
		}
		//Check to make sure this JWT we have is valid
		axios.get('/getUser', { headers: { Authorization: `Bearer ${jwt}`} })
			.then(res =>{
				this.setState({	user: res});
			})
			.catch(err => {
				console.log("nopw this is")
				setKickBack("No Token");
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
