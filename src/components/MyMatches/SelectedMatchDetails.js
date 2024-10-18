import React, { useEffect, useState } from 'react'
import Header from '../CustomMUI/Header'
import { Avatar, Box, Card, CardContent, Grid, Tab, Tabs } from '@material-ui/core'
import { txt } from "../../common/context";
import Styles from "./SelectedMatchCompo.module.css";
import { PrimaryButton } from '../CustomMUI/CustomButtons';
import MatchCard from '../CustomMUI/MatchCard';

export default function SelectedMatchDetails({ selectedMatch, setIsShow }) {

  const [selectedTab, setSelectedTab] = useState(1);
  const [showTeamPlayer, setShowTeamPlayer] = useState(true);
  const [matchDate, setMatchDate] = useState();
  const [selectedTeamPlayers, setSelectedTeamPlayers] = useState();

  useEffect(() => {
    if (selectedMatch) {
      const date = new Date(selectedMatch?.matchDate);
      const options = { day: '2-digit', month: 'short', year: 'numeric' };
      const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date);
      setMatchDate(formattedDate);
      setSelectedTeamPlayers(selectedMatch.teamA.playerList)
    }
  }, [selectedMatch])


  useEffect(() => {
    if (!showTeamPlayer) {
      setSelectedTeamPlayers(selectedMatch.teamB.playerList)
    } else if (showTeamPlayer && selectedMatch?.teamA?.playerList) {
      setSelectedTeamPlayers(selectedMatch.teamA.playerList)
    }
  }, [showTeamPlayer])

  return (
    <>

      <Header
        title={"Vs " + selectedMatch?.teamB.name}
        isModal={true}
        closeModal={() => setIsShow(0)}
      />

      <div className="form-container otp-form-container" style={{ marginTop: '20px', position: 'relative' }}>
        <Card className="card card-padding" elevation={0} style={{ padding: '0px', overflow: 'visible' }}>
          <CardContent style={{ padding: 0 }} className={Styles.mainCT}>
            <Box sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={selectedTab}
                textColor="primary"
                indicatorColor="primary"
                onChange={(e, newTab) => setSelectedTab(newTab)}
                style={{ position: 'sticky', top: '15px' }}
              >
                <Tab label={txt.match_details} value={1} />
                <Tab label={txt.analysis} value={2} />
                <Tab label={txt.recommendations} value={3} />
              </Tabs>
            </Box>

            <div>
              <MatchCard data={selectedMatch} />
            </div>

            <div className={Styles.container2}>
              <div>
                <p className={Styles.container2CP1}>Last 5 Match Form</p>
              </div>

              <div className={Styles.container2CD2}>
                <p className={Styles.container2CD2P1}>My Team</p>
                <div className={Styles.container2CD2CD2}>
                  <div className={Styles.last5WBtns}>W</div>
                  <div className={Styles.last5WBtns}>L</div>
                  <div className={Styles.last5WBtns}>L</div>
                  <div className={Styles.last5WBtns}>L</div>
                  <div className={Styles.last5WBtns}>L</div>
                </div>
              </div>
              <div className={Styles.container2CD2}>
                <p className={Styles.container2CD2P1}>RAC Excellence</p>
                <div className={Styles.container2CD2CD2}>
                  <div className={Styles.last5WBtns}>W</div>
                  <div className={`${Styles.last5WBtns} ${Styles.last5WBtnsLoss}`}>L</div>
                  <div className={Styles.last5WBtns}>L</div>
                </div>
              </div>
            </div>

            <div className={Styles.AdContainer}>
              <p>Advertisement Space</p>
            </div>

            <div className={Styles.playerMainContainer}>
              <div className={Styles.teamNameContainer}>
                <button className={`${Styles.teamNameBtn} ${showTeamPlayer && Styles.active}`}
                  onClick={() => {
                    setShowTeamPlayer(!showTeamPlayer)
                  }}
                >{selectedMatch?.teamA.name}</button>
                <h2 style={{ fontWeight: 500, margin: '0 10px' }}>Vs</h2>
                <button className={`${Styles.teamNameBtn} ${!showTeamPlayer && Styles.active}`}
                  onClick={() => {
                    setShowTeamPlayer(!showTeamPlayer)
                  }}
                >{selectedMatch?.teamB.name}</button>
              </div>

              <div className={Styles.playerListContainer}>
                {
                  (selectedTeamPlayers || []).map((player, idx) => (
                    <Box key={idx}>
                      <Grid container spacing={2} alignItems='center'>
                        <Grid item >
                          <Avatar
                            src={player?.firstName}
                            alt={player?.firstName}
                            sx={{ width: 56, height: 56 }}
                          />
                        </Grid>
                        <Grid item xs>
                          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{player?.firstName}</h3>
                          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', columnGap: 10 }}>
                            <p style={{ margin: 0, fontSize: '1rem', color: '#89898D' }}>Bat : Right </p>
                            <p style={{ margin: 0, fontSize: '1rem', color: '#89898D' }}>Ball : Right</p>
                            <p style={{ margin: 0, fontSize: '1rem', color: '#89898D' }}>Role : Top Order Batter</p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', columnGap: 10 }}>
                            <p style={{ margin: 0, fontSize: '1rem', color: '#89898D' }}>Form : 00.00</p>
                            <p style={{ margin: 0, fontSize: '1rem', color: '#89898D' }}>MVP : 00</p>
                          </div>
                        </Grid>
                      </Grid>
                    </Box>
                  ))
                }
              </div>
            </div>


            {

              ((selectedMatch?.status !== "STARTED") && (selectedMatch?.createdBy?._id == localStorage.getItem("loggedInUserId"))) &&
              <div style={{ position: 'fixed', bottom: '10%', width: '90%', left: '50%', translate: '-50%' }}>
                <PrimaryButton onClick={() => setIsShow(2)}>
                  Proceed for Toss
                </PrimaryButton>
              </div>
            }


          </CardContent>
        </Card>
      </div>
    </>
  )
}
