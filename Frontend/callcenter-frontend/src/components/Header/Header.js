import React from "react";
import {
    AppBar,
    Button,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import FactCheckIcon from '@mui/icons-material/FactCheck';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { Link, Link as LinkReact } from "react-router-dom";
import NavigationDrawer from "../NavigationDrawer/NavigationDrawer";
import { Stack } from "@mui/system";

const Header = ({logged, setLogged}) => {

    const theme = useTheme();
    const isMatch = useMediaQuery(theme.breakpoints.down("md"));

    const logout = async () => {
        localStorage.removeItem('identity');
        localStorage.removeItem('token');
        localStorage.setItem('loggedIn', false )
        setLogged(false)
    }

    return (
        <React.Fragment>
            <AppBar sx={{ background: "#3d75f0" }}>
                <Toolbar>
                    <LinkReact to={logged ? "/callcenter" : "/"} style={{ textDecoration: 'none', color: "inherit", display: "flex" }}>
                        <FactCheckIcon sx={{ fontSize: "2.3rem", mr: "0.3rem" }} />
                        <Typography sx={{ fontSize: "1.5rem" }}>
                            Teléfonos S.A.
                        </Typography>
                    </LinkReact>
                    {isMatch ? (
                        <>
                            <NavigationDrawer logged={logged} setLogged={setLogged}/>
                        </>
                    ) : (
                        <>
                            {
                                logged ?
                                    <LinkReact to="/login" style={{ textDecoration: 'none', color: "inherit", marginLeft: "auto" }}>
                                        <Button
                                            variant="contained"
                                            startIcon={<LogoutIcon />}
                                            onClick={logout}
                                        >
                                            Logout
                                        </Button>
                                    </LinkReact>
                                    :
                                    <>
                                        <Stack direction='row' spacing={2} sx={{ marginLeft: "auto", marginRight: "3rem" }}>
                                            <Link to="/login" style={{ textDecoration: 'none', color: "inherit" }}>
                                                <Button
                                                    variant="contained"
                                                    startIcon={<LoginIcon />}
                                                >
                                                    Sign in
                                                </Button>
                                            </Link>

                                            <Link to="/register" style={{ textDecoration: 'none', color: "inherit" }}>
                                                <Button
                                                    variant="contained"
                                                    startIcon={<HowToRegIcon />}
                                                >
                                                    Sign Up
                                                </Button>
                                            </Link>

                                            <Link to="/register" style={{ textDecoration: 'none', color: "inherit" }}>
                                                <Button
                                                    variant="contained"
                                                    startIcon={<AssessmentIcon />}
                                                >
                                                    Report
                                                </Button>
                                            </Link>
                                        </Stack>
                                    </>
                            }
                        </>
                    )}
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
};

export default Header;