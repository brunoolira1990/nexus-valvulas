// API_BASE deve incluir /api se não estiver incluído
const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
const API_BASE = BASE_URL.endsWith('/api') ? BASE_URL : `${BASE_URL}/api`;

/**
 * Normaliza resposta do DRF que pode vir paginada {results: [...]} ou como array direto
 */
function normalizeResponse(data: any): any[] {
  if (Array.isArray(data)) {
    return data;
  }
  if (data && Array.isArray(data.results)) {
    return data.results;
  }
  return [];
}

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

// Blog API
export async function getBlogPosts() {
  const data = await apiCall('/blog/posts');
  return normalizeResponse(data);
}

export async function getBlogPostBySlug(slug: string) {
  return apiCall(`/blog/posts/${slug}`);
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
