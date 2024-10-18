import React, { useState, useEffect, useRef } from "react";
import * as moment from "moment";
import { Card, CardContent, CircularProgress, Dialog, DialogContent } from "@material-ui/core";
import PersistentDrawerRight from "../navBar/nav";
import {
  sendHttpRequest,
  BASE_URL,
  checkIfUserLoggedIn,
} from "../../common/Common";
import "./HomeScreen.css";
import { ToastMessage, ShowToast } from "../CustomMUI/ToastMessage";
import Match from "../match/Match";
import IntroModal from "../CustomMUI/IntroModal";
import { txt } from "../../common/context";
import PlayerIcon from "../../assets/images/svg/player.svg";
import TeamIcon from "../../assets/images/svg/team.svg";
import MatchIcon from "../../assets/images/svg/match.svg";
import TournamentIcon from "../../assets/images/svg/tournament.svg";
import MatchComponent from "../match/MatchCard";
import Slider from "react-slick/lib/slider";
import { CustomSmallButton } from "../CustomMUI/CustomSmallButton";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import CreatePlayer from "../Player/CreatePlayer";
import MatchCard from "../CustomMUI/MatchCard";
import Carousel from "react-multi-carousel";
import CreateTeamModal from "../team/CreateTeamModal";
import CustomPhoneBottomSheet from "../CustomMUI/CustomPhoneBottomSheet";
import CustomRMPlayerBottomSheet from "../CustomMUI/CustomRMPlayerBottomSheet";

const HomeScreen = (props) => {
  const [name, setName] = useState("");
  const history = useHistory();
  const [matches, setMatches] = useState([]);
  const [loadMatches, setLoadMatches] = useState(true);
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [banner] = useState([
    {
      id: "1",
      url: "https://www.shutterstock.com/image-vector/illustration-batsman-playing-cricket-championship-600nw-2146224395.jpg",
    },
    {
      id: "2",
      url: "https://t3.ftcdn.net/jpg/04/28/40/40/360_F_428404007_dlbIe8jNte0Td6fzJ5NIVoLGcAP0drQ6.jpg",
    },
    {
      id: "3",
      url: "https://t4.ftcdn.net/jpg/04/28/40/41/360_F_428404189_pohNxH3T6vdzxqa3DbxJaaT7dzJam42S.jpg",
    },
  ]);
  const [cardsData] = useState([
    {
      key: "1",
      profileImage: "https://via.placeholder.com/50",
      name: "John Doe",
      role: "Software Engineer",
    },
    {
      key: "2",
      profileImage: "https://via.placeholder.com/50",
      name: "Jane Smith",
      role: "Product Manager",
    },
    {
      key: "3",
      profileImage: "https://via.placeholder.com/50",
      name: "Alice Johnson",
      role: "UX Designer",
    },
    {
      key: "4",
      profileImage: "https://via.placeholder.com/50",
      name: "Bob Brown",
      role: "Data Scientist",
    },
    {
      key: "5",
      profileImage: "https://via.placeholder.com/50",
      name: "Charlie Davis",
      role: "DevOps Engineer",
    },
  ]);
  const slider = useRef(null);

  useEffect(() => {
    checkIfUserLoggedIn(props.history);
    getUserDetails();
    getUpcomingOngoingMatches();
  }, []);


  const getUserDetails = () => {
    sendHttpRequest(
      "GET",
      `${BASE_URL}/api/player/${localStorage.getItem("loggedInUserId")}`
    )
      .then((res) => {
        const userName = `${res.data.data.firstName} ${res.data.data.lastName}`;
        setName(userName);
        setShowIntroModal(localStorage.getItem("showIntroScreen") === "true");
        if (localStorage.getItem("showIntroScreen") === "true") {
          ShowToastWithCustomOptions(userName);
        }
      })
      .catch((error) => {
        // toast.error(error.response.data.message);
      });
  };

  const getUpcomingOngoingMatches = () => {
    sendHttpRequest(
      "GET",
      // `${BASE_URL}/api/match/user/65510a247306d000182cfbb8`
      `${BASE_URL}/api/match/user/${localStorage.getItem("loggedInUserId")}`
    )
      .then(async (res) => {
        let todayDate = new Date().toISOString().split('T')[0];
        setMatches(res.data.data.filter((match) => match.matchDate > todayDate));
        setLoadMatches(false)
      })
      .catch((error) => {
        // toast.error(error.response.data.message);
      });
  };

  const ShowToastWithCustomOptions = (name) => {
    ShowToast(txt.welocome + name, {
      position: "top-right",
      type: "success", // success, error, warning, info
    });
  };

  const handleIntroModalClose = () => {
    localStorage.setItem("showIntroScreen", "false");
    setShowIntroModal(false);
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 5,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
    },
  };

  return (
    <div>
      {showIntroModal && <IntroModal onClose={handleIntroModalClose} />}
      <PersistentDrawerRight title="Home" />
      <div className="page-wrapper">
        <Slider ref={slider}>
          {banner.map((slide, index) => (
            <div key={index} className="slide">
              <img src={slide.url} className="card-img" />
            </div>
          ))}
        </Slider>
        <p className="text-header">{txt.create_new}</p>
        <div className="create-div">
          <div onClick={() => history.push("/createPlayer")}>
            <img src={PlayerIcon} />
            <p>{txt.player}</p>
          </div>
          <div onClick={() => history.push('/create-team')}>
            <img src={TeamIcon} />
            <p>{txt.team}</p>
          </div>
          <div onClick={() => history.push('/createMatch')}>
            <img src={MatchIcon} />
            <p>{txt.match}</p>
          </div>
          <div onClick={() => history.push('/tournament/create')}>
            <img src={TournamentIcon} />
            <p>{txt.tournament}</p>
          </div>
        </div>

        {/* <h2 className="text-blue-bg my-0">Welcome! {name}</h2> */}
        {/* <div className="flex-between mb-15">
          <h3 className="text-white-bg">Upcoming & ongoing matches</h3>
          <h3 className="text-white-bg">{moment(new Date()).format("DD-MM-YYYY")}</h3>
        </div>

        {matches.length === 0 ? (
          <NoResults text="matches" />
        ) : (
          <Carousel autoPlaySpeed={2000} showArrows={false} itemPadding={[0, 1]}>
            {matches.map((match, index) => (
              <Match data={match} key={index} />
            ))}
          </Carousel>
        )}
        <div>
          <h3 className="text-white-bg">Profile Related</h3>
          <Card className="card" onClick={() => alert("Coming Soon")}>
            <CardContent>
              <h2 className="text-primary text-center">Last Session details</h2>
            </CardContent>
          </Card>
          <Card className="card" onClick={() => alert("Coming Soon")}>
            <CardContent>
              <h2 className="text-primary text-center">Overall Statistics</h2>
            </CardContent>
          </Card>
        </div> */}
      </div>

      <div className="upcomming">
        <p className="text-header">{txt.upcoming_matches}</p>
        <div className="card-div" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '20px' }}>

          {
            loadMatches ?
              <CircularProgress style={{ margin: 'auto' }} />
              :
              matches.length === 0 ? (
                <div className="no-matches">
                  <p style={{ textAlign: 'center' }}>{txt.no_matches}</p>
                </div>
              ) : (
                matches.map(
                  (match, index) => (
                    (<MatchCard data={match} key={index} />)
                  )
                )
              )
          }

        </div>
        {/* {matches.map((match, index) => (<Match data={match} key={index} />))} */}
      </div>
    </div>
  );
};

export default HomeScreen;
