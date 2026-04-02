export type Message = { role: 'user' | 'assistant'; content: string };

export interface SavedPath {
  id: string;
  title: string;
  date: string;
  messages: Message[];
}
