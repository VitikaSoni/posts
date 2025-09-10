import api from "@/configs/axios";

// Post interfaces
export interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    username: string;
    email: string;
  };
  status: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  status?: "draft" | "published" | "archived";
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  status?: "draft" | "published" | "archived";
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
    const res = await api.post(BASE_PATH, postData);
    return res.data;
  },

  // Update an existing post
  updatePost: async function (
    id: string,
    postData: UpdatePostRequest
  ): Promise<Post> {
    const res = await api.put(`${BASE_PATH}/${id}`, postData);
    return res.data;
  },

  // Delete a post
  deletePost: async function (id: string): Promise<{ message: string }> {
    const res = await api.delete(`${BASE_PATH}/${id}`);
    return res.data;
  },

  // Update post status only
  updatePostStatus: async function (
    id: string,
    statusData: UpdateStatusRequest
  ): Promise<Post> {
    const res = await api.patch(`${BASE_PATH}/${id}/status`, statusData);
    return res.data;
  },

  // Get posts by status
  getPostsByStatus: async function (
    status: "draft" | "published" | "archived",
    params?: PostQueryParams
  ): Promise<PostResponse> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);

    // Add status filter to search query
    const searchQuery = params?.search
      ? `${params.search} status:${status}`
      : `status:${status}`;
    queryParams.append("search", searchQuery);

    const queryString = queryParams.toString();
    const url = `${BASE_PATH}?${queryString}`;

    const res = await api.get(url);
    return res.data;
  },

  // Search posts
  searchPosts: async function (
    searchTerm: string,
    params?: PostQueryParams
  ): Promise<PostResponse> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    queryParams.append("search", searchTerm);

    const queryString = queryParams.toString();
    const url = `${BASE_PATH}?${queryString}`;

    const res = await api.get(url);
    return res.data;
  },
};
