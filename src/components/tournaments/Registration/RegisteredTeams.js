import React from "react";
import { Card, CircularProgress } from "@material-ui/core";
import { sendHttpRequest, BASE_URL, checkIfUserLoggedIn } from "../../../common/Common";
import PersistentDrawerRight from "../../navBar/nav";
import { toast } from "react-toastify";
import { PrimaryButton, SecondaryButton } from "../../CustomMUI/CustomButtons";

class RegisteredTeams extends React.Component {
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

  approveTeam(teamId) {
    const { tournamentDetails } = this.state;

    if (tournamentDetails.status === "STARTED") {
      toast.error("Tournament is already started")
      return
    }

    if (tournamentDetails.teamCount === tournamentDetails.teamList.length) {
      toast.error("Maximum number of teams are approved")
      return
    }

    const data = { 
      tournamentId: tournamentDetails._id,
      teamId: teamId
    }

    this.setState({ isLoading: true });
    sendHttpRequest("PUT", BASE_URL + "/api/tournament/register/approve", null, JSON.stringify(data)).then(() => {
      this.getTournamentDetails(tournamentDetails._id)
    }).catch((error) => {
      toast.error(error.response.data.message);
    }).finally(() => {
      this.setState({ isLoading: false });
    });
  }

  rejectTeam(teamId) {
    const { tournamentDetails } = this.state;

    if (tournamentDetails.status === "STARTED") {
      toast.error("Tournament is already started")
      return
    }

    const data = {
      tournamentId: tournamentDetails._id,
      teamId: teamId
    }

    this.setState({ isLoading: true });
    sendHttpRequest("PUT", BASE_URL + "/api/tournament/register/reject", null, JSON.stringify(data)).then(() => {
      this.getTournamentDetails(tournamentDetails._id)
    }).catch((error) => {
      toast.error(error.response.data.message);
    }).finally(() => {
      this.setState({ isLoading: false });
    });
  }

  render() {
    const { tournamentDetails, isLoading } = this.state;

    return (
      <div>
        <PersistentDrawerRight title="Registered Teams" farLeft={true} />
        {isLoading ? (
          <div className="page-wrapper text-center">
            <CircularProgress />
          </div>
        ) : (
          <div className="page-wrapper">
            <h3 className="text-blue-bg">Approved Teams</h3>
            {tournamentDetails?.registrationRequests?.filter(request => request.approved === true).map((request, index) => (
              <Card key={index} className="card flex-between">
                <div>
                  <SecondaryButton
                    className="mb-15"
                    onClick={() => { this.props.history.push(`/team/${request.team._id}`) }}
                  >
                    {request.team.name}
                  </SecondaryButton>
                  <SecondaryButton onClick={() => { window.open(request.paymentSlip, "_blank") }}>
                    View Payment proof
                  </SecondaryButton>
                </div>
                <center>
                  <SecondaryButton className="delete-btn" onClick={() => this.rejectTeam(request.team._id)}>
                    Refuse Team
                  </SecondaryButton>
                </center>
              </Card>
            ))}
            <h3 className="text-blue-bg">Registered Teams</h3>
            {tournamentDetails?.registrationRequests?.filter(request => request.approved === false).map((request, index) => (
              <Card key={index} className="card flex-between">
                <div>
                  <SecondaryButton
                    className="mb-15"
                    onClick={() => { this.props.history.push(`/team/${request.team._id}`) }}
                  >
                    {request.team.name}
                  </SecondaryButton>
                  <SecondaryButton onClick={() => { window.open(request.paymentSlip, "_blank") }}>
                    View Payment proof
                  </SecondaryButton>
                </div>
                <center>
                  <PrimaryButton onClick={() => this.approveTeam(request.team._id)}>
                    Approve Team
                  </PrimaryButton>
                </center>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default RegisteredTeams;
