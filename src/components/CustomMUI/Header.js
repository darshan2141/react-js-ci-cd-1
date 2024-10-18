import {
  AppBar,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";

import React from "react";
import clsx from "clsx";

import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    // boxShadow: "0 2px 2px rgba(0, 0, 0, 0.1)",
    boxShadow: "none",
  },
  title: {
    flexGrow: 1,
  },
  hide: {
    display: "none",
  },
}));
//  when this component used in modal then : isModal={true} closeModal={callback}
const Header = ({ title, isModal, closeModal }) => {
  const history = useHistory();
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        style={{ backgroundColor: "var(--primary-color-white)" }}
        // position="fixed"
        className={clsx(classes.appBar)}
      >
        <Toolbar>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={() => {
              isModal ? closeModal("") : history.goBack();
            }}
          >
            <KeyboardArrowLeft style={{ fill: "var(--primary-color-700)" }} />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            style={{
              textAlign: "center",
              fontFamily: "DM Sans",
              fontWeight: "600",
              color: "var(--primary-color-700)",
            }}
            className={classes.title}
          >
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
