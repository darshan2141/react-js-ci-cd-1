import React from 'react';
import { Dialog, DialogContent, CircularProgress, Card, CardMedia } from '@material-ui/core';
import { sendHttpRequest, BASE_URL, checkIfUserLoggedIn, searchPlayer } from '../../common/Common';
import DefaultImage from "../../assets/images/User.jpg";
import AddGuestPlayer from '../Modals/AddGuestPlayer';
import { PrimaryButton, SecondaryButton, DeleteButton } from '../CustomMUI/CustomButtons'
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import CustomTextField from '../CustomMUI/CustomTextField';
import { toast } from 'react-toastify';
class CreateTeamModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userId: "",
			teamName: "",
			isLoading: false,
			showAddGuestPlayer: false,
			allPlayers: [],
			searchedPlayers: [],
			teamMembers: [],
		};
	}

	componentDidMount() {
		checkIfUserLoggedIn(this.props.history);
		this.setState({ userId: localStorage.getItem('loggedInUserId') })
		this.getAllPlayers()
	}

	getAllPlayers() {
		if (this.props.poolData) {
			this.setState({
				allPlayers: this.props.poolData.playerList,
				searchedPlayers: this.props.poolData.playerList,
			});
		} else {
			sendHttpRequest("GET", BASE_URL + "/api/player/").then((data) => {
				this.setState({
					allPlayers: data.data.result,
					searchedPlayers: data.data.result,
				});
			}).catch(error => {
				toast.error(error.response.data.message)
			});
		}
	}

	handleSearch(searchingKeyWord) {
		this.setState({ searchedPlayers: searchPlayer(searchingKeyWord, this.state.allPlayers) })
	}

	addPlayer(player) {
		const { teamMembers } = this.state
		const updateTeamMembers = [...teamMembers, player];

		this.setState({ teamMembers: updateTeamMembers })
	}

	removePlayer(player) {
		const { teamMembers } = this.state
		const updateTeamMembers = teamMembers.filter((teamMember) => teamMember !== player);

		this.setState({ teamMembers: updateTeamMembers })
	}

	createPool() {
		const { teamName, teamMembers, userId } = this.state;

		if (!teamName) {
			toast.error("Please enter a team name");
			return;
		}
		if (teamMembers.length < 5) {
			toast.error("Add at least 5 players before creating a team");
			return;
		}
		if (teamMembers.length > 11) {
			toast.error("Team can have only 11 players");
			return;
		}

		let data = {
			name: teamName,
			players: teamMembers,
			createdBy: userId,
			isTemp: true
		};

		this.setState({ isLoading: true });

		sendHttpRequest("POST", BASE_URL + "/api/pool", null, JSON.stringify(data)).then((res) => {
			toast.success(res.data.message);
			this.setState({ isLoading: false });
			this.createTeam(res.data.data)
		}).catch((error) => {
			this.setState({ isLoading: false });
			toast.error(error.response.data.message)
		});
	}

	createTeam(poolData) {
		const { teamName, teamMembers, userId } = this.state

		if (!teamName) {
			toast.error("Please enter a team name");
			return;
		}
		if (teamMembers.length < 5) {
			toast.error("Add at least 5 players before creating a team");
			return;
		}
		if (teamMembers.length > 11) {
			toast.error("Team can have only 11 players");
			return;
		}

		let data = {
			teamName: teamName,
			teamMembers: teamMembers,
			createdBy: userId,
			poolId: this.props.poolData ? this.props.poolData._id : poolData._id,
			isTemp: this.props.poolData ? false : true,
			owner: this.props.poolData ? userId : null,
		};

		this.setState({ isLoading: true });

		sendHttpRequest("POST", BASE_URL + "/api/team", null, JSON.stringify(data)).then((res) => {
			this.setState({ isLoading: false })
			if (this.props.poolData) {
				this.updatePool(this.props.poolData, res.data.data._id)
			} else {
				this.updatePool(poolData, res.data.data._id)
			}
		}).catch((error) => {
			this.setState({ isLoading: false });
			toast.error(error.response.data.message);
		});
	}

	updatePool(poolData, teamId) {
		const teamList = poolData.teamList.map((team) => team._id)

		let data = {
			poolId: poolData._id,
			teamList: [...teamList, teamId],
		};

		this.setState({ isLoading: true });

		sendHttpRequest("PUT", BASE_URL + "/api/pool/teams", null, JSON.stringify(data)).then(() => {
			this.setState({ isLoading: false })
			toast.success("Team created successfully")
			if (this.props.reloadPoolDetails) {
				this.props.reloadPoolDetails()
			}
			this.props.onClose()
		}).catch((error) => {
			this.setState({ isLoading: false });
			toast.error(error.response.data.message);
		});
	}

	render() {
		const { teamName, searchedPlayers, showAddGuestPlayer, isLoading, teamMembers } = this.state
		return (
			<div>
				<h2 align="center" className='text-primary'>Create Team</h2>
				<CustomTextField
					label="Team Name"
					type="text"
					value={teamName}
					onChange={(e) => this.setState({ teamName: e.target.value })}
				/>
				<CustomTextField
					type="text"
					label="Search players"
					onChange={(e) => this.handleSearch(e.target.value)}
				/>
				<div className='search-players'>
					{searchedPlayers.map((player, index) => (
						<Card className='card' key={index}>
							<div className='flex-between'>
								<CardMedia
									className='card-image'
									image={player.profilePhoto ? player.profilePhoto : DefaultImage}
								/>
								<div>
									<span className='text-primary'> {player.firstName} {player.lastName}</span><br />
									<span className='text-primary'>{player.contactNo}</span>
								</div>
								{teamMembers.includes(player._id) ? (
									<DeleteButton onClick={() => this.removePlayer(player._id)}><ClearIcon /></DeleteButton>
								) : (
									<SecondaryButton onClick={() => this.addPlayer(player._id)}><AddIcon /></SecondaryButton>
								)}
							</div>
						</Card>
					))}
					{!this.props.poolData && (
						<SecondaryButton onClick={() => this.setState({ showAddGuestPlayer: true })}>Add guest player</SecondaryButton>
					)}
				</div>
				<p className='text-center text-primary'>{teamMembers.length} players added</p>
				<div className='flex-center'>
					<SecondaryButton className="me-15 cancel-btn" onClick={() => this.props.onClose()}>Cancel</SecondaryButton>
					{this.props.poolData ? (
						<PrimaryButton onClick={() => this.createTeam()} >
							{!isLoading ? "Create" : <CircularProgress />}
						</PrimaryButton>
					) : (
						<PrimaryButton onClick={() => this.createPool()} >
							{!isLoading ? "Create Pool & Team" : <CircularProgress />}
						</PrimaryButton>
					)}
				</div>
				<Dialog fullWidth open={showAddGuestPlayer} onClose={() => this.setState({ showAddGuestPlayer: false })} >
					<DialogContent>
						<AddGuestPlayer onClose={() => this.setState({ showAddGuestPlayer: false })} reloadGuestPlayers={() => this.getAllPlayers()} />
					</DialogContent>
				</Dialog>
			</div>
		);
	}
}
export default CreateTeamModal;