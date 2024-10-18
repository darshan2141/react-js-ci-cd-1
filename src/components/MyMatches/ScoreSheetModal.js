import React, { useEffect, useState } from "react";
import Header from "../CustomMUI/Header";
import Style from "./ScoreSheetModal.module.css";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import CoinIcon from "../../assets/images/svg/toass.svg";
import { CustomCardButton } from "../CustomMUI/CustomSmallButton";
import Ball from "../../assets/images/score/Ball.svg";
import CircleGreen from "../../assets/images/score/circle_green.svg";
import Stumps from "../../assets/images/score/Stumps.svg";
import Undo from "../../assets/images/score/Undo.svg";
import CustomWicketSelectBottomSheet from "./CustomWicketSelectBottomSheet";
import CustomNextBatterBottomSheet from "./CustomNextBatterBottomSheet";
import CustomNextBowlerBottomSheet from "./CustomNextBowlerBottomSheet";
import { BASE_URL, sendHttpRequest } from "../../common/Common";
import { toast } from "react-toastify";

const BYE = 'Bye';
const NO_BALL = 'No ball';
const RUN_OUT = 'Run out';
const WIDE_BALL = 'Wide ball';
const BOWLED = 'Bowled';
const CATCH = 'Caught';
const STUMPED = 'Stumped';
const LBW = 'LBW';
const HIT_WICKET = 'Hit wicket';
const RETIRED = 'Retired';
const TIME_OUT = 'Timed out';
const RUN_OUT_STRIKER = 'RUN_OUT_STRIKER';
const RUN_OUT_NON_STRIKER = 'RUN_OUT_NON_STRIKER';

