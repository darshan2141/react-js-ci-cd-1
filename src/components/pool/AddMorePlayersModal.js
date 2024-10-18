import React from "react";
import { CircularProgress, Card, CardMedia } from "@material-ui/core";
import { Dialog, DialogContent } from "@material-ui/core";
import { sendHttpRequest, BASE_URL, checkIfUserLoggedIn, searchPlayer } from "../../common/Common";
import DefaultImage from "../../assets/images/User.jpg";
import { toast } from "react-toastify";
import AddGuestPlayer from "../Modals/AddGuestPlayer";
import CustomTextField from "../CustomMUI/CustomTextField";
import { DeleteButton, PrimaryButton, SecondaryButton } from "../CustomMUI/CustomButtons";
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';

class AddMorePlayersModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      allPlayers: [],
      searchedPlayers: [],
      existingPlayers: this.props.existingPlayers,
      addedPlayers: [],
      showAddGuestPlayer: false,
    };
  }

  componentDidMount() {
    checkIfUserLoggedIn(this.props.history);
    this.getAllPlayers();
  }

  getAllPlayers() {
    const { existingPlayers } = this.state
    sendHttpRequest("GET", BASE_URL + "/api/player/").then((data) => {
      this.setState({
        allPlayers: data.data.result.filter((player) => !existingPlayers.includes(player._id)),
        searchedPlayers: data.data.result.filter((player) => !existingPlayers.includes(player._id)),
      });
    }).catch(error => {
      toast.error(error.response.data.message)
    });
  }

  handleSearch(searchingKeyWord) {
    this.setState({ searchedPlayers: searchPlayer(searchingKeyWord, this.state.allPlayers) })
  }

  addPlayer(player) {
    const { addedPlayers } = this.state
    const updateAddedPlayers = [...addedPlayers, player];
    this.setState({ addedPlayers: updateAddedPlayers })
  }

  removePlayer(player) {
    const { addedPlayers } = this.state
    const updateAddedPlayers = addedPlayers.filter((addedPlayer) => addedPlayer !== player);
    this.setState({ addedPlayers: updateAddedPlayers })
  }

  updatePoolPlayerList() {
    const { addedPlayers, existingPlayers } = this.state;
    const totalPlayers = [...addedPlayers, ...existingPlayers]

    if (totalPlayers.length < 5) {
      toast.error("Add at least 5 players before creating a pool");
      return;
    }

    let data = {
      poolId: this.props.poolId,
      playerList: totalPlayers
    };

    this.setState({ isLoading: true });

    sendHttpRequest("PUT", BASE_URL + "/api/pool/players", null, JSON.stringify(data)).then((res) => {
      toast.success(res.data.message);
      this.setState({ isLoading: false });
      this.props.reloadPoolDetails()
      this.props.onClose()
    }).catch((error) => {
      this.setState({ isLoading: false });
      toast.error(error.response.data.message)
    });
  }

  render() {
    const { isLoading, poolName, searchedPlayers, addedPlayers, showAddGuestPlayer } = this.state;

    return (
      <div>
        <h2 align="center" className='text-primary'>Add More Players</h2>
        {!this.props.existingPlayers && (
          <CustomTextField
            label="Club Name"
            type="text"
            value={poolName}
            onChange={(e) => this.setState({ poolName: e.target.value })}
          />
        )}
        <CustomTextField
          type="search"
          label="Search players"
          onChange={(e) => this.handleSearch(e.target.value)}
        />
        <div className='search-players'>
          {searchedPlayers.map((player, index) => (
            <Card key={index} className='card'>
              <div className='flex-between'>
                <CardMedia
                  className='card-image'
                  image={player.profilePhoto ? player.profilePhoto : DefaultImage}
                />
                <div>
                  <span className='text-primary'> {player.firstName} {player.lastName}</span><br />
                  <span className='text-primary'>{player.contactNo}</span>
                </div>
                {addedPlayers.includes(player._id) ? (
                  <DeleteButton onClick={() => this.removePlayer(player._id)}>
                    <ClearIcon />
                  </DeleteButton>
                ) : (
                  <SecondaryButton onClick={() => this.addPlayer(player._id)}>
                    <AddIcon />
                  </SecondaryButton>
                )}
              </div>
            </Card>
          ))}
          <SecondaryButton onClick={() => this.setState({ showAddGuestPlayer: true })}>
            Add guest player
          </SecondaryButton>
        </div>
        <p className='text-center text-primary'>{addedPlayers.length} new players selected</p>
        <p className='text-center text-primary'>
          {addedPlayers.length + this.props.existingPlayers.length} total players
        </p>
        <div className='flex-center'>
          <SecondaryButton
            className="me-15"
            onClick={() => this.props.onClose()}
          >
            Cancel
          </SecondaryButton>
          {this.props.poolId ? (
            <PrimaryButton onClick={() => this.updatePoolPlayerList()}>
              {isLoading ? <CircularProgress /> : "Update Players"}
            </PrimaryButton>
          ) : this.props.teamId ? (
            <PrimaryButton onClick={() => this.updateTeamPlayerList()}>
              {isLoading ? <CircularProgress /> : "Update Players"}
            </PrimaryButton>
          ) : null}
        </div>
        <Dialog fullWidth open={showAddGuestPlayer} onClose={() => this.setState({ showAddGuestPlayer: false })} >
          <DialogContent>
            <AddGuestPlayer
              onClose={() => this.setState({ showAddGuestPlayer: false })}
              reloadGuestPlayers={() => this.getAllPlayers()}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default AddMorePlayersModal;