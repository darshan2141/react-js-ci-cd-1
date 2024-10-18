import React from "react";
import { Switch, Route } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import HomeScreen from "./components/home/HomeScreen";
import Scoresheet from "./components/score/Scoresheet";
import Scorecard from "./components/score/Scorecard";
import Profile from "./components/profile/Profile";
import Pool from "./components/pool/Pool";
import Pools from "./components/pool/Pools";
import Matches from "./components/match/Matches";
import Results from "./components/sessions/Results";
import AccessDenied from "./components/error/AccessDenied";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Team from "./components/team/Team";
import Tournaments from "./components/tournaments/Tournaments";
import Tournament from "./components/tournaments/Tournament";
import RegisterTeamTournament from "./components/tournaments/Registration/RegisterTeamTournament";
import TournamentSettings from "./components/tournaments/TournamentSettings";
import TournamentFixtures from "./components/tournaments/TournamentFixtures";
import RegisteredTeams from "./components/tournaments/Registration/RegisteredTeams";
import "./app.module.css";
import OtpVerify from "./components/Auth/OtpVerify";
import GettingStartedOne from "./components/GettingStarted/GettingStartedOne";
import ForgotPassword from "./components/Auth/forgotPassword";
import CreatePassword from "./components/Auth/createPassword";
import CreatePlayer from "./components/Player/CreatePlayer";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import BottomNav from "./components/BottomTab/bottomTab";
import MyCricket from "./components/MyCricket/MyCricket";
import More from "./components/More/More";
import { Box } from "@material-ui/core";
import PlayerList from "./components/Player/PlayerList";
import ViewPlayer from "./components/Player/ViewPlayer";
import CreateTeam from "./components/team/CreateTeam";
import AddPlayersModal from "./components/Player/AddPlayersModal";
import CreateMatch from "./components/match/CreateMatch";
import MyMatches from "./components/MyMatches/MyMatches";
import ScrollToTop from "./common/ScrollToTop";
import CreateTournament from "./pages/Tournament/CreateTournament/CreateTournament";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: true,
    };
  }
  componentDidMount() {
    this.setState({
      authenticated: !!localStorage.getItem("loggedInUserId"),
    });
  }
  render() {
    return (
      <Box
        style={{
          height: window.innerHeight + "px",
          width: window.innerWidth + "px",
        }}
      >
        <ToastContainer
          draggable={false}
          autoClose={5000}
          position={toast.POSITION.TOP_CENTER}
        />
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
          <Router>

            <ScrollToTop>
              <Switch>
                {this.state.authenticated ? (
                  <div className="main-tab">
                    <Route exact path="/home" component={HomeScreen} />
                    <Route exact path="/pools" component={Pools} />
                    <Route exact path="/my-cricket" component={MyCricket} />
                    <Route exact path="/my-matches" component={MyMatches} />
                    <Route exact path="/more" component={More} />
                    <BottomNav />
                    <Redirect from="/" to="/home" />
                  </div>
                ) : (
                  <>
                    <Route exact path="/" component={Login} />
                    <Route exact path="/gs" component={GettingStartedOne} />
                    <Route exact path="/signup" component={Register} />
                    <Route
                      exact
                      path="/forgotPassword"
                      component={ForgotPassword}
                    />
                    <Route
                      exact
                      path="/createPassword"
                      component={CreatePassword}
                    />
                    <Route exact path="/otpVerify" component={OtpVerify} />
                    <Redirect from="/" to="/" />
                  </>
                )}
              </Switch>

              <Route exact path="/createPlayer" component={CreatePlayer} />
              <Route exact path="/playerList" component={PlayerList} />
              <Route exact path="/viewPlayer" component={ViewPlayer} />
              <Route exact path="/addPlayersModal" component={AddPlayersModal} />

              <Route exact path="/createMatch" component={CreateMatch} />

              <Route path="/pool/:poolId" component={Pool} />
              <Route exact path="/tournament/create" component={CreateTournament} />
              <Route exact path="/tournament/all" component={Tournaments} />
              <Route exact path="/tournament/details/:tournamentId" component={Tournament} />
              <Route exact path="/tournament/register/:tournamentId" component={RegisterTeamTournament}/>
              <Route exact path="/tournament/settings/:tournamentId" component={TournamentSettings} />
              <Route exact path="/tournament/registrations/:tournamentId" component={RegisteredTeams} />
              <Route exact path="/tournament/standings/:tournamentId" component={TournamentFixtures} />
              <Route path="/series-results/:seriesId" component={Results} />
              <Route path="/pools" component={Pools} />
              <Route path="/profile" component={Profile} />
              <Route path="/matches" component={Matches} />
              <Route path="/scoresheet/:matchId" component={Scoresheet} />
              <Route path="/match/:matchId" component={Scorecard} />
              <Route path="/team/:teamId" component={Team} />
              <Route path="/create-team" component={CreateTeam} />
              <Route path="/403" component={AccessDenied} />
            </ScrollToTop>
          </Router>
        </GoogleOAuthProvider>
      </Box>
    );
  }
}

export default App;
