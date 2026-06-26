const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1';

type ApiResponse<T> = {
  message: string;
  data: T;
};

export const tokenStore = {
  get: () => localStorage.getItem('serviceflow.token'),
  set: (token: string) => localStorage.setItem('serviceflow.token', token),
  clear: () => localStorage.removeItem('serviceflow.token')
};

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = tokenStore.get();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {})
    }
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = (await response.json()) as ApiResponse<T>;
  if (!response.ok) {
    throw new Error(payload.message || 'Erro na comunicação com o servidor.');
  }

  return payload.data;
}

export const postJson = <T>(path: string, body: unknown) =>
  api<T>(path, { method: 'POST', body: JSON.stringify(body) });

export const putJson = <T>(path: string, body: unknown) =>
  api<T>(path, { method: 'PUT', body: JSON.stringify(body) });

