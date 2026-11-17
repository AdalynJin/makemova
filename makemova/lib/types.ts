export type ProjectStatus = 'draft' | 'active' | 'completed' | 'archived';

export type Project = {
  id: string;
  owner_id: string;
  title: string;
  status: ProjectStatus;
  skill_focus: string | null;
  created_at: string;
};
