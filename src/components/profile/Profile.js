import React from 'react';
import { Card, IconButton, Dialog, DialogContent, Button } from '@material-ui/core';
import MUIDataTable from "mui-datatables";
import PersistentDrawerRight from '../navBar/nav';
import { sendHttpRequest, BASE_URL, checkIfUserLoggedIn } from '../../common/Common';
import { } from '../../styles/site.css'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { toast } from "react-toastify";
import ProfilePlaceholder from "../../assets/images/User.jpg";
import { EditRounded } from '@material-ui/icons';
import EditProfileModal from './EditProfileModal';

const batsmenColumns = [
	{ name: "runs", label: "Runs" },
	{ name: "dots", label: "Dots" },
	{ name: "bigRuns", label: "4s/6s" }
]

const batsmenColumns2 = [
	{ name: "fifteenPlus", label: "15+" },
	{ name: "hs", label: "HS" },
	{ name: "strikeRate", label: "S/R" }
]

const bowlersColumns = [
	{ name: "overs", label: "Overs" },
	{ name: "w", label: "Wickets" },
	{ name: "zeros", label: "0's" }
]

const bowlersColumns2 = [
	{ name: "bigRuns", label: "4's/6's" },
	{ name: "twoW", label: "2W+" },
	{ name: "hf", label: "HF" },
	{ name: "otherBalls", label: "WB/NB" }
]

const tableOptions = {
	pagination: false,
	search: false,
	print: false,
	download: false,
	viewColumns: false,
	filter: false,
	selectableRows: "none",
	responsive: "standard"
};

