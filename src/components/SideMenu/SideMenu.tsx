import { Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import logo from "assets/Cupboard_Logo_lightmode.png";
import links from "assets/Links.json";
import uniIcons from "assets/UniIcon.json";
import { UserAuth } from "auth/UserAuth";
import { FaUserCircle } from "react-icons/fa";
import { IoInformationCircleOutline, IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import "./SideMenu.css";


interface SideMenuProps {
	userAuth: UserAuth;
	open: boolean;
	onClose: () => void;
}

function SideMenu({ userAuth, open, onClose }: SideMenuProps) {
	const navigate = useNavigate();

	const handleLogout = () => {
		userAuth.logout();
		navigate("/");
	};

	return (
		<Drawer
			className="side-menu"
			anchor="left"
			open={open}
			onClose={onClose}
		>
			<div className="side-menu-header" style={{ color: "white" }}>
				<button
					onClick={onClose}
					className="close-btn"
					aria-label="Close"
                    style={{ color: "white" }}
				>
					{uniIcons.cross}
				</button>
				<h2>Cupboard</h2>
				<p className="email">{userAuth.getEmail()}</p>
			</div>
            <Divider className="header-divider" sx={{ borderColor: 'white', borderBottomWidth: 1 }} />
			<List className="menu-list" style={{ color: "white" }} >
				<ListItemButton disabled={true}>
					<ListItemIcon sx={{ fontSize: "1.7rem", color: "white" }}>
						<FaUserCircle />
					</ListItemIcon>
					<ListItemText primary="My Account" />
				</ListItemButton>
				<ListItemButton
					component="a"
					href={links.aboutPage}
					target="_blank" // Open in a new tab
					rel="noopener noreferrer" // Security measure
                    sx={{
                        "&:hover": {
                          backgroundColor: "#0f4c75", 
                        },
                      }}
				>
					<ListItemIcon sx={{ fontSize: "1.7rem", color: "white" }}>
						<IoInformationCircleOutline />
					</ListItemIcon>
					<ListItemText primary="About" />
				</ListItemButton>
				<ListItemButton
                 onClick={handleLogout}
                 sx={{
                    "&:hover": {
                      backgroundColor: "#0f4c75", 
                    },
                  }}
                 >
					<ListItemIcon sx={{fontSize: "1.7rem", color: "red" }}>
						<IoLogOutOutline />
					</ListItemIcon>
					<ListItemText primary="Log out" />
				</ListItemButton>
			</List>
			<img
				src={logo}
				alt="Cupboard Logo"
				className="logo"
			/>
		</Drawer>
	);
}

export default SideMenu;
