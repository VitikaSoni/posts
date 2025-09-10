import api from "@/configs/axios";

// Post interfaces
export interface FileMetadata {
  name: string;
  type: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    username: string;
  };
  status: "draft" | "published" | "archived";
  fileMetadata?: FileMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  status?: "draft" | "published" | "archived";
  file?: File;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  status?: "draft" | "published" | "archived";
  file?: File;
}

export interface PostQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  filter?: "all" | "my";
}

export interface PostResponse {
  posts: Post[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface UpdateStatusRequest {
  status: "draft" | "published" | "archived";
}

export interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CommentResponse {
  comments: Comment[];
}

export interface CreateCommentRequest {
  content: string;
}

const BASE_PATH = "/posts";

export const PostService = {
  // Get posts with pagination, search, and filtering
  getAllPosts: async function (
    params?: PostQueryParams
  ): Promise<PostResponse> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.filter) queryParams.append("filter", params.filter);

    const queryString = queryParams.toString();
    const url = queryString ? `${BASE_PATH}?${queryString}` : BASE_PATH;

    const res = await api.get(url);
    return res.data;
  },

  // Get current user's posts (convenience method)
  getMyPosts: async function (
    params?: Omit<PostQueryParams, "filter">
  ): Promise<PostResponse> {
    return this.getAllPosts({ ...params, filter: "my" });
  },

  // Get a single post by ID
  getPostById: async function (id: string): Promise<Post> {
    const res = await api.get(`${BASE_PATH}/${id}`);
    return res.data;
  },

  // Create a new post
  createPost: async function (postData: CreatePostRequest): Promise<Post> {
    const formData = new FormData();
    formData.append("title", postData.title);
    formData.append("content", postData.content);
    if (postData.status) {
      formData.append("status", postData.status);
    }
    if (postData.file) {
      formData.append("file", postData.file);
    }

    const res = await api.post(BASE_PATH, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  // Update an existing post
  updatePost: async function (
    id: string,
    postData: UpdatePostRequest
  ): Promise<Post> {
    const formData = new FormData();
    if (postData.title) {
      formData.append("title", postData.title);
    }
    if (postData.content) {
      formData.append("content", postData.content);
    }
    if (postData.status) {
      formData.append("status", postData.status);
    }
    if (postData.file) {
      formData.append("file", postData.file);
    }

    const res = await api.put(`${BASE_PATH}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  // Delete a post
  deletePost: async function (id: string): Promise<{ message: string }> {
    const res = await api.delete(`${BASE_PATH}/${id}`);
    return res.data;
  },

  getComments: async function (postId: string): Promise<CommentResponse> {
    const res = await api.get(`${BASE_PATH}/${postId}/comments`);
    return res.data;
  },

  createComment: async function (
    postId: string,
    content: string
  ): Promise<Comment> {
    const res = await api.post(`${BASE_PATH}/${postId}/comments`, { content });
    return res.data;
  },
};
