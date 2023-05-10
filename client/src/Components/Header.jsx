import React, { useEffect, useState } from "react";
import {
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	Drawer,
	List,
	ListItemButton,
	ListItemText,
	ListItemIcon,
	Divider,
} from "@mui/material";
import {
	Menu as MenuIcon,
	Dashboard as DashboardIcon,
	AccountCircle as ProfileIcon,
	ExitToApp as SignOutIcon,
} from "@mui/icons-material";
import { ListAlt as WhitelistIcon } from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Link, useLocation } from "react-router-dom";

const drawerWidth = 240;

const pathNames = {
	"/": "Dashboard",
	"/whitelist": "Whitelist",
	"/profile": "Profile",
	"/signout": "Signout",
};

const Header = () => {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [name, setName] = useState("");
	const location = useLocation();

	useEffect(() => {
		if (location.pathname) {
			setName(pathNames[location.pathname]);
		}
	}, [location.pathname]);

	const toggleDrawer = () => {
		setDrawerOpen(!drawerOpen);
	};

	return (
		<div>
			<AppBar
				position="fixed"
				sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
			>
				<Toolbar
					sx={{
						pr: "24px", // keep right padding when drawer closed
					}}
				>
					<IconButton
						edge="start"
						color="inherit"
						aria-label="menu"
						onClick={toggleDrawer}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6">{name}</Typography>
					{/*{*/}
					{/*	location.pathname === '/' && (*/}
					{/*		<Search>*/}
					{/*			<SearchIconWrapper>*/}
					{/*				<SearchIcon />*/}
					{/*			</SearchIconWrapper>*/}
					{/*			<StyledInputBase*/}
					{/*				placeholder="Search…"*/}
					{/*				inputProps={{ "aria-label": "search" }}*/}
					{/*			/>*/}
					{/*		</Search>*/}
					{/*	)*/}
					{/*}*/}
				</Toolbar>
			</AppBar>
			<Drawer
				anchor="left"
				variant="permanent"
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					[`& .MuiDrawer-paper`]: {
						width: drawerWidth,
						boxSizing: "border-box",
					},
				}}
				open={drawerOpen}
				onClose={toggleDrawer}
			>
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
				<List>
					<List>
						<ListItemButton
							component={Link}
							to="/"
							onClick={() => {
								// setName("Dashboard");
								toggleDrawer();
							}}
							selected={location.pathname === "/"}
						>
							<ListItemIcon>
								<DashboardIcon />
							</ListItemIcon>
							<ListItemText primary="Dashboard" />
						</ListItemButton>
						<ListItemButton
							component={Link}
							to="/whitelist"
							onClick={() => {
								// setName("Whitelist");
								toggleDrawer();
							}}
							selected={location.pathname === "/whitelist"}
						>
							<ListItemIcon>
								<WhitelistIcon />
							</ListItemIcon>
							<ListItemText primary="Whitelist" />
						</ListItemButton>
						<Divider />
						<ListItemButton
							component={Link}
							to="/profile"
							onClick={toggleDrawer}
							selected={location.pathname === "/profile"}
						>
							<ListItemIcon>
								<ProfileIcon />
							</ListItemIcon>
							<ListItemText primary="Profile" />
						</ListItemButton>
						<ListItemButton
							component={Link}
							to="/signout"
							onClick={toggleDrawer}
							selected={location.pathname === "/signout"}
						>
							<ListItemIcon>
								<SignOutIcon />
							</ListItemIcon>
							<ListItemText primary="Sign out" />
						</ListItemButton>
					</List>
				</List>
			</Drawer>
		</div>
	);
};

export default Header;
