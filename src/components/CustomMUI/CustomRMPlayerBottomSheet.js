import React from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import "./CustomMUI.css";
import { DeleteButton, LightButton, PrimaryButton } from "./CustomButtons";
import { txt } from "../../common/context";
import CloseIcon from "../../assets/images/svg/close.svg";
import PartyIcon from "../../assets/images/svg/partyIcon.svg";
import MinusIcon from "../../assets/images/svg/MinusIcon.svg";
import CustomCard from "./CustomCard";
const CustomRMPlayerBottomSheet = ({
  isOpen,
  onDismiss,
  player,
  onButton1Click,
  onButton2Click,
}) => {
  return (
    <BottomSheet
      open={isOpen}
      onDismiss={onDismiss}
      // defaultSnap={({ maxHeight }) => maxHeight / 2}
      snapPoints={({ maxHeight }) => [maxHeight - 80, maxHeight / 2]}
    >
      <div className="container">
        <div className="header">
          <img src={MinusIcon} style={{ width: 50, height: 50 }} />
          <img
            src={CloseIcon}
            alt="Close"
            className="close-icon"
            onClick={onDismiss}
          />
        </div>
        <div className="content">
          <p className="sheet-header-text">
            {txt.are_you_sure_you_want_to_remove_this_player}
          </p>
          <div className="player-card-details">
            <CustomCard
              player={player}
              onClick={(value) => {
                console.log("clickVerify", value.contactNo);
              }}
            />
          </div>
          <div className="button-container">
            <DeleteButton onClick={onButton1Click}>{txt.yes}</DeleteButton>
            <LightButton onClick={onButton2Click}>{txt.no}</LightButton>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};

export default CustomRMPlayerBottomSheet;
