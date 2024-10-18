import React, { useState, useEffect } from "react";
import { ShowToast, ToastMessage } from "../CustomMUI/ToastMessage";
import {
  Card,
  CardContent,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { txt } from "../../common/context";
import "./player.css";
import CustomBottomSheet from "../CustomMUI/CustomBottomSheet";
import Header from "../CustomMUI/Header";
import ShareIcon from "../../assets/images/svg/share.svg";
import SearchIcon from "../../assets/images/svg/search.svg";
import CloseIcon from "../../assets/images/svg/close.svg";
import PlayerIcon from "../../assets/images/svg/player.svg";
import { CustomAddPlayerButton } from "../CustomMUI/CustomSmallButton";
import { Autocomplete } from "@material-ui/lab";
import CustomCard from "../CustomMUI/CustomCard";
import { BASE_URL, sendHttpRequest } from "../../common/Common";
import CustomPhoneBottomSheet from "../CustomMUI/CustomPhoneBottomSheet";
import { PrimaryButton } from "../CustomMUI/CustomButtons";

const AddPlayersModal = ({
  show,
  setIsShow,
  allPlayerList,
  setAllPlayerList,
}) => {
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [isOpenSheetOne, setIsOpenSheetOne] = useState(false);
  const [isOpenSheetTwo, setIsOpenSheetTwo] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState();
  const [searchText, setSearchText] = useState("");
  const [playerList, setPlayerList] = useState([]);

  const searchValue = (event) => {
    setSearchText(event.target.value);
    if (event.target.value.length > 1) {
      setPlayerList(
        allPlayerList.filter((item) =>
          item.firstName
            .toLowerCase()
            .includes(event.target.value.toLowerCase())
        )
      );
    } else {
      setPlayerList([]);
    }
  };

  const playerVerified = () => {
    let data = allPlayerList.map((item) => {
      if (item._id == selectedPlayer._id) {
        return {
          ...item,
          isVerified: true,
        };
      } else {
        return item;
      }
    });
    setAllPlayerList(data);
    setPlayerList(
      data.filter((item) =>
        item.firstName.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  };

  const onPressContinue = () => {
    setAllPlayerList(allPlayerList);
    setIsShow(typeof show === 'boolean' ? false : 2);
  };

  if (!show || (typeof show === 'number' && show !== 3)) {
    return <></>;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div>
          <Header
            title={txt.add_players}
            isModal={true}
            closeModal={() => setIsShow(typeof show === 'boolean' ? false : 2)}
          />
          <ToastMessage />
          <div id="recaptcha-container"></div>
          <div className="container top-padding">
            <p className="text-left text-color">
              {txt.select_or_invite_or_create_players_to_your_team}
            </p>

            <TextField
              style={{ width: "100%", marginBottom: 10 }}
              onChange={searchValue}
              variant="outlined"
              value={searchText}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <img src={SearchIcon} alt="Search Icon" />
                  </InputAdornment>
                ),
                endAdornment: searchText ? (
                  <InputAdornment
                    position="end"
                    onClick={() => {
                      setSearchText("");
                      setPlayerList([]);
                    }}
                  >
                    <img src={CloseIcon} alt="Search Icon" />
                  </InputAdornment>
                ) : null, // Explicitly set to null to remove the clear button
              }}
            />
            <div className="player-card-details">
              {playerList?.map((item, index) => {
                return (
                  <div key={item._id}>
                    <CustomCard
                      player={item}
                      name={item.isVerified ? "Verified" : "Verify"}
                      onClick={(value) => {
                        setSelectedPlayer(value);
                        console.log("clickVerify", value.contactNo);
                        setIsOpenSheetOne(true);
                      }}
                    />
                  </div>
                );
              })}
            </div>
            {playerList?.length ? (
              <div className="button-container">
                <PrimaryButton onClick={onPressContinue}>
                  {txt.continue}
                </PrimaryButton>
              </div>
            ) : (
              <></>
            )}

            <Card
              className="card card-invite-player"
              elevation={0}
              style={{
                margin: 0,
                padding: 0,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                backgroundColor: "var(--card-1-bg)",
                width: "70%",
              }}
            >
              <CardContent>
                <p>Invite Players</p>
                <p className="p1">Share the link to add new players.</p>
                <div style={{ display: "flex", alignItems: "flex-start" }}>
                  <CustomAddPlayerButton
                    name={txt.copy_link}
                    onClick={() => {
                      // navigator.clipboard.writeText(`${WEB_BASE_URL}/tournament/register/${tournamentDetails._id}`)
                      // ShowToast("Link copied to clipboard")
                      ShowToast("Link copied to clipboard", {
                        position: "top-right",
                        type: "error",
                      });
                    }}
                  // disabled={!isFormValid}
                  />
                </div>
              </CardContent>
              <img src={ShareIcon} style={{ width: "30%" }} />
            </Card>
            <Card
              className="card card-invite-player"
              elevation={0}
              style={{
                marginTop: 10,
                padding: 0,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                backgroundColor: "var(--card-2-bg)",
                width: "70%",
              }}
            >
              <CardContent>
                <p>Create a new Player</p>
                <p className="p1">Enter the name and the phone number.</p>
                <div style={{ display: "flex", alignItems: "flex-start" }}>
                  <CustomAddPlayerButton
                    name={txt.create_players}
                    onClick={() => {
                      history.push("/createPlayer");
                    }}
                  // disabled={!isFormValid}
                  />
                </div>
              </CardContent>
              <img src={PlayerIcon} style={{ width: "30%" }} />
            </Card>
          </div>
        </div>
      </div>
      <CustomPhoneBottomSheet
        isOpen={isOpenSheetOne}
        onDismiss={() => {
          setIsOpenSheetOne(false);
        }}
        onButton1Click={() => {
          setIsOpenSheetOne(false);
          setIsOpenSheetTwo(true);
          playerVerified();
        }}
        selectedPlayer={selectedPlayer}
      />
      <CustomBottomSheet
        isOpen={isOpenSheetTwo}
        onDismiss={() => {
          setIsOpenSheetTwo(false);
        }}
        onButton1Click={() => {
          setIsOpenSheetOne(false);
          setIsOpenSheetTwo(false);
        }}
        messageText={txt.verification_successful}
        button1Text={txt.continue}
      />
    </div>
  );
};

export default AddPlayersModal;
