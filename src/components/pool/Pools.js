import React from 'react';
import { Fab, Card, Divider, Dialog, DialogContent } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { sendHttpRequest, BASE_URL, checkIfUserLoggedIn, searchPlayer } from '../../common/Common';
import PersistentDrawerRight from '../navBar/nav'
import { toast } from 'react-toastify';
import CustomTextField from '../CustomMUI/CustomTextField';
import CreatePool from './CreatePool';
import NoResults from '../NoResults';

class Pools extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			allPools: [],
			searchedPools: [],
			isModalOpen: false,
			userId: ""
		};
	}

	componentDidMount() {
		checkIfUserLoggedIn(this.props.history);
		this.setState({ userId: localStorage.getItem('loggedInUserId') })
		this.getAllPools(localStorage.getItem('loggedInUserId'));
	}

	getAllPools(userId) {
		sendHttpRequest("GET", BASE_URL + "/api/pool/player/" + userId).then((res) => {
			this.setState({
				allPools: res.data.data,
				searchedPools: res.data.data,
			});
		}).catch(error => {
			toast.error(error.response.data.message)
		});
	}

	handleSearch(searchingKeyWord) {
		this.setState({ searchedPlayers: searchPlayer(searchingKeyWord, this.state.allPlayers) })
	}

	render() {
		const { searchedPools, isModalOpen, userId } = this.state

		return (
			<div>
				<PersistentDrawerRight title="Clubs" />
				<div className="page-wrapper">
					<CustomTextField
						label="Search for your Clubs"
						type="search"
						onChange={(e) => this.handleSearch(e.target.value)}
					/>
					{searchedPools.length === 0 ? (
						<NoResults text="pools" />
					) : (
						<div>
							{searchedPools.map((pool, index) =>
								<Card
									key={index}
									className="card"
									onClick={() => { this.props.history.push(`/pool/${pool._id}`) }}
								>
									<div className='flex-between'>
										<div className="flex-center-vertical text-primary">
											<h2 className='my-0'>{pool.name}</h2>
											<span className='text-chip'>{pool.playerList.length} Players</span>
										</div>
										{pool.teamList.length >= 1 && (
											<div className="flex-center-vertical text-primary">
												<b>Teams</b>
												<Divider />
												<div> </div>
												{pool.teamList.map((team, index) =>
													<div className='flex-between text-chip chip-small' key={index}>
														<small>{team.name}&nbsp;</small>
														<small>- {team.playerList.length} Players</small>
													</div>
												)}
											</div>
										)}
									</div>
								</Card>
							)}
						</div>
					)}
					<div className='bottom-right'>
						<Fab className='primary-btn' onClick={() => this.setState({ isModalOpen: true })}><AddIcon /></Fab>
					</div>
					<Dialog fullWidth open={isModalOpen} onClose={() => this.setState({ isModalOpen: false })} >
						<DialogContent>
							<CreatePool onClose={() => this.setState({ isModalOpen: false })} reloadPools={() => this.getAllPools(userId)} />
						</DialogContent>
					</Dialog>
				</div>
			</div>
		);
	}
}
export default Pools;