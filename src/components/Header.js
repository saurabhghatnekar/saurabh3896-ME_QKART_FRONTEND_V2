import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import {useHistory} from "react-router-dom";
import "./Header.css";

const Header = (props) =>
  {
    const history = useHistory();

    const logout = () => {
      localStorage.clear()
      window.location.reload("/")
    }

    const username = localStorage.getItem("username")

    let headerButton = <Button></Button>;
    if (props.hasHiddenAuthButtons){
      headerButton = <Button onClick={()=>{window.location.replace("/")}}
        startIcon={<ArrowBackIcon />}
        variant="text"
        >
        Back to explore
      </Button>
    }
    else if (username){
      headerButton = <Stack direction="row" spacing={1} alignItems="center">
        <Avatar>{username[0].toUpperCase()}</Avatar>
        <p>{username.charAt(0).toUpperCase() + username.slice(1)}</p>
        <Button onClick={logout} variant="text">LOGOUT</Button>
      </Stack>
    }
    else {
      headerButton = <Stack direction="row" spacing={1} alignItems="center">
        <Button onClick={()=>{window.location = "/login"}}  variant="text">LOGIN</Button>
        <Button onClick={()=>{window.location = "/register"}} variant="contained">REGISTER</Button>
      </Stack>
    }

   

    return (
      <Box className="header">
        <Box
          className="header-title"
        >
          {/* FIXME - Skip svg in stub generator */}
          <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        {headerButton}
      </Box>
    );
  };

export default Header;
