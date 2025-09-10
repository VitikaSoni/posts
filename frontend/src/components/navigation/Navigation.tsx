import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { DynamicFeed, LibraryBooks, Person, Logout } from "@mui/icons-material";
import ROUTES from "../../configs/routes";
import { type RootState } from "@/store";
import { logout } from "@/store/authSlice";

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
  const dispatch = useDispatch();
  const { role, username } = useSelector((state: RootState) => state.auth);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  // Define navigation items
  const allNavItems: NavItem[] = [
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

  // Filter navigation items based on user role
  const navItems = allNavItems.filter((item) => {
    if (item.id === "posts") {
      return role === "admin"; // Only show Posts tab to admins
    }
    return true; // Show all other tabs to everyone
  });

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await dispatch(logout() as any);
      navigate(ROUTES.LANDING, { replace: true });
    } catch (error) {
      console.error("Error during logout:", error);
      navigate(ROUTES.LANDING, { replace: true });
    } finally {
      setLogoutDialogOpen(false);
    }
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
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
            variant="h4"
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            Posts Dashboard
          </Typography>
        </Box>
        {username && (
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              mt: 1,
              display: "block",
            }}
          >
            Username: {username}
          </Typography>
        )}
        {role && (
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              mt: 0.5,
              display: "block",
              textTransform: "capitalize",
            }}
          >
            Role: {role}
          </Typography>
        )}
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

      {/* Logout Button */}
      <Box sx={{ p: 2, borderTop: "1px solid #e2e8f0" }}>
        <ListItemButton
          onClick={handleLogoutClick}
          sx={{
            borderRadius: 2,
            backgroundColor: "transparent",
            color: "error.main",
            "&:hover": {
              backgroundColor: "error.light",
              color: "white",
            },
            py: 1.5,
            px: 2,
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
            <Logout />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontWeight: 500,
            }}
          />
        </ListItemButton>
      </Box>
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
          <BottomNavigationAction
            label="Logout"
            icon={<Logout />}
            onClick={handleLogoutClick}
            sx={{
              color: "error.main",
              "&.Mui-selected": {
                color: "error.main",
              },
            }}
          />
        </BottomNavigation>
      </Paper>
    );
  };

  // Logout Confirmation Dialog
  const LogoutDialog = () => (
    <Dialog
      open={logoutDialogOpen}
      onClose={handleLogoutCancel}
      aria-labelledby="logout-dialog-title"
      aria-describedby="logout-dialog-description"
    >
      <DialogTitle id="logout-dialog-title">Logout</DialogTitle>
      <DialogContent>
        <DialogContentText id="logout-dialog-description">
          Are you sure you want to logout?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleLogoutCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleLogoutConfirm} color="error" variant="contained">
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      {!isRouteExcluded(location.pathname, desktopSidebarExcludedRoutes) && (
        <DesktopDrawer />
      )}

      {!isRouteExcluded(location.pathname, mobileBottomBarExcludedRoutes) && (
        <MobileBottomNavigation />
      )}

      <LogoutDialog />
    </>
  );
};

export default Navigation;
