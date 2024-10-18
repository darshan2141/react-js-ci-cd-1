import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
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
import { txt } from "../../common/context";
import {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "../../config/firebase";
import { BASE_URL, sendHttpRequest } from "../../common/Common";
// import "../../assets/styles/Colours.css";

const ForgotPassword = () => {
  const history = useHistory();
  const [countryCode, setCountryCode] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpValid, setIsOtpValid] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [numValid, setNumValid] = useState(false);
  const [timer, setTimer] = useState(0);
  const [playerId, setPlayerId] = useState("");
  const [otpError, setOtpError] = useState("");
  const recaptchaVerifierRef = useRef(null);

  useEffect(() => {
    setIsOtpValid(otp.length === 6);
  }, [otp]);

  useEffect(() => {
    if (contactNo.replace(countryCode, "").length !== 10) {
      setNumValid(false);
    } else {
      setNumValid(true);
    }
  }, [contactNo]);

  useEffect(() => {
    let interval;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
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

  const getForgotPassword = () => {
    sendHttpRequest(
      "GET",
      BASE_URL + "/api/auth/get-user-for-forgot/" + contactNo
    )
      .then((res) => {
        console.log("res", res.data.status_code);
        if (res.data.status_code == 200) {
          setPlayerId(res.data.playerId);
          setOtpError("");
          handleSendOtp();
        } else {
          setOtpError(txt.invalid_otp); 
          ShowToast(txt.please_enter_valid_contact_number, {
            position: "top-right",
            type: "error", //success, error, warning, info
          });
        }
      })
      .catch((error) => {
        console.log("getForgotPassword error ::", JSON.parse(error));
      });
  };
  
  const handleSendOtp = () => {
    if (!countryCode || !contactNo) {
      console.log("contact Number or Country Code issue.");
      return;
    }
    setIsLoading(true);
    setIsOtpSent(false);

    const phoneNumber = `+${contactNo}`;
    initializeRecaptcha();

    signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifierRef.current)
      .then((confirmationResult) => {
        console.log('confirmationResult::: ', confirmationResult)
        setConfirmationResult(confirmationResult);
        setIsLoading(false);
        setIsOtpSent(true);
        setTimer(60);
        // toast.success(txt.OTP_has_been_sent_to_your_number);
        ShowToast(txt.OTP_has_been_sent_to_your_number, {
          position: "top-right",
          type: "success", 
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
      console.log("something wrong in sent OTP");
      return;
    }

    setIsLoading(true);
console.log('confirmationResult', confirmationResult)
    confirmationResult
      .confirm(otp)
      .then((result) => {
        setIsLoading(false);
        history.push("/createPassword", { playerId: playerId });
      })
      .catch((error) => {
        setIsLoading(false);
        setOtpError(txt.invalid_otp);
        console.error("Error during confirmation", error);
      });
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
              <h1 className="text-left">{txt.forget_password}</h1>
              <p className="text-left">
                {txt.enter_phone_number_for_get_new_password}
              </p>

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
                disabled={isOtpSent} // Disable input after sending OTP
              />

              <h4
                onClick={timer === 0 ? handleSendOtp : null}
                style={{
                  color: isOtpSent
                    ? timer > 0
                      ? "var(--color-forgot-password)"
                      : "var(--color-forgot-password)"
                    : "gray",
                  cursor: timer === 0 ? "pointer" : "default",
                }}
              >
                {isOtpSent ? (
                  timer > 0 ? (
                    `${txt.donot_receive_code} Resend in ${timer}s`
                  ) : (
                    <>
                      {txt.donot_receive_code}{" "}
                      <span
                        style={{
                          textDecoration: "underline",
                          color: "var(--color-forgot-password)",
                        }}
                      >
                        Resend
                      </span>
                    </>
                  )
                ) : (
                  ""
                )}
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
                  onClick={isOtpSent ? handleVerify : getForgotPassword}
                  disabled={(isOtpSent && !isOtpValid) || !numValid}
                >
                  {isLoading ? (
                    <CircularProgress />
                  ) : isOtpSent ? (
                    isOtpValid ? (
                      txt.next
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

export default ForgotPassword;
