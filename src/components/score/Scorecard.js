import React from 'react';
import {
	Card,
	CardContent,
	Button,
	ButtonGroup,
	Typography,
	CardActions,
	IconButton
} from '@material-ui/core';
import MUIDataTable from "mui-datatables";

import { sendHttpRequest, BASE_URL, checkIfUserLoggedIn } from '../../common/Common'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { ArrowBack, KeyboardArrowLeft } from '@material-ui/icons';
import PersistentDrawerRight from '../navBar/nav';
import { withRouter } from 'react-router-dom'

import { createBrowserHistory } from 'history';
// Or, to pre-seed the history instance with some URLs:
let history = createBrowserHistory();
// const BASE_URL = "http://localhost:3000/api/"

const bowlersColumns = [
	{
		name: "fullName",
		label: "Name"
	},
	{
		name: "overs",
		label: "Overs"
	},
	{
		name: "runs",
		label: "Runs"
	},
	{
		name: "wickets",
		label: "Wk"
	},
	{
		name: "extras",
		label: "Extras"
	},
];

const batsmanColumns = [
	{
		name: "fullName",
		label: "Name"
	},
	{
		name: "runs",
		label: "Runs"
	},
	{
		name: "ballCount",
		label: "Balls"
	},
	{
		name: "strikerate",
		label: "S/R"
	},
];

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

