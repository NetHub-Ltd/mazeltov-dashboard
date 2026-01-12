import axios, { InternalAxiosRequestConfig } from "axios";

// 1. Create the base instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials ensures cookies are sent automatically on the client side
  withCredentials: true,
});

// 2. Request Interceptor: Environment-aware header injection
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const isServer = typeof window === "undefined";

    if (isServer) {
      // Dynamic import to prevent bundling server-only code into the client
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const token = cookieStore.get("auth_token")?.value;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor: Centralized Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors like 401 Unauthorized
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Client-side redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
