import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  DynamicFeed,
  LibraryBooks,
  Person,
} from "@mui/icons-material";
import ROUTES from "../../configs/routes";
// import { signOut } from "@/configs/firebase";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  isActive: boolean;
}

const Navigation = ({
  desktopSidebarExcludedRoutes,
  mobileBottomBarExcludedRoutes,
}: {
  desktopSidebarExcludedRoutes: string[];
  mobileBottomBarExcludedRoutes: string[];
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(
    null
  );

  // Define navigation items
  const navItems: NavItem[] = [
    {
      id: "posts",
      label: "Posts",
      icon: <DynamicFeed />,
      path: ROUTES.POSTS,
      isActive: location.pathname === ROUTES.POSTS,
    },
    {
      id: "my_posts",
      label: "My Posts",
      icon: <LibraryBooks />,
      path: ROUTES.MY_POSTS,
      isActive: location.pathname === ROUTES.MY_POSTS,
    },
    {
      id: "profile",
      label: "Profile",
      icon: <Person />,
      path: ROUTES.PROFILE,
      isActive: location.pathname === ROUTES.PROFILE,
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      // await signOut();
      navigate(ROUTES.LANDING, { replace: true });
    } catch (error) {
      console.error("Error during logout:", error);
      navigate(ROUTES.LANDING, { replace: true });
    }
    setProfileAnchorEl(null);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  // Helper function to check if current pathname matches any excluded route pattern
  const isRouteExcluded = (
    pathname: string,
    excludedRoutes: string[]
  ): boolean => {
    return excludedRoutes.some((route) => {
      if (route === pathname) {
        return true;
      }
      if (route.includes(":")) {
        const regexPattern = route
          .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
          .replace(/:[^/]+/g, "[^/]+");
        const regex = new RegExp(`^${regexPattern}$`);
        return regex.test(pathname);
      }
      return false;
    });
  };

  // Desktop Drawer component
  const DesktopDrawer = () => (
    <Drawer
      variant="persistent"
      open={true}
      sx={{
        display: { xs: "none", lg: "block" },
        "& .MuiDrawer-paper": {
          width: 280,
          boxSizing: "border-box",
          backgroundColor: "#f8fafc",
          borderRight: "1px solid #e2e8f0",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 1,
        },
      }}
    >
      <Box sx={{ p: 2, borderBottom: "1px solid #e2e8f0" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            Posts Dashboard
          </Typography>
        </Box>
      </Box>

      <List sx={{ flexGrow: 1, px: 1, py: 2 }}>
        {navItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: 2,
                backgroundColor: item.isActive ? "primary.main" : "transparent",
                color: item.isActive ? "white" : "text.primary",
                "&:hover": {
                  backgroundColor: item.isActive
                    ? "primary.dark"
                    : "action.hover",
                },
                py: 1.5,
                px: 2,
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: item.isActive ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );

  // Mobile Bottom Navigation component
  const MobileBottomNavigation = () => {
    const [value, setValue] = useState(0);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
      const selectedItem = navItems[newValue];
      if (selectedItem) {
        handleNavigation(selectedItem.path);
      }
    };

    return (
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: { xs: "block", lg: "none" },
        }}
        elevation={3}
      >
        <BottomNavigation value={value} onChange={handleChange} showLabels>
          {navItems.map((item) => (
            <BottomNavigationAction
              key={item.id}
              label={item.label}
              icon={item.icon}
              sx={{
                color: item.isActive ? "primary.main" : "text.secondary",
                "&.Mui-selected": {
                  color: "primary.main",
                },
              }}
            />
          ))}
        </BottomNavigation>
      </Paper>
    );
  };

  // Profile Menu Component
  const ProfileMenu = () => (
    <Menu
      anchorEl={profileAnchorEl}
      open={Boolean(profileAnchorEl)}
      onClose={handleProfileMenuClose}
      PaperProps={{
        sx: {
          mt: 1.5,
          minWidth: 200,
          "& .MuiMenuItem-root": {
            px: 2,
            py: 1.5,
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid #e2e8f0" }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          John Doe
        </Typography>
        <Typography variant="caption" color="text.secondary">
          john.doe@email.com
        </Typography>
      </Box>

      <MenuItem onClick={handleProfileMenuClose}>
        <ListItemIcon>
          <SettingsIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Settings</ListItemText>
      </MenuItem>

      <Divider />

      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" sx={{ color: "error.main" }} />
        </ListItemIcon>
        <ListItemText sx={{ color: "error.main" }}>Logout</ListItemText>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      {!isRouteExcluded(location.pathname, desktopSidebarExcludedRoutes) && (
        <DesktopDrawer />
      )}

      {!isRouteExcluded(location.pathname, mobileBottomBarExcludedRoutes) && (
        <MobileBottomNavigation />
      )}

      <ProfileMenu />
    </>
  );
};

export default Navigation;
