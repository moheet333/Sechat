import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../context/appContext";
import { useNavigate } from "react-router-dom";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import List from "@mui/material/List";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { mainListItems, secondaryListItems } from "./listItems";
import FormControl from "@mui/material/FormControl";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import Chart from "./Chart";
import Deposits from "./Deposits";
import Orders from "./Orders";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const SearchResultsContainer = styled("div")({
  position: "absolute",
  top: "100%",
  left: 0,
  zIndex: 999,
  backgroundColor: "#fff",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  maxHeight: "150px",
  overflowY: "auto",
  width: "100%",
  "& > .MuiList-root": {
    padding: 0,
  },
});

function Dashboard() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const { isAuthenticated, searchUsers, searchNewUsers } = useGlobalContext();

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const navigate = useNavigate();
  const [searchUser, setSearchUser] = useState("");

  const handleChat = (user) => {
    navigate(`/dashboard/chat/${user.id}-${currentUser.id}`);
  };

  useEffect(() => {
    try {
      searchUsers({ searchUser });
    } catch (error) {
      console.log(error);
    }
  }, [searchUser]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <div>
        <div className="position-relative">
          <Box sx={{ display: "flex" }}>
            <AppBar position="absolute" open={open}>
              <Toolbar
                sx={{
                  pr: "24px", // keep right padding when drawer closed
                }}
              >
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  onClick={toggleDrawer}
                  sx={{
                    marginRight: "36px",
                    ...(open && { display: "none" }),
                  }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  component="h1"
                  variant="h6"
                  color="inherit"
                  noWrap
                  sx={{ flexGrow: 1 }}
                >
                  Dashboard
                </Typography>
                <FormControl variant="standard">
                  <InputLabel
                    htmlFor="input-with-icon-adornment"
                    style={{ color: "whitesmoke" }}
                  >
                    Search users
                  </InputLabel>
                  <Input
                    id="input-with-icon-adornment"
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    style={{ color: "whitesmoke" }}
                    startAdornment={
                      <InputAdornment position="start">
                        <AccountCircle style={{ color: "whitesmoke" }} />
                      </InputAdornment>
                    }
                  />
                </FormControl>
                {searchUser && (
                  <SearchResultsContainer>
                    <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                      <List
                        component="nav"
                        sx={{
                          backgroundColor: "#f0f0f0",
                          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                          padding: 0,
                        }}
                      >
                        {searchNewUsers.map((result, index) => (
                          <ListItem key={index}>
                            <ListItemText
                              onClick={() => handleChat(result)}
                              primary={result.username}
                              style={{
                                cursor: "pointer",
                                color: "#3f50b5",
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </div>
                  </SearchResultsContainer>
                )}
                <IconButton color="inherit">
                  <Badge badgeContent={4} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
              <Toolbar
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  px: [1],
                }}
              >
                <IconButton onClick={toggleDrawer}>
                  <ChevronLeftIcon />
                </IconButton>
              </Toolbar>
              <Divider />
              <List component="nav">
                {mainListItems}
                <Divider sx={{ my: 1 }} />
                {secondaryListItems}
              </List>
            </Drawer>
            <Box
              component="main"
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900],
                flexGrow: 1,
                height: "100vh",
                overflow: "auto",
              }}
            >
              <Toolbar />
              <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                  {/* Chart */}
                  <Grid item xs={12} md={8} lg={9}>
                    <Paper
                      sx={{
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        height: 240,
                      }}
                    >
                      <Chart />
                    </Paper>
                  </Grid>
                  {/* Recent Deposits */}
                  <Grid item xs={12} md={4} lg={3}>
                    <Paper
                      sx={{
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        height: 240,
                      }}
                    >
                      <Deposits />
                    </Paper>
                  </Grid>
                  {/* Recent Orders */}
                  <Grid item xs={12}>
                    <Paper
                      sx={{ p: 2, display: "flex", flexDirection: "column" }}
                    >
                      <Orders />
                    </Paper>
                  </Grid>
                </Grid>
                <Copyright sx={{ pt: 4 }} />
              </Container>
            </Box>
          </Box>
          {/* <input
            type="text"
            name="searchUser"
            value={searchUser}
            placeholder="Search users.."
            onChange={(e) => setSearchUser(e.target.value)}
          />
          <div className="position-absolute overflow-auto">
            {searchNewUsers.map((user, index) => {
              return (
                <div
                  key={index}
                  onClick={() => handleChat(user)}
                  className="text-primary"
                >
                  {user.username}
                </div>
              );
            })}
          </div> */}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
