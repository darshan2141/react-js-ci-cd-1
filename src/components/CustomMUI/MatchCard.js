import React from "react";
import {
  CustomSmallButton,
  CustomSmallRoundedButton,
} from "./CustomSmallButton";
import "./CustomMUI.css";
import { txt } from "../../common/context";
import Clock from "../../assets/images/svg/clock.svg";
import Location from "../../assets/images/svg/location.svg";
import LocationIcon from "../../assets/images/svg/location1.svg";
import TagIcon from "../../assets/images/svg/tag.svg";
import Person from "../../assets/images/svg/person.svg";
import { useHistory } from "react-router-dom";
import Styles from './MatchCard.module.css'

const MatchCard = ({ data, setSelectedMatchData }) => {
  const history = useHistory();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="matches-card" onClick={() => {
      if (setSelectedMatchData === undefined) {
        history.push('/my-matches', { selectedMatch: data, openModalNo: 1 });
      } else {
        setSelectedMatchData(data);
      }
    }}>

      <div className="dateTeamStatusContainer">
        <div>
          <CustomSmallButton name={data?.matchDate?.split('-')[2] + " " + months[data?.matchDate?.split('-')[1] - 1]} disabled={false} />
        </div>

        <h3 style={{ margin: 0, flex: 1, fontSize: '18px' }}> Vs  {data.teamB.name}</h3>

        <div>
          <CustomSmallRoundedButton name="Going" type="btn-green" />
        </div>
      </div>

      <div className="noOfmatchGroundTournamentNameConatiner">
        <p>nn Match</p>
        <p>{data?.matchType?.type}</p>
        <p>{data?.ground}</p>
        <p>{data?.matchName}</p>
      </div>

      {
        data?.status !== "NOT-STARTED" &&
        <div className="teamsNameScoreContainer">
          <div>
            <p>{((data?.wonTossTeam === data?.teamA?._id) && data?.batFirst) ? data?.teamA?.name : data?.teamB?.name}</p>
            <p>
              <span>
                {
                  (((data?.wonTossTeam === data?.teamA?._id) && data?.batFirst) ? data?.teamARuns : data?.teamBRuns).toString().padStart(3, '0') + "/" + data?.teamAwickets.toString().padStart(2, '0')
                }
              </span>
            </p>
          </div>
          <div className="matchCardopponetTeamScoreCon">
            <p>{((data?.wonTossTeam === data?.teamA?._id) && data?.batFirst) ? data?.teamB?.name : data?.teamA?.name}</p>
            <p>{`Target : ${((((data?.wonTossTeam === data?.teamA?._id) && data?.batFirst) ? data?.teamBRuns : data?.teamARuns) + 1).toString().padStart(3, '0')}`}
              &nbsp;&nbsp;
              <span>
                {
                  (((data?.wonTossTeam === data?.teamA?._id) && data?.batFirst) ? data?.teamBRuns : data?.teamARuns).toString().padStart(3, '0') + "/" + data?.teamAwickets.toString().padStart(2, '0')
                }
              </span>
            </p>
          </div>
        </div>
      }


      <div className="matchCardBtnContainer">
        <button data-content="share">Share</button>
        {
          (data?.status === "STARTED" && data?.createdBy?._id === localStorage.getItem("loggedInUserId")) &&
          <button onClick={(e) => {
            e.stopPropagation();
            if (setSelectedMatchData === undefined) {
              history.push('/my-matches', { selectedMatch: data, openModalNo: 3 });
            } else {
              setSelectedMatchData(data, 3);
            }
          }}>Scoresheet</button>
        }
        <button onClick={(e) => {
          e.stopPropagation();
          history.push('/scoresheet/6626407885ff843b969b4133');
        }}>Scorecard</button>
        <button>RSVP</button>
      </div>
    </div>
  );
};
export default MatchCard;
