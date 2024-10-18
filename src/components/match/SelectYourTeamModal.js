import React, { useState, useEffect } from "react";
import { ToastMessage } from "../CustomMUI/ToastMessage";
import {
  Box,
  Card,
  CardContent,
  InputAdornment,
  Tab,
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

const SelectYourTeamModal = ({
  show,
  setIsShow,
}) => {

  const history = useHistory();
  const [searchText, setSearchText] = useState("");
  const [selectedTab, setSelectedTab] = useState("1");
  const [teamList, setTeamList] = useState([]);
  const [teams, setTeams] = useState();

  useEffect(() => {
    getAllTeams();
  }, [])

  const getAllTeams = () => {
    sendHttpRequest("GET", BASE_URL + "/api/team").then(res => {
      if (res.data.data) {
        setTeamList(res.data.data)
        setTeams(res.data.data)
      }
    }).catch((error) => {
      toast.error(error.response.data.message);
    });
  }

  const searchValue = (event) => {
    setSearchText(event.target.value);
    if (event.target.value.length > 1) {
      setTeamList(
        teams.filter((item) =>
          item.name
            .toLowerCase()
            .includes(event.target.value.toLowerCase())
        )
      );
    } else {
      setTeamList(teams);
    }
  };

  if (!show) {
    return <></>;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div>

          <Header
            title={txt.select_your_team}
            isModal={true}
            closeModal={() => setIsShow(false)}
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

            <TabContext value={selectedTab}>
              <Box sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
                <TabList
                  textColor="primary"
                  indicatorColor="primary"
                  onChange={(e, newTab) => setSelectedTab(newTab)} >
                  <Tab label={txt.my_teams} value="1" />
                  <Tab label={txt.previous} value="2" />
                  <Tab label={txt.global} value="3" />
                </TabList>
              </Box>

              <TabPanel style={{ padding: 0 }} value="1">
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
                  <img src={Chairs} alt="Chairs" style={{ width: "30%" }} />
                </Card>

                <div>
                  {teamList?.map((item, index) => {
                    return (
                      <TeamCard key={index} teamData={item} />
                    );
                  })}
                </div>
              </TabPanel>
              <TabPanel style={{ padding: 0 }} value="2">Item Two</TabPanel>
              <TabPanel style={{ padding: 0 }} value="3">Item Three</TabPanel>
            </TabContext>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectYourTeamModal;
