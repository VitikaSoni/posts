import React, { useState, useEffect } from "react";
import { Box, Typography, Divider } from "@mui/material";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import { PostService, type Comment } from "@/services/post";
import Loading from "../Loading";

interface CommentsSectionProps {
  postId: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await PostService.getComments(postId);
      setComments(response.comments);
    } catch (err: any) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (content: string) => {
    try {
      setSubmitting(true);
      const newComment = await PostService.createComment(postId, content);
      setComments((prev) => [newComment, ...prev]);
    } catch (err: any) {
      console.error("Error creating comment:", err);

      throw err; // Re-throw to let CommentForm handle the error state
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <Box sx={{ mt: { xs: 3, sm: 4 } }}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        fontWeight="600"
        color="text.primary"
        sx={{
          mb: { xs: 2, sm: 3 },
          fontSize: { xs: "1.25rem", sm: "1.5rem" },
        }}
      >
        Comments ({comments.length})
      </Typography>

      <CommentForm onSubmit={handleSubmitComment} loading={submitting} />

      <Divider sx={{ my: { xs: 2, sm: 3 } }} />

      {loading ? <Loading /> : <CommentList comments={comments} />}
    </Box>
  );
};

export default CommentsSection;
