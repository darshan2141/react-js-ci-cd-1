import React from 'react';
import { withRouter } from 'react-router-dom';
import { MenuItem } from '@material-ui/core';
import { BASE_URL, checkIfUserLoggedIn, sendHttpRequest } from '../../common/Common';
import { toast } from "react-toastify";
import CustomTextField from '../CustomMUI/CustomTextField';
import { PrimaryButton, SecondaryButton } from '../CustomMUI/CustomButtons';

class StartMatchModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wonTossTeam: "",
            batFirst: "",
            userId: "",
            matchDetails: null
        };
    }

    componentDidMount() {
        checkIfUserLoggedIn(this.props.history);
        this.setState({ userId: localStorage.getItem('loggedInUserId') })
        this.setState({ matchDetails: this.props.data })
    }

    updateToss() {
        const { wonTossTeam, batFirst, matchDetails } = this.state
        const { history } = this.props;
        let otherTeam = wonTossTeam === matchDetails.teamA._id ? matchDetails.teamB._id : matchDetails.teamA._id

        let data = {
            wonTossTeam: wonTossTeam,
            batFirst: batFirst,
            battingTeam: batFirst ? wonTossTeam : otherTeam,
            bowlingTeam: batFirst ? otherTeam : wonTossTeam,
            matchId: matchDetails._id
        };

        this.setState({ isLoading: true });

        sendHttpRequest("POST", BASE_URL + "/api/match/toss", null, JSON.stringify(data)).then(() => {
            this.setState({ isLoading: false })
            history.push(`/scoresheet/${matchDetails._id}`);
        }).catch((error) => {
            this.setState({ isLoading: false });
            toast.error(error.response.data.message)
        });
    }

    render() {
        const { batFirst, wonTossTeam, matchDetails } = this.state;
        return (
            <div>
                <h2 className='text-primary text-center'>Toss</h2>
                <h3 className='text-primary text-center'>Select the team who won the toss and what was their decision</h3>
                <div className='text-primary flex-center-vertical'>

                    <CustomTextField
                        className='text-capitalize text-primary'
                        select
                        label="Toss Won by"
                        value={wonTossTeam}
                        onChange={(e) => this.setState({ wonTossTeam: e.target.value })}
                    >
                        <MenuItem value={matchDetails?.teamA._id}>{matchDetails?.teamA.name}</MenuItem>
                        <MenuItem value={matchDetails?.teamB._id}>{matchDetails?.teamB.name}</MenuItem>
                    </CustomTextField>
                    <CustomTextField
                        className='text-capitalize text-primary'
                        select
                        label="Choose To"
                        value={batFirst}
                        onChange={(e) => this.setState({ batFirst: e.target.value })}
                    >
                        <MenuItem value={true}>Bat First</MenuItem>
                        <MenuItem value={false}>Ball First</MenuItem>
                    </CustomTextField>
                </div>
                <div className="flex-around mt-15 mb-15">
                    <SecondaryButton className="cancel-btn" onClick={() => this.props.onClose()}>Cancel</SecondaryButton>
                    <PrimaryButton onClick={() => this.updateToss()}>Start Match</PrimaryButton>
                </div>
            </div>
        );
    }
}
export default withRouter(StartMatchModal);