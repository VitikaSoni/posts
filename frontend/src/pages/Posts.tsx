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
import EditDialog, { type PostData } from "../components/Posts.tsx/EditDialog";
import DeleteConfirmationDialog from "../components/Posts.tsx/DeleteConfirmationDialog";

const initialRows: GridRowsProp = [
  {
    id: 1,
    title: "Getting Started with React",
    content:
      "This is a comprehensive guide to getting started with React development. Learn the basics of components, state, and props.",
    author: "John Doe",
    status: "published",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    title: "Advanced TypeScript Patterns",
    content:
      "Explore advanced TypeScript patterns and techniques that will make your code more maintainable and type-safe.",
    author: "Jane Smith",
    status: "draft",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    title: "Building Scalable APIs",
    content:
      "Learn how to build scalable and maintainable APIs using modern technologies and best practices.",
    author: "Mike Johnson",
    status: "archived",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function Posts() {
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const [rows, setRows] = React.useState(initialRows);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [selectedPost, setSelectedPost] = React.useState<PostData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [postToDelete, setPostToDelete] = React.useState<PostData | null>(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

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

  const handleDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedPost(null);
  };

  const handleSavePost = async (postData: PostData) => {
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (postData.id) {
        // Update existing post
        setRows(
          rows.map((row) =>
            row.id === postData.id
              ? { ...row, ...postData, updatedAt: new Date() }
              : row
          )
        );
      } else {
        // Create new post
        const newPost = {
          ...postData,
          id: Math.max(...rows.map((r) => r.id as number)) + 1,
          author: "Current User",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setRows([...rows, newPost]);
      }

      setEditDialogOpen(false);
      setSelectedPost(null);
    } catch (error) {
      console.error("Error saving post:", error);
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
    if (!postToDelete) return;

    setDeleteLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Remove the post from the rows
      setRows(rows.filter((row) => row.id !== postToDelete.id));

      // Close dialog and reset state
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteDialogClose = () => {
    if (!deleteLoading) {
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
          Posts Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreatePost}
          sx={{ mb: 2 }}
        >
          Create New Post
        </Button>
      </Box>

      <DataGrid
        rows={rows}
        columns={columns}
        sx={{ height: 500 }}
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 25]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 },
          },
        }}
      />

      <EditDialog
        open={editDialogOpen}
        onClose={handleDialogClose}
        onSave={handleSavePost}
        post={selectedPost}
        loading={loading}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={handleDeleteConfirm}
        postTitle={postToDelete?.title}
        loading={deleteLoading}
      />
    </Box>
  );
}
