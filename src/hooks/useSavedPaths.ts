import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { SavedPath, Message } from '@/components/learning-path/types';

function getUserId(): string | null {
  try {
    const raw = sessionStorage.getItem('entra_user');
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user?.id ?? null;
  } catch {
    return null;
  }
}

export function useSavedPaths() {
  const [savedPaths, setSavedPaths] = useState<SavedPath[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPaths = useCallback(async () => {
    const userId = getUserId();
    if (!userId) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('saved_learning_paths')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to load saved paths:', error);
      toast.error('Failed to load saved paths.');
    } else {
      setSavedPaths(
        (data ?? []).map((row: any) => ({
          id: row.id,
          title: row.title,
          date: row.date,
          messages: row.messages as Message[],
        }))
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPaths();
  }, [fetchPaths]);

  const savePath = useCallback(async (messages: Message[]) => {
    const userId = getUserId();
    if (!userId) {
      toast.error('Not signed in.');
      return;
    }
    if (messages.length === 0) {
      toast.error('Nothing to save — start a conversation first.');
      return;
    }

    const firstUserMsg = messages.find((m) => m.role === 'user');
    const title = firstUserMsg?.content.slice(0, 60) || 'Untitled Path';
    const date = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('saved_learning_paths')
      .insert({ user_id: userId, title, date, messages: messages as any })
      .select()
      .single();

    if (error) {
      console.error('Failed to save path:', error);
      toast.error('Failed to save learning path.');
    } else {
      setSavedPaths((prev) => [
        { id: data.id, title: data.title, date: data.date, messages: data.messages as Message[] },
        ...prev,
      ]);
      toast.success('Learning path saved!');
    }
  }, []);

  const deletePath = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('saved_learning_paths')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete path:', error);
      toast.error('Failed to delete path.');
    } else {
      setSavedPaths((prev) => prev.filter((p) => p.id !== id));
    }
  }, []);

  const loadPath = useCallback((id: string): Message[] | null => {
    const path = savedPaths.find((p) => p.id === id);
    return path ? [...path.messages] : null;
  }, [savedPaths]);

  const importPaths = useCallback(async (imported: SavedPath[]) => {
    const userId = getUserId();
    if (!userId) return;

    const existingIds = new Set(savedPaths.map((p) => p.id));
    const newPaths = imported.filter((p) => !existingIds.has(p.id));
    if (newPaths.length === 0) {
      toast.info('No new paths to import.');
      return;
    }

    const rows = newPaths.map((p) => ({
      user_id: userId,
      title: p.title,
      date: p.date,
      messages: p.messages as any,
    }));

    const { data, error } = await supabase
      .from('saved_learning_paths')
      .insert(rows)
      .select();

    if (error) {
      console.error('Failed to import paths:', error);
      toast.error('Failed to import paths.');
    } else {
      const mapped = (data ?? []).map((row: any) => ({
        id: row.id,
        title: row.title,
        date: row.date,
        messages: row.messages as Message[],
      }));
      setSavedPaths((prev) => [...mapped, ...prev]);
      toast.success(`Imported ${mapped.length} path(s).`);
    }
  }, [savedPaths]);

  return { savedPaths, loading, savePath, deletePath, loadPath, importPaths };
}
