import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ROUTES from "../configs/routes";

const Landing = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate(ROUTES.REGISTER);
  };

  const handleLogin = () => {
    navigate(ROUTES.LOGIN);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        marginLeft: "-140px",
        width: "100%",
        marginHorizontal: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        // elevation={8}
        sx={{
          p: { xs: 4, md: 6 },
          borderRadius: 4,
          textAlign: "center",
        }}
      >
        <Typography
          variant={"h1"}
          sx={{
            fontWeight: 600,
            mb: 2,
            background: "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1.2,
            textAlign: "left",
          }}
        >
          Welcome to <br />
          Posts
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            mb: 4,
            textAlign: "left",
            fontWeight: 300,
            lineHeight: 1.5,
          }}
        >
          Manage and organize your posts with ease
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button variant="contained" size="large" onClick={handleRegister}>
            Register
          </Button>
          <Button variant="outlined" size="large" onClick={handleLogin}>
            Login
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Landing;