export default function ScoreSheetModal({ setIsShow, selectedMatch }) {
  const [showWicket, setShowWicket] = useState(false);
  const [showNextBatter, setShowNextBatter] = useState(false);
  const [showNextBowler, setShowNextBowler] = useState(false);
  const [selectedWicket, setSelectedWicket] = useState("");
  const [nextBatter, setNextBatter] = useState("");
  const [nextBowler, setNextBowler] = useState("");

  const [state, setState] = useState({
    isBallUpdated: true,
    currentInning: "inning1",
    errorAlert: false,
    isFormFeedbackComplete: true,
    isPicked: { striker: true, nonStriker: true, bowler: true },
    informEndInning: false,
    informEndMessage: "",
    showEndMatch: false,
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
    currentBatsman: {},
    nextBatsman: {},
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
  });

  useEffect(() => {
    console.log("selectedMatch?._id ==>", selectedMatch?._id);
    getMatchDetails();
  }, [selectedMatch?._id])

  useEffect(() => {
    console.log(state);
  }, [state])

  useEffect(() => {
    if (showNextBowler) {
      console.log(showNextBowler)
    }
  }, [showNextBowler])

  const getMatchDetails = async () => {
    try {
      const matchId = selectedMatch?._id;
      const response = await sendHttpRequest('GET', `${BASE_URL}/api/match/${matchId}`);
      const data = response.data;

      if (data.status === 1 && data.data) {
        const {
          currentInning, teamARuns, teamBRuns, overs, teamAwickets,
          teamBwickets, teamABalls, teamBBalls, status,
          matchId, teamA, teamB, inning1,
          inning2, batsmanLeftOnPitch, isBowling, isNextBatsmanInPitch, isBatting, overBallCount, overBallCountWExtras,
        } = data.data;

        const seriesId = data.data.series;
        const overRuns = data.data.overRuns;

        const teamAName = data.data[currentInning].battingTeam.name;
        const teamBName = data.data[currentInning].bowlingTeam.name;

        const longestName = Math.max(teamAName.length, teamBName.length);
        const longestWidth = longestName + 9;
        const longestWidthInCh = longestWidth + 'ch';

        const currentBall = {
          ...state.currentBall,
          matchId: data.data._id,
          seriesId: data.data.series,
          ballCount: data.data[currentInning].ballCount,
          ballCountWExtra: data.data[currentInning].ballCountWExtra || data.data[currentInning].ballCount,
        };

        let currentBatsman = data?.data?.currentBatsman && { ...data?.data?.currentBatsman, otherData: data.data[currentInning].allBatsmen.find((batsman) => batsman.playerId === data.data?.currentBatsman?._id) }
        let nextBatsman = data?.data?.nextBatsman && { ...data?.data?.nextBatsman, otherData: data.data[currentInning].allBatsmen.find((batsman) => batsman.playerId === data.data?.nextBatsman?._id) }
        let currentBowler = data?.data?.currentBowler && { ...data?.data?.currentBowler, otherData: data.data[currentInning].allBowlers.find((batsman) => batsman.playerId === data.data?.currentBowler?._id) }
        let lastBowler = data?.data?.lastBowler

        const allBatsmenStates = data.data[currentInning].allBatsmen.reduce((acc, batsman) => {
          acc[batsman.playerId] = batsman.status;
          return acc;
        }, {});

        const allBowlersStates = data.data[currentInning].allBowlers.reduce((acc, bowler) => {
          acc[bowler.playerId] = bowler;
          return acc;
        }, {});

        setState(prevState => ({
          ...prevState,
          currentInning, currentBall, longstTeamName: longestName, longstTeamWidth: longestWidthInCh,
          teamARuns, teamBRuns, overs, teamAwickets,
          teamBwickets, teamABalls, teamBBalls, status,
          matchId, teamA, teamB, seriesId, inning1, inning2, overRuns, overBallCount, overBallCountWExtras,
          isBowling, isBatting, isNextBatsmanInPitch, currentBowler, lastBowler, nextBatsman, currentBatsman,
          teamBName, teamAName, batsmanLeftOnPitch,
          allBowlersStates,
          allBatsmenStates,
          allBowlers: data.data[currentInning].allBowlers,
          allBatsmen: data.data[currentInning].allBatsmen,
          showEndMatch: currentInning === 'inning2'
        }));
      }
    } catch (error) {
      console.error('Failed to fetch match details:', error);
    }
  }

  const updateSeries = (seriesState) => {
    let params = seriesState
    sendHttpRequest(
      "PUT",
      BASE_URL + "/api/series/" + state.seriesId,
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

  const updateMatch = async (matchState) => {
    let params = matchState;
    console.log("updateMatchData => ", params);
    try {
      const data = await sendHttpRequest(
        'PUT',
        `${BASE_URL}/api/match/${selectedMatch._id}`,
        null,
        JSON.stringify(params)
      );
      if (data.status === 1) {
        return data.data;
      }
    } catch (error) {
      console.error('Failed to update match:', error);
    }
  };

  const addBall = async (currentBall) => {
    let params = currentBall;
    try {
      const data = await sendHttpRequest(
        'POST',
        `${BASE_URL}/api/ball/`,
        null,
        JSON.stringify(params)
      );
      if (data.status === 1) {
        return data.data;
      }
    } catch (error) {
      console.error('Failed to add ball:', error);
    }
  };

  const handleBall = async (type) => {
    const {
      batsmanLeftOnPitch, overs, currentInning, errorAlert, isFormFeedbackComplete,
      isPicked, currentBatsman, nextBatsman, currentBowler, inning1, inning2
    } = state;


    if (!currentBatsman || !nextBatsman) {
      toast.info("Please select better", 1000);
      return;
    }

    if (!currentBowler) {
      toast.info("Please select bowler", 1000);
      return;
    }

    const inning = state[currentInning];

    if (state?.currentBall?.ballCountWExtra === 1 && currentInning === "inning1") {
      updateSeries({ status: "STARTED" });
    }

    if (inning?.ballCount === 6 * overs) {
      toast.error("No more overs left", 500);
      endInnings()
      return setState(prevState => ({
        ...prevState,
        informEndInning: true,
        informEndMessage: "No more overs left"
      }));
    }

    if (inning?.wickets === 10) {
      toast.error("No more batsman left", 500);
      return setState(prevState => ({
        ...prevState,
        informEndInning: true,
        informEndMessage: "No more batsman left"
      }));
    }

    if (state?.isMatchOver) {
      toast.success(`End of Match: ${inning2?.battingTeam?.name} won the match`, 500);
      return setState(prevState => ({
        ...prevState,
        informEndInning: true,
        informEndMessage: `End of Match: ${inning2?.battingTeam?.name} won the match`
      }));
    }

    if (!currentBowler || !currentBatsman?._id || !nextBatsman?._id) {
      let updatedIsPicked = { ...isPicked };
      let updatedErrorAlert = true;
      let updatedIsFormFeedbackComplete = false;

      if (!currentBowler) updatedIsPicked.bowler = false;
      if (!currentBatsman?._id) updatedIsPicked.striker = false;
      if (!nextBatsman?._id) updatedIsPicked.nonStriker = false;

      return setState(prevState => ({
        ...prevState,
        errorAlert: updatedErrorAlert,
        isFormFeedbackComplete: updatedIsFormFeedbackComplete,
        isPicked: updatedIsPicked
      }));
    }

    if (!state.isBatting) {
      await setState(prevState => ({ ...prevState, isBatting: true }));
    }
    if (!state.isNextBatsmanInPitch) {
      await setState(prevState => ({ ...prevState, isNextBatsmanInPitch: true }));
    }
    if (!state.isBowling) {
      await setState(prevState => ({ ...prevState, isBowling: true }));
    }

    if (batsmanLeftOnPitch) {
      await setState(prevState => ({ ...prevState, batsmanLeftOnPitch: null }));
    }

    switch (type) {
      case NO_BALL:
      case RUN_OUT_STRIKER:
      case RUN_OUT_NON_STRIKER:
      case WIDE_BALL:
      case BYE:
        await handleBallTypesWRuns(type);
        break;
      case BOWLED:
      case STUMPED:
      case CATCH:
        await handleBallTypeWickets(type);
        break;
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 6:
        await handleBallTypesRuns(type);
        break;
      default:
        break;
    }

    let allBallCount = state.allBallCount + 1;
    let activeBallType = type === RUN_OUT_NON_STRIKER || type === RUN_OUT_STRIKER ? RUN_OUT : type;

    setState(prevState => ({
      ...prevState,
      allBallCount,
      activeBallType
    }));
  };

  const handleBallTypesWRuns = async (type) => {
    setState(prevState => {
      const currentBallTypeStatus = { ...prevState.currentBallTypeStatus };
      let inning = { ...prevState[prevState.currentInning] };

      switch (type) {
        case RUN_OUT_NON_STRIKER:
        case RUN_OUT_STRIKER:
          inning.wickets += 1;
          currentBallTypeStatus.RUN_OUT.status = true;
          currentBallTypeStatus.RUN_OUT[type] = true;
          return {
            ...prevState,
            [prevState.currentInning]: inning,
            currentBallTypeStatus
          };
        case NO_BALL:
        case WIDE_BALL:
        case BYE:
          currentBallTypeStatus[type] = true;
          return {
            ...prevState,
            currentBallTypeStatus
          };
        default:
          return prevState;
      }
    });
  };

  const handleBallTypeWickets = async (type) => {
    setState(prevState => {
      const inning = { ...prevState[prevState.currentInning] };

      let {
        tossWon,
        teamARuns,
        teamBRuns,
        teamAwickets,
        teamBwickets,
        teamABalls,
        teamBBalls,
        lastBowler,
        overRuns,
        overBallCount,
        overBallCountWExtras,
        allBatsmenStates,
        currentBatsman,
        currentBall,
        currentBallTypeStatus,
        isBatting,
        isBowling,
        batsmanLeftOnPitch,
        currentBowler,
        nextBatsman,
        isNextBatsmanInPitch
      } = prevState;

      currentBall = resetCurrentBall(currentBall);
      currentBall.batsman = currentBatsman._id;
      currentBall.nonStriker = nextBatsman._id;
      currentBall.bowler = currentBowler._id;
      currentBall.ballType = 'NORMAL-BALL';

      const ballTypes = [];

      if (overBallCountWExtras === 0) {
        overRuns = [null, null, null, null, null, null];
      }
      if (currentBallTypeStatus.WIDE_BALL) {
        ballTypes.push('W');
        overBallCount -= 1;
        currentBall.ballType = 'WIDE-BALL';
        currentBall.runOutType = 'NONE';
        currentBall.extras += 1;
        currentBall.runs += 1;
        currentBall.ballCount -= 1;
      }

      ballTypes.push(type.substring(0, 1));
      overRuns[overBallCountWExtras] = ballTypes.join("");
      currentBall.runs += 0;
      currentBall.ballCount += 1;
      currentBall.wicket = 1;
      overBallCountWExtras += 1;
      overBallCount += 1;

      if (overBallCount === 6) {
        [currentBatsman, nextBatsman] = swapBatsmen(currentBatsman, nextBatsman);
        overBallCountWExtras = 0;
        overBallCount = 0;
        isBowling = false;
        lastBowler = currentBowler;
        currentBowler = null;

        isNextBatsmanInPitch = false;
        allBatsmenStates[nextBatsman._id] = {};
        allBatsmenStates[nextBatsman._id].out = true;
        allBatsmenStates[nextBatsman._id].inPitch = false;
        batsmanLeftOnPitch = type !== CATCH ? null : currentBatsman._id;
        nextBatsman._id = null;
      } else {
        allBatsmenStates[currentBatsman._id] = {};
        allBatsmenStates[currentBatsman._id].out = true;
        allBatsmenStates[currentBatsman._id].inPitch = false;
        batsmanLeftOnPitch = type !== CATCH ? null : nextBatsman._id;
        currentBatsman._id = null;
        isBatting = false;
      }

      switch (type) {
        case CATCH:
          currentBall.wicketType = "CATCHED";
          isNextBatsmanInPitch = false;
          isBatting = false;
          break;
        case STUMPED:
          currentBall.wicketType = "STUMPED";
          break;
        case BOWLED:
          currentBall.wicketType = "BOWLED";
          break;
        default:
          break;
      }

      currentBall.ballCountWExtra += 1;
      inning.wickets += currentBall.wicket;
      inning.ballCount = currentBall.ballCount;
      inning.ballCountWExtra = currentBall.ballCountWExtra;

      currentBallTypeStatus.WIDE_BALL = false;

      const newMatchState = {
        teamARuns,
        teamBRuns,
        teamAwickets,
        teamBwickets,
        teamABalls,
        teamBBalls,
        tossWon,
        currentBatsman: currentBatsman._id,
        nextBatsman: nextBatsman._id,
        currentBowler,
        lastBowler,
        batsmanLeftOnPitch,
        overBallCount,
        overBallCountWExtras,
        overRuns,
        isBatting,
        isBowling,
        isNextBatsmanInPitch,
        currentBallTypeStatus
      };

      // Perform asynchronous updates
      updateMatch(newMatchState);
      addBall(currentBall);

      return {
        ...prevState,
        lastBowler,
        isNextBatsmanInPitch,
        currentBowler,
        isBowling,
        isBatting,
        currentBall,
        overBallCountWExtras,
        overBallCount,
        overRuns,
        currentBatsman,
        allBatsmenStates,
        [prevState.currentInning]: inning,
        currentBallTypeStatus,
        nextBatsman,
        batsmanLeftOnPitch
      };
    });
  };

  const resetCurrentBall = (currentBall) => {
    const inningId = state[state.currentInning]._id;

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
    };
  };

  const handleExtras = (currentBall, extraType, runs) => {
    currentBall.ballCount -= 1; // Decrement ball count for extras
    currentBall.runs += 1; // Increment runs, generally extras add 1 run

    switch (extraType) {
      case WIDE_BALL:
        currentBall.ballType = 'WIDE-BALL';
        currentBall.extras += (1 + runs); // Wides count as 1 plus any additional runs
        break;
      case NO_BALL:
        currentBall.ballType = 'NO-BALL';
        currentBall.extras += 1; // No-balls count as 1 extra run
        break;
      default:
        // Handle other cases if necessary
        break;
    }
  };

  const swapBatsmen = (batsman1, batsman2) => {
    // Swapping the batsmen
    return [batsman2, batsman1];
  };

  const resetCurrentBallTypeStatus = () => {
    return {
      [NO_BALL]: false,
      [BYE]: false,
      [WIDE_BALL]: false,
      [RUN_OUT]: {
        status: false,
        [RUN_OUT_NON_STRIKER]: false,
        [RUN_OUT_STRIKER]: false
      }
    };
  };

  const handleBallTypesRuns = async (type) => {
    const ballTypes = [];
    let inning = state[state.currentInning]; // inning data
    let {
      batsmanLeftOnPitch, lastBowler, allBatsmenStates, isBowling, currentBallTypeStatus, currentBowler,
      currentBatsman, nextBatsman, overBallCount, currentBall, overRuns, isBatting, isNextBatsmanInPitch,
      overBallCountWExtras, teamAwickets, teamBwickets, teamBRuns, teamARuns, teamBBalls, teamABalls, tossWon
    } = state;


    currentBall = resetCurrentBall(currentBall);

    currentBall.batsman = currentBatsman._id;
    currentBall.nonStriker = nextBatsman._id;
    currentBall.bowler = currentBowler._id;
    currentBall.ballType = 'NORMAL-BALL';
    currentBall.runOutType = 'NONE';
    currentBall.wicketType = 'NONE';

    if (overBallCountWExtras === 0) {
      overRuns = [null, null, null, null, null, null];
    }

    if (currentBallTypeStatus[BYE]) {
      ballTypes.push('B+ ');
      currentBall.runs += type;
      currentBall.extras += type;
    } else {
      currentBall.runs += type;
    }

    if (currentBallTypeStatus[NO_BALL]) {
      ballTypes.push('NB+ ');
      overBallCount -= 1;
      handleExtras(currentBall, NO_BALL, type);
    } else if (currentBallTypeStatus[WIDE_BALL]) {
      ballTypes.push('WB+ ');
      overBallCount -= 1;
      handleExtras(currentBall, WIDE_BALL, type);
    }

    if (currentBallTypeStatus[RUN_OUT].status) {
      ballTypes.push('R');
      currentBall.wicketType = 'RUN-OUT';
      currentBall.wicket = 1;
      isNextBatsmanInPitch = false;
      isBatting = false;
      if (currentBallTypeStatus[RUN_OUT][RUN_OUT_STRIKER]) {
        currentBall.runOutType = 'STRIKER';
        allBatsmenStates[currentBatsman._id].out = true;
        allBatsmenStates[currentBatsman._id].inPitch = false;
        batsmanLeftOnPitch = nextBatsman._id;
        currentBatsman._id = null;
      } else {
        currentBall.runOutType = 'NON-STRIKER';
        allBatsmenStates[nextBatsman._id].out = true;
        allBatsmenStates[nextBatsman._id].inPitch = false;
        batsmanLeftOnPitch = currentBatsman._id;
        nextBatsman._id = null;
      }
    }

    overRuns[overBallCountWExtras] = ballTypes.join("") + type;
    overBallCount += 1;
    overBallCountWExtras += 1;
    currentBall.ballCount += 1;
    currentBall.ballCountWExtra += 1;

    inning.runs += currentBall.runs;
    inning.extras += currentBall.extras;
    inning.ballCount = currentBall.ballCount;
    inning.ballCountWExtra = currentBall.ballCountWExtra;

    if (overBallCount === 6) {
      [currentBatsman, nextBatsman] = swapBatsmen(currentBatsman, nextBatsman);
      overBallCountWExtras = 0;
      overBallCount = 0;
      isBowling = false;
      lastBowler = currentBowler;
      currentBowler = null;
    }
    if (type % 2 !== 0) {
      [currentBatsman, nextBatsman] = swapBatsmen(currentBatsman, nextBatsman);
    }

    currentBallTypeStatus = resetCurrentBallTypeStatus();

    let newMatchState = {
      teamARuns, teamBRuns, teamAwickets, teamBwickets, teamABalls, teamBBalls, tossWon,
      currentBatsman: currentBatsman._id,
      nextBatsman: nextBatsman._id,
      currentBowler,
      lastBowler,
      batsmanLeftOnPitch,
      overBallCount,
      overBallCountWExtras,
      overRuns,
      isBatting,
      isBowling,
      isNextBatsmanInPitch,
      currentBallTypeStatus
    };


    if (state.currentInning === "inning2") {
      if ((state.inning1.runs - inning.runs + 1) < 1) {
        await setState(prevState => ({ ...prevState, isMatchOver: true }));
      }
    }

    await setState(prevState => ({ ...prevState, isBallUpdated: false }));
    await updateMatch(newMatchState);
    await addBall(currentBall);

    setState(prevState => ({
      ...prevState,
      batsmanLeftOnPitch,
      lastBowler,
      allBatsmenStates,
      isNextBatsmanInPitch,
      isBatting,
      currentBallTypeStatus,
      [state.currentInning]: inning,
      currentBatsman,
      nextBatsman,
      overBallCountWExtras,
      overBallCount,
      currentBall,
      overRuns,
      isBowling,
      currentBowler
    }), () => setState(prevState => ({ ...prevState, isBallUpdated: true })));
  };

  const resetStateToInning2 = () => {
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
  };

  const endInnings = async () => {
    // Reset state for inning 2
    const {
      nextBatsman, currentInning, isBatting, isBowling, errorAlert, isFormFeedbackComplete,
      isPicked, informEndInning, showEndMatch, overRuns, currentBallTypeStatus,
      allBallCount, overBallCount, overBallCountWExtras, isNextBatsmanInPitch,
      currentBatsman, lastBowler, activeBallType, currentBowler, currentBall
    } = resetStateToInning2();

    // Update state
    setState(prevState => ({
      ...prevState,
      showEndMatch: true,
      nextBatsman,
      currentInning,
      isBatting,
      isBowling,
      errorAlert,
      isFormFeedbackComplete,
      isPicked,
      informEndInning,
      overRuns,
      currentBallTypeStatus,
      allBallCount,
      overBallCount,
      overBallCountWExtras,
      isNextBatsmanInPitch,
      currentBatsman,
      lastBowler,
      activeBallType,
      currentBall
    }));

    // Prepare match data for API call
    const matchData = {
      nextBatsman: nextBatsman._id,
      currentInning,
      isNextBatsmanInPitch,
      isBowling,
      isBatting,
      overRuns,
      overBallCount,
      overBallCountWExtras,
      currentBatsman: currentBatsman._id,
      lastBowler,
      currentBowler
    };

    // Update match and fetch details
    await updateMatch(matchData);
    getMatchDetails();
  };

  const endMatch = async () => {
    const matchData = {
      status: "COMPLETE"
    };

    try {
      await updateMatch(matchData); // Await the update match operation
      // history.push(`/match/${selectedMatch?._id}`); // Navigate to the match details page
      console.log("Navigate to the match details page");
    } catch (error) {
      console.error("Error ending match:", error);
      // Handle any errors that occur during the match update
    }
  };

  const getRunStyle = (run) => {

    if (typeof run === 'string') {
      if (run.startsWith('NB+')) return Style.noball;
      if (run.startsWith('WB+')) return Style.wideball;

      switch (run) {
        case '0':
          return Style.run0
        case '1':
          return Style.run1
        case '2':
          return Style.run2
        case '3':
          return Style.run3
        case '4':
          return Style.run4
        case '6':
          return Style.run6
        default:
          return ''
      }
    }

    // if (run === 'W') return Style.wicket;
    // if (run.startsWith('NB')) return Style.noball;
    // const runValue = parseInt(run.split(' ')[1], 10);
    // if (runValue >= 0 && runValue <= 6) return `${Style.run}${runValue}`;
    // return Style.default; // Provide a default style if needed
  };

  const minusToZero = (num) => {
    if (num < 0)
      return 0
    return num
  }


  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content" style={{ padding: 0 }}>
          <div>
            <Header
              title={"Scoresheet"}
              isModal={true}
              closeModal={() => setIsShow(0)}
            />

            <div className={Style.scoresheetMainContainer}>
              {/* over and batsman conatiner */}
              <div className={Style.scrshtcntr1}>
                <div className={Style.overContainer}>
                  <p>{state?.teamAName}</p>
                  <p>{state[state?.currentInning]?.runs || '0'}&nbsp;/&nbsp;{state[state?.currentInning]?.wickets || 0}</p>
                  <p>{(Math.floor(state[state?.currentInning]?.ballCount / 6)) || 0}.{(state[state?.currentInning]?.ballCount % 6) || 0} overs</p>
                  <hr />
                  <p>TARGET</p>
                  <p>180</p>
                </div>

                <div className={Style.batsmanContainer}>
                  <div className={`${Style.batsManCard} ${Style.play}`}>
                    <div>
                      <p>07</p>
                      <p>{state?.currentBatsman?.firstName}{" "}{state?.currentBatsman?.lastName}</p>
                      <p>
                        {state?.currentBatsman?.otherData?.runs ?? 0} <span>({state?.currentBatsman?.otherData?.ballsFaced ?? 0})</span>
                      </p>
                    </div>
                    <div>
                      <p>0X0</p>
                      <p>1X0</p>
                      <p>2X0</p>
                      <p>3X0</p>
                      <p>4X1</p>
                      <p>6X0</p>
                      <p>000.0</p>
                    </div>
                  </div>

                  <div className={Style.batsManCard}>
                    <div>
                      <p>07</p>
                      <p>{state?.nextBatsman?.firstName}{" "}{state?.nextBatsman?.lastName}</p>
                      <p>
                        {state?.nextBatsman?.otherData?.runs ?? 0} <span>({state?.nextBatsman?.otherData?.ballsFaced ?? 0})</span>
                      </p>
                    </div>
                    <div>
                      <p>0X0</p>
                      <p>1X0</p>
                      <p>2X0</p>
                      <p>3X0</p>
                      <p>4X1</p>
                      <p>6X0</p>
                      <p>000.0</p>
                    </div>
                  </div>

                  <div className={Style.batsmanBtnContainer}>
                    <button onClick={() => { }}>Switch</button>
                    <button
                      onClick={() => {
                        setShowNextBatter(true);
                      }}
                    >
                      Choose next batter <ChevronRightIcon />
                    </button>
                  </div>
                </div>
              </div>

              {/* ball container */}
              <div className={Style.scrshtcntr2}>

                {state.overRuns.map((run, index) =>
                  <div key={index} className={`${Style.ball} ${getRunStyle(run)}`}>{state.overRuns[index] !== null ? state.overRuns[index] : ""}</div>
                )}

                {/* <div className={`${Style.ball} ${Style.run0}`}>0</div>
                <div className={`${Style.ball} ${Style.run1}`}>1</div>
                <div className={`${Style.ball} ${Style.run4}`}>4</div>
                <div className={`${Style.ball} ${Style.wicket}`}>W</div>
                <div className={`${Style.ball} ${Style.noball}`}>NB+ 0</div>
                <div className={`${Style.ball} ${Style.freeHit}`}></div>
                <div className={`${Style.ball} ${Style.run6}`}>6</div>
                <div className={`${Style.ball} ${Style.run2}`}>2</div>
                <div className={`${Style.ball} ${Style.run3}`}>3</div>
                <div className={`${Style.ball} ${Style.wideball}`}>WB+ 0</div> */}
              </div>

              {/* bowler detail container */}
              <div className={Style.scrshtcntr3}>
                <div className={Style.bowlerCard}>
                  <div>
                    <p>07</p>
                    <p>{state?.currentBowler?.firstName}{" "}{state?.currentBowler?.lastName}</p>
                  </div>
                  <div>
                    <p>{state?.currentBowler?.otherData?.runs}{"/"}{state?.currentBowler?.otherData?.wickets}</p>
                    <p>({(Math.floor(state?.currentBowler?.otherData?.ballCount / 6)) || 0}.{(state?.currentBowler?.otherData?.ballCount % 6) || 0} Overs)</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowNextBowler(true);
                  }}
                >
                  Choose next bowler <ChevronRightIcon />
                </button>
              </div>

              {/* need run container */}
              <div className={Style.scrshtcntr4}>
                <div className={Style.firstBattingTeamsConatiner}>
                  <div>
                    <img src={CoinIcon} style={{ height: "24px" }} />
                    <p>{state?.teamAName}</p>
                  </div>
                  <div>
                    <p>
                      CRR <span>00.0</span>
                    </p>
                    <p>
                      DLS <span>00.0</span>
                    </p>
                    <p>
                      RRR <span>00.0</span>
                    </p>
                  </div>
                </div>

                {
                  state.currentInning === "inning2" &&
                  <p>
                    {state?.teamAName} needs <span>{minusToZero(state?.inning1?.runs - state?.inning2?.runs + 1)} runs</span> to win in{" "}
                    <span>{state?.overs * 6 - state?.inning2?.ballCount} balls</span>
                  </p>
                }
              </div>

              <div className={Style.scrshtcntr5}>

                <div className={Style.cntr5BtnsDiv}>
                  <CustomCardButton
                    onClick={() => handleBall(NO_BALL)}
                    name={NO_BALL}
                  ></CustomCardButton>
                  <CustomCardButton
                    onClick={() => handleBall(WIDE_BALL)}
                    name={WIDE_BALL}
                  ></CustomCardButton>
                  <CustomCardButton
                    onClick={() => handleBall(BYE)}
                    name={BYE}
                  ></CustomCardButton>
                  <CustomCardButton
                    onClick={() => { }}
                    name={"Leg-bye"}
                  ></CustomCardButton>
                </div>

                <div className={Style.cntr5DigitDiv}>
                  {
                    state?.ballTypeRuns?.map((type, idx) => (
                      <div key={idx} className={Style.cntr5Digit} onClick={() => handleBall(type)}>{type}</div>
                    ))
                  }
                </div>
                <div className={Style.cntr5LowerRow}>
                  <div className={Style.cntr5LowerDiv} onClick={() => { }}>
                    <div className={Style.cntr5Lower1Div}>S</div>
                    <p>Shot Played</p>
                  </div>
                  <div className={Style.cntr5LowerDiv} onClick={() => { }}>
                    <div className={Style.cntr5Lower1Div}>
                      <img src={CircleGreen} alt="" />
                    </div>
                    <p>Travelled</p>
                  </div>
                  <div className={Style.cntr5LowerDiv} onClick={() => { }}>
                    <div className={Style.cntr5Lower1Div}>F</div>
                    <p>Fielded By</p>
                  </div>
                  <div className={Style.cntr5LowerDiv} onClick={() => { }}>
                    <div className={Style.cntr5Lower1Div}>
                      <img src={Ball} alt="" />
                    </div>
                    <p>End ball</p>
                  </div>
                  <div className={Style.cntr5LowerDiv} onClick={() => { }}>
                    <div
                      className={`${Style.cntr5Lower1Div} ${Style.darkbold}`}
                    >
                      5
                    </div>
                    <p>Other runs</p>
                  </div>
                  <div className={Style.cntr5LowerDiv} onClick={() => { }}>
                    <div className={Style.cntr5Lower1Div}>
                      <img src={Undo} alt="" />
                    </div>
                    <p>Undo</p>
                  </div>
                  <div
                    className={Style.cntr5LowerDiv}
                    onClick={() => {
                      setShowWicket(true);
                    }}
                  >
                    <div className={Style.cntr5Lower1Div}>
                      <img src={Stumps} alt="" />
                    </div>
                    <p>Wicket</p>
                  </div>
                  <div className={Style.cntr5LowerDiv} onClick={() => { }}>
                    <div className={Style.cntr5Lower1Div}>
                      <img src={Ball} alt="" />
                    </div>
                    <p>End ball</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CustomWicketSelectBottomSheet
        isOpen={showWicket}
        onDismiss={() => setShowWicket(false)}
        setSelectedWicket={(wicket) => {
          console.log(wicket)
          handleBall(wicket?.type)
        }}
      />

      <CustomNextBatterBottomSheet
        isOpen={showNextBatter}
        onDismiss={() => setShowNextBatter(false)}
        setSelectedBatter={(batter) => {
          setState((prev) => ({ ...prev, [prev.currentBatsman ? 'nextBatsman' : 'currentBatsman']: batter?.player }))
        }}
        allBatsmen={state?.[state?.currentInning]?.allBatsmen?.filter((batter) => !batter.status.out)}
      />

      <CustomNextBowlerBottomSheet
        isOpen={showNextBowler}
        onDismiss={() => setShowNextBowler(false)}
        setSelectedBower={(bowler) => {
          setState((prev) => ({ ...prev, currentBowler: bowler?.player }))
        }}
        allBowlers={state?.[state?.currentInning]?.allBowlers}
      />
    </>
  );
}