import React from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CssBaseline from "@material-ui/core/CssBaseline";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import { Button } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { KeyboardArrowLeft } from "@material-ui/icons";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import AppLogoIcon from "../../assets/images/FieldR_Logo_Blue.png";
import ManuIcon from "../../assets/images/svg/manu.svg";
import MessageIcon from "../../assets/images/svg/message.svg";
import NotificationIcon from "../../assets/images/svg/notification.svg";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    boxShadow: "none", 
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  },
  title: {
    // flexGrow: 1,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
  btn: {
    backgroundColor: "var(--primary-color-600)",
    color: "white",
    fontFamily: "DM Sans",
    fontWeight: "bold",
    width: "105%",
  },
  headerDiv: {
    width: "100%",
    alignItems: 'center',
    display: "flex",
    justifyContent: "space-between",
  },
  logoImg: {
    height: "25px",
    marginLeft: "8px",
  },
}));

export default function PersistentDrawerRight({ title, farLeft, hideMenu }) {
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    history.push('/')
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        style={{ backgroundColor: "var(--primary-color-white)" }}
        position="fixed"
        className={clsx(classes.appBar, { [classes.appBarShift]: open })}
      >
        <Toolbar>
          {!hideMenu && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerOpen}
              className={clsx(open && classes.hide)}
            >
              <img src={ManuIcon} />
            </IconButton>
          )}
          {farLeft && (
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={() => history.goBack()}
            >
              <KeyboardArrowLeft />
            </IconButton>
          )}
          {/* {'Home'} */}
          <div className={classes.headerDiv}>
            <img src={AppLogoIcon} className={classes.logoImg} />
            {/* <div>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => {}}
            >
              <img src={MessageIcon} />
              </IconButton>
              <IconButton
              edge="end"
              color="inherit"
              onClick={() => {}}
            >

              <img src={NotificationIcon}  />
            </IconButton>
            </div> */}
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{ paper: classes.drawerPaper }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider className="mt-15 mb-15" />
        <List>
          <ListItem>
            <Button className={classes.btn} component={NavLink} to="/profile">
              Profile
            </Button>
          </ListItem>
          <Divider className="mt-15 mb-15" />
          <ListItem>
            <Button className={classes.btn} to="/home" component={NavLink}>
              Home
            </Button>
          </ListItem>
          <ListItem>
            <Button className={classes.btn} component={NavLink} to="/pools">
              Clubs
            </Button>
          </ListItem>
          <ListItem>
            <Button className={classes.btn} to="/matches" component={NavLink}>
              Matches
            </Button>
          </ListItem>
          <ListItem>
            <Button
              className={classes.btn}
              component={NavLink}
              to="/tournament/all"
            >
              Tournaments
            </Button>
          </ListItem>
          <Divider className="mt-15 mb-15" />
          <ListItem>
            <Button
              className={classes.btn}
              component={NavLink}
              to="/"
              onClick={logout}
            >
              Log Out
            </Button>
          </ListItem>
        </List>
        <Divider className="mt-15 mb-15" />
        <p className="text-center">Version 0.2</p>
      </Drawer>
    </div>
  );
}
