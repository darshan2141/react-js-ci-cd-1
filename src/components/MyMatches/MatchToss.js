import React, { useEffect, useState } from 'react'
import Header from '../CustomMUI/Header'
import { Card, CardContent, CircularProgress } from '@material-ui/core'
import Styles from './MatchToss.module.css';
import TeamCard from '../CustomMUI/TeamCard';
import { txt } from "../../common/context";
import { PrimaryButton } from '../CustomMUI/CustomButtons';
import { BASE_URL, sendHttpRequest } from '../../common/Common';
import { toast } from 'react-toastify';

export default function MatchToss({ setIsShow, selectedMatch }) {

  const [toss, setToss] = useState({
    wonTossTeam: null,
    batFirst: null,
    battingTeam: null,
    bowlingTeam: null,
    matchId: selectedMatch?._id
  });

  const [isWaitForRes, setIsWaitForRes] = useState(false);

  const updateTossWonDetails = async () => {
    setIsWaitForRes(true)
    try {
      const res = await sendHttpRequest(
        "POST",
        `${BASE_URL}/api/match/toss`, null, JSON.stringify(toss)
      );

      if (res.data) {
        // setIsShow(3)
        setIsWaitForRes(false)
      }
    } catch (error) {
      setIsWaitForRes(false)
      toast.error(error.response.data.message);
    }
  }

  return (
    <>
      <Header
        title={"Match Toss"}
        isModal={true}
        closeModal={() => setIsShow(1)}
      />

      <div className="form-container" style={{ paddingTop: 0, marginTop: '56px', position: 'relative', minHeight: 'calc(100vh - 112px)' }}>
        <Card className="card card-padding" elevation={0} style={{ padding: '0px' }}>
          <CardContent style={{ padding: 0, display: 'flex', flexDirection: 'column', gap: '15px', minHeight: '97%' }}>
            <div className={Styles.tossWonByContainer}>
              <h4 className={Styles.tossWonByTitle}>{txt.toss_won_by}</h4>

              <div className={Styles.teamDetailsContainer}>
                <TeamCard teamData={selectedMatch?.teamA}
                  btnTitle={selectedMatch?.teamA?._id === toss?.wonTossTeam ? 'Selected' : 'Select'}
                  handleAction={(selectedTeamData) => {
                    setToss((prev) => ({
                      ...prev,
                      wonTossTeam: selectedTeamData._id,
                      battingTeam: prev.batFirst ? selectedMatch?.teamA?._id : selectedMatch?.teamB?._id,
                      bowlingTeam: prev.batFirst ? selectedMatch?.teamB?._id : selectedMatch?.teamA?._id,
                    }))
                  }} />
                <TeamCard teamData={selectedMatch?.teamB}
                  btnTitle={selectedMatch?.teamB?._id === toss?.wonTossTeam ? 'Selected' : 'Select'}
                  handleAction={(selectedTeamData) => {
                    setToss((prev) => ({
                      ...prev,
                      wonTossTeam: selectedTeamData._id,
                      battingTeam: prev.batFirst ? selectedMatch?.teamB?._id : selectedMatch?.teamA?._id,
                      bowlingTeam: prev.batFirst ? selectedMatch?.teamA?._id : selectedMatch?.teamB?._id,
                    }))
                  }} />
              </div>
            </div>

            <div className={Styles.AdContainer}>
              <p>Advertisement Space</p>
            </div>

            <div className={Styles.tossWonByContainer} >
              <h4 className={Styles.tossWonByTitle}>{txt.choose_to}</h4>
              <div className={Styles.teamDetailsContainer}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <button className={`${Styles.batFieldBtns} ${toss?.batFirst && Styles.active}`}
                    onClick={() => setToss((prev) => ({
                      ...prev,
                      batFirst: true,
                      battingTeam: prev.wonTossTeam === selectedMatch?.teamA?._id ? selectedMatch?.teamA?._id : selectedMatch?.teamB?._id,
                      bowlingTeam: prev.wonTossTeam === selectedMatch?.teamA?._id ? selectedMatch?.teamB?._id : selectedMatch?.teamA?._id,
                    }))} >{txt.bat}</button>
                  <button className={`${Styles.batFieldBtns} ${toss?.batFirst === false && Styles.active}`}
                    onClick={() => setToss((prev) => ({
                      ...prev,
                      batFirst: false,
                      battingTeam: prev.wonTossTeam === selectedMatch?.teamA?._id ? selectedMatch?.teamB?._id : selectedMatch?.teamA?._id,
                      bowlingTeam: prev.wonTossTeam === selectedMatch?.teamA?._id ? selectedMatch?.teamA?._id : selectedMatch?.teamB?._id,
                    }))} >{txt.field}</button>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 'auto' }}>
              <PrimaryButton onClick={updateTossWonDetails} disabled={!(toss?.wonTossTeam)}>
                {
                  isWaitForRes ?
                    <CircularProgress style={{ margin: 'auto' }} />
                    :
                    txt.continue_to_scoresheet
                }
              </PrimaryButton>
            </div>

          </CardContent>
        </Card>
      </div>
    </>
  )
}
