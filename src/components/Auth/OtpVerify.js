import React, { useState, useEffect, useRef } from "react";
import { PrimaryButton } from "../CustomMUI/CustomButtons";
import lock from "../../assets/images/svg/lock.svg";
import { ShowToast, ToastMessage } from "../CustomMUI/ToastMessage";
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  CircularProgress,
} from "@material-ui/core";
import "./auth.css";
import CustomMobileInput from "../CustomMUI/CustomMobileInput";
import CustomOtpInput from "../CustomMUI/CustomOtpInput";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom";
import { sendHttpRequest, BASE_URL } from "../../common/Common";
import { txt } from "../../common/context";
import {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "../../config/firebase";

const OtpVerify = () => {
  const location = useLocation();
  const history = useHistory();
  const [countryCode, setCountryCode] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpValid, setIsOtpValid] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [numValid, setNumValid] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [timer, setTimer] = useState(0);
  const [otpError, setOtpError] = useState(""); 
  const recaptchaVerifierRef = useRef(null);
  let interval = useRef(null);

  useEffect(() => {
    if (otp.length === 6) {
      setIsOtpValid(true);
    } else {
      setIsOtpValid(false);
    }
  }, [otp]);

  useEffect(() => {
    if (contactNo.replace(countryCode, "").length !== 10) {
      setNumValid(false);
    } else {
      setNumValid(true);
    }
  }, [contactNo]);

  useEffect(() => {
    if (isOtpSent && timer > 0) {
      interval.current = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval.current);
    }
    return () => clearInterval(interval.current);
  }, [isOtpSent, timer]);

  const initializeRecaptcha = () => {
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("reCAPTCHA solved");
          },
          "expired-callback": () => {
            console.error("reCAPTCHA expired");
          },
        },
        auth
      );
      recaptchaVerifierRef.current.render();
    }
  };

  const handleSendOtp = () => {
    if (!countryCode || !contactNo) {
      console.log("contact Number or Country Code issue.");
      return;
    }
    setIsLoading(true);
    setIsOtpSent(false);
    console.log("contactNo", contactNo);
    const phoneNumber = `+${contactNo}`;
    console.log("phoneNumber", phoneNumber);
    initializeRecaptcha();

    signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifierRef.current)
      .then((confirmationResult) => {
        setConfirmationResult(confirmationResult);
        setIsLoading(false);
        setIsOtpSent(true);
        setTimer(60); // Set the timer to 60 seconds
        ShowToast(txt.OTP_has_been_sent_to_your_number, {
          position: "top-right",
          type: "success", // success, error, warning, info
        });
      })
      .catch((error) => {
        setIsLoading(false);
        setIsOtpSent(false);
        console.log("Failed to send OTP error", error);
      });
  };

  const handleVerify = () => {
    if (!confirmationResult) {
      console.log("somthig worng in sent OTP");
      return;
    }

    setIsLoading(true);

    confirmationResult
      .confirm(otp)
      .then((result) => {
        setIsLoading(false);
        console.log("otp verify successfully");
        setOtpError("");
        handleRegister();
      })
      .catch((error) => {
        setIsLoading(false);
        setOtpError(txt.invalid_otp); 
        console.error("Error during confirmation", error);
      });
  };

  const handleRegister = () => {
    const data = {
      firstName: location.state.firstName,
      lastName: location.state.lastName,
      email: location.state.email,
      contactNo: contactNo,
      country: countryCode,
      password: location.state.password,
    };

    setIsLoading(true);

    sendHttpRequest(
      "POST",
      BASE_URL + "/api/auth/register",
      null,
      JSON.stringify(data)
    )
      .then((res) => {
        setIsLoading(false);
        console.log('data', res.data)    
        localStorage.setItem("loggedInUserToken", res.data?.token);
        localStorage.setItem("loggedInUserId", res.data?._id);
        localStorage.setItem("showIntroScreen", 'true');
        history.push("/home");
      })
      .catch((error) => {
        setIsLoading(false);
        ShowToast(error.response.data.message, {
          position: "top-right",
          type: "error",
        });
        // toast.error(error.response.data.message);
      });
  };

  const handleResendOtp = () => {
    handleSendOtp();
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
              <h1 className="text-left">{txt.number_verification}</h1>
              <p className="text-left">{txt.num_verify_below_txt}</p>

              <CustomMobileInput
                countryCode={"lk"}
                phone={contactNo}
                onCountryChange={(value) => {
                  setCountryCode(value);
                }}
                onPhoneChange={(value) => {
                  setContactNo(value);
                }}
                label={txt.phone_number}
                disabled={isOtpSent} 
              />

              <h4
                onClick={timer === 0 ? handleResendOtp : null}
                style={{
                  color: isOtpSent
                    ? timer > 0
                      ? "var(--color-forgot-password)"
                      : "var(--color-forgot-password)"
                    : "gray",
                  cursor: timer === 0 ? "pointer" : "default",
                }}
              >
                {isOtpSent
                  ? timer > 0
                    ? `${txt.donot_receive_code} Resend in ${timer}s`
                    : <>
                        {txt.donot_receive_code}{" "}
                        <span style={{ textDecoration: "underline", color: "var(--color-forgot-password)" }}>Resend</span>
                      </>
                  : txt.dont_receive_code}
              </h4>

              {isOtpSent && (
                <>
                  <p className="mt-4 mb-1">{txt.enter_otp}</p>
                  <CustomOtpInput
                    numInputs={6}
                    onChange={(value) => {
                      setOtp(value);
                      setOtpError(""); 
                    }}
                  />
                  {otpError && (
                    <p style={{ color: "red" }}>{otpError}</p> 
                  )}
                </>
              )}

              <CardActions className="card-actions">
                <PrimaryButton
                  onClick={isOtpSent ? handleVerify : handleSendOtp}
                  disabled={(isOtpSent && !isOtpValid) || !numValid}
                >
                  {isLoading ? (
                    <CircularProgress />
                  ) : isOtpSent ? (
                    isOtpValid ? (
                      txt.login
                    ) : (
                      txt.next
                    )
                  ) : (
                    txt.send_otp
                  )}
                </PrimaryButton>
              </CardActions>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OtpVerify;
