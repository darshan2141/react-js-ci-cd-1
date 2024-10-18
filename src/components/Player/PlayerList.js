import { Box, Card, CardContent } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "../../styles/site.css";
import Header from "../CustomMUI/Header";
import { txt } from "../../common/context";
import { BASE_URL, sendHttpRequest } from "../../common/Common";
import CustomCard from "../CustomMUI/CustomCard";

const PlayerList = () => {
  const [playerList, setPlayerList] = useState();

  useEffect(() => {
    getPlayer();
  }, []);
  const getPlayer = () => {
    sendHttpRequest("GET", `${BASE_URL}/api/player`)
      .then((res) => {
        if (res.data) {
          setPlayerList(res.data.result);
        }
      })
      .catch((error) => {
        // toast.error(error.response.data.message);
      });
  };
  return (
    <Box>
      <Header title={txt.view_all_player} />
      <div className="form-container">
        <Card className="card card-padding" elevation={0}>
          <CardContent className="card-content">
            <p className="text-left text-color">
              {
                txt.select_a_player_to_verify_their_phone_number_to_match_with_the_team
              }
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="player-card-details padding-scroll-bottom">

      {playerList?.map((item, index) => {
        return (
          <div key={item._id}>
            <CustomCard player ={item} name={"View"}
              // profileImage={item.firstName + " " + item.lastName}
              // name={item.firstName + " " + item.lastName}
              // type={item?.battingStyle}
              // bowlingArm={item?.bowlingArm}
              />
          </div>
        );
        })}
      </div>
    </Box>
  );
};
export default PlayerList;
