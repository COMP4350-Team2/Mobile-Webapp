import './SideMenu.css';
import { IoInformationCircleOutline, IoLogOutOutline } from "react-icons/io5";
import { Drawer, List, ListItemIcon, ListItemText, Divider, ListItemButton } from '@mui/material';
import { FaUserCircle } from 'react-icons/fa';
import { UserAuth } from 'auth/UserAuth';
import { useNavigate } from 'react-router-dom';
import links from 'assets/Links.json'; // Import the JSON file

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
        <Drawer className="side-menu" anchor="left" open={open} onClose={onClose} >
            <div className="side-menu-header sub-color">
                <h2>Cupboard</h2>
                <p className="email">{"email@mailbox.com"}</p>
            </div>
            <div className="sub-color">
                <Divider className="thick-divider" />
            </div>
            <List className="menu-list sub-color">
                <ListItemButton disabled={true}>
                    <ListItemIcon sx={{ fontSize: '1.7rem' }}>
                        <FaUserCircle />
                    </ListItemIcon>
                    <ListItemText primary="My Account" />
                </ListItemButton >
                <ListItemButton onClick={handleLogout}>
                    <ListItemIcon sx={{ fontSize: '1.7rem' }}>
                        <IoLogOutOutline />
                    </ListItemIcon>
                    <ListItemText primary="Log out" />
                </ListItemButton>
                <ListItemButton
                    component="a"
                    href={links.aboutPage}
                    target="_blank" // Open in a new tab
                    rel="noopener noreferrer" // Security measure
                >
                    <ListItemIcon sx={{ fontSize: '1.7rem' }}>
                        <IoInformationCircleOutline />
                    </ListItemIcon>
                    <ListItemText primary="About" />
                </ListItemButton>
            </List>
        </Drawer>
    );
};

export default SideMenu;
