import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { Person, Edit, Save, Cancel } from "@mui/icons-material";
import { ProfileService, type ProfileResponse } from "@/services/profile";
import { useNotifications } from "@/hooks/useNotifications";
import Loading from "@/components/Loading";

const Profile: React.FC = () => {
  // const { showNotification } = useNotifications();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });
  const [errors, setErrors] = useState({
    name: "",
  });

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const profileData = await ProfileService.getProfile();
      setProfile(profileData);
      setFormData({ name: profileData.name });
    } catch (error: any) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      name: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length > 20) {
      newErrors.name = "Name must be at most 20 characters";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleInputChange =
    (field: keyof typeof formData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({ name: profile?.name || "" });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ name: profile?.name || "" });
    setErrors({ name: "" });
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsUpdating(true);
      const updatedProfile = await ProfileService.updateProfile({
        name: formData.name.trim(),
      });
      setProfile(updatedProfile);
      setIsEditing(false);
      // showNotification("Profile updated successfully", "success");
    } catch (error: any) {
      // showNotification("Failed to update profile", "error");
      console.error("Error updating profile:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!profile) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">Failed to load profile data</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: "center", mb: { xs: 3, sm: 4 } }}>
          <Typography variant="h4" component="h1">
            Profile
          </Typography>
        </Box>

        <Card>
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: { xs: 2, sm: 3 },
                flexDirection: { xs: "column", sm: "row" },
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              <Person
                sx={{
                  mr: { xs: 0, sm: 2 },
                  mb: { xs: 1, sm: 0 },
                  color: "primary.main",
                  fontSize: { xs: "1.5rem", sm: "1.75rem" },
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: "1.1rem", sm: "1.25rem" },
                }}
              >
                Personal Information
              </Typography>
            </Box>

            <Divider sx={{ mb: { xs: 2, sm: 3 } }} />

            {/* Username (read-only) */}
            <Box sx={{ mb: { xs: 2, sm: 3 } }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1,
                  fontSize: { xs: "0.8rem", sm: "0.875rem" },
                }}
              >
                Username
              </Typography>
              <TextField
                fullWidth
                value={profile.username}
                disabled
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    color: "text.primary",
                    WebkitTextFillColor: "text.primary",
                  },
                }}
              />
            </Box>

            {/* Role (read-only) */}
            <Box sx={{ mb: { xs: 2, sm: 3 } }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1,
                  fontSize: { xs: "0.8rem", sm: "0.875rem" },
                }}
              >
                Role
              </Typography>
              <TextField
                fullWidth
                value={
                  profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
                }
                disabled
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    color: "text.primary",
                    WebkitTextFillColor: "text.primary",
                  },
                }}
              />
            </Box>

            {/* Name (editable) */}
            <Box sx={{ mb: { xs: 3, sm: 4 } }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1,
                  fontSize: { xs: "0.8rem", sm: "0.875rem" },
                }}
              >
                Name
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  value={formData.name}
                  onChange={handleInputChange("name")}
                  error={!!errors.name}
                  helperText={errors.name}
                  inputProps={{ maxLength: 20 }}
                  variant="outlined"
                  size="small"
                />
              ) : (
                <TextField
                  fullWidth
                  value={profile.name}
                  disabled
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: "text.primary",
                      WebkitTextFillColor: "text.primary",
                    },
                  }}
                />
              )}
            </Box>

            {/* Action buttons */}
            <Box
              sx={{
                display: "flex",
                gap: { xs: 1, sm: 2 },
                justifyContent: { xs: "center", sm: "flex-end" },
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              {isEditing ? (
                <>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={isUpdating}
                    startIcon={<Cancel />}
                    size="small"
                    sx={{
                      minWidth: { xs: "auto", sm: "120px" },
                      mb: { xs: 1, sm: 0 },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={isUpdating}
                    startIcon={
                      isUpdating ? <CircularProgress size={16} /> : <Save />
                    }
                    size="small"
                    sx={{ minWidth: { xs: "auto", sm: "140px" } }}
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleEdit}
                  startIcon={<Edit />}
                  size="small"
                  sx={{
                    minWidth: { xs: "auto", sm: "140px" },
                    maxWidth: { xs: "200px", sm: "none" },
                  }}
                >
                  Edit Profile
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Profile;
