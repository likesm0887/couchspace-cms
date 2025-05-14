import logo from '../img/header/logo.png';
import './header.css'
import * as React from 'react';
import Personal from "./Personal";
import { Link, useLocation } from "react-router-dom";
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import consultation from '../img/slidebar/consultation.svg';
import meditation from '../img/slidebar/meditation.svg';
import article from '../img/slidebar/article.svg';
import manager from '../img/slidebar/manager.svg';
import setting from '../img/slidebar/setting.svg';

const screenWidth = window.innerWidth;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

function Header() {
    let currentHtml = window.location.href;
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const handleDrawerOpen = () => { setOpen(true) }
    const handleDrawerClose = () => { setOpen(false) }
    const drawerNames = ["諮詢"]
    const drawerIconUrls = [consultation, meditation, article, manager, setting];
    const redirectUrls = ["consultation", "repair", "repair", "repair", "repair"];
    return (
        <header class="header" style={{ height: 100, paddingRight: 0, override: "hidden", backgroundColor:"#FFFFFF" }}>
            {screenWidth > 500 ?
                <div class="container-fluid" style={{ marginTop: 10, marginBottom: 10 }}>
                    <div class="row align-items-center">
                        <div class="col-8 col-sm-6">
                            <Link to={redirectUrls[0]} style={{ textDecoration: 'none' }}>
                                <img style={{ objectFit: 'contain' }} src={logo} className="logo" alt="logo" />
                            </Link>
                        </div>
                        <div class="col-4 col-sm-6">
                            <Personal></Personal>
                        </div>
                    </div>
                </div>
                :
                <div class="container-fluid" style={{ marginTop: 10, marginBottom: 10 }}>
                    <div class="row align-items-center header">
                        <div class="col-2">
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={handleDrawerOpen}
                                sx={[
                                    open && { display: 'none' },
                                ]}
                            >
                                <MenuIcon />
                            </IconButton>
                        </div>
                        <div class="col-8 p-0">
                            <Link to={redirectUrls[0]} style={{ textDecoration: 'none' }}>
                                <img style={{ objectFit: 'contain' }} src={logo} className="logo" alt="logo" />
                            </Link>
                        </div>
                        <div class="col-2">
                            <Personal></Personal>
                        </div>
                    </div>
                </div>
            }
            <Drawer
                sx={{
                    width: 120,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 140,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {drawerNames.map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <Link onClick={handleDrawerClose} to={redirectUrls[index]} style={{ textDecoration: 'none' }}>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <img src={drawerIconUrls[index]} alt="123"></img>
                                    </ListItemIcon>
                                    <ListItemText style={{ color: "#89a2d0", fontWeight: "bold" }} primary={text} />
                                </ListItemButton>
                            </Link>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </header>

    );

}


export default Header;
