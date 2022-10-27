import React, { useState } from "react";
import { Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as LinkReact } from "react-router-dom";

const NavigationDrawer = ({ logged, setLogged }) => {

    const [openDrawer, setOpenDrawer] = useState(false);

    const logout = async () => {
        localStorage.removeItem('identity');
        localStorage.removeItem('token');
        localStorage.setItem('loggedIn', false)
        setLogged(false)
    }

    return (
        <React.Fragment>
            <Drawer
                anchor="left"
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
            >
                <List sx={{ p: '2rem' }}>
                    {
                        logged ?
                            <ListItemButton>
                                <ListItemIcon>
                                    <ListItemText>
                                        <LinkReact onClick={logout} to="/login" style={{ textDecoration: 'none', color: "inherit", marginLeft: "auto" }}>
                                            Log Out
                                        </LinkReact>
                                    </ListItemText>
                                </ListItemIcon>
                            </ListItemButton>
                            :
                            <>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <ListItemText>
                                            <LinkReact to="/login" style={{ textDecoration: 'none', color: "inherit", marginLeft: "auto" }}>
                                                Sign in
                                            </LinkReact>
                                        </ListItemText>
                                    </ListItemIcon>
                                </ListItemButton>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <ListItemText>
                                            <LinkReact to="/register" style={{ textDecoration: 'none', color: "inherit", marginLeft: "auto" }}>
                                                Sign Up
                                            </LinkReact>
                                        </ListItemText>
                                    </ListItemIcon>
                                </ListItemButton>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <ListItemText>
                                            <LinkReact to="/register" style={{ textDecoration: 'none', color: "inherit", marginLeft: "auto" }}>
                                                Report
                                            </LinkReact>
                                        </ListItemText>
                                    </ListItemIcon>
                                </ListItemButton>
                            </>
                    }
                </List>
            </Drawer>
            <IconButton
                sx={{ color: "white", marginLeft: "auto" }}
                onClick={() => setOpenDrawer(!openDrawer)}
            >
                <MenuIcon color="white" />
            </IconButton>
        </React.Fragment>
    );
};

export default NavigationDrawer;