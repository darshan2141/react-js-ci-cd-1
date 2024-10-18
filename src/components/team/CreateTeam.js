import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { PrimaryButton, SecondaryButton } from "../CustomMUI/CustomButtons";
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
import "./team.css";
import CustomBottomSheet from "../CustomMUI/CustomBottomSheet";
import Header from "../CustomMUI/Header";
import TeamIcon from "../../assets/images/svg/team.svg";
import { CustomAddPlayerButton } from "../CustomMUI/CustomSmallButton";
import AddPlayersModal from "../Player/AddPlayersModal";
import CustomCard from "../CustomMUI/CustomCard";
import { BASE_URL, sendHttpRequest } from "../../common/Common";
import CustomRMPlayerBottomSheet from "../CustomMUI/CustomRMPlayerBottomSheet";

const CreateTeam = () => {
  const location = useLocation();
  const history = useHistory();
  const [teamName, setTeamName] = useState("");
  const [teamLocation, setTeamLocation] = useState("");
  const [teamError, setTeamError] = useState("");
  const [teamLocationError, setTeamLocationError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isRemovePlayer, setIsRemovePlayer] = useState(false);
  const [IsValidPlayerList, setIsValidPlayerList] = useState(false);

  const [allPlayerList, setAllPlayerList] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    getPlayer();
  }, []);
  
  const getPlayer = () => {
    sendHttpRequest("GET", `${BASE_URL}/api/player`)
      .then((res) => {
        if (res.data) {
          let allPlayer = res.data.result.map((obj) => {
            return {
              ...obj, // Spread operator to copy the existing properties
              isVerified: false, // New parameter to add
            };
          });

          setAllPlayerList(allPlayer);
        }
      })
      .catch((error) => {
        // toast.error(error.response.data.message);
      });
  };

  useEffect(() => {
    if (teamName && teamLocation) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [teamName, teamLocation]);

  const handleSubmit = () => {
    setIsLoading(true);
    if (!teamName) {
      setTeamError(txt.please_enter_valid_email_address);
    } else {
      setTeamError("");
    }
    if (!teamLocation) {
      setTeamLocationError(txt.location_required);
    } else {
      setTeamLocationError("");
    }
    if (isFormValid) {
      setIsShow(true);
    }
    setIsLoading(false);
  };
  const [selectedRmPlayer, setSelectedRmPlayer] = useState();

  const removePlayer = () => {
    let data = allPlayerList.map((item) => {
      if (item._id == selectedRmPlayer._id) {
        return {
          ...item, // Spread operator to copy the existing properties
          isVerified: false, // New parameter to add
        };
      } else {
        return item;
      }
    });
    setAllPlayerList(data);
    setIsRemovePlayer(false);
    setSelectedRmPlayer()
  };

  useEffect(() => {
    // if (teamMembers.length > 5 && teamMembers.length < 17) {
      if (teamMembers.length > 1 && teamMembers.length < 17) {
      setIsValidPlayerList(true);
      console.log("teamMembers", teamMembers.length);
    } else setIsValidPlayerList(false);
  }, [teamMembers, allPlayerList]);
  
  useEffect(() => {
    if (allPlayerList.length) {
      setTeamMembers(allPlayerList.filter((item) => item.isVerified));
    }
  }, [allPlayerList]);

  const onPressCreateTeam = () => {
    console.log("create team API");
    if (teamMembers.length < 5) {
      ShowToast("Add at least 6 players before creating a team", {
        position: "top-right",
        type: "error",
      });
      return;
    }
    if (teamMembers.length > 17) {
      ShowToast("Team can have only 16 players", {
        position: "top-right",
        type: "error",
      });
      return;
    }
    let data = {
      name: "Pool - " + teamName,
      players: teamMembers.map((item) => item._id),
      createdBy: localStorage.getItem("loggedInUserId"),
      owner: localStorage.getItem("loggedInUserId"),
      isTemp: false,
    };

    sendHttpRequest("POST", BASE_URL + "/api/pool", null, JSON.stringify(data))
      .then((res) => {
        if (res.data.data) {
          let data1 = {
            teamName: teamName,
            teamMembers: teamMembers.map((item) => item._id),
            createdBy: localStorage.getItem("loggedInUserId"),
            poolId: res.data.data._id,
            teamLocation : teamLocation,
            isTemp: false,
            owner: localStorage.getItem("loggedInUserId"),
          };
          sendHttpRequest(
            "POST",
            BASE_URL + "/api/team",
            null,
            JSON.stringify(data1)
          )
            .then((res) => {
              setIsOpen(true);
              console.log("res", res);
            })
            .catch((error) => {
              console.log("error", error);
            });
        }
      })
      .catch((error) => {});
  };
  return (
    <>
      {!isShow ? (
        <div className="app-container">
          <Header title={txt.create_team} />
          <ToastMessage />
          <div id="recaptcha-container"></div>
          <div className="form-container otp-form-container">
            <Card className="card card-padding" elevation={0}>
              <CardContent>
                <div className="profile-pic-container">
                  <img src={TeamIcon} className="profile-pic" />
                </div>
                <h1 className="text-left">{txt.create_team}</h1>
                <p className="text-left text-color">
                  {txt.start_by_entering_the_details_of_your_team}
                </p>

                <CustomTextField
                  label={txt.team_name}
                  type="text"
                  value={teamName}
                  onChange={(e) => {
                    setTeamName(e.target.value);
                    setTeamError("");
                  }}
                />
                {teamError && <p className="error-message">{teamError}</p>}
                <CustomTextField
                  label={txt.location}
                  type="text"
                  value={teamLocation}
                  onChange={(e) => {
                    setTeamLocation(e.target.value);
                    setTeamLocationError("");
                  }}
                />
                {teamLocationError && (
                  <p className="error-message">{teamLocationError}</p>
                )}

                <div style={{ opacity: isFormValid ? 1 : 0.2 }}>
                  <h2 className="text-left">{txt.add_players}</h2>
                  <p className="text-left text-color">
                    {txt.players_of_your_team_will_be_listed_here}
                  </p>
                  {!teamMembers.length ? (
                    <CardActions className="card-actions top-space">
                      <CustomAddPlayerButton
                        name={txt.add_players}
                        onClick={handleSubmit}
                        disabled={!isFormValid}
                      />
                    </CardActions>
                  ) : (
                    <div style={{paddingTop:10}}>
                      {teamMembers?.map((item, index) => {
                        return (
                          <div key={item._id}>
                            <CustomCard
                              from={"createTeam"}
                              player={item}
                              name={item.isVerified ? "Verified" : "Verify"}
                              onClick={(value) => {
                                setIsRemovePlayer(true);
                                setSelectedRmPlayer(value);
                                console.log("clickVerify", value);
                              }}
                            />
                          </div>
                        );
                      })}
                      <CardActions className="card-actions top-space">
                        <CustomAddPlayerButton
                          name={txt.add_more_player}
                          onClick={handleSubmit}
                          disabled={!isFormValid}
                        />
                      </CardActions>
                      <div
                        className="button-container"
                        style={{
                          opacity: IsValidPlayerList ? 1 : 0.2,
                        }}
                      >
                        <PrimaryButton
                          onClick={onPressCreateTeam}
                          disabled={IsValidPlayerList ? false : true}
                        >
                          {txt.create_team}
                        </PrimaryButton>
                      </div>
                    </div>
                  )}
                </div>

                <CustomBottomSheet
                  isOpen={isOpen}
                  onDismiss={() => {
                    setIsOpen(false);
                    history.goBack();
                  }}
                  onButton1Click={() => {
                    setIsOpen(false);
                    history.goBack();
                  }}
                  messageText={teamName + " " + txt.created_Successfully}
                  button1Text={txt.continue}
                />

                <CustomRMPlayerBottomSheet
                  isOpen={isRemovePlayer}
                  onDismiss={() => {
                    setIsRemovePlayer(false);
                    setSelectedRmPlayer();
                  }}
                  player={selectedRmPlayer}
                  onButton1Click={removePlayer}
                  onButton2Click={() => {
                    setIsRemovePlayer(false);
                    setSelectedRmPlayer();
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <AddPlayersModal
          show={isShow}
          setIsShow={setIsShow}
          allPlayerList={allPlayerList}
          setAllPlayerList={setAllPlayerList}
        />
      )}
    </>
  );
};

export default CreateTeam;
