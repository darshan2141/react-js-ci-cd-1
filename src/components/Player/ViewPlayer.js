import { Avatar, Box, Card, CardContent } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "../../styles/site.css";
import Header from "../CustomMUI/Header";
import { txt } from "../../common/context";
import { BASE_URL, sendHttpRequest } from "../../common/Common";
import CustomCard from "../CustomMUI/CustomCard";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
const ViewPlayer = () => {
  const location = useLocation();
  const [player, setPlayer] = useState();
  useEffect(() => {
    setPlayer(location.state.data);
  }, [location]);
  return (
    <Box>
      <Header title={player?.firstName + " " + player?.lastName} />
      <div className="form-container">
        <Card className="card card-padding" elevation={0}>
          <CardContent className="card-content">
            <p className="text-left text-color">
              {txt.below_are_the_information_about}
            </p>
            <div className="div-profile">
              <div className="profile-pic-container">
                {player?.imageUrl ? <img
                  src={player?.firstName}
                  alt="Profile Placeholder"
                  className="profile-pic"
                  style={{ cursor: "pointer" }}
                />:
                <div className="profile-pic">
                  <p>{player?.firstName[0]+player?.lastName[0]}</p>
                </div>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="player-card-details"></div>
    </Box>
  );
};
export default ViewPlayer;
