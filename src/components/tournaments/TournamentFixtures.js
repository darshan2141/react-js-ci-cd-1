import React from "react";
import { CircularProgress } from "@material-ui/core";
import PersistentDrawerRight from "../navBar/nav";
import { sendHttpRequest, BASE_URL, checkIfUserLoggedIn } from "../../common/Common";
import { toast } from "react-toastify";
import Match from "../match/Match";
import { PrimaryButton } from "../CustomMUI/CustomButtons";

class TournamentFixtures extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tournamentDetails: {},
      userId: "",
      isLoading: false,
      fixtures: []
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
      this.getFixtures(res.data.data.fixtures);
    }).catch((error) => {
      toast.error(error.response.data.message);
    }).finally(() => {
      this.setState({ isLoading: false });
    });
  }

  async getFixtures(fixtures) {
    try {
      this.setState({ isLoading: true });
      const promises = fixtures.map(async (fixture) => {
        const data = await sendHttpRequest("GET", BASE_URL + "/api/match/id/" + fixture);
        return data.data.data;
      });

      const fixtureDataArray = await Promise.all(promises);
      this.setState({ fixtures: fixtureDataArray });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  endTournament() {
    this.setState({ isLoading: true });
    sendHttpRequest("PUT", BASE_URL + "/api/tournament/end/" + this.state.tournamentDetails._id).then(res => {
      toast.success(res.data.message);
      this.props.history.push("/tournaments");
    }).catch((error) => {
      toast.error(error.response.data.message);
    }).finally(() => {
      this.setState({ isLoading: false });
    });
  }

  render() {
    const { fixtures, isLoading } = this.state;

    return (
      <div>
        <PersistentDrawerRight title="Tournament Fixtures" farLeft={true} />
        {isLoading ? (
          <div className="page-wrapper text-center">
            <CircularProgress />
          </div>
        ) : (
          <div className="page-wrapper text-center">
            {fixtures?.map((match, index) => (
              <Match key={index} data={match} isTournament={true} />
            ))}
            {(fixtures.length > 0 && fixtures.every(match => match.status === "COMPLETED")) && (
              <PrimaryButton onClick={() => this.endTournament()}>End Tournament</PrimaryButton>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default TournamentFixtures;
