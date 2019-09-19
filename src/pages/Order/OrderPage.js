import React, { Component } from "react";
import { MDBRow, MDBCol, MDBBtn, MDBContainer } from "mdbreact";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import swal from "sweetalert";
import Header from "../../component/Header";
import { storage } from "../../firebase/index";
import { connect } from "unistore/react";
import { actions } from "../../Store/ActionOrderPage";
import { withRouter, Link, Redirect } from "react-router-dom";
import axios from "axios";
import Footer from "../../component/Footer";
import Swal from "sweetalert2";
// import GoogleMaps from "./GoogleMaps"
import GoogleMaps2 from "./GoogleMaps2";
import "./order.css";

class Order extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      photo: null,
      urlPhoto: "",
      progress: 0,
      adress: null,
      additialNotes: null,
      markers: {
        position: {
          lat: -7.9666204,
          lng: 112.6326321
        },
        key: Date.now(),
        defaultAnimation: 2
      },
      mapCenter: { lat: -7.9666204, lng: 112.6326321 },
      // access_token: 'AIzaSyAtJjcjFBzjxF908drCFRGAXBF-EvefsSo',
      // address: '',
      mapRef: null,
      lat: -7.9666204,
      lng: 112.6326321
    };
  }

  setAdditionalNotes = e => {
    e.preventDefault();
    this.setState({ additialNotes: e.target.value });
  };

  setTime = e => {
    e.preventDefault();
    this.setState({ password: e.target.value });
  };

  // funtion to store date by user choose
  handleChange = date => {
    this.setState({
      startDate: date
    });
    // console.log(this.state.startDate);
  };

  // funtion to store photo uploaded by user
  handleChangePhoto = e => {
    e.preventDefault();
    const regexImage = /([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg)/;
    console.log(e.target.files[0]);
    if (!regexImage.test(e.target.files[0].name)) {
      Swal.fire({
        type: "error",
        title: "Oops...",
        text: "Gunakan ekstensi .jpg .png atau .gif saja! "
      });
      return false;
    } else if (e.target.files[0]) {
      console.log(e.target.files[0]);
      if (e.target.files[0].size < 5000000) {
        this.setState({ photo: e.target.files[0] });
        try {
          const uploadTask = storage
            .ref(`images/${e.target.files[0].name}`)
            .put(e.target.files[0]);
          uploadTask.on(
            "state_changed",
            snapshot => {
              //progress Function
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              this.setState({ progress });
            },
            error => {},
            () => {
              //Complete Function
              storage
                .ref("images")
                .child(this.state.photo.name)
                .getDownloadURL()
                .then(url => {
                  this.setState({ urlPhoto: url });
                });
            }
          );
        } catch (err) {}
      } else {
        Swal.fire({
          type: "error",
          title: "Oops...",
          text: "Maksimal file 5MB!"
        });
      }
    }
  };

  doOrder = async e => {
    e.preventDefault();
    const self = this;
    const year = self.state.startDate.getFullYear();
    const month = self.state.startDate.getMonth() + 1;
    const date = self.state.startDate.getDate();
    const hour = self.state.startDate.getHours();
    const minute = self.state.startDate.getMinutes();
    const second = self.state.startDate.getSeconds();
    // var mili = self.state.startDate.getMiliseconds()
    let config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      data: {
        adress: {
          adress: self.state.adress,
          lat: self.state.lat,
          lng: self.state.lng,
          additialNotes: self.state.additialNotes
        },
        time:
          year +
          "-" +
          month +
          "-" +
          date +
          "T" +
          hour +
          ":" +
          minute +
          ":" +
          second +
          ".000",
        photo: this.state.urlPhoto
      },
      method: "POST",
      url: self.props.base_url + "/orders"
    };
    if (this.state.urlPhoto == "") {
      Swal.fire({
        type: "error",
        title: "Oops...",
        text: "Pilih foto terlebih dahulu!"
      });
      return false;
    } else if (this.state.adress == "") {
      Swal.fire({
        type: "error",
        title: "Oops...",
        text: "Lengkapi data terlebih dahulu!"
      });
      return false;
    }
    axios(config)
      .then(function(response) {
        self.props.history.push("/orderhistory");
        swal(
          "Terima Kasih, Sudah Order!",
          "Tim kami akan menghubungimu secepatnya!",
          "success"
        );
      })
      .catch(function(error) {
        console.log("error Order", error);
        swal("Oooppss!", "Lengkapi data terlebih dahulu!", "error");
      });
  };

  handleMapClick = event => {
    let that = this;
    let mapRef = this._mapComponent;
    console.log(mapRef.getCenter().lat() + "; " + mapRef.getCenter().lng());
    this.setState({
      markers: {
        position: event.latLng,
        defaultAnimation: 2,
        key: Date.now()
      },
      mapCenter: event.latLng,
      lat: mapRef.getCenter().lat(),
      lng: mapRef.getCenter().lng()
    });
    const self = this;
    const config = {
      method: "GET",
      url:
        "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
        mapRef.getCenter().lat() +
        "," +
        mapRef.getCenter().lng() +
        "&key=AIzaSyAtJjcjFBzjxF908drCFRGAXBF-EvefsSo"
    };
    axios(config)
      .then(function(response) {
        self.setState({ adress: response.data.results[0].formatted_address });
        console.log(response.data.results[0].formatted_address);
        console.log(response);
      })
      .catch(function(error) {
        console.log("error Order", error);
        swal("Oooppss!", "Ada yang error!", "error");
      });
    console.log(this.state.lat);
    console.log(this.state.lng);
  };

  handleMapDrag = () => {
    let mapRef = this._mapComponent;
    console.log(mapRef.getCenter().lat() + "; " + mapRef.getCenter().lng());
    console.log(this.state.markers.position);
  };

  handleMapLoad = map => {
    this._mapComponent = map;
  };

  componentDidMount = async props => {
    await navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;

      this.setState({
        markers: {
          position: { lat: latitude, lng: longitude },
          defaultAnimation: 2,
          key: Date.now()
        },
        mapCenter: { lat: latitude, lng: longitude }
      });
      console.log(this.state.mapCenter);
    });
    const self = this;
    const config = {
      method: "GET",
      url:
        "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
        this.state.lat +
        "," +
        this.state.lng +
        "&key=AIzaSyAtJjcjFBzjxF908drCFRGAXBF-EvefsSo"
    };
    axios(config)
      .then(function(response) {
        self.setState({ adress: response.data.results[0].formatted_address });
        console.log(response.data.results[0].formatted_address);
        console.log(response);
      })
      .catch(function(error) {
        console.log("error Order", error);
        swal("Oooppss!", "Ada yang error!", "error");
      });
  };

  render() {
    const isLogin = JSON.parse(localStorage.getItem("isLogin"));
    if (isLogin) {
      return (
        <div>
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
                  <div
                    style={{
                      height: "100vh",
                      backgroundColor: "white",
                      textAlign: "center",
                      padding: "0",
                      borderTopLeftRadius: "20px",
                      borderTopRightRadius: "20px"
                    }}
                  >
                    <div
                      className="row justify-content-center"
                      style={{
                        padding: "0",
                        margin: "0"
                      }}
                    ></div>
                    <br />
                    <div className="col-10 text-left">
                      <h2 className="font">Tukar Sampahmu</h2>
                    </div>
                    <div
                      className="row justify-content-center"
                      style={{ padding: "0", margin: "0" }}
                    ></div>

                    <br />
                    <div
                      className="row text-center justify-content-center"
                      style={{
                        padding: "0",
                        margin: "0"
                      }}
                    >
                      <div className="col-11">
                        <h6 className="text-left">
                          Klik posisi di peta untuk menentukan alamat
                          penjemputan
                        </h6>
                      </div>
                      <div className="col-11">
                        <div className="maps">
                          <GoogleMaps2
                            markers={this.state.markers}
                            center={this.state.mapCenter}
                            handleMapLoad={this.handleMapLoad}
                            handleMapDrag={this.handleMapDrag}
                            handleMapClick={this.handleMapClick}
                          />
                        </div>
                      </div>
                      <br />
                      <br />
                      <br />
                      <div className="col-11">
                        <h6 className="text-left">Alamat</h6>
                        <p className="text-left">{this.state.adress}</p>
                        <h6 className="text-left">
                          Beri keterangan tambahan agar kami lebih mudah
                          menemukan Anda
                        </h6>
                        <input
                          onChange={this.setAdditionalNotes}
                          type="text"
                          id="defaultFormLoginEmailEx"
                          className="form-control"
                        />
                        <br />

                        <div className="text-left">
                          <p style={{ fontSize: "15px", margin: "0" }}>
                            Tentukan tanggal
                          </p>
                          <DatePicker
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            timeCaption="time"
                            dateFormat="d MMMM, yyyy HH:mm"
                            style={{ width: "200px" }}
                            selected={this.state.startDate}
                            onChange={this.handleChange}
                          />
                          <br />

                          <br />
                          <label for="inputPhotoURL">
                            Pilih Foto Lalu Klik Upload
                          </label>
                          <br />
                          <progress
                            value={this.state.progress}
                            max="100"
                            style={{ width: "100%" }}
                          />
                          <br />
                          <input
                            type="file"
                            onChange={this.handleChangePhoto}
                          />
                          <image src={this.state.photo} />
                          <br />
                          <br />
                          <br />
                          <br />
                        </div>

                        <MDBBtn
                          id="buttonHover"
                          onClick={e => {
                            this.doOrder(e);
                          }}
                          style={{
                            width: "100%",
                            borderRadius: "15px",
                            marginBottom: "100px"
                          }}
                          target="_blank"
                          color="dark-green"
                        >
                          Tukar Sampahmu
                        </MDBBtn>
                      </div>
                    </div>
                  </div>
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
  "is_login, base_url, token, provinces",
  actions
)(withRouter(Order));
