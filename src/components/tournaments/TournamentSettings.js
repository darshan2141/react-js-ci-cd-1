import React from "react";
import { Dialog, DialogContent } from "@material-ui/core";
import PersistentDrawerRight from "../navBar/nav";
import { sendHttpRequest, BASE_URL, checkIfUserLoggedIn } from "../../common/Common";
import { toast } from "react-toastify";
import { PrimaryButton } from "../CustomMUI/CustomButtons";
import AddAdminModal from "./AddAdminModal";
import EditModal from "../Modals/EditModal";

class TournamentSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tournamentDetails: [],
      isEditModalOpen: false,
      isAdminModalOpen: false,
      userId: ""
    };
  }

  componentDidMount() {
    checkIfUserLoggedIn(this.props.history);
    this.setState({ userId: localStorage.getItem('loggedInUserId') });
    this.getTournamentDetails(this.props.match.params.tournamentId)
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

  render() {
    const { tournamentDetails, isAdminModalOpen, isEditModalOpen } = this.state;

    return (
      <div>
        <PersistentDrawerRight title="Tournaments" farLeft={true}/>
        <div className="page-wrapper flex-center-vertical">
          <PrimaryButton className="mb-15" onClick={() => this.setState({ isEditModalOpen: true })}>
            Edit Tournament
          </PrimaryButton>
          <PrimaryButton
            className="mb-15"
            onClick={() => { this.props.history.push(`/tournament/registrations/${tournamentDetails._id}`) }}
          >
            Registered Teams
          </PrimaryButton>
          <PrimaryButton onClick={() => this.setState({ isAdminModalOpen: true })}>
            Admins
          </PrimaryButton>
        </div>
        <Dialog fullWidth open={isEditModalOpen} onClose={() => this.setState({ isEditModalOpen: false })} >
          <DialogContent>
            <EditModal
              tournamentData={tournamentDetails}
              reloadTournamentDetails={() => this.getTournamentDetails(tournamentDetails._id)}
              onClose={() => this.setState({ isEditModalOpen: false })}
            />
          </DialogContent>
        </Dialog>
        <Dialog fullWidth open={isAdminModalOpen} onClose={() => this.setState({ isAdminModalOpen: false })} >
          <DialogContent>
            <AddAdminModal
              id={tournamentDetails._id}
              existingAdmins={tournamentDetails?.admins?.map((admin) => admin._id)}
              reloadTournamentDetails={() => this.getTournamentDetails(tournamentDetails._id)}
              onClose={() => this.setState({ isAdminModalOpen: false })}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default TournamentSettings;
