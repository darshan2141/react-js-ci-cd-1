import React from "react";
import { Fab } from "@material-ui/core";
import { Dialog, DialogContent } from "@material-ui/core";
import { sendHttpRequest, BASE_URL, checkIfUserLoggedIn } from "../../common/Common";
import PersistentDrawerRight from "../navBar/nav";
import { Add } from "@material-ui/icons/";
import { toast } from "react-toastify";
import CreateMatchModal from "./CreateMatchModal";
import NoResults from "../NoResults";
import Match from "./Match";

class Matches extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matches: [],
      showCreateMatchModal: false,
    };
  }

  componentDidMount() {
    checkIfUserLoggedIn(this.props.history);
    this.getAllMatches()
  }

  async getAllMatches() {
    await sendHttpRequest("GET", BASE_URL + "/api/match/user/" + localStorage.getItem('loggedInUserId')).then((res) => {
      this.setState({ matches: res.data.data });
    }).catch((error) => {
      toast.error(error.response.data.message)
    });
  }

  render() {
    const { matches, showCreateMatchModal } = this.state;
    
    return (
      <div>
        <PersistentDrawerRight title="Matches" />
        <div className="page-wrapper pb-15">
          {matches.length === 0 ? (
            <NoResults text="matches" />
          ) : (
            <div>
              {matches.map((match, index) => (
                <Match key={index} data={match} />
              ))}
            </div>
          )}
          <div className='bottom-right'>
            <Fab
              className='primary-btn'
              onClick={() => this.setState({ showCreateMatchModal: true })}
            >
              <Add />
            </Fab>
          </div>
          <Dialog fullWidth open={showCreateMatchModal} onClose={() => this.setState({ showCreateMatchModal: false })} >
            <DialogContent>
              <CreateMatchModal
                onClose={() => {
                  this.setState({ showCreateMatchModal: false });
                  this.getAllMatches()
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }
}

export default Matches;