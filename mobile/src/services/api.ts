const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

export async function api<T>(path: string, token?: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.message ?? 'Erro na API.');
  }

  return payload.data as T;
}

