import React, { Component,  } from "react";
import {Badge,	Button,Card,	CardBody,CardHeader,Col,Label,	Input,	Form,FormGroup,FormFeedback,Row} from "reactstrap";
//import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

import lgLogo from '../../../src/assests/images/SMT_Report_Tag.jpg';

//const Widget03 = lazy(() => import('../../views/Widgets/Widget03'));


class FFxTechReport extends Component {
	constructor(props) {
		super(props);

		//Binding states
		this.toggle = this.toggle.bind(this);
		this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

		//States
		this.state = {
			dropdownOpen: false,
			radioSelected: 2
		};
	}

	toggle() {
		this.setState({
			dropdownOpen: !this.state.dropdownOpen
		});
	}

	onRadioBtnClick(radioSelected) {
		this.setState({
			radioSelected: radioSelected
		});
	}

	render() {
		return (
			<h1>Tech Report</h1>
		);
	}
}
export default FFxTechReport;