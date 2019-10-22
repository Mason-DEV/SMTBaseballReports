import React, { Component } from "react";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Container,
  CustomInput,
  Modal,
  Form,
  Col,
  FormGroup,
  Label,
  Input,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Row,
  Table
} from "reactstrap";
import axios from "axios";
import spinner from "../../assests/images/smtSpinner.gif";
import logger from "../../components/helpers/logger";

class Venues extends Component {
  constructor(props) {
    super(props);
    this.showEdit = this.showEdit.bind(this);
    this.hideEdit = this.hideEdit.bind(this);
    this.submitEdit = this.submitEdit.bind(this);
    this.changeEditData = this.changeEditData.bind(this);
    this.changeEditDataRoles = this.changeEditDataRoles.bind(this);

    this.showAdd = this.showAdd.bind(this);
    this.hideAdd = this.hideAdd.bind(this);
    this.changeAddData = this.changeAddData.bind(this);
    this.changeAddDataRoles = this.changeAddDataRoles.bind(this);
    this.submitAdd = this.submitAdd.bind(this);

    this.showDelete = this.showDelete.bind(this);
    this.hideDelete = this.hideDelete.bind(this);
    this.submitDelete = this.submitDelete.bind(this);

    this.state = {
      addModal: false,
      editModal: false,
      deleteModal: false,
      isEditing: false,
      isAdding: false,
      isDeleting: false,
      isLoading: true,
      needToReload: false,
      staffData: {},
      editData: { roles: {} },
      addData: { roles: {} },
      deleteData: {}
    };
  }

  //#region Add Functions
  showAdd() {
    console.log("showing add", this.state);
    this.setState({
      addModal: !this.state.addModal
    });
    this.removeBlur();
  }

  hideAdd() {
    this.setState({
      addModal: !this.state.addModal,
      addData: { roles: {} },
      needToReload: false
    });
  }
  changeAddData(e) {
    this.setState({
      addData: { ...this.state.addData, [e.target.name]: e.target.value }
    });
  }
  changeAddDataRoles(e) {
    this.setState({
      addData: {
        ...this.state.addData,
        roles: {
          ...this.state.addData.roles,
          [e.target.name]: e.target.checked
        }
      }
    });
  }
  submitAdd(e) {
    e.preventDefault();
    this.setState({ isAdding: true });
    const staffToAdd = {
      name: this.state.addData.name,
      email: this.state.addData.email,
      roles: {
        auditor: this.state.addData.roles.auditor ? true : false,
        operator: this.state.addData.roles.operator ? true : false,
        support: this.state.addData.roles.support ? true : false
      }
    };
    axios
      .post("/api/staff/create/", staffToAdd)
      .then(adding => {
        this.setState({ isAdding: false, needToReload: true });
      })
      .catch(error => {
		this.setState({ isAdding: false });
		logger("error","Staff Add === "+error);
      });
    this.hideAdd();
  }
  //#endregion Add Functions

  //#region Edit Functions
  hideEdit() {
    this.setState({
      editModal: !this.state.editModal,
      editData: { roles: {} },
      needToReload: false
    });
  }
  changeEditData(e) {
    this.setState({
      editData: { ...this.state.editData, [e.target.name]: e.target.value }
    });
  }
  changeEditDataRoles(e) {
    this.setState({
      editData: {
        ...this.state.editData,
        roles: {
          ...this.state.editData.roles,
          [e.target.name]: e.target.checked
        }
      }
    });
  }
  showEdit(id) {
    axios
      .get("/api/staff/staffByID", {
        headers: { ID: id }
      })
      .then(res => {
        this.setState({ editData: res.data });
      })
      .catch(function(error) {
		logger("error","Staff Show edit === "+error);
      });

    this.setState({
      editModal: !this.state.editModal
    });
    this.removeBlur();
  }
  submitEdit(e) {
    e.preventDefault();
    this.setState({ isEditing: true });
    axios
      .put("/api/staff/update/" + this.state.editData._id, this.state.editData)
      .then(editing => {
        this.setState({ isEditing: false, needToReload: true });
      })
      .catch(error => {
        this.setState({ isEditing: false });
		logger("error","Staff Submit === "+error);
      });
    this.hideEdit();
  }
  //#endregion Edit Functions

  //#region Delete Functions
  hideDelete() {
    this.setState({
      deleteModal: !this.state.deleteModal,
      deleteData: {},
      needToReload: false
    });
  }

