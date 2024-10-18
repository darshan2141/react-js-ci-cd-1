import React from "react";
import { CircularProgress, TextField, Card, Dialog, DialogContent } from "@material-ui/core";
import { toast } from "react-toastify";
import { PrimaryButton, SecondaryButton } from "../../CustomMUI/CustomButtons";
import PersistentDrawerRight from "../../navBar/nav";
import { Autocomplete } from "@material-ui/lab";
import CreateTeamModal from "../../team/CreateTeamModal";
import FileUpload from "../../FileUpload/FileUpload";
import { BASE_URL, checkIfUserLoggedIn, sendHttpRequest, uploadToS3 } from "../../../common/Common";

class RegisterTeamTournament extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showAddTeam: false,
      ownTeams: [],
      team: {},
      tournamentDetails: {},
      paymentSlip: null
    };
    this.registerTournament = this.registerTournament.bind(this);
  }

  componentDidMount() {
    checkIfUserLoggedIn(this.props.history);
    this.getTournamentDetails()
    this.getOwnTeams()
  }

  async getOwnTeams() {
    await sendHttpRequest("GET", BASE_URL + "/api/team/own/" + localStorage.getItem("loggedInUserId")).then((res) => {
      this.setState({ ownTeams: res.data.data });
    }).catch((error) => {
      toast.error(error.response.data.message)
    });
  }

  async getTournamentDetails() {
    this.setState({ isLoading: true });

    await sendHttpRequest("GET", BASE_URL + "/api/tournament/" + this.props.match.params.tournamentId).then(res => {
      this.setState({
        isLoading: false,
        tournamentDetails: res.data.data
      });
    }).catch((error) => {
      this.setState({ isLoading: false });
      toast.error(error.response.data.message);
    });
  }

  async registerTournament() {
    const { team, tournamentDetails, paymentSlip } = this.state;
    this.setState({ isLoading: true });

    if (!team._id) {
      toast.error("Please select a team");
      this.setState({ isLoading: false });
      return;
    }

    if (!paymentSlip) {
      toast.error("Please upload proof of payment");
      this.setState({ isLoading: false });
      return;
    }

    if (tournamentDetails.registrationRequests.some(request => request.team._id === team._id)) {
      toast.error("Team already registered");
      this.setState({ isLoading: false });
      return;
    }

    const existingPlayerIds = tournamentDetails.registrationRequests.flatMap((request) => request.team.playerList);

    if (team.playerList.filter((player) => existingPlayerIds.includes(player._id)).length > 0) {
      toast.error("Cannot register team: Some players are already registered in other teams.");
      this.setState({ isLoading: false });
      return;
    }

    try {
      let data = {
        tournamentId: tournamentDetails._id,
        team: team._id,
        paymentSlip: await uploadToS3(paymentSlip, "payment")
      }

      const response = await sendHttpRequest("PUT", BASE_URL + "/api/tournament/register", null, JSON.stringify(data))
      toast.success(response.data.message)
      this.props.history.push("/tournaments")
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { isLoading, ownTeams, team, tournamentDetails, showAddTeam } = this.state;

    return (
      <div>
        <PersistentDrawerRight title="Register Team Tournament" farLeft={true} />
        <div className="page-wrapper">
          <Card className="card">
            <h2 className="text-center text-primary my-0">
              {tournamentDetails?.name} <br />
            </h2>
            <h3 className="text-center text-primary my-0">
              {tournamentDetails?.matchList?.length} matches | {tournamentDetails?.teamList?.length} / {tournamentDetails?.teamCount} Teams Registered
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
          <Autocomplete
            options={ownTeams}
            getOptionLabel={(option) => option.name}
            value={team}
            onChange={(event, newValue) => this.setState({ team: newValue })}
            renderInput={(params) => (
              <TextField
                {...params} required fullWidth
                style={{ marginTop: "20px" }}
                label="Team name"
                variant="outlined"
              />
            )}
          />
          <small>Don't see your team?. Please make sure your are an owner or admin of the team</small>
          <div className='text-center'>
            <SecondaryButton
              onClick={() => this.setState({ showAddTeam: true })}
            >
              No team? Create one
            </SecondaryButton>
            <FileUpload
              heading="Upload proof of payment"
              onChange={(value) => this.setState({ paymentSlip: value })}
            />
          </div>
        </div>
        <div className='flex-center'>
          <PrimaryButton onClick={() => this.registerTournament()} >
            {!isLoading ? "Register Team" : <CircularProgress />}
          </PrimaryButton>
        </div>
        <Dialog fullWidth open={showAddTeam} onClose={() => this.setState({ showAddTeam: false })} >
          <DialogContent>
            <CreateTeamModal
              onClose={() => { this.setState({ showAddTeam: false }); this.getOwnTeams() }}
            />
          </DialogContent>
        </Dialog>
      </div >
    );
  }
}

export default RegisterTeamTournament;
