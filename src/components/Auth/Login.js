import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  CircularProgress,
} from "@material-ui/core";
import {
  sendHttpRequest,
  BASE_URL,
  isEmail,
  isContactNo,
} from "../../common/Common";
import logo from "../../assets/images/FieldR_Logo_Blue.png";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import "./auth.css";
import { ShowToast, ToastMessage } from "../CustomMUI/ToastMessage";
import CustomTextField from "../CustomMUI/CustomTextField";
import CustomPasswordField from "../CustomMUI/CustomPasswordField";
import { PrimaryButton } from "../CustomMUI/CustomButtons";
import { txt } from "../../common/context";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailOrContactNo: "",
      password: "",
      isLoading: false,
      isLoginSuccess: false,
      passwordError: "", // State variable for password error message
      emailOrContactNoError: "", // State variable for email/contact number error message
    };
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleGoogleLoginSuccess = async (res) => {
    this.setState({ isLoading: true });

    const data = {
      googleToken: await res.credential,
    };

    sendHttpRequest("POST", BASE_URL + "/api/auth/google-login", null, JSON.stringify(data)).then((result) => {
      localStorage.setItem("loggedInUserToken", result.data.data.token);
      localStorage.setItem("loggedInUserId", result.data.data._id);
      this.setState({ isLoading: false });
      this.props.history.push("/home");
    }).catch((error) => {
      this.setState({ isLoading: false });
      toast.error(error.response.data.message);
    });
  };

  handleGoogleLoginFailure = (res) => {
    toast.error(res.error);
  };

  handleLogin() {
    const { emailOrContactNo, password } = this.state;
    let params = {};

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

    // Reset error messages
    this.setState({ emailOrContactNoError: "", passwordError: "" });

    if (!emailOrContactNo) {
      this.setState({ emailOrContactNoError: txt.enter_your_email_or_your_phone_number });
      return;
    }
    if (!password) {
      this.setState({ passwordError: txt.enter_password });
      return;
    }
    if (!passwordPattern.test(password)) {
      this.setState({ passwordError: txt.password_invalid_format });
      return;
    }

    if (emailOrContactNo.includes("@")) {
      if (!isEmail(emailOrContactNo)) {
        this.setState({ emailOrContactNoError: txt.please_enter_valid_email_address });
        return;
      } else {
        params = {
          email: emailOrContactNo,
          password: password,
        };
      }
    } else {
      if (!isContactNo(emailOrContactNo)) {
        this.setState({ emailOrContactNoError: txt.please_enter_valid_contact_number });
        return;
      } else {
        params = {
          contactNo: emailOrContactNo,
          password: password,
        };
      }
    }

    this.setState({ isLoading: true });

    sendHttpRequest(
      "POST",
      BASE_URL + "/api/auth/login",
      null,
      JSON.stringify(params)
    ).then((res) => {
      localStorage.setItem("loggedInUserToken", res.data.data.token);
      localStorage.setItem("loggedInUserId", res.data.data._id);
      localStorage.setItem("showIntroScreen", 'false');

      this.setState({ isLoading: false });
      this.setState({ isLoginSuccess: false, isLoading: false, emailOrContactNoError: "", passwordError: "" });
      this.props.history.push("/home");
    }).catch((err) => {
      console.log(err)
      this.setState({ isLoginSuccess: true, isLoading: false });
      ShowToast(err.response.data.message, {
        position: "top-right",
        type: "error",
      });
    });
  }

  render() {
    const { emailOrContactNo, password, isLoading, emailOrContactNoError, passwordError } = this.state;
    return (
      <div className="app-container">
        <ToastMessage />
        <div className="form-container">
          <Card className="card" elevation={0}>
            <CardContent>
              <CardMedia component="img" style={{ width: "50%" }} alt="FieldR Logo" src={logo} />
              <h1 className="text-left">{txt.log_in}</h1>
              <p className="text-left">{txt.login_below_text}</p>
              <CustomTextField
                label={txt.email_contact}
                type="text"
                value={emailOrContactNo}
                onChange={(e) => this.setState({ emailOrContactNo: e.target.value, emailOrContactNoError: "" })}
              />
              {emailOrContactNoError && <p className="error-message">{emailOrContactNoError}</p>}
              <CustomPasswordField
                label={txt.password}
                type="password"
                value={password}
                onChange={(e) => this.setState({ password: e.target.value, passwordError: "" })}
              />
              {passwordError && <p className="error-message">{passwordError}</p>}
              <p
                onClick={() => this.props.history.push("/forgotPassword")}
                className="text-left forgot-password"
                style={{ padding: 0, marginTop: 0, cursor: "pointer" }}
              >
                {txt.forget_password}
              </p>
              <CardActions className="card-actions">
                <PrimaryButton onClick={this.handleLogin}>
                  {isLoading ? <CircularProgress /> : txt.login}
                </PrimaryButton>
              </CardActions>
              <div className="other-login">
                <div className="line"></div>
                <p>{txt.or_continue_with}</p>
                <div className="line"></div>
              </div>
              <CardActions className="card-actions">
                <GoogleLogin
                  onSuccess={this.handleGoogleLoginSuccess}
                  onError={this.handleGoogleLoginFailure}
                  useOneTap
                  shape="circle"
                  theme="outline"
                />
              </CardActions>
              <h4 onClick={() => this.props.history.push("/signup")}>
                {txt.new_user_register}
              </h4>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}

export default Login;