  showDelete(id, name) {
    this.setState({
      deleteModal: !this.state.deleteModal,
      deleteData: { _id: id, name }
    });
    this.removeBlur();
  }
  submitDelete(e) {
    e.preventDefault();
    this.setState({ isDeleting: true });
    axios
      .delete("/api/staff/delete/", {
        headers: { ID: this.state.deleteData._id }
      })
      .then(deleteing => {
        this.setState({ isDeleting: false, needToReload: true });
      })
      .catch(error => {
        this.setState({ isDeleting: false });
        console.log(error);
      });
    this.hideDelete();
  }
  //#endregion Delete Functions

  componentDidMount() {
    //Axios api call to get all staffData
    axios
      .get("/api/staff/")
      .then(res => {
        this.setState({ staffData: res.data });
      })
      //Data is loaded, so change from loading state
      .then(isLoading => this.setState({ isLoading: false }))
      .catch(function(error) {
        console.log(error);
      });
  }

  componentDidUpdate() {
    //Checking if we need to make an Axios api call to get all staffData
    if (this.state.needToReload === true) {
      axios
        .get("/api/staff/")
        .then(res => {
          this.setState({ staffData: res.data, needToReload: false });
        })
        .catch(function(error) {
          console.log(error);
        });
      this.setState({ needToReload: false });
    }
  }

  removeBlur() {
    let el = document.querySelector(":focus");
    if (el) el.blur();
  }

