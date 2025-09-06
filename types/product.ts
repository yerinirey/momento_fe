export type UUID = string;

export interface Product {
  id: UUID;
  user_id: UUID;
  name: string;
  description?: string | null;
  model_url?: string | null;
  thumbnail_url?: string | null;
  created_at: string;
}
