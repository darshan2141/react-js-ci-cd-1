import React from "react";
import { Card, CircularProgress } from "@material-ui/core";
import { sendHttpRequest, BASE_URL, checkIfUserLoggedIn, WEB_BASE_URL } from "../../common/Common";
import PersistentDrawerRight from "../navBar/nav";
import { toast } from "react-toastify";
import { PrimaryButton, SecondaryButton } from "../CustomMUI/CustomButtons";
import './Tournaments.css'

class Tournament extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      tournamentDetails: {},
      isEditModalOpen: false,
      isAdminModalOpen: false,
      userId: "",
    };
  }

  componentDidMount() {
    this.getTournamentDetails(this.props.match.params.tournamentId)
    checkIfUserLoggedIn(this.props.history);
    this.setState({ userId: localStorage.getItem('loggedInUserId') });
  }

  getTournamentDetails(tournamentId) {
    this.setState({ isLoading: true });
    sendHttpRequest("GET", BASE_URL + "/api/tournament/" + tournamentId).then(res => {
      this.setState({ tournamentDetails: res.data.data });
    }).catch((error) => {
      toast.error(error.response.data.message);
    }).finally(() => {
      this.setState({ isLoading: false });
    });
  }

  startTournament() {
    const { tournamentDetails, userId } = this.state;
    this.setState({ isLoading: true });

    const data = {
      tournamentId: tournamentDetails._id,
      userId: userId
    }

    sendHttpRequest("POST", BASE_URL + "/api/tournament/" + tournamentDetails.tournamentType, null, JSON.stringify(data)).then(res => {
      this.getTournamentDetails(tournamentDetails._id);
    }).catch((error) => {
      toast.error(error.response.data.message);
    }).finally(() => {
      this.setState({ isLoading: false });
    });
  }

  render() {
    const { tournamentDetails, userId, isLoading } = this.state;

    return (
      <div>
        <PersistentDrawerRight title="Tournament Information" farLeft={true} />
        {isLoading ? (
          <div className="page-wrapper text-center">
            <CircularProgress />
          </div>
        ) : (
          <div className="page-wrapper">
            <Card className="card">
              <h2 className="text-center text-primary my-0">
                {tournamentDetails?.name} <br />
              </h2>
              <h3 className="text-center text-primary my-0">
                {tournamentDetails?.matchList?.length} matches | {tournamentDetails?.teamList?.length} / {tournamentDetails?.teamCount} Teams
              </h3>
              <hr />
              <div className="flex-between">
                <div className="flex-center-vertical text-primary">
                  <span> Date: {tournamentDetails.date} </span>
                  <span> Ground: {tournamentDetails.ground} </span>
                  <div> Pitch Type: {tournamentDetails.pitchType}</div>
                </div>
                <div className="flex-center-vertical text-primary">
                  <span> Category: {tournamentDetails.tournamentType} </span>
                  <span> Ball: {tournamentDetails.ballType} </span>
                  <div> Overs: {tournamentDetails.overs}</div>
                </div>
              </div>
            </Card>
            <h3 className="text-blue-bg">Teams</h3>
            <div className="four-grid">
              {tournamentDetails?.teamList?.map((team, index) => (
                <SecondaryButton key={index} onClick={() => { this.props.history.push(`/team/${team._id}`) }}>
                  {team.name}
                </SecondaryButton>
              ))}
            </div>
          </div>
        )}
        {(tournamentDetails?.createdBy?._id === userId || tournamentDetails?.admin?._id === userId) &&
          <div className="bottom-center flex-around blur-bg py-15 px-15">
            <PrimaryButton onClick={() => { this.props.history.push(`/tournament/settings/${tournamentDetails._id}`) }}>
              Settings
            </PrimaryButton>
            {tournamentDetails?.teamCount !== tournamentDetails?.teamList?.length ? (
              <PrimaryButton
                onClick={() => {
                  navigator.clipboard.writeText(`${WEB_BASE_URL}/tournament/register/${tournamentDetails._id}`)
                  toast.success("Link copied to clipboard")
                }}
              >
                Invite Team
              </PrimaryButton>
            ) : tournamentDetails?.status === "NOT-STARTED" ? (
              <PrimaryButton onClick={() => this.startTournament()}>
                Start Tournament
              </PrimaryButton>
            ) : (
              <PrimaryButton onClick={() => { this.props.history.push(`/tournament/standings/${tournamentDetails._id}`) }}>
                View Fixtures
              </PrimaryButton>
            )}
          </div>
        }
      </div>
    );
  }
}

export default Tournament;
