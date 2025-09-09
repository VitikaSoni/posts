import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  CircularProgress,
  Link,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Person, AdminPanelSettings } from "@mui/icons-material";
import ROUTES from "../configs/routes";
import { useDispatch } from "react-redux";
import { registerUser, loginUser } from "@/services/auth";
import { setCredentials } from "@/store/authSlice";

interface FormData {
  username: string;
  password: string;
  confirmPassword: string;
  role: "user" | "admin" | "";
}

interface FormErrors {
  username: string;
  password: string;
  confirmPassword: string;
  role: string;
}

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [errors, setErrors] = useState<FormErrors>({
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      username: "",
      password: "",
      confirmPassword: "",
      role: "",
    };

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username =
        "Username can only contain letters, numbers, and underscores";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = "Please select a role";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleInputChange =
    (field: keyof FormData) =>
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
    ) => {
      const value = event.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
      setSubmitError("");
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSubmitError("");

    try {
      // Simulate API call
      await registerUser(formData.username, formData.password, formData.role);

      // 2️⃣ Automatically log in the user after registration
      const loginData = await loginUser(formData.username, formData.password);
      dispatch(
        setCredentials({
          accessToken: loginData.accessToken,
          username: formData.username,
        })
      );

      navigate(ROUTES.POSTS);
    } catch (error) {
      setSubmitError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        p: 3,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography
            variant="h4"
            // component="h1"
            sx={{ fontWeight: 600, mb: 1 }}
          >
            Create Account
          </Typography>
        </Box>

        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Username"
            value={formData.username}
            onChange={handleInputChange("username")}
            error={!!errors.username}
            helperText={errors.username}
            margin="normal"
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleInputChange("password")}
            error={!!errors.password}
            helperText={errors.password}
            margin="normal"
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            margin="normal"
            required
            sx={{ mb: 2 }}
          />

          <FormControl
            fullWidth
            margin="normal"
            error={!!errors.role}
            sx={{ mb: 3 }}
          >
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.role}
              onChange={handleInputChange("role")}
              label="Role"
            >
              <MenuItem value="user">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Person fontSize="small" />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      User
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Manage your posts
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
              <MenuItem value="admin">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AdminPanelSettings fontSize="small" />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Admin
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Manage all posts
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            </Select>
            {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{
              py: 1.5,
              mb: 2,
              fontSize: "1.1rem",
              fontWeight: 500,
            }}
          >
            {isLoading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                Creating Account...
              </Box>
            ) : (
              "Sign Up"
            )}
          </Button>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Link
                component={RouterLink}
                to={ROUTES.LOGIN}
                sx={{
                  fontWeight: 500,
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Sign in here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;
