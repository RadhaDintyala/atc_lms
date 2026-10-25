export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: 'student' | 'admin';
  full_name: string;
  created_at: string;
  status: 'active' | 'inactive';
}

export interface StudentProfile {
  id: string;
  user_id: string;
  roll_number: string;
  college: string;
  department: string;
  current_year: 'year_1' | 'year_2' | 'year_3';
  track_id: 'common' | 'fullstack' | 'ai';
  profile_image?: string;
  github_url?: string;
  created_at: string;
  last_active_at: string;
}

export interface Track {
  id: string;
  name: string;
  code: string;
  description: string;
}

export interface Year {
  id: string;
  name: string;
  year_number: number;
  description: string;
}

export interface Category {
  id: string;
  year_id: string;
  track_id: string;
  name: string;
  description: string;
  order: number;
}

export interface Topic {
  id: string;
  category_id: string;
  year_id: string;
  track_id: string;
  title: string;
  slug: string;
  description: string;
  learning_objectives: string[];
  estimated_duration_minutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  is_required: boolean;
  is_published: boolean;
  order: number;
  suggested_project?: string;
}

export interface Resource {
  id: string;
  topic_id: string;
  title: string;
  description: string;
  type: 'Documentation' | 'Video' | 'Course' | 'Tutorial' | 'Repository' | 'Article' | 'Practice';
  url: string;
  duration_minutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  display_order: number;
  published: boolean;
  is_sample: boolean;
}

export interface StudentTopicProgress {
  id: string;
  student_id: string;
  topic_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  started_at?: string;
  completed_at?: string;
  notes?: string;
  updated_at: string;
}

export interface StudentResourceProgress {
  id: string;
  student_id: string;
  resource_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completed_at?: string;
  updated_at: string;
}

export interface Project {
  id: string;
  student_id: string;
  topic_id?: string;
  title: string;
  problem_statement: string;
  tech_stack: string[];
  github_url: string;
  deployment_url: string;
  description: string;
  completion_notes?: string;
  status: 'draft' | 'submitted' | 'under_review' | 'changes_requested' | 'approved';
  created_at: string;
  submitted_at?: string;
  reviewed_at?: string;
  reviewer_feedback?: string;
  reviewer_id?: string;
  history: Array<{
    date: string;
    action: string;
    status: string;
    notes?: string;
    by: string;
  }>;
}

export interface ActivityLog {
  id: string;
  student_id: string;
  type: 'topic_status' | 'resource_completed' | 'project_submitted' | 'project_reviewed' | 'profile_updated';
  description: string;
  timestamp: string;
}
