// 统一请求封装：携带角色头（rbacMiddleware 识别），统一抛出携带 code/details 的错误
export interface ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json", "x-role": "LEADER", ...(init.headers ?? {}) },
    ...init
  });
  if (!res.ok) {
    let body: { code?: string; message?: string; details?: unknown } = {};
    try {
      body = await res.json();
    } catch {
      // 非 JSON 错误响应忽略解析失败
    }
    const error = new Error(body.message ?? `请求失败：${res.status}`) as ApiError;
    error.status = res.status;
    error.code = body.code ?? "REQUEST_FAILED";
    error.details = body.details;
    throw error;
  }
  return (await res.json()) as T;
}
