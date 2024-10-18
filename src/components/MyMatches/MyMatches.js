import React, { useEffect, useState } from 'react'
import Header from '../CustomMUI/Header'
import { txt } from "../../common/context";
import { Box, Card, CardContent, CircularProgress, Tab, Tabs } from '@material-ui/core';
import { ToastMessage } from '../CustomMUI/ToastMessage';
import { CustomSmallButton } from '../CustomMUI/CustomSmallButton';
import MatchCard from '../CustomMUI/MatchCard';
import { BASE_URL, sendHttpRequest } from '../../common/Common';
import Styles from './MyMatches.module.css';
import { toast } from 'react-toastify';
import ScoreSheetModal from './ScoreSheetModal';
import SelectedMatchDetails from './SelectedMatchDetails';
import { useLocation } from "react-router-dom";
import MatchToss from './MatchToss';

const MyMatches = ({ }) => {
  const location = useLocation();

  const [selectedTab, setSelectedTab] = useState(1);
  const [matches, setMatches] = useState([]);
  const [matchesByDate, setMatchesByDate] = useState([]);
  const [loadMatches, setLoadMatches] = useState(true);
  const [isShow, setIsShow] = useState(0);
  const [selectedMatch, setSelectedMatch] = useState();

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      getUpcomingOngoingMatches();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (location?.state?.selectedMatch) {
      setSelectedMatch(location.state.selectedMatch)
      setIsShow(location.state.openModalNo);
    }
  }, [location.state])


  const getUpcomingOngoingMatches = async () => {
    try {
      const res = await sendHttpRequest(
        "GET",
        `${BASE_URL}/api/match/user/${localStorage.getItem("loggedInUserId")}`
      );

      if (res.data.data) {
        setMatches(res.data.data);
        setLoadMatches(false);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // Filter Mathes date wise
  useEffect(() => {
    let todayDate = new Date().toISOString().split('T')[0]
    switch (selectedTab) {
      case 1:
        setMatchesByDate(matches.filter((match) => match.matchDate === todayDate))
        break;
      case 2:
        setMatchesByDate(matches.filter((match) => match.matchDate > todayDate))
        break;
      case 3:
        setMatchesByDate(matches.filter((match) => match.status === "COMPLETE"))
        break;
      default:
        break;
    }
  }, [matches, selectedTab])


  return (
    <div className="app-container">
      {
        (() => {
          switch (isShow) {
            case 0:
              return (
                <>
                  <Header title={txt.my_matches} />
                  <ToastMessage />
                  <div className="form-container otp-form-container" style={{ marginTop: '20px' }}>
                    <Card className="card card-padding" elevation={0} style={{ padding: 0, overflow: 'visible' }}>
                      <CardContent style={{ padding: 0 }}>
                        <Box sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
                          <Tabs
                            value={selectedTab}
                            textColor="primary"
                            indicatorColor="primary"
                            onChange={(e, newTab) => setSelectedTab(newTab)} >
                            <Tab label={txt.today} value={1} />
                            <Tab label={txt.upcoming} value={2} />
                            <Tab label={txt.results} value={3} />
                          </Tabs>
                        </Box>

                        <div className={Styles.matchCardContainer}>
                          {
                            loadMatches ?
                              <CircularProgress style={{ margin: '0 auto' }} />
                              :
                              matchesByDate.length === 0 ? (
                                <div className="no-matches">
                                  <p style={{ textAlign: 'center' }}>{txt.no_matches}</p>
                                </div>
                              ) : (

                                <>
                                  {
                                    matchesByDate.map((match, index) => <MatchCard data={match} key={index} setSelectedMatchData={(data, openModalNo) => {
                                      setSelectedMatch(match)
                                      switch (openModalNo) {
                                        case 3: setIsShow(3);
                                          break;
                                        default: setIsShow(1);
                                      }
                                    }} />)

                                  }
                                </>
                              )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )
            case 1:
              return (
                <SelectedMatchDetails selectedMatch={selectedMatch} setIsShow={setIsShow} />
              )
            case 2:
              return (
                <MatchToss selectedMatch={selectedMatch} setIsShow={setIsShow} />
              )
            case 3:
              return (
                <ScoreSheetModal selectedMatch={selectedMatch} show={isShow} setIsShow={setIsShow} />
              )
          }
        })()
      }


    </div>
  )
}

export default MyMatches