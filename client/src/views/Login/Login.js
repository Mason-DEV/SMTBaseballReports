import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import logo from '../../assests/images/white_HeaderLogo.png'
import axios from 'axios';

class Login extends Component {

  constructor(props) {
    super(props);

    this.change = this.change.bind(this);
    this.submit = this.submit.bind(this);

    this.state = {
      username: "",
      password: ""
    };

  };

  change(e){
    this.setState({
      [e.target.name]: e.target.value
    })
  };
  
  submit(e){
    e.preventDefault();
    axios.post('/getToken', {
      username: this.state.username,
      password: this.state.password
    }).then(res => {
      localStorage.setItem('smt-jwt', res.data);
      this.props.history.push('/dashboard');
    })
    .catch(err =>{
      console.log(err.response);
    }) 
    
  };

  render() {
    return (
      <div className="app flex-row align-items-center">
       <Container>
          <Row className="justify-content-center">
            <Col md="8">
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
                        <Input type="text" name="username" onChange={e => this.change(e)} value={this.state.username} placeholder="username" autoComplete="username" />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" name="password" onChange={e => this.change(e)} value={this.state.password} placeholder="password" autoComplete="current-password" />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="success" type='submit' value="Log in" className="px-4">Login</Button>
                        </Col>
                        <Col xs="6" className="text-right">
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="bg-dark text-light py-5 d-md-down-none" style={{ width: '44%', background: 'grey' }}>
                  <CardBody className="text-center">
                    <div>
                      
                      <h1><img src={logo}></img></h1>
                      <h5 >MiLB Reporting and Dashboard Site</h5>
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

export default Login