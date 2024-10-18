import React from "react";
import { Card, Fab, Divider } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import PersistentDrawerRight from "../navBar/nav";
import { sendHttpRequest, BASE_URL, checkIfUserLoggedIn } from "../../common/Common";
import NoResults from "../NoResults";
import { toast } from "react-toastify";

class Tournaments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tournaments: [],
      userId: ""
    };
  }

  componentDidMount() {
    checkIfUserLoggedIn(this.props.history);
    this.setState({ userId: localStorage.getItem('loggedInUserId') });
    this.getTournaments();
  }

  async getTournaments() {
    await sendHttpRequest("GET", BASE_URL + "/api/tournament/user/" + localStorage.getItem('loggedInUserId')).then((res) => {
      this.setState({ tournaments: res.data.data });
    }).catch((error) => {
      toast.error(error.response.data.message)
    });
  }

  render() {
    const { tournaments, userId } = this.state;

    return (
      <div>
        <PersistentDrawerRight title="Tournaments" />
        <div className="page-wrapper">
          {tournaments.length === 0 ? (
            <NoResults text="tournaments" />
          ) : (
            <div>
              {tournaments.map((tournament, index) => (
                <Card key={index} className="card" onClick={() => { this.props.history.push(`/tournament/${tournament._id}`) }} >
                  {(tournament?.createdBy?._id === userId && tournament?.admins?.some(admin => admin._id === userId)) ? (
                    <p className="text-blue-bg my-0">Owner & Admin</p>
                  ) : tournament?.createdBy?._id === userId ? (
                    <p className="text-blue-bg my-0">Owner</p>
                  ) : tournament?.admins?.some(admin => admin._id === userId) && (
                    <p className="text-blue-bg my-0">Admin</p>
                  )}
                  <h2 className="text-primary"> {tournament.name} </h2>
                  <Divider />
                  <div className="flex-between text-primary">
                    <div>
                      <div> Date: {tournament.date} </div>
                      <div> Ground: {tournament.ground} </div>
                      <div> Pitch Type: {tournament.pitchType}</div>
                    </div>
                    <div>
                      <div> Category: {tournament.tournamentType} </div>
                      <div> Ball: {tournament.ballType} </div>
                      <div> Overs: {tournament.overs}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        <div className='bottom-right'>
          <Fab
            className='primary-btn'
            onClick={() => this.props.history.push('/tournament/create')}
          >
            <AddIcon />
          </Fab>
        </div>
      </div>
    );
  }
}

export default Tournaments;
