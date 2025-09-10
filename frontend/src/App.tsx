import "./App.css";
import { Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import ROUTES from "./configs/routes";
import Navigation from "./components/navigation/Navigation";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { refreshAccessToken } from "@/store/authSlice";
import Login from "./pages/Login";
import Posts from "./pages/Posts";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import MyPosts from "./pages/MyPosts";
import NotificationProvider from "./components/NotificationProvider";
import Post from "./pages/Post";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Material Blue 700
      light: "#42a5f5", // Material Blue 400
      dark: "#1565c0", // Material Blue 800
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#2196f3", // Material Blue 500
      light: "#64b5f6", // Material Blue 300
      dark: "#1976d2", // Material Blue 700
      contrastText: "#ffffff",
    },
    background: {
      default: "#f5f7fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#1a202c",
      secondary: "#4a5568",
    },
    grey: {
      50: "#f7fafc",
      100: "#edf2f7",
      200: "#e2e8f0",
      300: "#cbd5e0",
      400: "#a0aec0",
      500: "#718096",
      600: "#4a5568",
      700: "#2d3748",
      800: "#1a202c",
      900: "#171923",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 8,
          padding: "8px 16px",
        },
        contained: {
          boxShadow: "0 2px 8px rgba(25, 118, 210, 0.2)",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        elevation1: {
          boxShadow:
            "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
        },
        elevation2: {
          boxShadow:
            "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
        },
        elevation3: {
          boxShadow:
            "0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: "1px solid #e2e8f0",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: "2px 0",
          "&:hover": {
            backgroundColor: "rgba(25, 118, 210, 0.08)",
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(25, 118, 210, 0.12)",
            "&:hover": {
              backgroundColor: "rgba(25, 118, 210, 0.16)",
            },
          },
        },
      },
    },
  },
});

function App() {
  const dispatch = useDispatch();

  // Check for existing tokens and refresh on app initialization
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Try to refresh the access token using the refresh token
        await dispatch(refreshAccessToken() as any).unwrap();
      } catch (error) {
        // If refresh fails, user will be redirected to login
        console.log("Token refresh failed on app initialization:", error);
      }
    };

    initializeAuth();
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navigation
        desktopSidebarExcludedRoutes={[
          ROUTES.LOGIN,
          ROUTES.LANDING,
          ROUTES.REGISTER,
        ]}
        mobileBottomBarExcludedRoutes={[
          ROUTES.LOGIN,
          ROUTES.LANDING,
          ROUTES.REGISTER,
        ]}
      />
      <Box
        component="main"
        sx={{
          marginLeft: { lg: "280px" },
          minHeight: "100vh",
          backgroundColor: "background.default",
          position: "relative",
          top: 0,
          left: 0,
          padding: 3,
          pb: 10,
          width: { lg: "calc(100% - 280px)" },
        }}
      >
        <Routes>
          <Route
            path={ROUTES.LANDING}
            element={
              <PublicRoute>
                <Landing />
              </PublicRoute>
            }
          />
          <Route
            path={ROUTES.REGISTER}
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path={ROUTES.LOGIN}
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path={ROUTES.POSTS}
            element={
              <ProtectedRoute>
                <Posts />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.POST}
            element={
              <ProtectedRoute>
                <Post />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.MY_POSTS}
            element={
              <ProtectedRoute>
                <MyPosts />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PROFILE}
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Box>
      <NotificationProvider />
    </ThemeProvider>
  );
}

export default App;
