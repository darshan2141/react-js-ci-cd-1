import React from 'react';
import {
	Snackbar,
	IconButton,
	Card,
	CardContent,
	Typography,
	InputLabel,
	MenuItem,
	FormControl,
	FormHelperText,
	Select,
	Button,
	ButtonGroup,
	CardActions,
	AppBar,
	Toolbar
} from '@material-ui/core';
import { Close, MenuIcon, ArrowBackRounded, KeyboardArrowUp, KeyboardArrowDown, KeyboardArrowLeft } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab'
import { BYE, STUMPED, RUN_OUT, CATCH, BOWLED, NO_BALL, WIDE_BALL } from '../../common/Messages';
import { sendHttpRequest, isInputEmptyString, BASE_URL, checkIfUserLoggedIn } from '../../common/Common';
import { withStyles } from '@material-ui/core/styles';
import PersistentDrawerRight from '../navBar/nav';
import { NavLink, withRouter } from 'react-router-dom'

const RUN_OUT_NON_STRIKER = 'Non-Striker'
const RUN_OUT_STRIKER = 'Striker'
// const EndMatchButton = withStyles({
// root: {
// background: "#444",
// width: "100%",
// marginTop: "var(--card-margin-S)",
// borderRadius: "4px !important",
// borderRight: "2px solid var(--primary-color) !important",
// borderLeft: "2px solid var(--primary-color)",
// borderBottom: "2px solid var(--primary-color)",
// borderTop: "2px solid var(--primary-color)",
// color: "#fff",
// fontSize: "18px",
// background: 'linear-gradient(45deg, #53CDF6 30%, #53CDF6 90%)',
// },
// label: {
// textTransform: 'capitalize',
// },
// })(Button);

