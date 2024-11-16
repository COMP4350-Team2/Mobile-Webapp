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
			<div className="side-menu-header sub-color">
				<button
					onClick={onClose}
					className="close-btn"
					aria-label="Close"
				>
					{uniIcons.cross}
				</button>
				<h2>Cupboard</h2>
				<p className="email">{userAuth.getEmail()}</p>
			</div>
			<div className="sub-color">
				<Divider className="thick-divider" />
			</div>
			<List className="menu-list sub-color">
				<ListItemButton disabled={true}>
					<ListItemIcon sx={{ fontSize: "1.7rem" }}>
						<FaUserCircle />
					</ListItemIcon>
					<ListItemText primary="My Account" />
				</ListItemButton>
				<ListItemButton
					component="a"
					href={links.aboutPage}
					target="_blank" // Open in a new tab
					rel="noopener noreferrer" // Security measure
				>
					<ListItemIcon sx={{ fontSize: "1.7rem" }}>
						<IoInformationCircleOutline />
					</ListItemIcon>
					<ListItemText primary="About" />
				</ListItemButton>
				<ListItemButton onClick={handleLogout}>
					<ListItemIcon sx={{ fontSize: "1.7rem" }}>
						<IoLogOutOutline />
					</ListItemIcon>
					<ListItemText primary="Log out" />
				</ListItemButton>
			</List>
			<img
				src={logo}
				alt="Cupboard Logo"
				className="logo sub-color"
			/>
		</Drawer>
	);
}

export default SideMenu;
