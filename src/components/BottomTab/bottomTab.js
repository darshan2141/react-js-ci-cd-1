import React from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import InfoIcon from "@material-ui/icons/Info";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import { useHistory, useLocation } from "react-router-dom";
import "../style.module.css";
import SignalCellularAltRoundedIcon from '@material-ui/icons/SignalCellularAltRounded';
import SportsCricketOutlinedIcon from '@material-ui/icons/SportsCricketOutlined';
import KeyboardArrowUpOutlinedIcon from '@material-ui/icons/KeyboardArrowUpOutlined';

function BottomNav() {
  const history = useHistory();
  const location = useLocation();

  const handleChange = (event, newValue) => {
    history.push(newValue);
  };

  return (
    <Box
      style={{
        position: "sticky",
        bottom: 0,
        left: 0,
        width: window.innerWidth + "px",
      }}
    >
      <BottomNavigation value={location.pathname} onChange={handleChange}>
        <BottomNavigationAction
          label="Home"
          value="/home"
          icon={<HomeIcon />}
        />
        <BottomNavigationAction
          label="My Stats"
          value="/my-cricket"
          icon={<SignalCellularAltRoundedIcon />}
        />
        <BottomNavigationAction
          label="My Matches"
          value="/my-matches"
          icon={<SportsCricketOutlinedIcon />}
        />
        <BottomNavigationAction
          label="More"
          value="/more"
          icon={<KeyboardArrowUpOutlinedIcon />}
        />
      </BottomNavigation>
    </Box>
  );
}

export default BottomNav;
