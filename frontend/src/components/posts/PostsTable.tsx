import * as React from "react";
import {
  DataGrid,
  type GridRowsProp,
  type GridColDef,
  GridRowModes,
  GridActionsCellItem,
  type GridRowModesModel,
  type GridRowId,
} from "@mui/x-data-grid";
import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import EditDialog, { type PostData } from "./EditDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import {
  PostService,
  type CreatePostRequest,
  type UpdatePostRequest,
} from "@/services/post";
import { useSelector } from "react-redux";
import { type RootState } from "@/store";

const initialRows: GridRowsProp = [];

interface PostsTableProps {
  title: string;
  showCreateButton?: boolean;
  filter?: "all" | "my";
}

export default function PostsTable({
  title,
  showCreateButton = true,
  filter = "all",
}: PostsTableProps) {
  // const { role } = useSelector((state: RootState) => state.auth);

  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const [rows, setRows] = React.useState(initialRows);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [selectedPost, setSelectedPost] = React.useState<PostData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [postToDelete, setPostToDelete] = React.useState<PostData | null>(null);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });
  const [totalRows, setTotalRows] = React.useState(0);
  const [isLoadingPosts, setIsLoadingPosts] = React.useState(false);

  // Load posts function with pagination
  const loadPosts = async (page: number, pageSize: number) => {
    setIsLoadingPosts(true);
    try {
      const response = await PostService.getAllPosts({
        page: page + 1, // API uses 1-based pagination, DataGrid uses 0-based
        limit: pageSize,
        filter: filter,
      });
      const gridPosts = response.posts.map((post) => ({
        id: post._id,
        title: post.title,
        content: post.content,
        author: post.author.username,
        status: post.status,
        fileMetadata: post.fileMetadata,
        createdAt: new Date(post.createdAt).toLocaleDateString(),
        updatedAt: new Date(post.updatedAt).toLocaleDateString(),
      }));
      setRows(gridPosts);
      setTotalRows(response.total);
    } catch (error) {
      console.error("Error loading posts:", error);
      // Error handling is now centralized in axios interceptor
    } finally {
      setIsLoadingPosts(false);
    }
  };

  // Load posts on component mount
  React.useEffect(() => {
    loadPosts(paginationModel.page, paginationModel.pageSize);
  }, [paginationModel.page, paginationModel.pageSize, filter]);

  const handleEditClick = (id: GridRowId) => () => {
    const post = rows.find((row) => row.id === id);
    if (post) {
      setSelectedPost(post as PostData);
      setEditDialogOpen(true);
    }
  };

  const handleCreatePost = () => {
    setSelectedPost(null);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedPost(null);
  };

  const handleSavePost = async (postData: PostData) => {
    setLoading(true);

    try {
      if (postData.id) {
        // Update existing post using API
        const updatePostData: UpdatePostRequest = {
          title: postData.title,
          content: postData.content,
          status: postData.status as "draft" | "published" | "archived",
          file: postData.file,
        };

        await PostService.updatePost(postData.id.toString(), updatePostData);

        // Refresh the current page instead of updating local state
        loadPosts(paginationModel.page, paginationModel.pageSize);
      } else {
        // Create new post using API
        const createPostData: CreatePostRequest = {
          title: postData.title,
          content: postData.content,
          status:
            (postData.status as "draft" | "published" | "archived") || "draft",
          file: postData.file,
        };

        await PostService.createPost(createPostData);

        // Refresh the current page instead of adding to local state
        loadPosts(paginationModel.page, paginationModel.pageSize);
      }

      setEditDialogOpen(false);
      setSelectedPost(null);
    } catch (error) {
      console.error("Error saving post:", error);
      // Error handling is now centralized in axios interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    const post = rows.find((row) => row.id === id);
    if (post) {
      setPostToDelete(post as PostData);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete || !postToDelete.id) return;

    setLoading(true);

    try {
      // Delete post using API
      await PostService.deletePost(postToDelete.id.toString());

      // Refresh the current page instead of removing from local state
      loadPosts(paginationModel.page, paginationModel.pageSize);

      // Close dialog and reset state
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    } catch (error) {
      console.error("Error deleting post:", error);
      // Error handling is now centralized in axios interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDialogClose = () => {
    if (!loading) {
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  // Handle pagination changes
  const handlePaginationModelChange = (newModel: any) => {
    setPaginationModel(newModel);
  };

  const columns: GridColDef[] = [
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              material={{
                sx: {
                  color: "primary.main",
                },
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
    { field: "title", headerName: "Title", width: 200, editable: true },
    { field: "content", headerName: "Content", width: 300 },
    {
      field: "fileMetadata",
      headerName: "File metadata",
      width: 200,
      renderCell: (params) => {
        const fileMetadata = params.value;
        if (fileMetadata) {
          return (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                // alignItems: "center",
                // gap: 1,
              }}
            >
              <Typography variant="body2" noWrap>
                Name:{fileMetadata.name}
              </Typography>
              <Typography variant="body2" noWrap>
                Type: {fileMetadata.type}
              </Typography>
            </Box>
          );
        }
        return (
          <Typography variant="body2" color="text.secondary">
            No file
          </Typography>
        );
      },
    },
    { field: "author", headerName: "Author", width: 200 },
    { field: "status", headerName: "Status", width: 200 },
    { field: "createdAt", headerName: "Created At", width: 200 },
    { field: "updatedAt", headerName: "Updated At", width: 200 },
  ];

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        {showCreateButton && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreatePost}
            sx={{ mb: 2 }}
          >
            Create New Post
          </Button>
        )}
      </Box>

      <DataGrid
        rows={rows}
        columns={columns}
        sx={{ height: 500 }}
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 25]}
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationModelChange}
        rowCount={totalRows}
        paginationMode="server"
        loading={isLoadingPosts}
      />

      <EditDialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        onSave={handleSavePost}
        post={selectedPost}
        loading={loading}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={handleDeleteConfirm}
        postTitle={postToDelete?.title}
        loading={loading}
      />
    </Box>
  );
}