  render() {
    if (this.state.isLoading) {
      return <img src={spinner} height="150" width="150" alt="spinner" align="center" style={{ height: "100%" }} />;
    } else {
      return (
        <React.Fragment>
          <Card>
            <CardHeader tag="h5">
              <i className="fa fa-group"></i>Staff Management
              <div className="card-header-actions">
                <Button color="success" size="sm" onClick={this.showAdd}>
                  <i className="fa fa-plus"></i> New Staff
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              <Table bordered striped responsive size="sm">
                <thead>
                  <tr>
                    <th width="">Actions</th>
                    <th width="">Name</th>
                    <th width="">Email</th>
                    <th width="">Roles</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.staffData.map((staff, i) => {
                    return (
                      <tr key={i}>
                        <td>
                          <Button onClick={e => this.showEdit(staff._id)} color="warning" size="sm">
                            Edit
                          </Button>{" "}
                          <Button onClick={e => this.showDelete(staff._id, staff.name)} color="danger" size="sm">
                            Delete
                          </Button>
                        </td>
                        <td>{staff.name}</td>
                        <td>{staff.email}</td>
                        <td>
                          {staff.roles.auditor ? <Badge color="info">Auditor</Badge> : null}{" "}
                          {staff.roles.operator ? <Badge color="warning">Operator</Badge> : null}{" "}
                          {staff.roles.support ? <Badge color="secondary">Support</Badge> : null}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </CardBody>
          </Card>

          {/* Add Modal */}
          <div>
            {this.state.isAdding ? (
              <Modal color="success" isOpen={this.state.addModal}>
                <ModalHeader style={{ backgroundColor: "#3EA662", color: "white" }} toggle={this.hideAdd}>
                  <i className="fa fa-pencil"></i> Add New Staff Member
                </ModalHeader>
                <ModalBody>
                  <img src={spinner} height="150" width="150" alt="spinner" align="center" style={{ height: "100%" }} />
                </ModalBody>
              </Modal>
            ) : (
              <Modal color="success" isOpen={this.state.addModal}>
                <Form onSubmit={e => this.submitAdd(e)}>
                  <ModalHeader style={{ backgroundColor: "#3EA662", color: "white" }} toggle={this.hideAdd}>
                    <i className="fa fa-pencil"></i> Add New Staff Member
                  </ModalHeader>
                  <ModalBody>
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label htmlFor="naame">Full Name</Label>
                          <Input
                            type="text"
                            name="name"
                            id="name"
                            onChange={e => this.changeAddData(e)}
                            required
                          ></Input>
                        </FormGroup>
                        <FormGroup>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            required
                            id="email"
                            type="email"
                            name="email"
                            onChange={e => this.changeAddData(e)}
                          ></Input>
                        </FormGroup>
                        <FormGroup>
                          <Label htmlFor="roles">Roles</Label>
                          <Container
                            style={{
                              border: "1px solid #e4e7ea",
                              borderRadius: "0.25rem"
                            }}
                          >
                            <CustomInput
                              type="checkbox"
                              id="auditorCustomCheckbox"
                              label="Auditor"
                              name="auditor"
                              onClick={e => this.changeAddDataRoles(e)}
                            />
                            <CustomInput
                              type="checkbox"
                              id="operatorCustomCheckbox"
                              label="Operator"
                              name="operator"
                              onClick={e => this.changeAddDataRoles(e)}
                            />
                            <CustomInput
                              type="checkbox"
                              id="supportCustomCheckbox"
                              label="Support"
                              name="support"
                              onClick={e => this.changeAddDataRoles(e)}
                            />
                          </Container>
                        </FormGroup>
                      </Col>
                    </Row>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="success" type="submit" value="Add Staff" className="px-4">
                      Add
                    </Button>
                    <Button color="secondary" onClick={this.hideAdd}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </Form>
              </Modal>
            )}
          </div>

          {/* Edit Modal */}
          <div>
            {this.state.isEditing ? (
              <Modal color="success" isOpen={this.state.editModal}>
                <ModalHeader style={{ backgroundColor: "#ffc107", color: "Black" }}>
                  <i className="fa fa-pencil"></i> Edit Staff Member
                </ModalHeader>
                <ModalBody>
                  <img src={spinner} height="150" width="150" alt="spinner" align="center" style={{ height: "100%" }} />
                </ModalBody>
              </Modal>
            ) : (
              <Modal color="success" isOpen={this.state.editModal}>
                <Form onSubmit={e => this.submitEdit(e)}>
                  <ModalHeader style={{ backgroundColor: "#ffc107", color: "Black" }} toggle={this.hideEdit}>
                    <i className="fa fa-pencil"></i> Edit Staff Member
                  </ModalHeader>
                  <ModalBody>
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label htmlFor="naame">Full Name</Label>
                          <Input
                            type="text"
                            name="name"
                            id="name"
                            defaultValue={this.state.editData.name ? this.state.editData.name : ""}
                            onChange={e => this.changeEditData(e)}
                            required
                          ></Input>
                        </FormGroup>
                        <FormGroup>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            name="email"
                            defaultValue={this.state.editData.email ? this.state.editData.email : ""}
                            onChange={e => this.changeEditData(e)}
                          ></Input>
                        </FormGroup>
                        <FormGroup>
                          <Label htmlFor="roles">Roles</Label>
                          <Container
                            style={{
                              border: "1px solid #e4e7ea",
                              borderRadius: "0.25rem"
                            }}
                          >
                            <CustomInput
                              type="checkbox"
                              id="auditorCustomCheckbox"
                              label="Auditor"
                              name="auditor"
                              defaultChecked={this.state.editData.roles.auditor}
                              onClick={e => this.changeEditDataRoles(e)}
                            />
                            <CustomInput
                              type="checkbox"
                              id="operatorCustomCheckbox"
                              label="Operator"
                              name="operator"
                              defaultChecked={this.state.editData.roles.operator}
                              onClick={e => this.changeEditDataRoles(e)}
                            />
                            <CustomInput
                              type="checkbox"
                              id="supportCustomCheckbox"
                              label="Support"
                              name="support"
                              defaultChecked={this.state.editData.roles.support}
                              onClick={e => this.changeEditDataRoles(e)}
                            />
                          </Container>
                        </FormGroup>
                      </Col>
                    </Row>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="success" type="submit" value="Add Staff" className="px-4">
                      Update
                    </Button>

                    <Button color="secondary" onClick={this.hideEdit}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </Form>
              </Modal>
            )}
          </div>

          {/* Delete Modal */}
          <div>
            {this.state.isDeleting ? (
              <Modal color="success" isOpen={this.state.deleteModal}>
                <ModalHeader style={{ backgroundColor: "#f86c6b", color: "Black" }}>
                  <i className="fa fa-warning"></i> Delete Staff Member
                </ModalHeader>
                <ModalBody>
                  <img src={spinner} height="150" width="150" alt="spinner" align="center" style={{ height: "100%" }} />
                </ModalBody>
              </Modal>
            ) : (
              <Modal color="success" isOpen={this.state.deleteModal}>
                <Form onSubmit={e => this.submitDelete(e)}>
                  <ModalHeader style={{ backgroundColor: "#f86c6b", color: "Black" }} toggle={this.hideDelete}>
                    <i className="fa fa-warning"></i> Delete Staff Member
                  </ModalHeader>
                  <ModalBody>
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label htmlFor="naame">Are you sure you want to delete {this.state.deleteData.name}?</Label>
                        </FormGroup>
                      </Col>
                    </Row>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" type="submit" value="Add Staff" className="px-4">
                      Delete
                    </Button>
                    <Button color="secondary" onClick={this.hideDelete}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </Form>
              </Modal>
            )}
          </div>
        </React.Fragment>
      );
    }
  }
}
export default Venues;
