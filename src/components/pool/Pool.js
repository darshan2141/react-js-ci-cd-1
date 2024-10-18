import React from "react";
import { Card, CardMedia, CircularProgress, Dialog, DialogContent, IconButton } from "@material-ui/core";
import { sendHttpRequest, BASE_URL, checkIfUserLoggedIn } from "../../common/Common";
import PersistentDrawerRight from "../navBar/nav";
import { toast } from "react-toastify";
import DefaultImage from "../../assets/images/User.jpg";
import { DeleteButton, PrimaryButton, SecondaryButton } from "../CustomMUI/CustomButtons"
import ClearIcon from '@material-ui/icons/Clear';
import CreateTeamModal from "../team/CreateTeamModal";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import AddMorePlayersModal from "./AddMorePlayersModal";
import { EditRounded } from "@material-ui/icons";
import EditModal from "../Modals/EditModal"

class Pool extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      poolDetails: [],
      isModalOpen: false,
      isTeamModalOpen: false,
      isEditModalOpen: false
    };
  }

  componentDidMount() {
    this.getPoolDetails(this.props.match.params.poolId)
    checkIfUserLoggedIn(this.props.history);
  }

  getPoolDetails(poolId) {
    this.setState({ isLoading: true });

    sendHttpRequest("GET", BASE_URL + "/api/pool/" + poolId).then(res => {
      this.setState({
        isLoading: false,
        poolDetails: res.data.data
      });
    }).catch((error) => {
      this.setState({ isLoading: false });
      toast.error(error.response.data.message);
    });
  }

  removePlayer(playerId) {
    const { poolDetails } = this.state
    this.setState({ isLoading: true });

    const data = {
      poolId: poolDetails._id,
      playerList: poolDetails.playerList.filter((player) => player._id !== playerId)
    }

    sendHttpRequest("PUT", BASE_URL + "/api/pool/players", null, JSON.stringify(data)).then(res => {
      this.setState({ isLoading: false });
      toast.success(res.data.message);
      this.getPoolDetails(poolDetails._id)
    }).catch((error) => {
      this.setState({ isLoading: false });
      toast.error(error.response.data.message);
    });
  }

  render() {
    const { poolDetails, isLoading, isModalOpen, isTeamModalOpen, isEditModalOpen } = this.state;
    const responsive = {
      superLargeDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 5
      },
      desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 5
      },
      tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 5
      },
      mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 2
      }
    };

    return (
      <div>
        <PersistentDrawerRight title="Pool Information" farLeft={true} />
        {isLoading ? (
          <div className="page-wrapper text-center">
            <CircularProgress />
          </div>
        ) : (
          <div className="page-wrapper">
            <Card className="card">
              <div className="flex-center">
                <h2 className="text-center text-primary text-uppercase my-0">
                  {poolDetails?.name} <br />
                </h2>
                {poolDetails?.owner?._id === localStorage.getItem('loggedInUserId') &&
                  <IconButton className="text-primary" onClick={() => this.setState({ isEditModalOpen: true })}>
                    <EditRounded />
                  </IconButton>
                }
              </div>
              <h3 className="text-center text-primary my-0">
                {poolDetails?.playerList?.length} Players | {poolDetails?.teamList?.length} Teams
              </h3>
              <Carousel responsive={responsive} className="mt-15" >
                {poolDetails?.teamList?.map((team, index) =>
                  <center key={index}>
                    <SecondaryButton className="mx-15" onClick={() => { this.props.history.push(`/team/${team._id}`) }}>
                      {team.name}<br />{team.playerList.length} Players
                    </SecondaryButton>
                  </center>
                )}
              </Carousel>
            </Card>
            {poolDetails?.playerList?.map((player, index) => (
              <Card key={index} className="card">
                <div className="flex-between">
                  <div className="flex-center-vertical">
                    {poolDetails?.owner?._id === player._id &&
                      <p className="text-chip chip-small">Owner</p>
                    }
                    <CardMedia
                      className="card-image-lg"
                      image={player.profilePhoto ? player.profilePhoto : DefaultImage}
                    />
                  </div>
                  <div className="flex-center-vertical text-primary">
                    <h3 className="my-0 text-chip"> {player.firstName} {player.lastName} </h3>
                    <span> Batting Arm: {player.battingStyle} </span>
                    <span> Bowling Arm: {player.bowlingArm} </span>
                    <span> Bowling Style: {player.bowlingStyle} </span>
                  </div>
                  <div className="flex-center-vertical">
                    {poolDetails?.owner?._id === localStorage.getItem('loggedInUserId') &&
                      <DeleteButton onClick={() => this.removePlayer(player._id)} >
                        {isLoading ? <CircularProgress /> : <ClearIcon />}
                      </DeleteButton>
                    }
                  </div>
                </div>
              </Card>
            ))}
            {poolDetails?.owner?._id === localStorage.getItem('loggedInUserId') &&
              <div className="bottom-center flex-around blur-bg py-15 px-15 ">
                <SecondaryButton onClick={() => this.setState({ isModalOpen: true })}>Add Players</SecondaryButton>
                <PrimaryButton onClick={() => this.setState({ isTeamModalOpen: true })}>Create Team</PrimaryButton>
              </div>
            }
            <Dialog fullWidth open={isModalOpen} onClose={() => this.setState({ isModalOpen: false })} >
              <DialogContent>
                <AddMorePlayersModal
                  poolId={poolDetails._id}
                  existingPlayers={poolDetails?.playerList?.map((player) => player._id)}
                  onClose={() => this.setState({ isModalOpen: false })}
                  reloadPoolDetails={() => this.getPoolDetails(poolDetails._id)}
                />
              </DialogContent>
            </Dialog>
            <Dialog fullWidth open={isTeamModalOpen} onClose={() => this.setState({ isTeamModalOpen: false })} >
              <DialogContent>
                <CreateTeamModal
                  poolData={poolDetails}
                  onClose={() => this.setState({ isTeamModalOpen: false })}
                  reloadPoolDetails={() => this.getPoolDetails(poolDetails._id)}
                />
              </DialogContent>
            </Dialog>
            <Dialog fullWidth open={isEditModalOpen} onClose={() => this.setState({ isEditModalOpen: false })} >
              <DialogContent>
                <EditModal
                  poolData={poolDetails}
                  reloadPoolDetails={() => this.getPoolDetails(poolDetails._id)}
                  onClose={() => this.setState({ isEditModalOpen: false })}
                />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    );
  }
}

export default Pool;
