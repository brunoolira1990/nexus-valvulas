// API_BASE deve incluir /api se não estiver incluído
const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:8000";
const API_BASE = BASE_URL.endsWith("/api") ? BASE_URL : `${BASE_URL}/api`;

/**
 * Normaliza resposta do DRF que pode vir paginada {results: [...]} ou como array direto
 */
function normalizeResponse(data: unknown): unknown[] {
  if (Array.isArray(data)) {
    return data;
  }
  if (
    data &&
    typeof data === "object" &&
    "results" in data &&
    Array.isArray((data as { results: unknown[] }).results)
  ) {
    return (data as { results: unknown[] }).results;
  }
  return [];
}

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: Record<string, unknown> | FormData;
  token?: string | null;
  isFormData?: boolean;
}

async function apiCall(path: string, options: ApiOptions = {}) {
  const { method = "GET", body, token = null, isFormData = false } = options;

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${path}`, config);

  // For file downloads, return the response directly
  if (response.headers.get("content-type")?.includes("application/octet-stream")) {
    return response;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
}

// Blog API
export async function getBlogPosts() {
  const data = await apiCall("/blog/posts");
  return normalizeResponse(data);
}

export async function getBlogPostBySlug(slug: string) {
  if (!slug || typeof slug !== "string") return null;
  const path = `/blog/posts/${encodeURIComponent(slug)}/`;
  const fullUrl = `${API_BASE}${path}`;
  console.log("[API] getBlogPostBySlug →", fullUrl);
  try {
    const data = await apiCall(path);
    console.log(
      "[API] getBlogPostBySlug resposta:",
      data ? "OK (objeto com título/slug)" : "vazio",
      data?.slug ?? data?.title ?? data
    );
    return data;
  } catch (err) {
    console.log("[API] getBlogPostBySlug erro:", err);
    throw err;
  }
}

// Auth
export async function login(email: string, password: string) {
  return apiCall("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export async function register(data: Record<string, unknown>) {
  return apiCall("/auth/register", {
    method: "POST",
    body: data,
  });
}

// Products API
export async function getCategories() {
  const data = await apiCall("/products/categories/");
  return normalizeResponse(data);
}

export async function getCategoryBySlug(slug: string) {
  return apiCall(`/products/categories/${slug}/`);
}

export async function getProducts(categorySlug?: string) {
  const path = categorySlug
    ? `/products/products/?category=${categorySlug}`
    : "/products/products/";
  const data = await apiCall(path);
  return normalizeResponse(data);
}

export async function getProductBySlug(slug: string) {
  return apiCall(`/products/products/${slug}/`);
}
