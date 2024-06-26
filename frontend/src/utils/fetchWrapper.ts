type FetchWrapperProps = {
  url: string;
  method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
  contentType?: string;
  body?: Record<string, unknown> | FormData | string;
  signal?: AbortSignal;
};

export const fetchWrapper = async ({
  url,
  method,
  contentType = "application/json",
  body,
  signal,
}: FetchWrapperProps): Promise<Response> => {
  const headers: HeadersInit = {};

  if (contentType) {
    headers["Content-Type"] = contentType;
  }

  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
    body:
      method == "POST" || method == "PUT" || method == "PATCH" ? JSON.stringify(body) : undefined,
    signal,
  };

  return fetch(url, config);
};
