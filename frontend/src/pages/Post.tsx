import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PostService, type Post } from "@/services/post";
import Loading from "@/components/Loading";
import CommentsSection from "@/components/comments/CommentsSection";
import {
  ArrowBack,
  Person,
  AccessTime,
  Update,
  AttachFile,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Typography,
  Paper,
  Avatar,
  Divider,
} from "@mui/material";

export default function Post() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const postData = await PostService.getPostById(postId);
        setPost(postData);
      } catch (err: any) {
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (!post) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          mb: 20,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card sx={{ width: "100%", textAlign: "center" }}>
          <CardContent>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: "grey.200",
                mx: "auto",
                mb: 3,
              }}
            >
              📄
            </Avatar>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              fontWeight="bold"
            >
              Post Not Found
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              The post you're looking for doesn't exist or has been removed.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ArrowBack />}
              onClick={handleBack}
              sx={{ px: 3, py: 1.5 }}
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Button
          variant="text"
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{
            textTransform: "none",
            fontWeight: 500,
            color: "text.secondary",
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          Back to Posts
        </Button>
      </Box>
      <Container maxWidth="md" sx={{ px: "0" }}>
        {/* Header */}

        {/* Post Content */}
        <Card sx={{ boxShadow: 1, borderRadius: 2 }}>
          {/* Post Header */}
          <CardContent>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                fontWeight="600"
                color="text.primary"
              >
                {post.title}
              </Typography>

              <Box sx={{ mb: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip
                  icon={<Person />}
                  label={post.author.username}
                  variant="outlined"
                  size="small"
                  color="primary"
                />
                <Chip
                  icon={<AccessTime />}
                  label={formatDate(post.createdAt)}
                  variant="outlined"
                  size="small"
                  color="default"
                />
                {post.updatedAt !== post.createdAt && (
                  <Chip
                    icon={<Update />}
                    label={`Updated ${formatDate(post.updatedAt)}`}
                    variant="outlined"
                    size="small"
                    color="default"
                  />
                )}
              </Box>

              <Chip
                label={
                  post.status.charAt(0).toUpperCase() + post.status.slice(1)
                }
                color={
                  post.status === "published"
                    ? "success"
                    : post.status === "draft"
                    ? "warning"
                    : "default"
                }
                variant="filled"
                size="small"
              />
            </Box>
          </CardContent>

          <Divider />

          {/* Post Body */}
          <CardContent sx={{ p: 4, pt: 3 }}>
            <Typography
              variant="body1"
              sx={{
                whiteSpace: "pre-wrap",
                lineHeight: 1.7,
                fontSize: "1rem",
                color: "text.primary",
              }}
            >
              {post.content}
            </Typography>

            {/* File Attachment */}
            {post.fileMetadata && (
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  mt: 3,
                  bgcolor: "grey.50",
                  borderRadius: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    sx={{
                      bgcolor: "primary.light",
                      mr: 2,
                      width: 32,
                      height: 32,
                    }}
                  >
                    <AttachFile fontSize="small" />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="500">
                      {post.fileMetadata.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {post.fileMetadata.type}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            )}
          </CardContent>
        </Card>

        {/* Comments Section */}
        {postId && <CommentsSection postId={postId} />}
      </Container>
    </Box>
  );
}
