import React, { useState, useEffect } from "react";
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
import CustomMobileInput from "../CustomMUI/CustomMobileInput";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom";
import { txt } from "../../common/context";
import CustomTextField from "../CustomMUI/CustomTextField";
import ProfilPlacholder from "../../assets/images/svg/profil_placeholder.svg";
import CameroImg from "../../assets/images/svg/camero.svg";
import "./player.css";
import CustomBottomSheet from "../CustomMUI/CustomBottomSheet";
import Header from "../CustomMUI/Header";
import { BASE_URL, sendHttpRequest } from "../../common/Common";

const CreatePlayer = () => {
  const location = useLocation();
  const history = useHistory();
  const [playerFirstName, setPlayerFirstName] = useState("");
  const [playerLastName, setPlayerLastName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const resetFormFields = () => {
    setPlayerFirstName("");
    setPlayerLastName("");
    setCountryCode("");
    setContactNo("");
    setProfilePic(null);
    setIsFormValid(false);
    setFirstNameError("");
    setLastNameError("");
    setPhoneError("");
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (
      playerFirstName &&
      playerLastName &&
      profilePic &&
      countryCode &&
      contactNo &&
      contactNo.replace(countryCode, "").length === 10
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [playerFirstName, playerLastName, contactNo, profilePic, countryCode]);

  const handleSubmit = () => {
    if (!playerFirstName) {
      setFirstNameError(txt.please_enter_first_name);
    } else {
      setFirstNameError("");
    }

    if (!playerLastName) {
      setLastNameError(txt.please_enter_last_name);
    } else {
      setLastNameError("");
    }

    if (!contactNo || contactNo.replace(countryCode, "").length !== 10) {
      setPhoneError(txt.please_enter_valid_phone_number);
    } else {
      setPhoneError("");
    }
    let params = {
      firstName: playerFirstName,
      lastName: playerLastName,
      contactNo: contactNo,
    };

    if (isFormValid) {
      sendHttpRequest(
        "POST",
        BASE_URL + "/api/player",
        null,
        JSON.stringify(params)
      )
        .then((data) => {
          console.log('data', data)
          // API call to create player
          setIsOpen(true);
        })
        .catch((error) => {});
    }
  };

  const closeSheet = () => {
    setIsOpen(false);
    history.push("/playerList");
  };

  const handleButton1Click = () => {
    resetFormFields();
    closeSheet();
  };

  const handleButton2Click = () => {
    closeSheet();
    history.push("/playerList");
  };

  return (
    <>
      <div className="app-container">
        <Header title={"Create Player"} />
        <ToastMessage />
        <div id="recaptcha-container"></div>
        <div className="form-container otp-form-container">
          <Card className="card card-padding" elevation={0}>
            <CardContent>
              <p className="text-left text-color">
                {txt.enter_players_name_and_phone_number}
              </p>
              <div className="profile-pic-container">
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="profile-pic-input"
                  type="file"
                  onChange={handleProfilePicChange}
                />
                <label htmlFor="profile-pic-input">
                  <img
                    src={profilePic || ProfilPlacholder}
                    alt="Profile Placeholder"
                    className="profile-pic"
                    style={{ cursor: "pointer" }}
                  />
                  <img
                    src={CameroImg}
                    alt="Camera Icon"
                    className="camera-icon"
                  />
                </label>
              </div>
              <div className="flex-container">
                <div className="flex-item">
                  <CustomTextField
                    label={txt.first_name}
                    type="text"
                    value={playerFirstName}
                    onChange={(e) => {
                      setPlayerFirstName(e.target.value);
                      setFirstNameError("");
                    }}
                  />
                  {firstNameError && (
                    <p className="error-message">{firstNameError}</p>
                  )}
                </div>
                <div className="flex-item">
                  <CustomTextField
                    label={txt.last_name}
                    type="text"
                    value={playerLastName}
                    onChange={(e) => {
                      setPlayerLastName(e.target.value);
                      setLastNameError("");
                    }}
                  />
                  {lastNameError && (
                    <p className="error-message">{lastNameError}</p>
                  )}
                </div>
              </div>
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
              />
              {phoneError && <p className="error-message">{phoneError}</p>}
              <CardActions className="card-actions top-space">
                <PrimaryButton onClick={handleSubmit} disabled={!isFormValid}>
                  {isLoading ? <CircularProgress /> : txt.continue}
                </PrimaryButton>
              </CardActions>
              <CustomBottomSheet
                isOpen={isOpen}
                onDismiss={closeSheet}
                messageText={txt.player_creation_successful}
                button1Text={txt.add_another_player}
                button2Text={txt.view_players}
                onButton1Click={handleButton1Click}
                onButton2Click={handleButton2Click}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CreatePlayer;
