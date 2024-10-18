import React, { useState, useEffect } from "react";
import { ToastMessage } from "../CustomMUI/ToastMessage";
import {
  Box,
  Card,
  CardContent,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
} from "@material-ui/core";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { txt } from "../../common/context";
import "./SelectYourTeamModal.css";
import Header from "../CustomMUI/Header";
import SearchIcon from "../../assets/images/svg/search.svg";
import CloseIcon from "../../assets/images/svg/close.svg";
import Chairs from "../../assets/images/svg/chairs.svg";
import { CustomAddPlayerButton } from "../CustomMUI/CustomSmallButton";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import { BASE_URL, sendHttpRequest } from "../../common/Common";
import { toast } from "react-toastify";
import TeamCard from "../CustomMUI/TeamCard";

const SelectTeamModal = ({
  show,
  setIsShow,
  selectTeamFor,
  setSelectedTeam,
  onSelect
}) => {
  const history = useHistory();
  const [searchText, setSearchText] = useState("");
  const [selectedTab, setSelectedTab] = useState(1);
  const [teamList, setTeamList] = useState([]);
  const [teams, setTeams] = useState([]);
  const [allTeamsList, setAllTeamsList] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        let response;
        if (selectedTab === 1) {
          response = await sendHttpRequest("GET", BASE_URL + "/api/team/own/" + localStorage.getItem('loggedInUserId'));
        } else if (selectedTab === 2) {
          response = await sendHttpRequest("GET", BASE_URL + "/api/team/previous/" + localStorage.getItem('loggedInUserId'));
        } else if (selectedTab === 3) {
          response = await sendHttpRequest("GET", BASE_URL + "/api/team/global/" + localStorage.getItem('loggedInUserId'));
        }
        
        if (isMounted && response?.data?.data) {
          setAllTeamsList(response.data.data);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(error.response?.data?.message || "An error occurred");
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [selectedTab]);

  useEffect(() => {
    setTeams(allTeamsList);
  }, [allTeamsList])

  const searchValue = (event) => {
    setSearchText(event.target.value);
    if (event.target.value.length > 1) {
      setTeams(
        allTeamsList.filter((item) =>
          item.name
            .toLowerCase()
            .includes(event.target.value.toLowerCase())
        )
      );
    } else {
      setTeams(allTeamsList);
    }
  };

  if (show !== 1) {
    return <></>;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div>

          <Header
            title={selectTeamFor}
            isModal={true}
            closeModal={() => setIsShow(0)}
          />

          <ToastMessage />
          <div id="recaptcha-container"></div>
          <div className="container top-padding">
            <p className="text-left text-color">
              {txt.select_an_existing_team_or_create_a_new_team}
            </p>

            <TextField
              style={{ width: "100%", marginBottom: 10 }}
              onChange={searchValue}
              variant="outlined"
              value={searchText}
              placeholder={txt.search_team}
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
                    }}
                  >
                    <img src={CloseIcon} alt="Search Icon" />
                  </InputAdornment>
                ) : null, // Explicitly set to null to remove the clear button
              }}
            />

            <Box sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={selectedTab}
                textColor="primary"
                indicatorColor="primary"
                onChange={(e, newTab) => setSelectedTab(newTab)} >
                <Tab label={txt.my_teams} value={1} />
                <Tab label={txt.previous} value={2} />
                <Tab label={txt.global} value={3} />
              </Tabs>
            </Box>

            <Card
              className="card create-new-team-card"
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
                <p>Create a new Team</p>
                <p className="p1">Enter the name and the phone number.</p>
                <div style={{ display: "flex", alignItems: "flex-start" }}>
                  <CustomAddPlayerButton
                    name={txt.create_team}
                    onClick={() => {
                      history.push("/create-team");
                    }}
                  // disabled={!isFormValid}
                  />
                </div>
              </CardContent>
              <img src={Chairs} style={{ width: "30%" }} />
            </Card>

            <div>
              {teams?.map((item, index) => {
                return (
                  <TeamCard key={index} teamData={item} handleAction={(selectedTeamData) => {
                    setSelectedTeam(selectedTeamData)
                    setIsShow(2);
                  }} />
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectTeamModal;
