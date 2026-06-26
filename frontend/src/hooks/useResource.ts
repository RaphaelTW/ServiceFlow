import { useEffect, useState } from 'react';
import { api, postJson, putJson } from '../services/api';

export function useResource<T>(path: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      setItems(await api<T[]>(path));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  }

  async function create(payload: Partial<T>) {
    await postJson<T>(path, payload);
    await load();
  }

  async function update(id: number, payload: Partial<T>) {
    await putJson<T>(`${path}/${id}`, payload);
    await load();
  }

  async function remove(id: number) {
    await api<void>(`${path}/${id}`, { method: 'DELETE' });
    await load();
  }

  async function activate(id: number) {
    await api<T>(`${path}/${id}/activate`, { method: 'PATCH' });
    await load();
  }

  async function deactivate(id: number) {
    await api<T>(`${path}/${id}/deactivate`, { method: 'PATCH' });
    await load();
  }

  useEffect(() => {
    load();
  }, [path]);

  return { items, loading, error, load, create, update, remove, activate, deactivate };
}
