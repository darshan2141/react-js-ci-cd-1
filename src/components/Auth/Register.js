import React from "react";
import {
  sendHttpRequest,
  BASE_URL,
  isEmail,
  isContactNo,
} from "../../common/Common";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  CircularProgress,
} from "@material-ui/core";
import logo from '../../assets/images/FieldR_Logo_Blue.png'
import { ShowToast, ToastMessage } from "../CustomMUI/ToastMessage";
import CustomTextField from "../CustomMUI/CustomTextField";
import CustomPasswordField from "../CustomMUI/CustomPasswordField";
import { PrimaryButton } from "../CustomMUI/CustomButtons";
import "./auth.css";
import "react-phone-input-2/lib/style.css";
import { txt } from "../../common/context";

class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: {
        firstname: "",
        lastname: "",
        email: "",
        contactNo: "",
        countryCode: "94",
        password: "",
        confirmPassword: "",
        isLoading: false,
        isLoginSuccess: false,
        firstnameError: "",
        lastnameError: "",
        emailError: "",
        contactNoError: "",
        passwordError: "",
        confirmPasswordError: "",
        passmatchError: "",
      },
    };

    this.handleRegister = this.handleRegister.bind(this);
  }

  handleRegister() {
    const {
      firstname,
      lastname,
      email,
      contactNo,
      countryCode,
      password,
      confirmPassword,
    } = this.state;

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

    if (!firstname) {
      this.setState({ firstnameError: txt.please_enter_first_name });
      return;
    }
    if (!lastname) {
      this.setState({ lastnameError: txt.please_enter_last_name });
      return;
    }
    if (!isEmail(email)) {
      this.setState({ emailError: txt.please_enter_valid_email_address });
      return;
    }
    if (!password) {
      this.setState({ passwordError: txt.password_cant_be_empty });
      return;
    }
    if (!passwordPattern.test(password)) {
      this.setState({ passwordError: txt.password_invalid_format });
      return;
    }
    if (!confirmPassword) {
      this.setState({ confirmPasswordError: txt.confirm_password_cant_be_empty });
      return;
    }
    if (password !== confirmPassword) {
      this.setState({ passmatchError: txt.passwords_doesnt_match });
      return;
    }

    const data = {
      firstName: firstname,
      lastName: lastname,
      email: email,
      contactNo: contactNo,
      country: countryCode,
      password: password,
    };

    this.setState({ isLoading: true });

    this.props.history.push({
      pathname: '/otpVerify',
      state: data
    });
  }

  render() {
    const {
      firstname,
      lastname,
      email,
      contactNo,
      countryCode,
      password,
      confirmPassword,
      isLoading,
      firstnameError,
      lastnameError,
      emailError,
      contactNoError,
      passwordError,
      confirmPasswordError,
      passmatchError,
    } = this.state;

    return (
      <>
        <div className="app-container">
          <ToastMessage />
          <div className="form-container">
            <Card className="card" elevation={0}>
              <CardContent>
                <CardMedia
                  component="img"
                  style={{ width: "50%" }}
                  alt="FieldR Logo"
                  src={logo}
                />
                <h1 className="text-left">{txt.register}</h1>
                <p className="text-left">
                  {txt.register_below_txt}
                </p>
                
                <div className="flex-container">
                  <div className="flex-item">
                    <CustomTextField
                      label={txt.first_name}
                      type="text"
                      value={firstname}
                      onChange={(e) =>
                        this.setState({
                          firstname: e.target.value,
                          firstnameError: "",
                        })
                      }
                    />
                    {firstnameError && (
                      <p className="error-message">{firstnameError}</p>
                    )}
                  </div>
                  <div className="flex-item">
                    <CustomTextField
                      label={txt.last_name}
                      type="text"
                      value={lastname}
                      onChange={(e) =>
                        this.setState({
                          lastname: e.target.value,
                          lastnameError: "",
                        })
                      }
                    />
                    {lastnameError && (
                      <p className="error-message">{lastnameError}</p>
                    )}
                  </div>
                </div>

                <CustomTextField
                  label={txt.email_address}
                  type="email"
                  value={email}
                  onChange={(e) =>
                    this.setState({ email: e.target.value, emailError: "" })
                  }
                />
                {emailError && <p className="error-message">{emailError}</p>}
                
                <CustomPasswordField
                  label={txt.password}
                  type="password"
                  value={password}
                  onChange={(e) =>
                    this.setState({
                      password: e.target.value,
                      passwordError: "",
                    })
                  }
                />
                {passwordError && (
                  <p className="error-message">{passwordError}</p>
                )}

                <CustomPasswordField
                  label={txt.c_password}
                  type="password"
                  value={confirmPassword}
                  onChange={(e) =>
                    this.setState({
                      confirmPassword: e.target.value,
                      confirmPasswordError: "",
                      passmatchError: "",
                    })
                  }
                />
                {confirmPasswordError && (
                  <p className="error-message">{confirmPasswordError}</p>
                )}
                {passmatchError && (
                  <p className="error-message">{passmatchError}</p>
                )}
                <CardActions className="card-actions">
                  <PrimaryButton
                    onClick={() =>
                      this.setState({ isError: true }, this.handleRegister)
                    }
                  >
                    {isLoading ? <CircularProgress /> : txt.register}
                  </PrimaryButton>
                </CardActions>

                <div className="other-login">
                  <div className="line"></div>
                  <p>{txt.or_continue_with}</p>
                  <div className="line"></div>
                </div>
                <h4 onClick={() => this.props.history.push("/")}>
                  {txt.already_register}
                </h4>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }
}

export default Register;
