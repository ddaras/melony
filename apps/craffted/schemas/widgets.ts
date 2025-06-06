export type Widget = {
  id: string;
  title: string;
  page_id: string;
  type: string;
  created_at?: string;
  config: Record<string, any>;
  size?: "small" | "medium" | "large" | "full";
  order?: number;
};
