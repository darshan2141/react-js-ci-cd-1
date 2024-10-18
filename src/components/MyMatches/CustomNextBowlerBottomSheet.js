import React, { useEffect, useState } from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import CloseIcon from "../../assets/images/svg/close.svg";
import RedBall from "../../assets/images/score/Red_Ball.svg";
import { txt } from "../../common/context";
import { makeStyles } from "@material-ui/core";
import { PrimaryButton } from "../CustomMUI/CustomButtons";
import CustomCard from "./../CustomMUI/CustomCard";

const CustomNextBowlerBottomSheet = ({
  isOpen,
  onDismiss,
  setSelectedBower,
  allBowlers
}) => {

  const [selectedPlayerIdx, setSelectedPlayerIdx] = useState();

  return (
    <BottomSheet
      open={isOpen}
      onDismiss={onDismiss}
      snapPoints={({ maxHeight }) => [maxHeight - 80, maxHeight / 1.7]}
    >
      <div className="container">
        <div className="header">
          <img src={RedBall} alt="Ball" />
          <img
            src={CloseIcon}
            alt="Close"
            className="close-icon"
            onClick={onDismiss}
          />
        </div>
        <div className="content">
          <p className="sheet-header-text">{txt.next_bowler}</p>
          <p className="sheet-description-text">{txt.pick_the_next_bowler}</p>

          <div className="player-card-details">
            {allBowlers?.map((item, idx) => (
              <div key={idx}>
                <CustomCard
                  player={item?.player}
                  name={selectedPlayerIdx === idx ? "Selected" : "Select"}
                  onClick={(e) => {
                    setSelectedPlayerIdx(idx);
                  }}
                />
              </div>
            ))}
          </div>

          <div className="button-container">
            <PrimaryButton
              onClick={() => {
                if (typeof selectedPlayerIdx === "number") {
                  onDismiss();
                  setSelectedBower(allBowlers[selectedPlayerIdx]);
                }
              }}
            >
              {txt.continue}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};

export default CustomNextBowlerBottomSheet;
