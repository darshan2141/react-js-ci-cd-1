import React, { useState } from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import "./CustomMUI.css";
import { LightButton, PrimaryButton } from "./CustomButtons";
import { txt } from "../../common/context";
import CloseIcon from "../../assets/images/svg/close.svg";
import RightArrow from "../../assets/images/svg/rightArrow.svg";
import CustomOtpInput from "./CustomOtpInput";

const CustomPhoneBottomSheet = ({
  isOpen,
  onDismiss,
  onButton1Click,
  selectedPlayer,
}) => {
  const [phoneNo, setPhoneNo] = useState();
  const [isError,setIsError ]= useState(false);
  const onPressContinue = () => {
    // onButton1Click
    console.log(
      "selectedPlayer",
      selectedPlayer.contactNo.substr(selectedPlayer.contactNo.length - 4)
    );
    if (
      phoneNo ==
      selectedPlayer.contactNo.substr(selectedPlayer.contactNo.length - 4)
    ) {
      setIsError(false)
      onButton1Click();
    }else{
      setIsError(true)
    }
  };
  return (
    <BottomSheet
      open={isOpen}
      onDismiss={onDismiss}
      // defaultSnap={({ maxHeight }) => maxHeight / 2}
      snapPoints={({ maxHeight }) => [maxHeight - 80, maxHeight / 2]}
    >
      <div className="container">
        <div className="header">
          <img src={RightArrow} alt="Party" />
          <img
            src={CloseIcon}
            alt="Close"
            className="close-icon"
            onClick={onDismiss}
          />
        </div>
        <div className="content">
          <p className="sheet-header-text">{txt.verify_player}</p>
          <p className="sheet-description-text">
            {txt.enter_last_4_digits_of_the_players_mobile_number}
          </p>
          <div style={{paddingLeft:"5%",paddingRight:"5%",width:"100%"}}>
            <CustomOtpInput
              numInputs={4}
              onChange={(value) => {
                setIsError(false)
                setPhoneNo(value);
                
              }}
            />
          </div>
          {isError && <p className="error-message">{txt.invalid_last_4_digits}</p>}
          <div className="button-container">
            <PrimaryButton onClick={onPressContinue}>
              {txt.continue}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};

export default CustomPhoneBottomSheet;