class Scoresheet extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isBallUpdated: true,

			currentInning: "inning1",
			errorAlert: false,
			isFormFeedbackComplete: true,
			isPicked: { striker: true, nonStriker: true, bowler: true },
			informEndInning: false,
			informEndMessage: "",
			showEndMatch: false, // cosider removing
			isMatchOver: false,
			showMenu: false,

			teamAName: '',
			teamBName: '',
			teamARuns: 0,
			teamBRuns: 0,
			maxOvers: 50,
			overs: 0,
			teamAwickets: 0,
			teamBwickets: 0,
			teamABalls: [],
			teamBBalls: [],
			status: "",
			matchId: null,
			teamA: {},
			teamB: {},

			longstTeamName: "",
			longstTeamWidth: "",
			ballSize: "",
			ballsContainerFontSize: "",

			ballersData: [],
			batsmansData: [],

			currentBallTypeStatus: {
				[BYE]: false, [NO_BALL]: false, [RUN_OUT]: { status: false, [RUN_OUT_STRIKER]: false, [RUN_OUT_NON_STRIKER]: false },
				[WIDE_BALL]: false
			},
			ballTypesWAdditionalRuns: [BYE, NO_BALL, WIDE_BALL, RUN_OUT],
			ballTypeWickets: [BOWLED, CATCH, STUMPED],
			wicketTypes: [BOWLED, CATCH, STUMPED, RUN_OUT],
			ballTypeRuns: [0, 1, 2, 3, 4, 6],
			overRuns: [null, null, null, null, null, null],

			seriesId: null,
			inning1: {},
			inning2: {},

			allBatsmen: [],
			allBowlers: [],
			allBowlersStates: {},
			allBatsmenStates: {},
			allBallCount: 0,
			overBallCount: 0,
			overBallCountWExtras: 0,
			isNextBatsmanInPitch: false,
			isBatting: false,
			isBowling: false,
			currentBatsman: { id: null, runs: 0, sixes: 0, fours: 0 },
			nextBatsman: { id: null, runs: 0, sixes: 0, fours: 0 },
			currentBowler: null,
			lastBowler: null,
			batsmanLeftOnPitch: null,

			activeBallType: "",
			currentBall: {
				batsman: null,
				nonStriker: null,
				bowler: null,
				inningId: null,
				matchId: null,
				seriesId: null,
				runs: 0,
				extras: 0,
				wicket: 0,
				wicketType: "",
				runOutType: "",
				ballType: "",
				ballCount: 0,
				ballCountWExtra: 0,
			}
		};

		//	this.handleEndBallNew = this.handleEndBallNew.bind(this);
		this.handleBall = this.handleBall.bind(this);
		this.handleBallTypeWickets = this.handleBallTypeWickets.bind(this);
		this.getMatchDetails = this.getMatchDetails.bind(this);
		this.handleBallTypesWRuns = this.handleBallTypesWRuns.bind(this);
		this.handleBallTypesRuns = this.handleBallTypesRuns.bind(this);
		this.resetCurrentBall = this.resetCurrentBall.bind(this);
		this.resetCurrentBallTypeStatus = this.resetCurrentBallTypeStatus.bind(this);
		this.addBall = this.addBall.bind(this);
		this.updateMatch = this.updateMatch.bind(this);
		this.endInnings = this.endInnings.bind(this);
		this.endMatch = this.endMatch.bind(this);
	}

	componentDidMount() {
		// localStorage.setItem('MatchId', "asdasd");
		// localStorage.getItem('MatchId')
		this.dynamicBallSize(this.state.overRuns);
		this.getMatchDetails();

	}
	async addBall(currentBall) {
		let params = currentBall;

		sendHttpRequest(
			"POST",
			BASE_URL + "/api/ball/",
			null,
			JSON.stringify(params)
		).then((data) => {
			var response = data.data;
			if (response.status === 1) {
				return response.data
			}
		}).catch((error) => {
			console.log(error.response.data.message.message)
		});
	}
	async updateMatch(matchState) {
		// const { currentBallTypeStatus, teamBRuns, teamARuns, teamAwickets, teamBwickets,
		// teamABalls, teamBBalls, tossWon, status, currentBatsman, nextBatsman,
		// currentBowler, lastBowler, overBallCount, overBallCountWExtras, isBatting,
		// isNextBatsmanInPitch, overRuns } = matchState

		let params = matchState
		sendHttpRequest(
			"PUT",
			BASE_URL + "/api/match/" + this.props.match.params.matchId,
			null,
			JSON.stringify(params)
		).then((data) => {
			var response = data.data;
			if (response.status === 1) {
				return response.data;
			}
		});
	}
	updateSeries(seriesState) {
		let params = seriesState
		sendHttpRequest(
			"PUT",
			BASE_URL + "/api/series/" + this.state.seriesId,
			null,
			JSON.stringify(params)
		).then((data) => {
			var response = data.data;
			if (response.status === 1) {
				console.log("match updated successfully")
				console.log(response.data)
			}
		});
	}
	dynamicBallSize(overRuns) {
		// balls dynamic sizing according to num of balls
		const ballsContainer = document.querySelector('.balls-container');
		let cssStyle = window.getComputedStyle(ballsContainer);
		let ballsContainerWidth = cssStyle.width;

		const newBallsContainerFontSize = 90 / overRuns.length
		const newBallsContainerFontSizeInPx = newBallsContainerFontSize + 'px'
		const ballSize = (parseInt(ballsContainerWidth.substring(0, ballsContainerWidth.length - 2)) / overRuns.length) - 6
		const ballSizeInPx = ballSize + 'px'

		this.setState({ ballsContainerFontSize: newBallsContainerFontSizeInPx, ballSize: ballSizeInPx });
	}

	getMatchDetails() {
		sendHttpRequest('GET', BASE_URL + '/api/match/' + this.props.match.params.matchId).then((res) => {
			const data = res.data;
			if (data.status === 1 && data.data != {}) {
				const { currentInning, teamARuns, teamBRuns, overs, teamAwickets,
					teamBwickets, teamABalls, teamBBalls, status,
					matchId, teamA, teamB, inning1,
					inning2, batsmanLeftOnPitch, isBowling, isNextBatsmanInPitch, isBatting, overBallCount, overBallCountWExtras } = data.data
				const seriesId = data.data.series
				const overRuns = data.data.overRuns

				let { currentBatsman, nextBatsman, currentBowler, lastBowler } = this.state
				currentBowler = data.data.currentBowler ? data.data.currentBowler._id : null
				currentBatsman.id = data.data.currentBatsman ? data.data.currentBatsman._id : null
				nextBatsman.id = data.data.nextBatsman
				lastBowler = data.data.lastBowler

				const teamAName = data.data.inning1.battingTeam.name
				const teamBName = data.data.inning2.battingTeam.name

				const longstName = teamAName.length > teamBName.length ?
					teamAName.length : teamBName.length
				const longstWidth = longstName.length + 9;
				const longstWidthInCh = longstWidth + 'ch';
				const currentBall = this.state.currentBall
				currentBall.matchId = data.data._id
				currentBall.seriesId = data.data.series
				currentBall.ballCount = data.data[currentInning].ballCount
				currentBall.ballCountWExtra = data.data[currentInning].ballCountWExtra || data.data[currentInning].ballCount
				// balls dynamic sizing acordint to num of balls
				const ballsContainer = document.querySelector('.balls-container');
				if (ballsContainer) {
					let cssStyle = window.getComputedStyle(ballsContainer);
					let ballsContainerWidth = cssStyle.width;
				}


				this.setState({
					currentInning, currentBall, longstTeamName: longstName, longstTeamWidth: longstWidthInCh,
					teamARuns, teamBRuns, overs, teamAwickets,
					teamBwickets, teamABalls, teamBBalls, status,
					matchId, teamA, teamB, seriesId, inning1, inning2, overRuns, overBallCount, overBallCountWExtras,
					isBowling, isBatting, isNextBatsmanInPitch, currentBowler, lastBowler, nextBatsman, currentBatsman,
					teamBName, teamAName, batsmanLeftOnPitch
				}
				)
				const allBatsmen = this.state[currentInning].allBatsmen
				const allBowlers = this.state[currentInning].allBowlers

				let allBatsmenStates = {}
				let allBowlersStates = {}

				this.state[currentInning].allBatsmen.forEach(batsman => {
					allBatsmenStates[batsman.playerId] = batsman.status
				})

				this.state[currentInning].allBowlers.forEach(bowler => {
					allBowlersStates[bowler.playerId] = bowler
				})

				// allBatsmans.forEach(batsman => {
				// const id = batsman._id
				// allBatsmenStates[id] = { out: false, inPitch: false }
				// })
				// allBowlers.forEach(bowler => {
				// const id = bowler._id
				// allBowlersStates[id] = { ballCount: 0 }
				// })
				let showEndMatch = false
				if (currentInning === 'inning2') {
					showEndMatch = true
				}
				this.setState({ showEndMatch, allBowlersStates, allBatsmenStates, allBowlers, allBatsmen })
			}
		})
	}

	resetCurrentBall(currentBall) {
		const inningId = this.state[this.state.currentInning]._id

		return {
			...currentBall,
			inningId: inningId,
			bowler: null,
			batsman: null,
			nonStriker: null,
			ballType: "",
			wicket: 0,
			runs: 0,
			extras: 0,
		}
	}

	async handleBallTypesRuns(type) {
		const ballTypes = [];
		let inning = this.state[this.state.currentInning]
		let { batsmanLeftOnPitch, lastBowler, allBatsmenStates, isBowling, currentBallTypeStatus, currentBowler, currentBatsman, nextBatsman,
			overBallCount, currentBall, overRuns, isBatting, isNextBatsmanInPitch, overBallCountWExtras, teamAwickets, teamBwickets,
			teamBRuns, teamARuns, teamBBalls, teamABalls, tossWon
		} = this.state

		currentBall = this.resetCurrentBall(currentBall);

		currentBall.batsman = currentBatsman.id
		currentBall.nonStriker = nextBatsman.id
		currentBall.bowler = currentBowler
		currentBall.ballType = 'NORMAL-BALL'
		currentBall.runOutType = 'NONE'
		currentBall.wicketType = 'NONE'

		if (overBallCountWExtras === 0) {
			overRuns = [null, null, null, null, null, null]
			this.dynamicBallSize(overRuns)
		}

		if (currentBallTypeStatus[BYE]) {
			ballTypes.push('B');
			currentBall.runs += type;
			currentBall.extras += type;
		} else {
			currentBall.runs += type
		}

		if (currentBallTypeStatus[NO_BALL]) {
			ballTypes.push('N');
			overBallCount -= 1;
			this.handleExtras(currentBall, NO_BALL, type)
		}
		else if (currentBallTypeStatus[WIDE_BALL]) {
			ballTypes.push('W');
			overBallCount -= 1;
			this.handleExtras(currentBall, WIDE_BALL, type)
		}

		if (currentBallTypeStatus[RUN_OUT].status) {
			ballTypes.push('R')
			currentBall.wicketType = 'RUN-OUT';
			currentBall.wicket = 1;
			isNextBatsmanInPitch = false
			isBatting = false;
			if (currentBallTypeStatus[RUN_OUT][RUN_OUT_STRIKER]) {
				currentBall.runOutType = 'STRIKER'
				allBatsmenStates[currentBatsman.id].out = true
				allBatsmenStates[currentBatsman.id].inPitch = false
				batsmanLeftOnPitch = nextBatsman.id
				currentBatsman.id = null;
			}
			else {
				currentBall.runOutType = 'NON-STRIKER'
				allBatsmenStates[nextBatsman.id].out = true
				allBatsmenStates[nextBatsman.id].inPitch = false
				batsmanLeftOnPitch = currentBatsman.id
				nextBatsman.id = null;
			}
		}


		overRuns[overBallCountWExtras] = ballTypes.join("") + type
		overBallCount += 1;
		overBallCountWExtras += 1;
		currentBall.ballCount += 1
		currentBall.ballCountWExtra += 1

		// handling inning runs
		inning.runs += currentBall.runs
		inning.extras += currentBall.extras
		inning.ballCount = currentBall.ballCount
		inning.ballCountWExtra = currentBall.ballCountWExtra

		if (overRuns.length > 6) {
			this.dynamicBallSize(overRuns)
		}
		if (overBallCount === 6) {
			[currentBatsman, nextBatsman] = this.swapBatsmen(currentBatsman, nextBatsman)
			overBallCountWExtras = 0;
			overBallCount = 0;
			isBowling = false
			lastBowler = currentBowler
			currentBowler = null
		}
		if (type % 2 !== 0) {
			[currentBatsman, nextBatsman] = this.swapBatsmen(currentBatsman, nextBatsman)
		}

		currentBallTypeStatus = this.resetCurrentBallTypeStatus()

		let newMatchState = {
			teamARuns: teamARuns,
			teamBRuns: teamBRuns,
			teamAwickets: teamAwickets,
			teamBwickets: teamBwickets,
			teamABalls: teamABalls,
			teamBBalls: teamBBalls,
			tossWon: tossWon,
			currentBatsman: currentBatsman.id,
			nextBatsman: nextBatsman.id,
			currentBowler: currentBowler,
			lastBowler: lastBowler,
			batsmanLeftOnPitch: batsmanLeftOnPitch,
			overBallCount: overBallCount,
			overBallCountWExtras: overBallCountWExtras,
			overRuns: overRuns,
			isBatting: isBatting,
			isBowling: isBowling,
			isNextBatsmanInPitch: isNextBatsmanInPitch,
			currentBallTypeStatus: currentBallTypeStatus
		};

		if (this.state.currentInning == "inning2") {
			if ((this.state.inning1.runs - inning.runs + 1) < 1) {
				await this.setState({ isMatchOver: true })
			}
		}
		await this.setState({ isBallUpdated: false })
		await this.updateMatch(newMatchState)
		await this.addBall(currentBall)
		this.setState({
			batsmanLeftOnPitch, lastBowler, allBatsmenStates, isNextBatsmanInPitch, isBatting, currentBallTypeStatus,
			[inning]: inning, currentBatsman, nextBatsman, overBallCountWExtras, overBallCount, currentBall, overRuns, isBowling,
			currentBowler
		}, () => { this.setState({ isBallUpdated: true }) })
	}

	handleExtras(currentBall, extraType, runs) {
		currentBall.ballCount -= 1;
		currentBall.runs += 1;
		switch (extraType) {
			case (WIDE_BALL):
				currentBall.ballType = 'WIDE-BALL'
				currentBall.extras += (1 + runs);
				break;
			case (NO_BALL):
				currentBall.ballType = 'NO-BALL'
				currentBall.extras += 1
				break;
		}
	}
	resetCurrentBallTypeStatus() {
		return {
			[NO_BALL]: false,
			[BYE]: false,
			[WIDE_BALL]: false,
			[RUN_OUT]: { status: false, [RUN_OUT_NON_STRIKER]: false, [RUN_OUT_STRIKER]: false }
		}
	}

	handleBallTypesWRuns(type) {
		const currentBallTypeStatus = this.state.currentBallTypeStatus
		let inning = this.state[this.state.currentInning]
		// if (inning.wickets === 9 || inning.ballCount === ((this.state.overs) * 6)) {
		// return
		// }
		switch (type) {
			case RUN_OUT_NON_STRIKER:
			case RUN_OUT_STRIKER:
				inning.wickets += 1
				currentBallTypeStatus[RUN_OUT].status = true
				currentBallTypeStatus[RUN_OUT][type] = true
				this.setState({ [this.state.currentInning]: inning, currentBallTypeStatus })
				break
			case NO_BALL:
			case WIDE_BALL:
			case BYE:
				currentBallTypeStatus[type] = true
				this.setState({ currentBallTypeStatus })
				break
			default:

		}
	}
	async handleBallTypeWickets(type) {
		let inning = this.state[this.state.currentInning]
		// let isBowling = true (consider if any err)
		let { tossWon, teamARuns, teamBRuns, teamAwickets, teamBwickets, teamABalls, teamBBalls, lastBowler, overRuns, overBallCount, overBallCountWExtras, allBatsmenStates,
			currentBatsman, currentBall, currentBallTypeStatus, isBatting,
			isBowling, batsmanLeftOnPitch, currentBowler, nextBatsman, isNextBatsmanInPitch
		} = this.state

		currentBall = this.resetCurrentBall(currentBall);

		currentBall.batsman = currentBatsman.id
		currentBall.nonStriker = nextBatsman.id
		currentBall.bowler = currentBowler
		currentBall.ballType = 'NORMAL-BALL'

		const ballTypes = [];

		if (overBallCountWExtras === 0) {
			overRuns = [null, null, null, null, null, null]
			this.dynamicBallSize(overRuns)
		}
		if (currentBallTypeStatus[WIDE_BALL]) {
			ballTypes.push('W')
			overBallCount -= 1
			currentBall.ballType = 'WIDE-BALL'
			currentBall.runOutType = 'NONE'
			currentBall.extras += 1
			currentBall.runs += 1
			currentBall.ballCount -= 1
		}


		ballTypes.push(type.substring(0, 1))
		overRuns[overBallCountWExtras] = ballTypes.join("")
		// currentBall.batsmanRuns = 0
		currentBall.runs += 0
		currentBall.ballCount += 1
		currentBall.wicket = 1
		overBallCountWExtras += 1
		overBallCount += 1


		if (overRuns.length > 5) {
			this.dynamicBallSize(overRuns)
		}

		if (overBallCount === 6) {
			[currentBatsman, nextBatsman] = this.swapBatsmen(currentBatsman, nextBatsman)
			overBallCountWExtras = 0;
			overBallCount = 0;
			isBowling = false
			lastBowler = currentBowler
			currentBowler = null;

			isNextBatsmanInPitch = false
			allBatsmenStates[nextBatsman.id].out = true;
			allBatsmenStates[nextBatsman.id].inPitch = false;
			batsmanLeftOnPitch = type !== CATCH ? null : currentBatsman.id
			nextBatsman.id = null
		} else {
			allBatsmenStates[currentBatsman.id].out = true;
			allBatsmenStates[currentBatsman.id].inPitch = false;
			batsmanLeftOnPitch = type !== CATCH ? null : nextBatsman.id
			currentBatsman.id = null
			isBatting = false;
		}

		switch (type) {
			case (CATCH):
				currentBall.wicketType = "CATCHED"
				isNextBatsmanInPitch = false
				isBatting = false
				break
			case (STUMPED):
				currentBall.wicketType = "STUMPED"
				break
			case (BOWLED):
				currentBall.wicketType = "BOWLED"
				break
		}
		currentBall.ballCountWExtra += 1
		inning.wickets += currentBall.wicket
		inning.ballCount = currentBall.ballCount
		inning.ballCountWExtra = currentBall.ballCountWExtra

		currentBallTypeStatus[WIDE_BALL] = false

		let newMatchState = {
			teamARuns: teamARuns,
			teamBRuns: teamBRuns,
			teamAwickets: teamAwickets,
			teamBwickets: teamBwickets,
			teamABalls: teamABalls,
			teamBBalls: teamBBalls,
			tossWon: tossWon,
			currentBatsman: currentBatsman.id,
			nextBatsman: nextBatsman.id,
			currentBowler: currentBowler,
			lastBowler: lastBowler,
			batsmanLeftOnPitch: batsmanLeftOnPitch,
			overBallCount: overBallCount,
			overBallCountWExtras: overBallCountWExtras,
			overRuns: overRuns,
			isBatting: isBatting,
			isBowling: isBowling,
			isNextBatsmanInPitch: isNextBatsmanInPitch,
			currentBallTypeStatus: currentBallTypeStatus
		};

		await this.updateMatch(newMatchState)
		await this.addBall(currentBall)

		this.setState({
			lastBowler, isNextBatsmanInPitch, currentBowler, isBowling, isBatting, currentBall,
			overBallCountWExtras, overBallCount, overRuns, currentBatsman,
			allBatsmenStates, [inning]: inning, currentBallTypeStatus, nextBatsman, batsmanLeftOnPitch
		})

	}

	handleLastBallWicketBatsmanPos(currentBatsman, nextBatsman, pos_batsman, isOver) {

		let { allBatsmenStates, isNextBatsmanInPitch, isBatting } = this.state
		if (isOver) {
			if (pos_batsman === 'STRIKER') {
				[currentBatsman, nextBatsman] = this.swapBatsmen(currentBatsman, nextBatsman)
				isNextBatsmanInPitch = false
				allBatsmenStates[nextBatsman.id].out = true;
				allBatsmenStates[nextBatsman.id].inPitch = false;
				nextBatsman.id = null
				return { currentBatsman, nextBatsman, isNextBatsmanInPitch, isBatting, allBatsmenStates }
			}
			if (pos_batsman === 'NON-STRIKER') {
				allBatsmenStates[currentBatsman.id].out = true;
				allBatsmenStates[currentBatsman.id].inPitch = false;
				currentBatsman.id = null
				isBatting = false;
				return { currentBatsman, nextBatsman, isNextBatsmanInPitch, isBatting, allBatsmenStates }
			}
		}
		if (!isOver) {
			if (pos_batsman === 'STRIKER') {
				allBatsmenStates[currentBatsman.id].out = true;
				allBatsmenStates[currentBatsman.id].inPitch = false;
				currentBatsman.id = null
				isBatting = false;
				return { currentBatsman, nextBatsman, isNextBatsmanInPitch, isBatting, allBatsmenStates }
			}
			if (pos_batsman === 'NON-STRIKER') {
				allBatsmenStates[currentBatsman.id].out = true;
				allBatsmenStates[currentBatsman.id].inPitch = false;
				currentBatsman.id = null
				isBatting = false;
				return { currentBatsman, nextBatsman, isNextBatsmanInPitch, isBatting, allBatsmenStates }
			}
		}
	}

	swapBatsmen(batsman_1, batsman_2) {
		let tempBatsman = batsman_1;
		batsman_1 = batsman_2;
		batsman_2 = tempBatsman;
		return [batsman_1, batsman_2]
	}

	async handleBall(type) {
		// this.dynamicBallSize()
		let { batsmanLeftOnPitch, overs, currentInning, errorAlert, isFormFeedbackComplete,
			isPicked, currentBatsman, nextBatsman, currentBowler, inning1, inning2 } = this.state

		const inning = this.state[currentInning]

		if (this.state.currentBall.ballCountWExtra === 1 && currentInning === "inning1") {
			this.updateSeries({ status: "STARTED" })
		}
		if (inning.ballCount === 6 * overs) {
			return this.setState({ informEndInning: true, informEndMessage: "No more overs left" })
		}
		if (inning.wickets === 10) {
			return this.setState({ informEndInning: true, informEndMessage: "No more batsman left" })
		}
		if (this.state.isMatchOver) {
			return this.setState({
				informEndInning: true, informEndMessage: `End of Match: ${inning2.battingTeam.teamName} 
					won the match`})
		}

		if (!currentBowler || !currentBatsman.id || !nextBatsman.id) {
			errorAlert = true
			isFormFeedbackComplete = false
			if (!currentBowler)
				isPicked.bowler = false
			if (!currentBatsman.id)
				isPicked.striker = false
			if (!nextBatsman.id)
				isPicked.nonStriker = false
			return this.setState({ errorAlert, isFormFeedbackComplete, isPicked })
		}


		if (!this.state.isBatting) {
			await this.setState({ isBatting: true })
		}
		if (!this.state.isNextBatsmanInPitch) {
			await this.setState({ isNextBatsmanInPitch: true })
		}
		if (!this.state.isBowling) {
			await this.setState({ isBowling: true })
		}

		if (batsmanLeftOnPitch) {
			batsmanLeftOnPitch = null
			await this.setState(batsmanLeftOnPitch)
		}
		// if (this.state.wicketTypes.includes(type)) {
		// await this.setState({ isBatting: false });
		// }
		switch (type) {
			case NO_BALL:
			case RUN_OUT_STRIKER:
			case RUN_OUT_NON_STRIKER:
			case WIDE_BALL:
			case BYE:
				this.handleBallTypesWRuns(type);
				break
			case BOWLED:
			case STUMPED:
			case CATCH:
				await this.handleBallTypeWickets(type);
				break
			case 0:
			case 1:
			case 2:
			case 3:
			case 4:
			case 6:
				await this.handleBallTypesRuns(type)
		}
		let allBallCount = this.state.allBallCount + 1
		// const activeBallType = type
		type === RUN_OUT_NON_STRIKER || type === RUN_OUT_STRIKER ? this.setState({ allBallCount, activeBallType: RUN_OUT }) :
			this.setState({ allBallCount, activeBallType: type })
		// this.setState({ currentBall: { runs: 0, extras: 0 } })
		// this.dynamicBallSize()
	}
	resetOnOver() {
		let currentBatsman = this.state.currentBatsman
		let nextBatsman = this.state.nextBatsman
	}
	resetStateToInning2() {
		return {
			currentInning: "inning2",
			isBatting: false,
			isBowling: false,
			errorAlert: false,
			isFormFeedbackComplete: true,
			isPicked: {
				striker: true, nonStriker: true,
				bowler: true
			},
			informEndInning: false,
			showEndMatch: true,
			overRuns: [null, null, null, null, null, null],
			currentBallTypeStatus: {
				[BYE]: false, [NO_BALL]: false, [RUN_OUT]: { status: false, [RUN_OUT_STRIKER]: false, [RUN_OUT_NON_STRIKER]: false },
				[WIDE_BALL]: false
			},
			allBowlersStates: {},
			allBatsmenStates: {},
			allBallCount: 0,
			overBallCount: 0,
			overBallCountWExtras: 0,
			isNextBatsmanInPitch: false,
			currentBatsman: { id: null, runs: 0, sixes: 0, fours: 0 },
			nextBatsman: { id: null, runs: 0, sixes: 0, fours: 0 },
			currentBowler: null,
			lastBowler: null,

			activeBallType: "",
			currentBall: {
				...this.state.currentBall,
				batsman: null,
				nonStriker: null,
				bowler: null,
				inningId: null,
				runs: 0,
				extras: 0,
				wicket: 0,
				wicketType: "",
				runOutType: "",
				ballType: "",
				ballCount: 0,
				ballCountWExtra: 0,
			}

		}
	}
	async endInnings() {

		// if(this.state[this.state.currentInning].wickets !== 10 && this.state.overs*6 !== this.state[this.state.currentInning].ballCount) {
		// return alert("can't end inning")
		// }

		let { nextBatsman, currentInning, isBatting, isBowling, errorAlert, isFormFeedbackComplete,
			isPicked, informEndInning, showEndMatch, overRuns, currentBallTypeStatus,
			allBallCount, overBallCount, overBallCountWExtras, isNextBatsmanInPitch, currentBatsman, lastBowler, activeBallType,
			currentBowler, currentBall } = this.resetStateToInning2()


		await this.setState({
			showEndMatch: true, nextBatsman, currentInning, isBatting, isBowling, errorAlert, isFormFeedbackComplete,
			isPicked, informEndInning, showEndMatch, overRuns, currentBallTypeStatus,
			allBallCount, overBallCount, overBallCountWExtras, isNextBatsmanInPitch, currentBatsman, lastBowler, activeBallType,
			currentBall
		})

		const matchData = {
			nextBatsman: nextBatsman.id, currentInning, isNextBatsmanInPitch, isBowling, isBatting, overRuns,
			overBallCount, overBallCountWExtras, currentBatsman: currentBatsman.id, lastBowler, currentBowler
		}

		let newMatch = await this.updateMatch(matchData)
		this.getMatchDetails()
		// sendHttpRequest('POST', 'https://fieldr-indoor-dev.herokuapp.com/api/').then((data) => {
		// if (data.data.status === 1) {
		// this.setState({ showEndMatch: true });
		// }
		// });
	}

	async endMatch() {
		const matchData = {
			status: "COMPLETE"
		}
		await this.updateMatch(matchData);
		this.props.history.push('/match/' + this.props.match.params.matchId)
	}

	minusToZero = num => {
		if (num < 0)
			return 0
		return num
	}


	render() {
		const { currentInning, overs, inning1, inning2 } = this.state;
		const { isFormFeedbackComplete, isPicked, lastBowler, isBatting, isBowling, nextBatsman, currentBatsman, currentBowler, showEndMatch, allBatsmenStates } = this.state;

		const { teamAName, teamBName, allBatsmen, allBowlers, isBallUpdated, batsmanLeftOnPitch, informEndInning, errorAlert,
			ballsContainerFontSize, isNextBatsmanInPitch, currentBallTypeStatus, ballSize,
			activeBallType, ballTypeRuns, ballTypeWickets, overRuns, runs } = this.state

		// custom nav bar
		const useStyles = makeStyles((theme) => ({
			root: {
				flexGrow: 1,
			},
			menuButton: {
				marginRight: theme.spacing(2),
			},
			title: {
				flexGrow: 1,
			},
		}));

		const handleBack = () => {
			this.props.history.push(`/matches`)
		}
		const handleMenu = () => {
			this.setState({ showMenu: !this.state.showMenu })
		}
		const ButtonAppBar = () => {
			const classes = useStyles();

			return (
				<div className={"app-bar"}>
					<AppBar position="static" style={{ backgroundColor: "var(--primary-color-600)" }}>
						<Toolbar>
							<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu"
								onClick={() => handleBack()}>
								<ArrowBackRounded />
							</IconButton>
							<Typography variant="h6" style={{ textAlign: "center", fontFamily:"DM Sans", fontWeight: "600"}} className={classes.title}>
								Scoresheet
							</Typography>
							<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu"
								onClick={() => handleMenu()}>
								{this.state.showMenu ? (<KeyboardArrowUp />) : (<KeyboardArrowDown />)}
							</IconButton>
						</Toolbar>
					</AppBar>
				</div>
			);
		}


		let matchSum;
		if (currentInning === "inning2") {
			matchSum = `${this.minusToZero(inning1.runs - inning2.runs + 1)} Runs required from ${overs * 6 - inning2.ballCount} Balls`
		} else {
			matchSum = `${inning1.runs} Runs from ${inning1.ballCount} Balls`
		}

		return (
			<div>
				<ButtonAppBar />
				<div className="app-container">
					<div>
						<Snackbar
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'center',
							}}
							open={errorAlert}
							autoHideDuration={10000}
							onClose={(e) => this.setState({ errorAlert: false })}
						>
							<Alert onClose={(e) => this.setState({ errorAlert: false })} severity="error">
								<strong>Error: </strong>Required fields missing!
							</Alert>
						</Snackbar>
					</div>
					<div>
						<Snackbar
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'center',
							}}
							open={informEndInning}
							autoHideDuration={10000}
							onClose={(e) => this.setState({ informEndInning: false })}
						>
							<Alert onClose={(e) => this.setState({ informEndInning: false })} severity="info">
								<strong>INFO: </strong>{this.state.informEndMessage}
							</Alert>
						</Snackbar>
					</div>
					<div>
						<Card className="scoresheetcard">
							<div className='flex-between mb-15'>
								<h3 className='score-sum my-0 me-15' style={{ width: 'max-content' }}>
									{this.state[currentInning].runs || '000'}&nbsp;/&nbsp;{this.state[currentInning].wickets || 0}
								</h3>
								<div className="score-sum flex-between">
									<h3 className='my-0'>{teamAName}</h3>
									<h4 className='my-1'>Vs</h4>
									<h3 className='my-0'>{teamBName}</h3>
								</div>
							</div>
							<div className='flex-between'>
								<p className='score-sum my-0 me-15' style={{ width: 'max-content' }}>
									Overs:{(Math.floor(this.state[currentInning].ballCount / 6)) || 0}.{this.state[currentInning].ballCount % 6}
								</p>
								<div style={{ fontSize: ballsContainerFontSize }} className="balls-container">
									{overRuns.map((run, index) =>
										<div key={index} style={{ width: ballSize, height: ballSize }}
											className={overRuns[index] !== null ? "balls balls-with-runs" : "balls"}>
											<span>{overRuns[index] !== null ? overRuns[index] : ""}</span>
										</div>
									)}
								</div>
							</div>
							<p className="score-sum">{matchSum}</p>
						</Card>
						<Card className={[this.state.showMenu ? ("card-expand") : ("card-shrink"),
						!isFormFeedbackComplete ? "card shake" : "card"]}
							style={{ borderRadius: "15px" }}>
							<CardContent style={{ display: "flex", flexDirection: "column" }}>
								<FormControl className="mb-15" variant="outlined"
									style={{ minWidth: 160 }}
									error={!isPicked.striker} disabled={isBatting}>
									<InputLabel>Pick Striker*</InputLabel>
									<Select
										label="Pick Striker"
										value={currentBatsman.id || ""}
										onChange={(e) => {
											const allBatsmenStates = this.state.allBatsmenStates;
											const currentBatsman = this.state.currentBatsman;
											const nextBatsman = this.state.nextBatsman;
											let isPicked = this.state.isPicked
											let isFormFeedbackComplete = this.state.isFormFeedbackComplete
											if (!isPicked.striker) {
												isPicked.striker = true
											}
											if (nextBatsman.id == e.target.value) {
												nextBatsman.id = null;
											}
											if (this.state[currentInning].ballCountWExtra > 0 &&
												batsmanLeftOnPitch && e.target.value !== batsmanLeftOnPitch) {
												nextBatsman.id = batsmanLeftOnPitch
											}
											isFormFeedbackComplete = true
											currentBatsman.id = e.target.value
											allBatsmenStates[e.target.value].inPitch = true;
											this.setState({
												isFormFeedbackComplete, isPicked,
												nextBatsman, currentBatsman, allBatsmenStates
											})
										}}
										onOpen={() => {
											let isPicked = this.state.isPicked
											if (!isPicked.striker) {
												isPicked.striker = true
											}
											let isFormFeedbackComplete = true;
											this.setState({ isPicked, isFormFeedbackComplete })
										}}
									>
										{
											allBatsmen.filter((batsman) => {
												if (isNextBatsmanInPitch)
													return !allBatsmenStates[batsman.playerId].out && nextBatsman.id !== batsman.playerId
												if (!isNextBatsmanInPitch)
													return !allBatsmenStates[batsman.playerId].out
											}).map((filteredBatsman) => {
												return (<MenuItem key={filteredBatsman.playerId + "next"}
													value={filteredBatsman.playerId || ""}>
													{filteredBatsman.player.firstName} {filteredBatsman.player.lastName}
												</MenuItem>)
											})
										}
									</Select>
									<FormHelperText>{!isPicked.striker ? "Select a Batter*" : ""}</FormHelperText>
								</FormControl>
								<FormControl className="mb-15 text-primary" variant="outlined"
									style={{ minWidth: 160 }}
									error={!isPicked.nonStriker} disabled={isNextBatsmanInPitch}>
									<InputLabel className="mb-15 text-primary" >Pick Non-Striker*</InputLabel>
									<Select
										label="Pick Non-Striker"
										className="mb-15 text-primary" 
										value={nextBatsman.id || ""}
										onChange={(e) => {
											const allBatsmenStates = this.state.allBatsmenStates;
											const nextBatsman = this.state.nextBatsman;
											const currentBatsman = this.state.currentBatsman
											let isPicked = this.state.isPicked
											let isFormFeedbackComplete = this.state.isFormFeedbackComplete
											if (!isPicked.nonStriker) {
												isPicked.nonStriker = true
											}

											if (this.state[currentInning].ballCountWExtra > 0 &&
												batsmanLeftOnPitch) {
												currentBatsman.id = batsmanLeftOnPitch;
											}
											isFormFeedbackComplete = true
											nextBatsman.id = e.target.value
											allBatsmenStates[e.target.value].inPitch = true;
											this.setState({
												isFormFeedbackComplete,
												isPicked,
												nextBatsman,
												allBatsmenStates
											})
										}}
										onOpen={() => {
											let isPicked = this.state.isPicked
											if (!isPicked.nonStriker) {
												isPicked.nonStriker = true
											}
											let isFormFeedbackComplete = true;
											this.setState({ isPicked, isFormFeedbackComplete })
										}}
									>
										{
											allBatsmen.filter((batsman) => {
												return !allBatsmenStates[batsman.playerId].out && currentBatsman.id !== batsman.playerId
											}).map((filteredBatsman) => {
												return (<MenuItem key={filteredBatsman.playerId + "next"}
													value={filteredBatsman.playerId || ""}>
													{filteredBatsman.player.firstName} {filteredBatsman.player.lastName}
												</MenuItem>)
											})
										}
									</Select>
									<FormHelperText className='text-primary'>{!isPicked.nonStriker ? "Select a Batter*" : ""}</FormHelperText>
								</FormControl>
								<FormControl error={!isPicked.bowler} variant="outlined" disabled={isBowling}>
									<InputLabel>Pick Bowler*</InputLabel>
									<Select
										label="Pick Bowler"
										value={currentBowler || ""}
										onChange={(e) => {
											let isPicked = this.state.isPicked
											let isFormFeedbackComplete = this.state.isFormFeedbackComplete
											if (!isPicked.bowler) {
												isPicked.bowler = true
											}
											isFormFeedbackComplete = true
											this.setState({
												isFormFeedbackComplete,
												isPicked,
												currentBowler: e.target.value
											})
										}
										}
										onOpen={() => {
											let isPicked = this.state.isPicked
											if (!isPicked.bowler) {
												isPicked.bowler = true
											}
											let isFormFeedbackComplete = true;
											this.setState({ isPicked, isFormFeedbackComplete })
										}}
									>
										{allBowlers.filter((bowler) => {
											return lastBowler !== bowler.playerId
										}).map((bowler) => {
											return <MenuItem key={bowler.playerId} value={bowler.playerId || ""}>
												{bowler.player.firstName} {bowler.player.lastName}
											</MenuItem>
										})}
									</Select>
									<FormHelperText className='text-primary'>{!isPicked.bowler ? "Select a Bowler*" : ""}</FormHelperText>
								</FormControl>
							</CardContent>
						</Card>
						<Card  className="card">
							<CardContent style={{ padding: "0" }}>
								<CardActions className="flex-center-vertical">
									<ButtonGroup className="button-group-balls ">
										<Button
											className={[activeBallType === NO_BALL ? "active-disabled no-ball-active" : "button-scorescheme",
											currentBallTypeStatus[NO_BALL] ? "no-ball-active" : ""]}
											onClick={() => this.handleBall(NO_BALL)}
											disabled={!isBallUpdated || activeBallType === BYE || activeBallType === NO_BALL || activeBallType === WIDE_BALL ||
												activeBallType === RUN_OUT}>{NO_BALL}</Button>

										<Button
											className={[activeBallType === WIDE_BALL ? "active-disabled wide-ball-active" : "",
											currentBallTypeStatus[WIDE_BALL] ? "wide-ball-active" : ""]}
											onClick={() => this.handleBall(WIDE_BALL)}
											disabled={!isBallUpdated || activeBallType === BYE ||
												activeBallType === NO_BALL || activeBallType === WIDE_BALL ||
												activeBallType === RUN_OUT}>
											{WIDE_BALL}</Button>

										<Button
											className={activeBallType === BYE ? "bye-active-disabled" : ""}
											onClick={() => this.handleBall(BYE)}
											disabled={!isBallUpdated || activeBallType === BYE || activeBallType === WIDE_BALL ||
												activeBallType === RUN_OUT}>{BYE}</Button>
									</ButtonGroup>
									<ButtonGroup className="button-group-balls-runout">
										<Button
											variant='contained'
											className={"label-disabled"}
											onClick={() => this.handleBall(RUN_OUT)}
											disabled={true}>{RUN_OUT}:</Button>
										<Button
											className={currentBallTypeStatus[RUN_OUT][RUN_OUT_STRIKER] ? "runout-active-disabled" : ""}
											onClick={() => this.handleBall(RUN_OUT_STRIKER)}
											disabled={!isBallUpdated || activeBallType === RUN_OUT}>Striker</Button>

										<Button
											className={currentBallTypeStatus[RUN_OUT][RUN_OUT_NON_STRIKER] ? "runout-active-disabled" : ""}
											onClick={() => this.handleBall(RUN_OUT_NON_STRIKER)}
											disabled={!isBallUpdated || activeBallType === RUN_OUT}>N-Striker</Button>
									</ButtonGroup>
									<ButtonGroup className="button-group-balls button-group-ball-type-runs">
										{ballTypeRuns.slice(0, 3).map((type, index) =>
											<Button disabled={!isBallUpdated} key={index} onClick={() => this.handleBall(type)}>{type}</Button>
										)}
									</ButtonGroup>
									<ButtonGroup className="button-group-balls button-group-ball-type-runs">
										{ballTypeRuns.slice(3, 6).map((type, index) =>
											<Button disabled={!isBallUpdated} key={index} onClick={() => this.handleBall(type)}>{type}</Button>
										)}
									</ButtonGroup>
									<ButtonGroup className="button-group-balls">
										{ballTypeWickets.map((type, index) =>
											type !== STUMPED ?
												(<Button key={index} onClick={() => this.handleBall(type)}
													disabled={!isBallUpdated ||
														activeBallType === WIDE_BALL || activeBallType === RUN_OUT ||
														activeBallType === NO_BALL || currentBallTypeStatus[BYE]}>{type}</Button>) :
												(<Button key={index} onClick={() => this.handleBall(type)}
													disabled={!isBallUpdated ||
														activeBallType === RUN_OUT || activeBallType === NO_BALL ||
														currentBallTypeStatus[BYE]}>{type}</Button>)
										)}
									</ButtonGroup>
									<div className="end-game">
										{showEndMatch === false ?
											(<Button disabled={this.state[currentInning].ballCount !== overs * 6 &&
												this.state[currentInning].wickets !== 10}
												className={this.state[currentInning].ballCount !== overs * 6 &&
													this.state[currentInning].wickets !== 10 ?
													"button-end-match button-end-match-disabled" : "button-end-match"}
												onClick={() => this.endInnings()}>End Innings</Button>) :
											(<Button disabled={this.state[currentInning].ballCount !== overs * 6 &&
												this.state[currentInning].wickets !== 10 && !this.state.isMatchOver}
												className={this.state[currentInning].ballCount !== overs * 6 &&
													this.state[currentInning].wickets !== 10 ?
													"button-end-match button-end-match-disabled" : "button-end-match"}
												onClick={() => this.endMatch()}>End Match</Button>)}
									</div>
								</CardActions>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		);
	}
}

export default Scoresheet;
