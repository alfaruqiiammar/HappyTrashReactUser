import React, { Component } from "react";
import { MDBRow, MDBCol, MDBContainer, MDBMedia } from "mdbreact";
import swal from "sweetalert";
import TabReward from "./TabReward";
import Header from "../../component/Header";
import Footer from "../../component/Footer";
import axios from "axios";
import { connect } from "unistore/react";
import { actions } from "../../store";
import { withRouter, Link, Redirect } from "react-router-dom";

class RewardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      name: "",
      point: null,
      photo: "",
      stock: null,
      data: []
    };
    this.sweetAlertFunction = this.sweetAlertFunction.bind(this);
  }

  setName = e => {
    e.preventDefault();
    this.setState({ name: e.target.value });
  };

  setPoint = e => {
    e.preventDefault();
    this.setState({ point: e.target.value });
  };

  setPhoto = e => {
    e.preventDefault();
    this.setState({ photo: e.target.value });
  };

  setStock = e => {
    e.preventDefault();
    this.setState({ stock: e.target.value });
  };

  // componentDidMount() {
  // const self = this;
  // const config = {
  // headers: {
  // Authorization: "Bearer " + localStorage.getItem('token')
  // }
  // };
  // console.log("token", this.props.token);
  // axios
  // .get(self.props.base_url + "/rewards", config)
  // .then(response => {
  // self.setState({ data: response.data });
  // self.setState({
  // name: response.data.name,
  // point: response.data.point,
  // photo: response.data.photo,
  // stock: response.data.stock
  // });
  // console.log(self.state.data);
  // })
  // .catch(error => {
  // console.log("error rewards", error);
  // });

  // }

  sweetAlertFunction() {
    console.log("button clicks");
    swal(
      "Terima Kasih, Ammar!",
      "Harap tunggu tim kami akan menghubungi kamu!",
      "success"
    );
  }

  render() {
    const isLogin = JSON.parse(localStorage.getItem("isLogin"));
    if (isLogin) {
      return (
        <div className="page">
          <Header />
          <MDBContainer>
            <MDBRow className="justify-content-center" style={{ padding: "0" }}>
              <MDBCol style={{ maxWidth: "480px", padding: "0" }}>
                <div
                  style={{
                    height: "100vh",
                    backgroundColor: "white",
                    textAlign: "center",
                    padding: "0"
                  }}
                >
                  <br />
                  <div
                    className="row justify-content-center"
                    style={{
                      padding: "0",
                      margin: "0"
                    }}
                  >
                    <div
                      className="col-11 text-left"
                      style={{
                        borderTop: "0.5px solid green",
                        borderLeft: "0.5px solid green",
                        borderRight: "0.5px solid green",
                        borderTopLeftRadius: "15px",
                        borderTopRightRadius: "15px",
                        padding: "5px 0 8px 0"
                      }}
                    >
                      <div
                        className="row justify-content-center"
                        style={{
                          padding: "0",
                          margin: "0"
                        }}
                      >
                        <div
                          className="col-11 text-center"
                          style={{
                            padding: "0",
                            margin: "0"
                          }}
                        >
                          <h3
                            className="font"
                            style={{
                              marginTop: "5px",
                              marginBottom: "10px",
                              fontWeight: "600",
                              margin: "0"
                            }}
                          >
                            Jumlah Poinmu
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-11 text-left"
                      style={{
                        borderBottom: "0.5px solid green",
                        borderLeft: "0.5px solid green",
                        borderRight: "0.5px solid green",
                        paddingTop: "5px",
                        borderBottomLeftRadius: "15px",
                        borderBottomRightRadius: "15px"
                      }}
                    >
                      <h6 className="text-center">
                        Total kamu sudah mengumpulkan Poin sebanyak
                      </h6>
                      <h3
                        className="text-center font"
                        style={{ fontWeight: "600" }}
                      >
                        {localStorage.getItem("point")} Poin
                      </h3>
                    </div>
                  </div>
                  <div className="row justify-content-center">
                    <div className=" col-11 text-center">
                      <TabReward />
                    </div>
                  </div>
                  <br />
                  <br />
                  <br />
                </div>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
          <Footer />
        </div>
      );
    } else {
      return <Redirect to="/" />;
    }
  }
}

export default connect(
  "is_login, base_url, token",
  actions
)(withRouter(RewardPage));