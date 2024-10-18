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
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom";
import { txt } from "../../common/context";
import CustomTextField from "../CustomMUI/CustomTextField";
import CustomBottomSheet from "../CustomMUI/CustomBottomSheet";
import Header from "../CustomMUI/Header";
import MatchIcon from "../../assets/images/svg/match.svg";
import { BASE_URL, sendHttpRequest } from "../../common/Common";
import CustomRMPlayerBottomSheet from "../CustomMUI/CustomRMPlayerBottomSheet";
import SelectTeamModal from "./SelectTeamModal";
import SelectedTeamPlayerModal from "./SelectedTeamPlayerModal";
import AddPlayersModal from "../Player/AddPlayersModal";
import { KeyboardArrowRight } from "@material-ui/icons";
import CustomMatchTypeBottomSheet from "../CustomMUI/CustomMatchTypeBottomSheet";
import CustomBallTypeBottomSheet from "../CustomMUI/CustomBallTypeBottomSheet";
import CustomPitchTypeBottomSheet from "../CustomMUI/CustomPitchTypeBottomSheet";
import CustomOverBottomSheet from "../CustomMUI/CustomOverBottomSheet";

const CreateMatch = () => {
  const location = useLocation();
  const history = useHistory();

  const [matchName, setMatchName] = useState("");
  const [ground, setGround] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [yourTeam, setYourTeam] = useState("");
  const [oppositionTeam, setOppositionTeam] = useState("");

  const [matchError, setMatchError] = useState("");
  const [groundError, setGroundError] = useState("");
  const [dateError, setDateError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [yourTeamError, setYourTeamError] = useState("");
  const [oppositionTeamError, setOppositionTeamError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isValidFormOne, setIsValidFormOne] = useState(false);
  const [showFormTwo, setShowFormTwo] = useState(false);
  const [isBothTeamSame, setIsBothTeamSame] = useState(false);
  const [isShow, setIsShow] = useState(0);
  const [currentTeamField, setCurrentTeamField] = useState("");
  const [selectedTeam, setSelectedTeam] = useState();
  const [allPlayerList, setAllPlayerList] = useState([]);
  const [matchType, setMatchType] = useState(
    {
      type: 'Limited overs',
      player: 'Min number of players 11',
    });
  const [over, setOver] = useState(6);
  const [ballType, setBallType] = useState("Tennis");
  const [pitchType, setPitchType] = useState("Rough");
  const [showMatchType, setShowMatchType] = useState(false);
  const [showBallType, setShowBallType] = useState(false);
  const [showPitchType, setShowPitchType] = useState(false);
  const [showOver, setShowOver] = useState(false);
  const [isOpenSheetTwo, setIsOpenSheetTwo] = useState(false);
  const [oldTeamPlayerList, setOldTeamPlayerList] = useState();

  useEffect(() => {
    let isMounted = true;

    const getPlayer = () => {
      sendHttpRequest("GET", `${BASE_URL}/api/player`)
        .then((res) => {
          if (res.data) {
            let allPlayer = res.data.result.map((obj) => {
              return {
                ...obj,
                isVerified: false,
              };
            });

            if (isMounted) {
              setAllPlayerList(allPlayer);
            }
          }
        })
        .catch((error) => {
          if (isMounted) {
            toast.error(error.response.data.message);
          }
        });
    };

    getPlayer();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {

    if (allPlayerList.length && selectedTeam?.playerList.length) {
      let newPlayers = allPlayerList.filter((player, idx) => player.isVerified)

      const mergedArray = [...selectedTeam.playerList, ...newPlayers];
      const uniqueArray = Array.from(
        mergedArray.reduce((map, item) => map.set(item._id, item), new Map()).values()
      );

      setSelectedTeam({ ...selectedTeam, playerList: uniqueArray });
    }

  }, [allPlayerList])

  useEffect(() => {
    if (matchName && ground && date && time && yourTeam && oppositionTeam) {
      if (yourTeam._id === oppositionTeam._id) {
        setIsBothTeamSame(true)
      } else {
        setIsBothTeamSame(false)
        setIsValidFormOne(true);
      }
    } else {
      setIsValidFormOne(false);
    }
  }, [matchName, ground, date, time, yourTeam, oppositionTeam]);

  const openTeamModal = (field) => {
    setCurrentTeamField(field);
    setIsShow(1);
  };

  const handleTeamSelect = () => {

    if (selectedTeam.playerList.length !== oldTeamPlayerList.length) {
      sendHttpRequest("PUT", BASE_URL + "/api/team", null, JSON.stringify(selectedTeam)).then(res => {
        if (res?.data?.data) {
          console.log(res.data.data);
        }
      }).catch((error) => {
        toast.error(error.response.data.message);
      });
    }

    if (currentTeamField === txt.select_your_team) {
      setYourTeam(selectedTeam);
      setYourTeamError("");
    } else if (currentTeamField === txt.select_opposition_team) {
      setOppositionTeam(selectedTeam);
      setOppositionTeamError("");
    }
  };

  const handleSubmit = () => {
    setIsLoading(true);

    if (!matchName) {
      setMatchError(txt.enter_match_name);
    } else {
      setMatchError("");
    }

    if (!ground) {
      setGroundError(txt.enter_ground_name);
    } else {
      setGroundError("");
    }

    if (!date) {
      setDateError(txt.enter_match_date);
    } else {
      setDateError("");
    }
    if (!time) {
      setTimeError(txt.enter_match_time);
    } else {
      setTimeError("");
    }
    if (!yourTeam) {
      setYourTeamError(txt.select_your_team);
    } else {
      setYourTeamError("");
    }
    if (!oppositionTeam) {
      setOppositionTeamError(txt.select_opposition_team);
    } else {
      setOppositionTeamError("");
    }

    if (isValidFormOne) {
      setShowFormTwo(true)
    }
    setIsLoading(false);
  };

  const onPressCreateMatch = () => {
    setIsLoading(true);

    let data = {
      matchName: matchName,
      matchDate: date,
      matchTime: time.split(":")[0] > 12 ? time.split(":")[0][1] - 2 + ":" + time.split(":")[1] + " PM" : time + " AM",
      ballType: ballType,
      overs: over,
      ground: ground,
      matchType: matchType,
      pitchType: pitchType,
      teamA: yourTeam._id,
      teamB: oppositionTeam._id,
      createdBy: localStorage.getItem("loggedInUserId")
    }


    sendHttpRequest("POST", BASE_URL + `/api/match`, null, JSON.stringify(data))
      .then((res) => {
        if (res?.status === 200) {
          setIsOpenSheetTwo(true);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.response.data.message);
      });
  };

  return (
    <>
      {
        (() => {
          switch (isShow) {
            case 0:
              return (
                <div className="app-container">
                  <Header title={txt.create_a_match} />
                  <ToastMessage />
                  <div id="recaptcha-container"></div>
                  <div className="form-container otp-form-container">
                    <Card className="card card-padding" elevation={0}>
                      <CardContent>
                        <div className="profile-pic-container">
                          <img src={MatchIcon} className="profile-pic" />
                        </div>
                        <h1 className="text-left">{txt.create_a_match}</h1>

                        {/* form one */}
                        {
                          !showFormTwo ?
                            <>
                              <p className="text-left text-color">
                                {txt.start_by_entering_the_details_of_your_match}
                              </p>
                              <CustomTextField
                                label={txt.match_name}
                                type="text"
                                value={matchName}
                                onChange={(e) => {
                                  setMatchName(e.target.value);
                                  setMatchError("");
                                }}
                              />
                              {matchError && <p className="error-message">{matchError}</p>}
                              <CustomTextField
                                label={txt.date}
                                type="date"
                                defaultValue={date}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                onChange={(e) => {
                                  setDate(e.target.value);
                                  setDateError("");
                                }}
                              />

                              {dateError && <p className="error-message">{dateError}</p>}
                              <CustomTextField
                                label={txt.time}
                                defaultValue={time}
                                type="time"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                onChange={(e) => {
                                  setTime(e.target.value);
                                  setTimeError("");
                                }}
                              />
                              {timeError && <p className="error-message">{timeError}</p>}

                              <CustomTextField
                                label={txt.ground}
                                type="text"
                                value={ground}
                                onChange={(e) => {
                                  setGround(e.target.value);
                                  setGroundError("");
                                }}
                              />

                              <CustomTextField
                                label={txt.select_your_team}
                                type="text"
                                value={yourTeam?.name}
                                onClick={() => openTeamModal(txt.select_your_team)}
                                onChange={(e) => {
                                  setYourTeam(e.target.value);
                                  setYourTeamError("");
                                }}
                                readOnly={true}
                              />
                              {yourTeamError && (
                                <p className="error-message">{yourTeamError}</p>
                              )}
                              <div>
                                <CustomTextField
                                  label={txt.select_opposition_team}
                                  type="text"
                                  value={oppositionTeam?.name}
                                  onClick={() => openTeamModal(txt.select_opposition_team)}
                                  onChange={(e) => {
                                    setOppositionTeam(e.target.value);
                                    setOppositionTeamError("");
                                  }}
                                  readOnly={true}
                                />
                              </div>
                              {oppositionTeamError && (
                                <p className="error-message">{oppositionTeamError}</p>
                              )}
                              {isBothTeamSame && <p className="error-message">Both team are same</p>}

                              <CardActions className="card-actions top-space">
                                <PrimaryButton onClick={handleSubmit} disabled={!isValidFormOne}>
                                  {isLoading ? (
                                    <CircularProgress />
                                  ) : !isValidFormOne ? (
                                    txt.next
                                  ) : (
                                    txt.next
                                  )}
                                </PrimaryButton>
                              </CardActions>
                            </>
                            :
                            <>
                              <p className="text-left text-color">
                                {txt.select_an_existing_team_or_create_a_new_team}
                              </p>

                              {/* Match Type */}
                              <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                fontSize: "16px",
                              }}>
                                <p style={{
                                  color: 'var(--primary-color-700)',
                                }}>{txt.match_type}</p>
                                <p
                                  style={{
                                    color: 'var(--color-forgot-password)',
                                    fontWeight: "600",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                  onClick={() => setShowMatchType(true)}
                                >{matchType?.type} <KeyboardArrowRight />
                                </p>
                              </div>

                              {/* Number of Overs */}
                              <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                fontSize: "16px",
                              }}>
                                <p style={{
                                  color: 'var(--primary-color-700)',
                                }}>{txt.number_of_overs}</p>
                                <p
                                  style={{
                                    color: 'var(--color-forgot-password)',
                                    fontWeight: "600",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                  onClick={() => setShowOver(true)}
                                >{over} <KeyboardArrowRight />
                                </p>
                              </div>

                              {/* Ball Type */}
                              <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                fontSize: "16px",
                              }}>
                                <p style={{
                                  color: 'var(--primary-color-700)',
                                }}>{txt.ball_type}</p>
                                <p
                                  style={{
                                    color: 'var(--color-forgot-password)',
                                    fontWeight: "600",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                  onClick={() => setShowBallType(true)}
                                >{ballType} <KeyboardArrowRight />
                                </p>
                              </div>

                              {/* Pitch Type */}
                              <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                fontSize: "16px",
                              }}>
                                <p style={{
                                  color: 'var(--primary-color-700)',
                                }}>{txt.pitch_type}</p>
                                <p
                                  style={{
                                    color: 'var(--color-forgot-password)',
                                    fontWeight: "600",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                  onClick={() => setShowPitchType(true)}
                                >{pitchType} <KeyboardArrowRight />
                                </p>
                              </div>

                              <CardActions className="card-actions top-space">
                                <PrimaryButton onClick={() => setShowFormTwo(false)}>
                                  {txt.previous}
                                </PrimaryButton>
                              </CardActions>

                              <CardActions className="card-actions">
                                <PrimaryButton onClick={onPressCreateMatch} disabled={isLoading}>
                                  {isLoading ?
                                    <CircularProgress /> :
                                    txt.create_match
                                  }
                                </PrimaryButton>

                              </CardActions>
                            </>
                        }
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )
            case 1:
              return (
                <SelectTeamModal
                  show={isShow}
                  selectTeamFor={currentTeamField}
                  setIsShow={setIsShow}
                  setSelectedTeam={(selectedTeamData) => {
                    setSelectedTeam(selectedTeamData)
                    setOldTeamPlayerList(selectedTeamData.playerList);
                  }}
                />
              )
            case 2:
              return (
                <SelectedTeamPlayerModal show={isShow} setIsShow={setIsShow} selectedTeam={selectedTeam} handleAction={(finalTeam) => {
                  handleTeamSelect(finalTeam)
                }} />
              )
            case 3:
              return (
                <AddPlayersModal show={isShow} setIsShow={setIsShow} allPlayerList={allPlayerList} setAllPlayerList={setAllPlayerList} />
              )
          }
        })()
      }

      <CustomMatchTypeBottomSheet isOpen={showMatchType} onDismiss={() => setShowMatchType(false)} setMatchType={setMatchType} />
      <CustomBallTypeBottomSheet isOpen={showBallType} onDismiss={() => setShowBallType(false)} setBallType={setBallType} />
      <CustomPitchTypeBottomSheet isOpen={showPitchType} onDismiss={() => setShowPitchType(false)} setPitchType={setPitchType} />
      <CustomOverBottomSheet isOpen={showOver} onDismiss={() => setShowOver(false)} setOver={setOver} />

      <CustomBottomSheet
        isOpen={isOpenSheetTwo}
        onDismiss={() => {
          setIsOpenSheetTwo(false);
          history.goBack();
        }}
        onButton1Click={() => {
          setIsOpenSheetTwo(false);
          history.goBack();
        }}
        messageText={txt.successfully_created_a_match}
        button1Text={txt.continue}
      />
    </>
  );
};

export default CreateMatch;