class Scorecard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			defaultInning: "inning1",
			teamARuns: 0,
			teamBRuns: 0,
			overs: 0,
			ballCount: 0,
			teamAwickets: 0,
			teamBwickets: 0,
			teamABalls: [],
			teamBBalls: [],
			status: "",
			currentBatsman: "",
			currentBowler: "",
			matchId: "",
			teamA: {},
			teamB: {},
			teamAName: "",
			teamBName: "",
			series: "",
			inning1: {},
			inning2: {},
			ballersData: [],
			batsmansData: [],
			longstTeamName: "",
			longstTeamWidth: "",
			inningTabs: [
				{ inning1: { name: '1st Innings', active: true } },
				{ inning2: { name: '2nd Innings', active: false } }
			],
			teamWon: "",
		};
		this.toggleActiveInning = this.toggleActiveInning.bind(this);
		this.getMatchDetails = this.getMatchDetails.bind(this);
	}

	componentDidMount() {
		this.getMatchDetails();
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
					whiteSpace: 'nowrap'
				}
			},
			MuiTableCell: {
				body: {
					fontSize: '16px',
					fontFamily: 'DM Sans',
					textAlign: 'center',
					color: 'var(--primary-color-600)',
					borderRadius: '8px',
					// boxShadow:
					// 	'0 4px 7px rgb(30, 30, 30, 0.15)',
					// borderCollapse: 'separate',
					// borderSpacing: '5px',
					padding: '5px'
				},
				head: {
					fontSize: '18px',
					fontFamily: 'DM Sans',
					color: 'var(--primary-color-600)',
					borderRadius: '5px',
					textAlign: 'center',
					boxShadow:
						'0 4px 7px rgb(30, 30, 30, 0.15)',
					// borderCollapse: 'separate',
					// borderSpacing: '0px',
					padding: '5px'
				}
			},
			MUIDataTableHeadCell: {
				toolButton: {
					display: 'flex',
					justifyContent: 'center',
				},
				sortActive: {
					color: '#00b9f7',
				}
			},
			MuiTable: {
				root: {
					borderSpacing: '8px',
					borderCollapse: 'separate',
				}
			},
			MuiTableHead: {
				root: {
					position: 'relative',
					top: '5px',
				}
			},
			MUIDataTableToolbar: {
				left: {
					width: '100%',
					display: 'flex',
					justifyContent: 'center',
					alignItem: 'center',
					textAlign: 'center',
					fontFamily: 'DM Sans'
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

	toggleActiveInning(tabIndex) {
		const tabs = this.state.inningTabs;
		//    tabs[tabIndex] = true;
		const modifiedTabs = tabs.map((tab, index) => {
			if (index !== tabIndex) {
				tab['inning' + (index + 1)].active = false
			} else {
				tab['inning' + (index + 1)].active = true
			}
		})
		this.setState({ tabs: modifiedTabs })
	}

	async getMatchDetails() {
		let { teamARuns, teamBRuns, overs, ballCount, teamAwickets,
			teamBwickets, teamABalls, teamBBalls, status, currentBatsman,
			currentBowler, matchId, teamA, teamB, series, inning1,
			inning2, teamWon } = this.state;
		let longstWidthInCh;
		Promise.all([sendHttpRequest('GET', BASE_URL + '/api/match/' + this.props.match.params.matchId),
		sendHttpRequest('GET', BASE_URL + '/api/batting/match/' + this.props.match.params.matchId),
		sendHttpRequest('GET', BASE_URL + '/api/bowling/match/' + this.props.match.params.matchId)]).
			then(res => {
				const matchData = res[0].data;
				const battingData = res[1].data;
				const bowlingData = res[2].data;
				if (matchData.status === 1) {
					({
						teamARuns, teamBRuns, overs, ballCount, teamAwickets,
						teamBwickets, teamABalls, teamBBalls, status, currentBatsman,
						currentBowler, matchId, teamA, teamB, series, inning1,
						inning2
					} = matchData.data)

					const teamAName = matchData.data.inning1.battingTeam.name
					const teamBName = matchData.data.inning1.bowlingTeam.name

					const longstName = teamAName.length > teamBName.length ?
						teamAName : teamBName
					const longstWidth = longstName.length + 7;
					longstWidthInCh = longstWidth + 'ch';

					if (battingData.status === 1) {
						let batting = battingData.data;
						inning1.batting = batting.
							filter(battingPerformance => (battingPerformance.inningId == inning1._id &&
								battingPerformance.ballsFaced !== 0)).
							map(fBatting => {
								let strikerate = ((fBatting.runs / fBatting.ballsFaced) * 100).toFixed(2)
								if (strikerate === 'NaN') {
									strikerate = 0
								}
								return {
									fullName: fBatting.player.firstName + " " + fBatting.player.lastName,
									ballCount: fBatting.ballsFaced,
									runs: fBatting.runs,
									strikerate: strikerate
								}
							})
						inning2.batting = batting.
							filter(battingPerformance => (battingPerformance.inningId == inning2._id &&
								battingPerformance.ballsFaced !== 0)).
							map(fBatting => {
								let strikerate = ((fBatting.runs / fBatting.ballsFaced) * 100).toFixed(2)
								if (strikerate === 'NaN') {
									strikerate = 0
								}
								return {
									fullName: fBatting.player.firstName + " " + fBatting.player.lastName,
									ballCount: fBatting.ballsFaced,
									runs: fBatting.runs,
									strikerate: strikerate
								}
							})
					}
					if (bowlingData.status === 1) {
						let bowling = bowlingData.data;
						inning1.bowling = bowling.
							filter(bowlingPerformance => (bowlingPerformance.inningId == inning1._id &&
								bowlingPerformance.ballCountWExtra !== 0)).
							map(fBowling => {
								let overs = ~~(fBowling.ballCount / 6) + ((fBowling.ballCount % 6) / 10)
								overs = overs.toFixed(1)
								return {
									fullName: fBowling.player.firstName + " " + fBowling.player.lastName,
									overs: overs,
									ballCount: fBowling.ballCountWExtra,
									wickets: fBowling.wickets,
									extras: fBowling.extras,
									runs: fBowling.runs,
								}
							})
						inning2.bowling = bowling.
							filter(bowlingPerformance => (bowlingPerformance.inningId == inning2._id &&
								bowlingPerformance.ballCountWExtra !== 0)).
							map(fBowling => {
								let overs = ~~(fBowling.ballCount / 6) + ((fBowling.ballCount % 6) / 10)
								overs = overs.toFixed(1)
								return {
									fullName: fBowling.player.firstName + " " + fBowling.player.lastName,
									overs: overs,
									ballCount: fBowling.ballCountWExtra,
									wickets: fBowling.wickets,
									extras: fBowling.extras,
									runs: fBowling.runs,
								}
							})
					}

					if (inning1.runs > inning2.runs) {
						teamWon = matchData.data.inning1.battingTeam.name + " Won the match";
					}
					else if (inning1.runs < inning2.runs) {
						teamWon = matchData.data.inning1.bowlingTeam.name + " Won the match";
					} else {
						teamWon = "Match Drawn"
					}

					this.setState({
						teamARuns, teamBRuns, overs, ballCount, teamAwickets,
						teamBwickets, teamABalls, teamBBalls, status, currentBatsman,
						currentBowler, matchId, teamA, teamB, series, inning1, inning2,
						longstTeamWidth: longstWidthInCh, teamBName, teamAName, teamWon
					});
				}
			})
	}

	render() {
		const { defaultInning, inningTabs, teamBName, teamAName, teamWon } = this.state;

		return (
			<div>
				<PersistentDrawerRight title="Scorecard" farLeft={true} />
				<div className="page-wrapper">
					<Card className="card">
						<div className="score-sum flex-between">
							<h3 className='my-0'>{teamAName}</h3>
							<h4 className='my-1'>Vs</h4>
							<h3 className='my-0'>{teamBName}</h3>
						</div>
						<p className='score-sum'>{this.state[defaultInning].runs || 0} Runs from {this.state[defaultInning].ballCount || 0} Balls </p>
						<p className='score-sum my-0'>{teamWon}</p>
					</Card>
					<div className='flex-around mb-15'>
						{inningTabs.map((tab, index) =>
							<Button
								key={index}
								variant='contained'
								disableElevation
								className={tab['inning' + (index + 1)].active ? 'active-tab' : 'tab'}
								onClick={() => { this.setState({ defaultInning: 'inning' + (index + 1) }); this.toggleActiveInning(index) }}
							>
								{tab['inning' + (index + 1)].name}
							</Button>
						)}
					</div>
					<Card className="card">
						<h3 className="text-blue-bg">Bowling Stats</h3>
						<MuiThemeProvider theme={this.getMuiTheme()}>
							<MUIDataTable
								data={this.state[defaultInning].bowling}
								columns={bowlersColumns}
								options={tableOptions}
							/>
						</MuiThemeProvider>
					</Card>
					<Card className="card">
						<h3 className="text-blue-bg">Batting Stats</h3>
						<MuiThemeProvider theme={this.getMuiTheme()}>
							<MUIDataTable
								data={this.state[defaultInning].batting}
								columns={batsmanColumns}
								options={tableOptions}
							/>
						</MuiThemeProvider>
					</Card>
				</div>
			</div>
		);
	}
}

export default Scorecard;
