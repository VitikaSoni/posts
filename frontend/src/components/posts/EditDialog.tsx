import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
} from "@mui/material";
// import { LoadingButton } from '@mui/lab';

export interface PostData {
  id?: number;
  title: string;
  content: string;
  status: "draft" | "published" | "archived";
  author?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (postData: PostData) => void;
  post?: PostData | null;
  loading?: boolean;
}

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

export default function EditDialog({
  open,
  onClose,
  onSave,
  post,
  loading = false,
}: EditDialogProps) {
  const [formData, setFormData] = useState<PostData>({
    title: "",
    content: "",
    status: "draft",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Reset form when dialog opens/closes or post changes
  useEffect(() => {
    if (open) {
      if (post) {
        setFormData({
          id: post.id,
          title: post.title || "",
          content: post.content || "",
          status: post.status || "draft",
          author: post.author,
          image: post.image,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
        });
      } else {
        setFormData({
          title: "",
          content: "",
          status: "draft",
        });
      }
      setErrors({});
    }
  }, [open, post]);

  const handleInputChange =
    (field: keyof PostData) =>
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
    ) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }
    };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters long";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    } else if (formData.content.length < 10) {
      newErrors.content = "Content must be at least 10 characters long";
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: "500px" },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" component="div">
          {post ? "Edit Post" : "Create New Post"}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
          {/* Title Field */}
          <TextField
            label="Title"
            value={formData.title}
            onChange={handleInputChange("title")}
            fullWidth
            error={!!errors.title}
            helperText={errors.title}
            placeholder="Enter post title"
            variant="outlined"
          />

          {/* Content Field */}
          <TextField
            label="Content"
            value={formData.content}
            onChange={handleInputChange("content")}
            fullWidth
            multiline
            rows={6}
            error={!!errors.content}
            helperText={errors.content}
            placeholder="Enter post content"
            variant="outlined"
          />

          {/* Status Field */}
          <FormControl fullWidth error={!!errors.status}>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              onChange={handleInputChange("status")}
              label="Status"
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {errors.status && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 0.5, ml: 1.5 }}
              >
                {errors.status}
              </Typography>
            )}
          </FormControl>

          {/* Show validation errors */}
          {Object.keys(errors).length > 0 && (
            <Alert severity="error">
              Please fix the errors above before saving.
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={loading} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={
            !formData.title.trim() || !formData.content.trim() || loading
          }
        >
          {loading ? "Saving..." : post ? "Update Post" : "Create Post"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
