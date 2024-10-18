import React from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import "./CustomMUI.css";
import { LightButton, PrimaryButton } from "./CustomButtons";
import { txt } from "../../common/context";
import CloseIcon from "../../assets/images/svg/close.svg";
import PartyIcon from "../../assets/images/svg/partyIcon.svg";

const CustomBottomSheet = ({
  isOpen,
  onDismiss,
  messageText,
  button1Text,
  button2Text,
  onButton1Click,
  onButton2Click,
}) => {
  return (
    <BottomSheet
      open={isOpen}
      onDismiss={onDismiss}
      // defaultSnap={({ maxHeight }) => maxHeight / 2}
      snapPoints={({ maxHeight }) => [maxHeight - 80, maxHeight / 2.7]}
    >
      <div className="container">
        <div className="header">
          <img src={PartyIcon} alt="Party" />
          <img
            src={CloseIcon}
            alt="Close"
            className="close-icon"
            onClick={onDismiss}
          />
        </div>
        <div className="content">
          <p className="sheet-header-text">{messageText}</p>
          <div className="button-container">
            {button1Text ? (
              <PrimaryButton onClick={onButton1Click}>
                {button1Text}
              </PrimaryButton>
            ) : (
              <></>
            )}
            {button2Text ? (
              <LightButton onClick={onButton2Click}>{button2Text}</LightButton>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};

export default CustomBottomSheet;
