const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  token?: string | null;
  isFormData?: boolean;
}

async function apiCall(path: string, options: ApiOptions = {}) {
  const {
    method = 'GET',
    body,
    token = null,
    isFormData = false
  } = options;

  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const config: RequestInit = {
    method,
    headers
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${path}`, config);
  
  // For file downloads, return the response directly
  if (response.headers.get('content-type')?.includes('application/octet-stream')) {
    return response;
  }

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

// Categories
export async function getCategories() {
  return apiCall('/categories');
}

export async function createCategory(data: any) {
  return apiCall('/categories', {
    method: 'POST',
    body: data
  });
}

export async function updateCategory(id: string, data: any) {
  return apiCall(`/categories/${id}`, {
    method: 'PUT',
    body: data
  });
}

export async function deleteCategory(id: string) {
  return apiCall(`/categories/${id}`, {
    method: 'DELETE'
  });
}

export async function uploadCategoryImage(categoryId: string, file: File) {
  const formData = new FormData();
  formData.append('image', file);
  return apiCall(`/categories/${categoryId}/image`, {
    method: 'POST',
    body: formData,
    isFormData: true
  });
}

// Products
export async function getProducts(filters?: any) {
  const params = new URLSearchParams(filters).toString();
  return apiCall(`/products${params ? `?${params}` : ''}`);
}

export async function getProduct(id: string) {
  return apiCall(`/products/${id}`);
}

// Auth
export async function login(email: string, password: string) {
  return apiCall('/auth/login', {
    method: 'POST',
    body: { email, password }
  });
}

export async function register(data: any) {
  return apiCall('/auth/register', {
    method: 'POST',
    body: data
  });
}

// Blog
export async function getBlogPosts() {
  return apiCall('/blog/posts');
}

export async function getBlogPostBySlug(slug: string) {
  return apiCall(`/blog/posts/slug/${slug}`);
}