import React from "react";
import { Card, CardMedia, CircularProgress, Dialog, DialogContent, IconButton } from "@material-ui/core";
import { sendHttpRequest, BASE_URL, checkIfUserLoggedIn } from "../../common/Common";
import PersistentDrawerRight from "../navBar/nav";
import { toast } from "react-toastify";
import DefaultImage from "../../assets/images/User.jpg";
import { DeleteButton } from "../CustomMUI/CustomButtons"
import ClearIcon from '@material-ui/icons/Clear';
import EditModal from "../Modals/EditModal";
import { EditRounded } from "@material-ui/icons";

class Team extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      teamDetails: null,
      isEditModalOpen: false
    };
  }

  componentDidMount() {
    this.getTeamDetails(this.props.match.params.teamId)
    checkIfUserLoggedIn(this.props.history);
  }

  getTeamDetails(teamId) {
    this.setState({ isLoading: true });

    sendHttpRequest("GET", BASE_URL + "/api/team/" + teamId).then(res => {
      this.setState({
        isLoading: false,
        teamDetails: res.data.data
      });
    }).catch((error) => {
      this.setState({ isLoading: false });
      toast.error(error.response.data.message);
    });
  }

  removePlayer(playerId) {
    const { teamDetails } = this.state
    this.setState({ isLoading: true });

    const data = {
      teamId: teamDetails._id,
      playerList: teamDetails.playerList.filter((player) => player._id !== playerId)
    }

    sendHttpRequest("PUT", BASE_URL + "/api/team/", null, JSON.stringify(data)).then(res => {
      this.setState({ isLoading: false });
      toast.success("Player removed successfully");
      this.getTeamDetails(teamDetails._id)
    }).catch((error) => {
      this.setState({ isLoading: false });
      toast.error(error.response.data.message);
    });
  }

  render() {
    const { teamDetails, isLoading, isEditModalOpen } = this.state;

    return (
      <div>
        <PersistentDrawerRight title="Team Information" farLeft={true} />
        {isLoading ? (
          <div className="page-wrapper text-center">
            <CircularProgress />
          </div>
        ) : (
          <div className="page-wrapper">
            <Card className="card">
              <div className="flex-center">
                <h2 className="text-center text-primary my-0">
                  {teamDetails?.name} | {teamDetails?.poolId.name}
                </h2>
                {teamDetails?.owner?._id === localStorage.getItem('loggedInUserId') &&
                  <IconButton onClick={() => this.setState({ isEditModalOpen: true })}>
                    <EditRounded />
                  </IconButton>
                }
              </div>
              <h3 className="text-center text-primary my-0">
                {teamDetails?.playerList?.length} Players
              </h3>
            </Card>
            {teamDetails?.playerList?.map((player, index) => (
              <Card key={index} className="card">
                <div className="flex-between">
                  <div className="flex-center-vertical">
                    {teamDetails?.owner?._id === player._id &&
                      <p className="text-blue-bg text-chip chip-small">Owner</p>
                    }
                    <CardMedia
                      className="card-image-lg"
                      image={player.profilePhoto ? player.profilePhoto : DefaultImage}
                    />
                  </div>
                  <div className="flex-center-vertical text-primary">
                    <h3 className="my-0 text-chip"> {player.firstName} {player.lastName} </h3>
                    <span>Batting Arm: {player.battingStyle}</span>
                    <span>Bowling Arm: {player.bowlingArm}</span>
                    <span>Bowling Style: {player.bowlingStyle}</span>
                  </div>
                  <div className="flex-center-vertical">
                    {teamDetails?.owner?._id === localStorage.getItem('loggedInUserId') &&
                      <DeleteButton onClick={() => this.removePlayer(player._id)} >
                        {isLoading ? <CircularProgress /> : <ClearIcon />}
                      </DeleteButton>
                    }
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        <Dialog fullWidth open={isEditModalOpen} onClose={() => this.setState({ isEditModalOpen: false })} >
          <DialogContent>
            <EditModal
              teamData={teamDetails}
              reloadTeamDetails={() => this.getTeamDetails(teamDetails._id)}
              onClose={() => this.setState({ isEditModalOpen: false })}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default Team;