class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userId: "",
			batsManData: [],
			ballsManData: [],
			profilePhoto: "",
			name: "",
			battingStyle: "",
			bowlingArm: "",
			bowlingStyle: "",
			isModalOpen: false,
			last: false,
			last3: false,
			overall: true,
		};
		this.getOverallStats = this.getOverallStats.bind(this);
		this.getLastSessionStats = this.getLastMatchStats.bind(this);
		this.getLast3MatchStats = this.getLast3MatchStats.bind(this);
		this.getUserDetails = this.getUserDetails.bind(this);
	}

	componentDidMount() {
		checkIfUserLoggedIn(this.props.history);
		this.setState({ userId: localStorage.getItem('loggedInUserId') })
		this.getOverallStats();
		this.getUserDetails();
	}

	getLastMatchStats() {
		const { userId } = this.state;

		Promise.all([
			sendHttpRequest('GET', BASE_URL + '/api/batting/last-match/' + userId),
			sendHttpRequest('GET', BASE_URL + '/api/bowling/last-match/' + userId)
		]).then((res) => {
			const battingStats = res[0].data.data;
			const bowlingStats = res[1].data.data;

			this.setState({
				batsManData: [{
					runs: battingStats.runs || 0,
					dots: battingStats.dots || 0,
					bigRuns: (battingStats.boundaries || 0) + '/' + (battingStats.sixes || 0),
					fifteenPlus: battingStats.fifteenPlus || 0,
					hs: battingStats.hs || 0,
					strikeRate: ((battingStats.runs / battingStats.ballsFaced) * 100).toFixed(2) || 0 || 0
				}],

				ballsManData: [{
					overs: +(bowlingStats.ballCount / 6).toFixed(0) + +((25 % 6) / 10) || 0,
					w: bowlingStats.wickets || 0,
					zeros: bowlingStats.zeros || 0,
					bigRuns: bowlingStats.bigRuns || 0,
					twoW: bowlingStats.twoW || 0,
					hf: bowlingStats.hf || 0,
					otherBalls: bowlingStats.extras || 0
				}]
			})
		}).catch((error) => {
			toast.error(error.response.data.message)
		});
	}

	getLast3MatchStats() {
		const { userId } = this.state;

		Promise.all([
			sendHttpRequest('GET', BASE_URL + '/api/batting/last3matches/' + userId),
			sendHttpRequest('GET', BASE_URL + '/api/bowling/last3matches/' + userId)
		]).then((res) => {
			const battingStats = res[0]?.data?.data || {};
			const bowlingStats = res[1]?.data?.data || {};

			this.setState({
				batsManData: [{
					runs: battingStats.runs || 0,
					dots: battingStats.dots || 0,
					bigRuns: battingStats.boundaries + '/' + battingStats.sixes || 0,
					fifteenPlus: battingStats.fifteenPlus || 0,
					hs: battingStats.highestScore || 0,
					strikeRate: ((battingStats.runs / battingStats.ballsFaced) * 100).toFixed(2) || 0
				}],

				ballsManData: [{
					overs: +(bowlingStats.ballCount / 6).toFixed(0) + +((25 % 6) / 10) || 0,
					w: bowlingStats.wickets || 0,
					zeros: bowlingStats.zeros || 0,
					bigRuns: bowlingStats.bigRuns || 0,
					twoW: bowlingStats.twoW || 0,
					hf: bowlingStats.hf || 0,
					otherBalls: bowlingStats.extras || 0
				}]
			})
		}).catch((error) => {
			toast.error(error.response.data.message)
		});
	}

	getOverallStats() {
		const userId = localStorage.getItem('loggedInUserId')

		Promise.all([
			sendHttpRequest('GET', BASE_URL + '/api/batting/overall/' + userId),
			sendHttpRequest('GET', BASE_URL + '/api/bowling/overall/' + userId)
		]).then((res) => {
			const battingStats = res[0].data.data;
			const bowlingStats = res[1].data.data;

			this.setState({
				batsManData: [{
					runs: battingStats.runs || 0,
					dots: battingStats.dots || 0,
					bigRuns: battingStats.boundaries + '/' + battingStats.sixes || 0,
					fifteenPlus: battingStats.fifteenPlus || 0,
					hs: battingStats.hs || 0,
					strikeRate: ((battingStats.runs / battingStats.ballsFaced) * 100).toFixed(2) || 0
				}],

				ballsManData: [{
					overs: +(bowlingStats.ballCount / 6).toFixed(0) + +((25 % 6) / 10) || 0,
					w: bowlingStats.wickets || 0,
					zeros: bowlingStats.zeros || 0,
					bigRuns: bowlingStats.bigRuns || 0,
					twoW: bowlingStats.twoW || 0,
					hf: bowlingStats.hf || 0,
					otherBalls: bowlingStats.extras || 0
				}]
			});
		}).catch((error) => {
			toast.error(error.response.data.message)
		});
	}

	getUserDetails() {
		sendHttpRequest("GET", BASE_URL + "/api/player/" + localStorage.getItem("loggedInUserId")).then((res) => {
			this.setState({
				name: res.data.data.firstName + " " + res.data.data.lastName,
				battingStyle: res.data.data.battingStyle,
				bowlingArm: res.data.data.bowlingArm,
				bowlingStyle: res.data.data.bowlingStyle,
				profilePhoto: res.data.data.profilePhoto ? res.data.data.profilePhoto : ProfilePlaceholder
			});
		}).catch((error) => {
			toast.error(error.response.data.message)
		});
	}

	getMuiTheme = () => createMuiTheme({
		overrides: {
			MUIDataTableBody: {
				emptyTitle: {
					visibility: 'hidden'
				}
			},
			MUIDataTableBodyCell: {
				root: {
					maxWidth: '20ch',
					textOverflow: 'ellipsis',
					overflow: 'hidden',
					whiteSpace: 'nowrap',
					textAlign: 'center,'
				}
			},
			MuiTableCell: {
				body: {
					fontSize: '15px !important',
					textAlign: 'center',
					color: '#194055',
					borderRadius: '8px',
					borderCollapse: 'separate',
					padding: '5px',
					fontFamily: 'DM Sans',
				},
				head: {
					fontSize: '15px',
					color: '#194055',
					borderRadius: '8px',
					boxShadow: '0 4px 7px rgb(30, 30, 30, 0.15)',
					padding: '5px',
					fontFamily: 'DM Sans',
					textAlign: 'center !important',
					backgroundColor: 'rgba(25, 64, 85, 0.250) !important',
				}
			},
			MUIDataTableHeadCell: {
				toolButton: {
					display: 'flex',
					justifyContent: 'center'

				},
				sortActive: {
					color: '#00b9f7',
				}
			},
			MuiTable: {
				root: {
					borderSpacing: '8px',
					borderCollapse: 'separate',
					textAlign: 'center'
				}
			},
			MuiTableHead: {
				root: {
					position: 'relative',
					top: '5px',
					textAlign: 'center'
				}
			},
			MUIDataTableToolbar: {
				left: {
					width: '100%',
					display: 'flex',
					justifyContent: 'center',
					alignItem: 'center',
					textAlign: 'center'
				}
			},
			MuiToolbar: {
				regular: {
					minHeight: '48px !important'
				}
			},
			MuiPaper: {
				elevation4: {
					boxShadow:
						'0 4px 7px rgb(30, 30, 30, 0)',
					backgroundColor: 'rgb(255, 255, 255, 0)'
				}
			},
			MuiTableSortLabel: {
				icon: {
					position: 'absolute',
					top: '33%',
				}
			}
		}
	})

	handleToggle(btnName) {
		if (btnName === "last") {
			this.setState({ last: true, overall: false, last3: false });
			this.getLastSessionStats()
		} else if (btnName === "last3") {
			this.setState({ last: false, overall: false, last3: true });
			this.getLast3MatchStats()
		} else {
			this.setState({ last: false, overall: true, last3: false });
			this.getOverallStats()
		}
	}

	render() {
		const { name, profilePhoto, bowlingArm, isModalOpen, last, last3, overall, battingStyle, bowlingStyle } = this.state;

		return (
			<div>
				<PersistentDrawerRight title="Profile" />
				<div className="page-wrapper">
					<div className="flex-between mb-15">
						<img width={130} height={130} style={{ borderRadius: '12px' }} src={profilePhoto} alt='profile'/>
						<div className="flex-center-vertical text-primary">
							<h1 className="text-left my-0 text-chip">{name}</h1>
							<span>Batting Arm: {battingStyle}</span>
							<span>Bowling Arm: {bowlingArm}</span>
							<span>Bowling Style: {bowlingStyle}</span>
						</div>
						<div className="flex-center-vertical">
							<IconButton onClick={() => this.setState({ isModalOpen: true })}>
								<EditRounded />
							</IconButton>
						</div>
					</div>
					<Dialog fullWidth open={isModalOpen} onClose={() => this.setState({ isModalOpen: false })} >
						<DialogContent>
							<EditProfileModal onClose={() => this.setState({ isModalOpen: false })} />
						</DialogContent>
					</Dialog>
					<h3 className="text-blue-bg text-center">Match Statistics</h3>
					<div className='flex-around mb-15'>
						<Button
							variant='contained'
							disableElevation
							className={overall ? "active-tab" : "tab"}
							onClick={() => this.handleToggle("overall")}
						>
							Overall
						</Button>
						<Button
							variant='contained'
							disableElevation
							className={last3 ? "active-tab" : "tab"}
							onClick={() => this.handleToggle("last3")}
						>
							Last Three
						</Button>
						<Button
							variant='contained'
							disableElevation
							className={last ? "active-tab" : "tab"}
							onClick={() => this.handleToggle("last")}
						>
							Last
						</Button>
					</div>
					<Card className="card">
						<h2 className='text-blue-bg text-center'>Batting Statistics</h2>
						<div>
							<MuiThemeProvider theme={this.getMuiTheme()}>
								<MUIDataTable
									data={this.state.batsManData}
									columns={batsmenColumns}
									options={tableOptions}
								/>
							</MuiThemeProvider>
						</div>
						<div>
							<MuiThemeProvider theme={this.getMuiTheme()}>
								<MUIDataTable
									data={this.state.batsManData}
									columns={batsmenColumns2}
									options={tableOptions}
								/>
							</MuiThemeProvider>
						</div>
					</Card>
					<Card className="card">
						<h2 className='text-blue-bg text-center'>Bowling Statistics</h2>
						<div>
							<MuiThemeProvider theme={this.getMuiTheme()}>
								<MUIDataTable
									data={this.state.ballsManData}
									columns={bowlersColumns}
									options={tableOptions}
								/>
							</MuiThemeProvider>
						</div>
						<div>
							<MuiThemeProvider theme={this.getMuiTheme()}>
								<MUIDataTable
									data={this.state.ballsManData}
									columns={bowlersColumns2}
									options={tableOptions}
								/>
							</MuiThemeProvider>
						</div>
					</Card>
					{/* <Card className="card">
						<h2 className='text-blue-bg text-center'>Feilding Statistics</h2>
						<div>
							<MuiThemeProvider theme={this.getMuiTheme()}>
								<MUIDataTable
									
								/>
							</MuiThemeProvider>
						</div>
						<div>
							<MuiThemeProvider theme={this.getMuiTheme()}>
								<MUIDataTable
									
								/>
							</MuiThemeProvider>
						</div>
					</Card> */}
				</div>
			</div>
		);
	}
}

export default Profile;