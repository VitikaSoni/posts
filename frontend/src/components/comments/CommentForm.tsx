import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Send } from "@mui/icons-material";

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  loading?: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  loading = false,
}) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSubmit(content.trim());
      setContent("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: { xs: 1, sm: 2 },
        bgcolor: "background.paper",
      }}
    >
      <Typography
        variant="h6"
        component="h3"
        gutterBottom
        fontWeight="600"
        color="text.primary"
        sx={{
          fontSize: { xs: "1.1rem", sm: "1.25rem" },
        }}
      >
        Add a Comment
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your comment here..."
          variant="outlined"
          disabled={isSubmitting || loading}
          sx={{
            mb: { xs: 1.5, sm: 2 },
            "& .MuiOutlinedInput-root": {
              borderRadius: { xs: 1, sm: 2 },
            },
            "& .MuiInputBase-input": {
              fontSize: { xs: "0.9rem", sm: "1rem" },
            },
          }}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="submit"
            variant="contained"
            startIcon={
              isSubmitting ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <Send />
              )
            }
            disabled={!content.trim() || isSubmitting || loading}
            sx={{
              px: { xs: 2, sm: 3 },
              py: { xs: 0.75, sm: 1 },
              borderRadius: { xs: 1, sm: 2 },
              textTransform: "none",
              fontWeight: 500,
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default CommentForm;
