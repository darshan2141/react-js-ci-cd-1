import React, { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  Typography,
  Button,
  Grid,
  Box,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import {
  CustomCardButton,
  CustomSmallButton,
  CustomSmallRoundedButton,
} from "./CustomSmallButton";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import MinusIcon from "../../assets/images/svg/MinusIcon.svg";

const CustomCard = ({ player, name, onClick, from }) => {
  const theme = useTheme();
  const history = useHistory();
  const [buttonText, setButtonText] = useState();
  const [playerDetail, setPlayerDetail] = useState();

  useEffect(() => {
    setButtonText(name);
    setPlayerDetail(player);
  }, [player,name]);

  const handleButtonClick = () => {
    if (buttonText === "View") {
      history.push("/viewPlayer", { data: playerDetail });
    } else if (buttonText === "Verify") {
      onClick(playerDetail);
    } else if (buttonText === "Verified") {
      console.log("first", buttonText);
      onClick(playerDetail);
    } else if (buttonText === "Select") {
      onClick(playerDetail);
    } else if (buttonText === "Selected") {
      console.log("first", buttonText);
      onClick(playerDetail);
    }
  };

  return (
    <Card elevation={0}>
      <Box sx={{ paddingBottom: "5%" }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Avatar
              src={playerDetail?.firstName}
              alt={playerDetail?.firstName}
              sx={{ width: 60, height: 60 }}
            />
          </Grid>
          <Grid item xs>
            <Box>
              <div
                style={{
                  color: "#000",
                  fontFamily: "DM Sans",
                  fontWeight: 400,
                  fontSize: "15px",
                }}
              >
                {playerDetail?.firstName + " " + playerDetail?.lastName}
              </div>
              <div
                style={{
                  color: "#89898D",
                  fontFamily: "DM Sans",
                  fontWeight: 400,
                  fontSize: "13px",
                }}
              >
                {playerDetail?.battingStyle
                  ? "Bat: " + playerDetail?.battingStyle
                  : " "}
                {playerDetail?.bowlingArm
                  ? " Ball: " + playerDetail?.bowlingArm
                  : " "}
              </div>
            </Box>
          </Grid>
          <Grid item>
            {from === "createTeam" ? (
              <div
                className="icon-pic-container"
                onClick={() => handleButtonClick(playerDetail)}
              >
                <img src={MinusIcon} className="icon-pic" />
              </div>
            ) : name ? (
              <CustomCardButton
                onClick={() => handleButtonClick(playerDetail)}
                disabled={false}
                name={buttonText}
              ></CustomCardButton>
            ) : (
              <></>
            )}
            {/* View, Add, Added, Verified, Verify */}
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

export default CustomCard;
