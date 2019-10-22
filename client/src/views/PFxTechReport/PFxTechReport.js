import React, { Component } from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Col,
  Label,
  Input,
  Form,
  FormGroup,
  FormFeedback,
  Modal,
  ModalHeader,
  Row
} from "reactstrap";
import lgLogo from "../../../src/assests/images/SMT_Report_Tag.jpg";
import Table from "../PFxTechReport/Table";
import axios from "axios";
import spinner from "../../assests/images/smtSpinner.gif";

class PFxTechReport extends Component {
  constructor(props) {
    super(props);

    //Binding states
    this.toggle = this.toggle.bind(this);

    //States
    this.state = {
      isLoading: true,
      dropdownOpen: false,
      operators: {},
      fieldData: {
        hwswIssues: "",
        t1Notes: "",
        correctionData: {}
      }
    };
  }

  callbackFunction = childData => {
    this.setState({ fieldData: { ...this.state.fieldData, correctionData: childData } });
  };

  currentDate() {
    var curr = new Date();
    curr.setDate(curr.getDate());
    return curr.toISOString().substr(0, 10);
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  change(e) {
    this.setState({
      fieldData: { ...this.state.fieldData, [e.target.name]: e.target.value }
    });
  }

  onSubmitReport(e) {
    e.preventDefault();
    //Build new report
    console.log(this.state);
    const report = new PFxTechReport({
      // name:
    });
  }

  componentDidMount() {
    Promise.all([
      axios.get("/api/staff/")
      // axios.get('https://api.github.com/users/antranilan/repos')
    ])
      .then(([opResponse]) => {
        const ops = opResponse.data.filter(obj => obj.roles.operator === true).map(obj => ({ name: obj.name }));
        this.setState({ operators: ops });
      })
      .then(isLoading => this.setState({ isLoading: false }));
  }

  render() {
	  console.log("State",this.state.fieldData)
    if (this.state.isLoading) {
      return <img src={spinner} height="150" width="150" alt="spinner" align="center" style={{ height: "100%" }} />;
    } else {
      return (
        <div className="animated fadeIn">
          <br />
          <Card className="card-accent-success">
            <Form onSubmit={e => this.onSubmitReport(e)}>
              <CardHeader>
                <strong>Pitchf/x Tech Report</strong>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label htmlFor="venue">Venue</Label>
                      <Input type="select" name="venue" id="venue" onChange={e => this.change(e)} required>
                        <option></option>
                        <option>Venue 1</option>
                        <option>Venue 2</option>
                        <option>Venue 3</option>
                        <option>Venue 4</option>
                        <option>Venue 5</option>
                        <option>Venue 6</option>
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="operator">Operator</Label>
                      <Input type="select" name="operator" id="operator" onChange={e => this.change(e)} required>
                        <option key="-1"></option>
                        {this.state.operators.map((op, idx) => {
                          return <option key={idx}>{op.name}</option>;
                        })}
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        name="date"
                        onChange={e => this.change(e)}
                        required /*defaultValue={this.currentDate()}*/
                      ></Input>
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="login-time">
                        Log In <Badge>Eastern Time</Badge>
                      </Label>
                      <Input id="login-time" type="time" name="logIn" onChange={e => this.change(e)} required></Input>
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="first-pitch">
                        First Pitch <Badge>Eastern Time</Badge>
                      </Label>
                      <Input
                        id="first-pitch"
                        type="time"
                        name="firstPitch"
                        onChange={e => this.change(e)}
                        required
                      ></Input>
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="logout-time">
                        Log Out <Badge>Eastern Time</Badge>
                      </Label>
                      <Input id="logout-time" type="time" name="logOut" onChange={e => this.change(e)} required></Input>
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="hwswIssues">Hardware/Software Issues</Label>
                      <Input id="hwswIssues" type="textarea" onChange={e => this.change(e)} name="hwswIssues"></Input>
                    </FormGroup>
                  </Col>
                  <Col>
                    <Label>
                      <h5 style={{ color: "green" }}>Corrections/Changes Section</h5>
                    </Label>
                    <Table parentCallback={this.callbackFunction} />
                    <Label>
                      {this.props.permission === "support" ? (
                        <h5 style={{ color: "red" }}>Support Section</h5>
                      ) : (
                        <h5 style={{ color: "red" }}>Support Section - Not accessible via OP login</h5>
                      )}
                    </Label>
                    <FormGroup>
                      <Label htmlFor="t1Notes">T1 Notes</Label>
                      {this.props.permission === "support" ? (
                        <Input
                          type="textarea"
                          onChange={e => this.change(e)}
                          name="t1Notes"
                          id="t1Notes"
                        ></Input>
                      ) : (
                        <Input disabled type="textarea" name="t1Notes" id="t1Notes"></Input>
                      )}
                    </FormGroup>
                    <img src={lgLogo} alt="SMT Logo"></img>
                  </Col>
                </Row>

                <Row>
                  <Col></Col>
                  <Col></Col>
                </Row>
              </CardBody>
              <CardFooter>
                <FormGroup className="form-actions text-center">
                  <Button type="submit" size="sm" color="success">
                    <i className="fa fa-check"></i> Submit
                  </Button>{" "}
                  <Button type="reset" size="sm" color="danger">
                    <i className="fa fa-ban"></i> Clear
                  </Button>
                </FormGroup>
              </CardFooter>
            </Form>
          </Card>
        </div>
      );
    }
  }
}
export default PFxTechReport;
