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
  CircularProgress,
  Link,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Person, AdminPanelSettings } from "@mui/icons-material";
import ROUTES from "../configs/routes";
import { useDispatch } from "react-redux";
import { AuthService } from "@/services/auth";
import { setCredentials } from "@/store/authSlice";

interface FormData {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
  role: "user" | "admin" | "";
}

interface FormErrors {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
  role: string;
}

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
      role: "",
    };

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length > 20) {
      newErrors.name = "Name must be at most 20 characters";
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (formData.username.length > 20) {
      newErrors.username = "Username must be at most 20 characters";
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
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Register the user
      await AuthService.registerUser(
        formData.name,
        formData.username,
        formData.password,
        formData.role
      );

      // Automatically log in the user after successful registration
      const loginData = await AuthService.loginUser(
        formData.username,
        formData.password
      );
      dispatch(
        setCredentials({
          accessToken: loginData.accessToken,
        })
      );

      navigate(ROUTES.MY_POSTS);
    } catch (error: any) {
      // Error handling is now centralized in axios interceptor
      // This catch block is mainly for any additional error handling if needed
      console.error("Registration error:", error);
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

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={handleInputChange("name")}
            error={!!errors.name}
            helperText={errors.name}
            margin="normal"
            required
            inputProps={{ maxLength: 20 }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Username"
            value={formData.username}
            onChange={handleInputChange("username")}
            error={!!errors.username}
            helperText={errors.username}
            margin="normal"
            required
            inputProps={{ maxLength: 20 }}
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
