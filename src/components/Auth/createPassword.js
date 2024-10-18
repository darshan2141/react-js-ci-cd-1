import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { PrimaryButton } from "../CustomMUI/CustomButtons";
import { ShowToast, ToastMessage } from "../CustomMUI/ToastMessage";
import { txt } from "../../common/context";
import lock from "../../assets/images/svg/lock.svg";
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  CircularProgress,
} from "@material-ui/core";
import CustomPasswordField from "../CustomMUI/CustomPasswordField";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom";
import { BASE_URL, sendHttpRequest } from "../../common/Common";

const CreatePassword = () => {
  const history = useHistory();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [passwordError, setPasswordError] = useState();
  const [confirmPasswordError, setConfirmPasswordError] = useState();
  const [passMatchError, setPassMatchError] = useState();

  const handleSave = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!password) {
      setPasswordError(txt.password_cant_be_empty);
      return;
    }
    if (!passwordRegex.test(password)) {
      setPasswordError(txt.password_invalid_format);
      return;
    }
    if (!confirmPassword) {
      setConfirmPasswordError(txt.confirm_password_cant_be_empty);
      return;
    }
    if (password !== confirmPassword) {
      setPassMatchError(txt.passwords_doesnt_match);
      return;
    }
    if (password == confirmPassword) {
      setIsLoading(true);
      const data = {
        playerId: location.state.playerId,
        password: password,
      };
      sendHttpRequest(
        "POST",
        BASE_URL + "/api/auth/forgot-password-create-password",
        null,
        JSON.stringify(data)
      )
        .then((res) => {
          setIsLoading(false);
          localStorage.setItem("loggedInUserToken", res.data.data.token);
          localStorage.setItem("loggedInUserId", res.data.data._id);
          localStorage.setItem("showIntroScreen", 'true');
          ShowToast(txt.new_password_set_successfully, {
            position: "top-center",
            type: "success",
          });
          history.push("/home");
        })
        .catch((error) => {
          setIsLoading(false);
          toast.error(error.response.data.message);
        });
    }
  };

  return (
    <>
      <div className="app-container otp-container">
        <ToastMessage />
        <div id="recaptcha-container"></div>
        <div className="form-container otp-form-container">
          <Card className="card" elevation={0}>
            <CardContent>
              <CardMedia
                component="img"
                style={{ width: "30%" }}
                alt=""
                src={lock}
              />
              <h1 className="text-left">{txt.create_new_password}</h1>
              <p className="text-left">{txt.enter_new_password}</p>

              <CustomPasswordField
                label={txt.password}
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
              />
              {passwordError && (
                <p className="error-message">{passwordError}</p>
              )}

              <CustomPasswordField
                label={txt.c_password}
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmPasswordError("");
                  setPassMatchError("");
                }}
              />
              {confirmPasswordError && (
                <p className="error-message">{confirmPasswordError}</p>
              )}
              {passMatchError && (
                <p className="error-message">{passMatchError}</p>
              )}

              <CardActions className="card-actions">
                <PrimaryButton onClick={handleSave}>
                  {isLoading ? <CircularProgress /> : txt.save}
                </PrimaryButton>
              </CardActions>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CreatePassword;
