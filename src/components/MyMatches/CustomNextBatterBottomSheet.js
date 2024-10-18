import React, { useEffect, useState } from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import CloseIcon from "../../assets/images/svg/close.svg";
import RedBall from "../../assets/images/score/Red_Ball.svg";
import { txt } from "../../common/context";
import { makeStyles } from "@material-ui/core";
import { PrimaryButton } from "../CustomMUI/CustomButtons";
import CustomCard from "./../CustomMUI/CustomCard";

const CustomNextBatterBottomSheet = ({
  isOpen,
  onDismiss,
  setSelectedBatter,
  allBatsmen
}) => {

  const [selectedPlayerIdx, setSelectedPlayerIdx] = useState(null);

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
          <p className="sheet-header-text">{txt.next_batter}</p>
          <p className="sheet-description-text">{txt.pick_the_next_batter}</p>

          <div className="player-card-details">
            {allBatsmen?.map((item, idx) => (
              <div key={idx}>
                <CustomCard
                  player={item?.player}
                  name={selectedPlayerIdx === idx ? "Selected" : "Select"}
                  onClick={() => setSelectedPlayerIdx(idx)}
                />
              </div>
            ))}
          </div>

          <div className="button-container">
            <PrimaryButton
              onClick={() => {
                if (typeof selectedPlayerIdx === "number") {
                  onDismiss();
                  setSelectedBatter(allBatsmen[selectedPlayerIdx]);
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

export default CustomNextBatterBottomSheet;
