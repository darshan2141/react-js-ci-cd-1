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

class AddAdminModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      allPlayers: [],
      searchedPlayers: [],
      addedPlayers: [],
      showAddGuestPlayer: false,
    };
  }

  componentDidMount() {
    checkIfUserLoggedIn(this.props.history);
    this.setState({ addedPlayers: this.props.existingAdmins });
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
    if (addedPlayers.length === 3) {
      toast.error("Maximum 3 admins can be added");
      return;
    }
    const updateAddedPlayers = [...addedPlayers, player];
    this.setState({ addedPlayers: updateAddedPlayers })
  }

  removePlayer(player) {
    const { addedPlayers } = this.state
    if (addedPlayers.length === 1) {
      toast.error("At least 1 admin must be there");
      return;
    }
    const updateAddedPlayers = addedPlayers.filter((addedPlayer) => addedPlayer !== player);
    this.setState({ addedPlayers: updateAddedPlayers })
  }

  updateAdminList() {

    let data = {
      tournamentId: this.props.id,
      admins: this.state.addedPlayers
    };

    this.setState({ isLoading: true });

    sendHttpRequest("PUT", BASE_URL + "/api/tournament/admins", null, JSON.stringify(data)).then((res) => {
      toast.success(res.data.message);
      this.props.reloadTournamentDetails();
      this.props.onClose()
    }).catch((error) => {
      toast.error(error.response.data.message)
    }).finally(() => {
      this.setState({ isLoading: false });
    });
  }

  render() {
    const { isLoading, searchedPlayers, addedPlayers, showAddGuestPlayer } = this.state;

    return (
      <div>
        <h2 align="center" className='text-primary'>Tournament Admins</h2>
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
        <p className='text-center text-primary'>{addedPlayers.length} Admins</p>
        <div className='flex-center'>
          <SecondaryButton
            className="me-15"
            onClick={() => this.props.onClose()}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton onClick={() => this.updateAdminList()}>
            {isLoading ? <CircularProgress /> : "Save changes"}
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

export default AddAdminModal;