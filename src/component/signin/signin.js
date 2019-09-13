import React, { Component } from "react";
import {
  MDBContainer,
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBIcon
} from "mdbreact";
import axios from "axios";
import { connect } from "unistore/react";
import { actions } from "../../store";
import { withRouter, Link, Redirect } from "react-router-dom";
import swal from "sweetalert";

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      username: "",
      password: ""
    };
    this.doLogin = this.doLogin.bind(this);
    this.sweetAlertFunction = this.sweetAlertFunction.bind(this);
  }

  sweetAlertFunction() {
    swal(
      "Terima Kasih, Sudah Login!",
      "Sampah Online siap membantumu!",
      "success"
    );
  }

  setUsername = e => {
    e.preventDefault();
    this.setState({ username: e.target.value });
  };

  setPassword = e => {
    e.preventDefault();
    this.setState({ password: e.target.value });
  };

  setToken = e => {
    e.preventDefault();
    this.setState({ token: e.target.value });
  };

  toggle = nr => () => {
    let modalNumber = "modal" + nr;
    this.setState({
      [modalNumber]: !this.state[modalNumber]
    });
  };

  doLogin = async e => {
    const self = this;
    axios
      .post("http://api.alfaruqi.xyz/auth", {
        username: self.state.username,
        password: self.state.password
      })
      .then(function(response) {
        self.props.setLogin(true);
        self.props.setToken(response.data.token);
        console.log(response.data.status);
        swal(
          "Terima Kasih, Sudah Login!",
          "Sampah Online siap membantumu!",
          "success"
        );
        self.props.history.push("/home");
      })
      .catch(function(error) {
        console.log("errrrrrr", error);
        swal(
          "Terima Kasih, Sudah Login!",
          "Sampah Online siap membantumu!",
          "error"
        );
      });
  };

  render() {
    return (
      <MDBContainer style={{ padding: "0" }}>
        <MDBBtn
          className="font rounded-pill"
          style={{ width: "145px" }}
          color="dark-green"
          onClick={this.toggle(14)}
        >
          Masuk
        </MDBBtn>
        <MDBModal isOpen={this.state.modal14} toggle={this.toggle(14)} centered>
          <MDBModalBody>
            <MDBContainer>
              <MDBRow className="text-left">
                <MDBCol md="10">
                  <MDBIcon className="text-left" icon="mobile-alt" size="3x" />

                  <form>
                    <div className="grey-text">
                      <MDBInput
                        label="Masukkan emailmu"
                        group
                        type="text"
                        validate="email"
                        onChange={this.setUsername}
                      />
                      <MDBInput
                        label="Masukkan passwordmu"
                        group
                        type="password"
                        validate
                        onChange={this.setPassword}
                      />
                    </div>
                  </form>
                </MDBCol>
              </MDBRow>
            </MDBContainer>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn
              className="font rounded-pill"
              onClick={this.doLogin}
              isOpen={this.state.modal14}
              color="dark-green"
            >
              Masuk
            </MDBBtn>
          </MDBModalFooter>
        </MDBModal>
      </MDBContainer>
    );
  }
}

export default connect(
  "is_login",
  actions
)(withRouter(SignIn));
