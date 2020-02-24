import React, { Component } from 'react';
import { Col, Container, Row } from 'reactstrap';


class Page404 extends Component {

  //Temp to force logout
  componentDidMount(){
      localStorage.removeItem("smt-jwt");
  }

  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="7">
              <div className="clearfix">
                <h1 className="float-left display-3 mr-4">404</h1>
                <h4 className="pt-3">Oops! This is not a valid url.</h4>
                {/* <h4 className="pt-3">Oops! This is not a valid url.</h4> */}
                <p  className="text-muted float-left">Please check your URL or Credentials and try again.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Page404;
