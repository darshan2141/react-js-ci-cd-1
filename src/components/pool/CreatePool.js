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

class CreatePool extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      poolId: "",
      poolName: "",
      allPlayers: [],
      searchedPlayers: [],
      addedPlayers: [],
      showAddGuestPlayer: false,
      teamA: "",
      teamB: "",
    };

    this.createPool = this.createPool.bind(this);
  }

  componentDidMount() {
    checkIfUserLoggedIn(this.props.history);
    this.getAllPlayers();
  }

  getAllPlayers() {
    sendHttpRequest("GET", BASE_URL + "/api/player/").then((data) => {
      this.setState({
        allPlayers: data.data.result,
        searchedPlayers: data.data.result,
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

  createPool() {
    const { addedPlayers, poolName } = this.state;

    if (!poolName) {
      toast.error("Please enter Club name");
      return;
    }
    if (addedPlayers.length < 5) {
      toast.error("Add at least 5 players before creating a pool");
      return;
    }

    let data = {
      name: poolName,
      players: addedPlayers,
      createdBy: localStorage.getItem("loggedInUserId"),
      owner: localStorage.getItem("loggedInUserId"),
      isTemp: false
    };

    this.setState({ isLoading: true });

    sendHttpRequest("POST", BASE_URL + "/api/pool", null, JSON.stringify(data)).then((res) => {
      toast.success(res.data.message);
      this.setState({ isLoading: false });
      this.props.reloadPools()
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
        <h2 align="center" className='text-primary'>Create Club</h2>
        <CustomTextField
          label="Club Name"
          type="text"
          value={poolName}
          onChange={(e) => this.setState({ poolName: e.target.value })}
        />
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
                  <DeleteButton onClick={() => this.removePlayer(player._id)}><ClearIcon /></DeleteButton>
                ) : (
                  <SecondaryButton onClick={() => this.addPlayer(player._id)}><AddIcon /></SecondaryButton>
                )}
              </div>
            </Card>
          ))}
          <SecondaryButton onClick={() => this.setState({ showAddGuestPlayer: true })}>Add guest player</SecondaryButton>
        </div>
        <p className='text-center text-primary text-chip'>{addedPlayers.length} Players Added</p>
        <div className='flex-center'>
          <SecondaryButton
            className="me-15 cancel-btn"
            onClick={() => this.props.onClose()}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton onClick={() => this.createPool()}>
            {isLoading ? <CircularProgress /> : "Create Club"}
          </PrimaryButton>
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

export default CreatePool;