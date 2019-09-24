/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form,	FormGroup,	Row, Col, Label, Input } from 'reactstrap';


class ModalExample extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      modal: false,
      modalType: "View"
    };

    this.toggle = this.toggle.bind(this);
    this.updateElement = this.updateElement.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
      modalType: this.props.props.name 
    }));
  }

  updateElement() {
    const updateAudit  
    this.updateAuditData(this.props.props.element._id);
      this.setState(prevState => ({
        modal: !prevState.modal,
        modalType: this.props.props.name 
      }));
  }


// Retrieves the data of from the Express api
updateAuditData = (id) => {
  fetch('$/api/audits/:{"id"}', {
        method: 'PUT',
        body: 
    }).then(response => response.json());
};

// function createNewProfile(profile) {
//   const formData = new FormData();
//   formData.append('first_name', profile.firstName);
//   formData.append('last_name', profile.lastName);
//   formData.append('email', profile.email);

//   return fetch('http://example.com/api/v1/registration', {
//       method: 'POST',
//       body: formData
//   }).then(response => response.json())
// }

// createNewProfile(profile)
//  .then((json) => {
//      // handle success
//   })
//  .catch(error => error);


  render() {
    if(this.state.modalType === "View"){
      return (
        <div style={{margin: 1, float: "left"}}>
          <Button  color={this.props.props.color} size="sm" onClick={this.toggle}>{this.props.props.name} </Button>
          <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
            <ModalHeader toggle={this.toggle}>View Modal</ModalHeader>
            <ModalBody>
              <Form action="" method="post">
                <Row>
                  <Col>
                    <FormGroup>
                      <Label htmlFor="gameID">Gamestring</Label>
                      <Input type="text" className="form-control-warning"	id="gameID" defaultValue={this.props.props.element.gamestring} disabled></Input>
                      <Label htmlFor="operator">Operator</Label>
                      <Input type="text" className="form-control-warning"	id="operator" defaultValue={this.props.props.element.operator} disabled></Input>
                      <Label htmlFor="auditor">Auditor</Label>
                      <Input type="text" className="form-control-warning"	id="auditor" defaultValue={this.props.props.element.auditor} disabled></Input>

                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label htmlFor="gdPitches">GD Pitches</Label>
                      <Input type="text" className="form-control-warning"	id="gdPitches" defaultValue={this.props.props.element.gdPitches} disabled></Input>
                      <Label htmlFor="ffxPitches">FFx Pitches</Label>
                      <Input type="text" className="form-control-warning"	id="ffxPitches" defaultValue={this.props.props.element.ffxPitches} disabled></Input>
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="warning">Generate PDF</Button>
              <Button color="secondary" onClick={this.toggle}>Close</Button>
            </ModalFooter>
          </Modal>
        </div>
      );
    }
    else{
    return (
        <div style={{margin: 1, float: "left"}}>
          <Button  color={this.props.props.color} size="sm" onClick={this.toggle}>{this.props.props.name} </Button>
          <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
            <ModalHeader toggle={this.toggle}>Edit Modal</ModalHeader>
            <ModalBody>
            <Form action="" method="post">
                <Row>
                  <Col>
                    <FormGroup>
                      <Label htmlFor="gameID">Gamestring</Label>
                      <Input type="text" className="form-control-warning"	id="gameID" defaultValue={this.props.props.element.gamestring}></Input>
                      <Label htmlFor="operator">Operator</Label>
                      <Input type="text" className="form-control-warning"	id="operator" defaultValue={this.props.props.element.operator}></Input>
                      <Label htmlFor="auditor">Auditor</Label>
                      <Input type="text" className="form-control-warning"	id="auditor" defaultValue={this.props.props.element.auditor}></Input>

                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label htmlFor="gdPitches">GD Pitches</Label>
                      <Input type="text" className="form-control-warning"	id="gdPitches" defaultValue={this.props.props.element.gdPitches}></Input>
                      <Label htmlFor="ffxPitches">FFx Pitches</Label>
                      <Input type="text" className="form-control-warning"	id="ffxPitches" defaultValue={this.props.props.element.ffxPitches}></Input>
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="success" onClick={this.updateElement}>Update</Button>
              <Button color="secondary" onClick={this.toggle}>Cancel</Button>
            </ModalFooter>
          </Modal>
        </div>
      );
    }
  }
}

export default ModalExample;