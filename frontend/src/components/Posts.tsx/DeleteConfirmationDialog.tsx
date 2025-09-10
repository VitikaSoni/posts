import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  postTitle?: string;
  loading?: boolean;
}

export default function DeleteConfirmationDialog({
  open,
  onClose,
  onConfirm,
  postTitle = "",
  loading = false,
}: DeleteConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { minHeight: "200px" },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <DeleteIcon color="error" />
          <Typography variant="h6" component="div">
            Delete Post
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <Typography variant="body1">
            Are you sure you want to delete this post? This action cannot be
            undone.
          </Typography>

          {postTitle && (
            <Alert severity="warning" sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                Post Title: "{postTitle}"
              </Typography>
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
          color="inherit"
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={loading}
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
        >
          {loading ? "Deleting..." : "Delete Post"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
