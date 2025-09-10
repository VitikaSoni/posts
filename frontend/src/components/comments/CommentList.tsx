import React from "react";
import { Box, Typography, Avatar, Paper, Stack, Divider } from "@mui/material";
import { type Comment } from "@/services/post";

interface CommentListProps {
  comments: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (comments.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          No comments yet. Be the first to comment!
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={{ xs: 1.5, sm: 2 }}>
      {comments.map((comment, index) => (
        <React.Fragment key={comment._id}>
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 1.5, sm: 2 },
              borderRadius: { xs: 1, sm: 2 },
              bgcolor: "grey.50",
            }}
          >
            <Box sx={{ display: "flex", gap: { xs: 1.5, sm: 2 } }}>
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: { xs: 28, sm: 32 },
                  height: { xs: 28, sm: 32 },
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                {comment.author.username.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: { xs: 0.5, sm: 1 },
                    mb: { xs: 0.5, sm: 1 },
                    flexWrap: "wrap",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight="600"
                    color="text.primary"
                    sx={{
                      fontSize: { xs: "0.8rem", sm: "0.875rem" },
                    }}
                  >
                    {comment.author.username}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: "0.7rem", sm: "0.75rem" },
                    }}
                  >
                    {formatDate(comment.createdAt)}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: "pre-wrap",
                    lineHeight: { xs: 1.5, sm: 1.6 },
                    color: "text.primary",
                    fontSize: { xs: "0.85rem", sm: "0.875rem" },
                  }}
                >
                  {comment.content}
                </Typography>
              </Box>
            </Box>
          </Paper>
          {index < comments.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </Stack>
  );
};

export default CommentList;
