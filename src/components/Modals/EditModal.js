import React from "react";
import { CircularProgress, MenuItem } from "@material-ui/core";
import { sendHttpRequest, BASE_URL, checkIfUserLoggedIn } from "../../common/Common";
import { toast } from "react-toastify";
import CustomTextField from "../CustomMUI/CustomTextField";
import { PrimaryButton, SecondaryButton } from "../CustomMUI/CustomButtons";

class EditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      poolId: "",
      poolName: "",
      teamId: "",
      teamName: "",
      tournamentName: "",
      tournamentGround: "",
      tournamentDate: "",
      ballType: "",
      pitchType: "",
    };

    this.savePoolChanges = this.savePoolChanges.bind(this);
    this.saveTeamChanges = this.saveTeamChanges.bind(this);
  }

  componentDidMount() {
    checkIfUserLoggedIn(this.props.history);
    if (this.props.poolData) {
      this.setState({
        poolName: this.props.poolData.name,
        poolId: this.props.poolData._id,
      })
    } else if (this.props.teamData) {
      this.setState({
        teamName: this.props.teamData.name,
        teamId: this.props.teamData._id,
      })
    } else if (this.props.tournamentData) {
      this.setState({
        tournamentName: this.props.tournamentData.name,
        tournamentGround: this.props.tournamentData.ground,
        tournamentDate: this.props.tournamentData.date,
        ballType: this.props.tournamentData.ballType,
        pitchType: this.props.tournamentData.pitchType,
      })
    }
  }

  savePoolChanges() {
    const { poolId, poolName } = this.state;

    if (!poolName) {
      toast.error("Please enter pool name");
      return;
    }

    let data = {
      name: poolName,
      poolId: poolId
    };

    this.setState({ isLoading: true });

    sendHttpRequest("PUT", BASE_URL + "/api/pool", null, JSON.stringify(data)).then((res) => {
      toast.success(res.data.message);
      this.setState({ isLoading: false });
      this.props.reloadPoolDetails()
      this.props.onClose()
    }).catch((error) => {
      this.setState({ isLoading: false });
      toast.error(error.response.data.message)
    });
  }

  saveTeamChanges() {
    const { teamId, teamName } = this.state;

    if (!teamName) {
      toast.error("Please enter team name");
      return;
    }

    let data = {
      name: teamName,
      teamId: teamId
    };

    this.setState({ isLoading: true });

    sendHttpRequest("PUT", BASE_URL + "/api/team/name", null, JSON.stringify(data)).then((res) => {
      toast.success(res.data.message);
      this.setState({ isLoading: false });
      this.props.reloadTeamDetails()
      this.props.onClose()
    }).catch((error) => {
      this.setState({ isLoading: false });
      toast.error(error.response.data.message)
    });
  }

  saveTournamentChanges() {
    const { tournamentName, tournamentGround, tournamentDate, pitchType, ballType } = this.state;

    if (!tournamentName) {
      toast.error("Please enter tournament name");
      return;
    }
    if (!tournamentGround) {
      toast.error("Please enter tournament ground");
      return;
    }
    if (!tournamentDate) {
      toast.error("Please enter tournament date");
      return;
    }
    if (!pitchType) {
      toast.error("Please select pitch type");
      return;
    }
    if (!ballType) {
      toast.error("Please select ball type");
      return;
    }

    let data = {
      name: tournamentName,
      ground: tournamentGround,
      date: tournamentDate,
      tournamentId: this.props.tournamentData._id,
      ballType: ballType,
      pitchType: pitchType
    };

    this.setState({ isLoading: true });

    sendHttpRequest("PUT", BASE_URL + "/api/tournament", null, JSON.stringify(data)).then((res) => {
      toast.success(res.data.message);
      this.props.reloadTournamentDetails()
      this.props.onClose()
    }).catch((error) => {
      toast.error(error.response.data.message)
    }).finally(() => {
      this.setState({ isLoading: false });
    });
  }

  render() {
    const { isLoading, poolName, teamName, tournamentName, tournamentGround, tournamentDate, ballType, pitchType } = this.state;
    const ballTypes = ["Tennis Ball", "Red Ball", "White Ball", "Pink Ball"]
    const pitchTypes = ["Indoor", "Matting", "Astra", "Turf", "Grass"]

    return (
      <div>
        <h2 align="center" className='text-primary'>
          {this.props.poolData ? "Edit Club" : this.props.teamData ? "Edit Team" : "Edit Tournament"}
        </h2>
        {this.props.poolData ? (
          <CustomTextField
            label="Club Name"
            type="text"
            value={poolName}
            onChange={(e) => this.setState({ poolName: e.target.value })}
          />
        ) : this.props.teamData ? (
          <CustomTextField
            label="Team Name"
            type="text"
            value={teamName}
            onChange={(e) => this.setState({ teamName: e.target.value })}
          />
        ) : this.props.tournamentData && (
          <div>
            <CustomTextField
              label="Tournament Name"
              type="text"
              value={tournamentName}
              onChange={(e) => this.setState({ tournamentName: e.target.value })}
            />
            <CustomTextField
              label="Tournament Ground"
              type="text"
              value={tournamentGround}
              onChange={(e) => this.setState({ tournamentGround: e.target.value })}
            />
            <CustomTextField
              label="Tournament Date"
              type="date"
              value={tournamentDate}
              onChange={(e) => this.setState({ tournamentDate: e.target.value })}
            />
            <div className="flex-between">
              <CustomTextField
                select
                label="Pitch type"
                className="me-15"
                value={pitchType}
                onChange={(e) => this.setState({ pitchType: e.target.value })}
              >
                {pitchTypes.map((pitchType, index) => (
                  <MenuItem key={index} value={pitchType}>{pitchType}</MenuItem>
                ))}
              </CustomTextField>
              <CustomTextField
                select
                label="Ball type"
                className="me-15"
                value={ballType}
                onChange={(e) => this.setState({ ballType: e.target.value })}
              >
                {ballTypes.map((ballType, index) => (
                  <MenuItem key={index} value={ballType}>{ballType}</MenuItem>
                ))}
              </CustomTextField>
            </div>
          </div>
        )}
        <div className='flex-center mt-15 mb-15'>
          <SecondaryButton className="me-15 cancel-btn" onClick={() => this.props.onClose()}>Cancel</SecondaryButton>
          {this.props.poolData ? (
            <PrimaryButton onClick={() => this.savePoolChanges()}>
              {isLoading ? <CircularProgress /> : "Save changes"}
            </PrimaryButton>
          ) : this.props.poolData ? (
            <PrimaryButton onClick={() => this.saveTeamChanges()}>
              {isLoading ? <CircularProgress /> : "Save changes"}
            </PrimaryButton>
          ) : this.props.tournamentData && (
            <PrimaryButton onClick={() => this.saveTournamentChanges()}>
              {isLoading ? <CircularProgress /> : "Save changes"}
            </PrimaryButton>
          )}
        </div>
      </div >
    );
  }
}

export default EditModal;