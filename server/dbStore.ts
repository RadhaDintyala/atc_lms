import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  User,
  StudentProfile,
  Track,
  Year,
  Category,
  Topic,
  Resource,
  StudentTopicProgress,
  StudentResourceProgress,
  Project,
  ActivityLog,
} from './types.ts';
import { generateSeedData } from './seedData.ts';
import { PROJECT_CATALOG } from '../src/data/projectCatalog.js';

const JWT_SECRET = process.env.JWT_SECRET || 'beacon-engineering-lms-jwt-secret-key-2026';
const DATA_DIR = process.env.DB_PATH
  ? path.dirname(process.env.DB_PATH)
  : path.resolve(process.cwd(), 'data');
const DB_FILE = process.env.DB_PATH || path.resolve(DATA_DIR, 'db.json');

export interface DatabaseSchema {
  users: User[];
  profiles: StudentProfile[];
  tracks: Track[];
  years: Year[];
  categories: Category[];
  topics: Topic[];
  resources: Resource[];
  topicProgress: StudentTopicProgress[];
  resourceProgress: StudentResourceProgress[];
  projects: Project[];
  activityLogs: ActivityLog[];
}

class DBStore {
  private db: DatabaseSchema;

  constructor() {
    this.db = this.init();
  }

  private init(): DatabaseSchema {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.db = parsed;
        this.syncProjectTopicProgress();
        return this.db;
      } catch (err) {
        console.error('Failed to read db.json, generating fresh seed data:', err);
      }
    }

    const initialData = generateSeedData();
    this.db = initialData;
    this.syncProjectTopicProgress();
    this.saveToDisk(this.db);
    return this.db;
  }

  private syncProjectTopicProgress(): void {
    if (!this.db?.projects || !this.db?.topicProgress) return;
    this.db.projects.forEach((proj) => {
      if (
        proj.topic_id &&
        (proj.status === 'approved' || proj.status === 'submitted' || proj.status === 'under_review') &&
        proj.github_url &&
        proj.github_url.trim().length > 0
      ) {
        const cur = this.db.topicProgress.find(
          (tp) => tp.student_id === proj.student_id && tp.topic_id === proj.topic_id
        );
        if (!cur) {
          this.db.topicProgress.push({
            id: `prog-${proj.student_id}-${proj.topic_id}`,
            student_id: proj.student_id,
            topic_id: proj.topic_id,
            status: 'completed',
            completed_at: proj.submitted_at || new Date().toISOString(),
            notes: 'Completed automatically via project GitHub submission',
            updated_at: new Date().toISOString(),
          });
        } else if (cur.status !== 'completed') {
          cur.status = 'completed';
          cur.completed_at = cur.completed_at || proj.submitted_at || new Date().toISOString();
        }
      }
    });

    // Ensure curriculum topics requiring projects from PROJECT_CATALOG only stay completed if GitHub URL is submitted
    const projectTopicIds = new Set(PROJECT_CATALOG.map((p: any) => p.topic_id));
    this.db.topicProgress.forEach((tp) => {
      if (projectTopicIds.has(tp.topic_id) && tp.status === 'completed') {
        const hasValidSubmission = this.db.projects.some(
          (p) =>
            p.student_id === tp.student_id &&
            p.topic_id === tp.topic_id &&
            (p.status === 'approved' || p.status === 'submitted' || p.status === 'under_review') &&
            p.github_url &&
            p.github_url.trim().length > 0
        );
        if (!hasValidSubmission) {
          tp.status = 'in_progress';
          tp.completed_at = undefined;
          tp.notes = 'Requires project GitHub submission to complete';
        }
      }
    });
  }

  private saveToDisk(data: DatabaseSchema = this.db): void {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing to db.json:', err);
    }
  }

  // --- Auth & Users ---
  public authenticate(email: string, passwordPlain: string): { token: string; user: User; profile?: StudentProfile } | null {
    const user = this.db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null;
    if (user.status !== 'active') {
      throw new Error('Account is deactivated. Please contact your administrator.');
    }

    const isValid = bcrypt.compareSync(passwordPlain, user.password_hash);
    if (!isValid) return null;

    const profile = this.db.profiles.find((p) => p.user_id === user.id);
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        profileId: profile?.id,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    if (profile) {
      profile.last_active_at = new Date().toISOString();
      this.saveToDisk();
    }

    return { token, user, profile };
  }

  public verifyToken(token: string): { userId: string; email: string; role: 'student' | 'admin'; profileId?: string } | null {
    try {
      return jwt.verify(token, JWT_SECRET) as any;
    } catch {
      return null;
    }
  }

  public getUserById(id: string): User | undefined {
    return this.db.users.find((u) => u.id === id);
  }

  public getProfileByUserId(userId: string): StudentProfile | undefined {
    return this.db.profiles.find((p) => p.user_id === userId);
  }

  public getProfileById(profileId: string): StudentProfile | undefined {
    return this.db.profiles.find((p) => p.id === profileId);
  }

  // --- Students Management (Admin) ---
  public getAllStudents() {
    return this.db.profiles.map((profile) => {
      const user = this.db.users.find((u) => u.id === profile.user_id);
      const progress = this.calculateStudentProgress(profile.id);
      const studentProjects = this.db.projects.filter((p) => p.student_id === profile.id);

      // Check inactive if > 14 days
      const lastActive = new Date(profile.last_active_at || profile.created_at).getTime();
      const fourteenDaysAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
      const isInactiveWarning = lastActive < fourteenDaysAgo;

      return {
        ...profile,
        full_name: user?.full_name || 'Unknown',
        email: user?.email || '',
        account_status: user?.status || 'inactive',
        progress,
        projects_count: studentProjects.length,
        approved_projects_count: studentProjects.filter((p) => p.status === 'approved').length,
        is_inactive_warning: isInactiveWarning,
      };
    });
  }

  public getStudentDetail(profileId: string) {
    const profile = this.db.profiles.find((p) => p.id === profileId);
    if (!profile) return null;
    const user = this.db.users.find((u) => u.id === profile.user_id);
    const progress = this.calculateStudentProgress(profile.id);
    const studentProjects = this.db.projects.filter((p) => p.student_id === profile.id);
    const topicProgressRecords = this.db.topicProgress.filter((tp) => tp.student_id === profile.id);
    const resourceProgressRecords = this.db.resourceProgress.filter((rp) => rp.student_id === profile.id);
    const logs = this.db.activityLogs
      .filter((l) => l.student_id === profile.id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return {
      profile,
      user,
      progress,
      projects: studentProjects,
      topicProgress: topicProgressRecords,
      resourceProgress: resourceProgressRecords,
      activityLogs: logs,
    };
  }

  public createStudent(data: {
    full_name: string;
    email: string;
    passwordPlain: string;
    roll_number: string;
    college: string;
    department: string;
    current_year: 'year_1' | 'year_2' | 'year_3';
    track_id: 'common' | 'fullstack' | 'ai';
    github_url?: string;
  }) {
    // Unique email check
    if (this.db.users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      throw new Error(`Email ${data.email} is already registered.`);
    }
    // Unique roll number check
    if (this.db.profiles.some((p) => p.roll_number.toLowerCase() === data.roll_number.toLowerCase())) {
      throw new Error(`Roll number ${data.roll_number} is already assigned.`);
    }

    const userId = `usr-student-${Date.now()}`;
    const profileId = `prof-student-${Date.now()}`;
    const now = new Date().toISOString();

    const newUser: User = {
      id: userId,
      email: data.email.trim(),
      password_hash: bcrypt.hashSync(data.passwordPlain, 10),
      role: 'student',
      full_name: data.full_name.trim(),
      created_at: now,
      status: 'active',
    };

    const newProfile: StudentProfile = {
      id: profileId,
      user_id: userId,
      roll_number: data.roll_number.trim(),
      college: data.college.trim() || 'Beacon Institute of Technology',
      department: data.department.trim(),
      current_year: data.current_year,
      track_id: data.track_id,
      github_url: data.github_url?.trim(),
      created_at: now,
      last_active_at: now,
    };

    this.db.users.push(newUser);
    this.db.profiles.push(newProfile);

    this.db.activityLogs.push({
      id: `act-${Date.now()}`,
      student_id: profileId,
      type: 'profile_updated',
      description: `Student account created for ${data.full_name} (${data.roll_number}).`,
      timestamp: now,
    });

    this.saveToDisk();

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: 'student', profileId: newProfile.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { token, user: newUser, profile: newProfile };
  }

  public createAdmin(data: {
    full_name: string;
    email: string;
    passwordPlain: string;
  }) {
    if (this.db.users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      throw new Error(`Email ${data.email} is already registered.`);
    }

    const userId = `usr-admin-${Date.now()}`;
    const now = new Date().toISOString();

    const newAdmin: User = {
      id: userId,
      email: data.email.trim(),
      password_hash: bcrypt.hashSync(data.passwordPlain, 10),
      role: 'admin',
      full_name: data.full_name.trim(),
      created_at: now,
      status: 'active',
    };

    this.db.users.push(newAdmin);
    this.saveToDisk();

    const token = jwt.sign(
      { userId: newAdmin.id, email: newAdmin.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { token, user: newAdmin };
  }

  public updateStudentProfile(
    profileId: string,
    data: {
      full_name?: string;
      roll_number?: string;
      department?: string;
      college?: string;
      current_year?: 'year_1' | 'year_2' | 'year_3';
      track_id?: 'common' | 'fullstack' | 'ai';
      github_url?: string;
      profile_image?: string;
      status?: 'active' | 'inactive';
    }
  ) {
    const profile = this.db.profiles.find((p) => p.id === profileId);
    if (!profile) throw new Error('Student profile not found');
    const user = this.db.users.find((u) => u.id === profile.user_id);
    if (!user) throw new Error('Associated user not found');

    if (data.roll_number && data.roll_number !== profile.roll_number) {
      if (this.db.profiles.some((p) => p.id !== profileId && p.roll_number.toLowerCase() === data.roll_number?.toLowerCase())) {
        throw new Error('Roll number is already taken by another student.');
      }
      profile.roll_number = data.roll_number;
    }

    if (data.full_name) user.full_name = data.full_name;
    if (data.status) user.status = data.status;
    if (data.department) profile.department = data.department;
    if (data.college) profile.college = data.college;
    if (data.current_year) profile.current_year = data.current_year;
    if (data.track_id) profile.track_id = data.track_id;
    if (data.github_url !== undefined) profile.github_url = data.github_url;
    if (data.profile_image !== undefined) profile.profile_image = data.profile_image;

    profile.last_active_at = new Date().toISOString();
    this.saveToDisk();
    return { user, profile };
  }

  // --- Curriculum & Topics ---
  public getCurriculum(yearFilter?: string, trackFilter?: string) {
    let categories = this.db.categories;
    let topics = this.db.topics;

    if (yearFilter && yearFilter !== 'all') {
      categories = categories.filter((c) => c.year_id === yearFilter);
      topics = topics.filter((t) => t.year_id === yearFilter);
    }
    if (trackFilter && trackFilter !== 'all') {
      categories = categories.filter((c) => c.track_id === trackFilter || c.track_id === 'common');
      topics = topics.filter((t) => t.track_id === trackFilter || t.track_id === 'common');
    }

    return {
      tracks: this.db.tracks,
      years: this.db.years,
      categories: categories.sort((a, b) => a.order - b.order),
      topics: topics.sort((a, b) => a.order - b.order),
      resources: this.db.resources.sort((a, b) => a.display_order - b.display_order),
    };
  }

  public getTopicById(topicId: string) {
    const topic = this.db.topics.find((t) => t.id === topicId);
    if (!topic) return null;
    const category = this.db.categories.find((c) => c.id === topic.category_id);
    const resources = this.db.resources.filter((r) => r.topic_id === topic.id && r.published);
    return { ...topic, category, resources };
  }

  public createCategory(data: Omit<Category, 'id'>) {
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      ...data,
    };
    this.db.categories.push(newCat);
    this.saveToDisk();
    return newCat;
  }

  public updateCategory(catId: string, data: Partial<Category>) {
    const cat = this.db.categories.find((c) => c.id === catId);
    if (!cat) throw new Error('Category not found');
    Object.assign(cat, data);
    this.saveToDisk();
    return cat;
  }

  public deleteCategory(catId: string) {
    this.db.categories = this.db.categories.filter((c) => c.id !== catId);
    this.saveToDisk();
    return { success: true };
  }

  public createTopic(data: Omit<Topic, 'id' | 'slug'>) {
    const topicId = `top-${Date.now()}`;
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newTopic: Topic = {
      id: topicId,
      slug,
      ...data,
    };
    this.db.topics.push(newTopic);

    // Auto seed placeholder resource for new topic
    this.db.resources.push({
      id: `res-${Date.now()}`,
      topic_id: topicId,
      title: `${data.title} - Getting Started Guide`,
      description: `Placeholder learning resource for ${data.title}.`,
      type: 'Documentation',
      url: `https://example.com/resources/${slug}`,
      duration_minutes: 90,
      difficulty: data.difficulty,
      display_order: 1,
      published: true,
      is_sample: true,
    });

    this.saveToDisk();
    return newTopic;
  }

  public updateTopic(topicId: string, data: Partial<Topic>) {
    const topic = this.db.topics.find((t) => t.id === topicId);
    if (!topic) throw new Error('Topic not found');
    if (data.title && data.title !== topic.title) {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    Object.assign(topic, data);
    this.saveToDisk();
    return topic;
  }

  public deleteTopic(topicId: string) {
    this.db.topics = this.db.topics.filter((t) => t.id !== topicId);
    this.db.resources = this.db.resources.filter((r) => r.topic_id !== topicId);
    this.saveToDisk();
    return { success: true };
  }

  // --- Resource Management ---
  public getResources(topicId?: string) {
    if (topicId) {
      return this.db.resources.filter((r) => r.topic_id === topicId);
    }
    return this.db.resources;
  }

  public createResource(data: Omit<Resource, 'id'>) {
    const newResource: Resource = {
      id: `res-${Date.now()}`,
      ...data,
    };
    this.db.resources.push(newResource);
    this.saveToDisk();
    return newResource;
  }

  public updateResource(resourceId: string, data: Partial<Resource>) {
    const res = this.db.resources.find((r) => r.id === resourceId);
    if (!res) throw new Error('Resource not found');
    Object.assign(res, data);
    this.saveToDisk();
    return res;
  }

  public deleteResource(resourceId: string) {
    this.db.resources = this.db.resources.filter((r) => r.id !== resourceId);
    this.saveToDisk();
    return { success: true };
  }

  // --- Student Applicable Curriculum Filter ---
  public getApplicableTopicsForStudent(profileId: string): Topic[] {
    const profile = this.db.profiles.find((p) => p.id === profileId);
    if (!profile) return [];

    const { current_year, track_id } = profile;

    return this.db.topics.filter((t) => {
      if (!t.is_published) return false;

      // First Year: Only Year 1 Common Foundation
      if (current_year === 'year_1') {
        return t.year_id === 'year_1';
      }

      // Second Year: Year 1 Common Foundation + Year 2 of their chosen track
      if (current_year === 'year_2') {
        if (t.year_id === 'year_1') return true;
        if (t.year_id === 'year_2' && (t.track_id === track_id || t.track_id === 'common')) return true;
        return false;
      }

      // Third Year: Year 1 Common + Year 2 Track + Year 3 Track
      if (current_year === 'year_3') {
        if (t.year_id === 'year_1') return true;
        if (t.year_id === 'year_2' && (t.track_id === track_id || t.track_id === 'common')) return true;
        if (t.year_id === 'year_3' && (t.track_id === track_id || t.track_id === 'common')) return true;
        return false;
      }

      return false;
    });
  }

  // --- Progress Tracking Engine ---
  public calculateStudentProgress(profileId: string) {
    const profile = this.db.profiles.find((p) => p.id === profileId);
    if (!profile) {
      return {
        overallPercentage: 0,
        totalRequiredTopics: 0,
        completedRequiredTopics: 0,
        inProgressTopics: 0,
        pendingTopics: 0,
        totalProjects: 0,
        completedProjects: 0,
        breakdown: {
          commonFoundationPercentage: 0,
          trackPercentage: 0,
          thirdYearPercentage: 0,
          commonProjectsTotal: 0,
          commonProjectsCompleted: 0,
          trackProjectsTotal: 0,
          trackProjectsCompleted: 0,
          isCommonCompleted: false,
          isTrackCompleted: false,
        },
        nextRecommendedTopic: null,
      };
    }

    // Projects submitted by this student containing a valid GitHub URL
    const studentSubmittedProjects = this.db.projects.filter(
      (p) =>
        p.student_id === profileId &&
        (p.status === 'submitted' || p.status === 'approved' || p.status === 'under_review') &&
        p.github_url &&
        p.github_url.trim().length > 0
    );
    const submittedTopicIds = new Set(studentSubmittedProjects.map((p) => p.topic_id).filter(Boolean));

    // Curriculum project catalogs by track
    const commonProjectSpecs = PROJECT_CATALOG.filter((p: any) => p.track_id === 'common');
    const commonProjectsTotal = commonProjectSpecs.length; // 5 projects
    const commonProjectsCompleted = commonProjectSpecs.filter((p: any) => submittedTopicIds.has(p.topic_id)).length;
    const isCommonCompleted = commonProjectsTotal > 0 && commonProjectsCompleted >= commonProjectsTotal;
    const commonPercentage = commonProjectsTotal > 0
      ? Number(((commonProjectsCompleted / commonProjectsTotal) * 100).toFixed(1))
      : 100;

    const trackProjectSpecs = PROJECT_CATALOG.filter((p: any) => p.track_id === profile.track_id);
    const trackProjectsTotal = trackProjectSpecs.length; // 4 projects for fullstack
    const trackProjectsCompleted = trackProjectSpecs.filter((p: any) => submittedTopicIds.has(p.topic_id)).length;
    const isTrackCompleted = trackProjectsTotal > 0 && trackProjectsCompleted >= trackProjectsTotal;
    const trackPercentage = trackProjectsTotal > 0
      ? Number(((trackProjectsCompleted / trackProjectsTotal) * 100).toFixed(1))
      : 100;

    // Year 3 Capstone
    const thirdYearProjectSpecs = PROJECT_CATALOG.filter((p: any) => p.year_id === 'year_3');
    const thirdYearTotal = thirdYearProjectSpecs.length;
    const thirdYearCompleted = thirdYearProjectSpecs.filter((p: any) => submittedTopicIds.has(p.topic_id)).length;
    const thirdYearPercentage = thirdYearTotal > 0
      ? Number(((thirdYearCompleted / thirdYearTotal) * 100).toFixed(1))
      : 0;

    // Overall applicable projects and completion
    const applicableProjectSpecs = PROJECT_CATALOG.filter(
      (p: any) => p.track_id === 'common' || p.track_id === profile.track_id
    );
    const applicableProjectsTotal = applicableProjectSpecs.length;
    const applicableProjectsCompleted = applicableProjectSpecs.filter((p: any) => submittedTopicIds.has(p.topic_id)).length;
    const overallPercentage = applicableProjectsTotal > 0
      ? Number(((applicableProjectsCompleted / applicableProjectsTotal) * 100).toFixed(1))
      : 0;

    // Topics list and counts
    const applicableTopics = this.getApplicableTopicsForStudent(profileId);
    const requiredTopics = applicableTopics.filter((t) => t.is_required);
    const progressRecords = this.db.topicProgress.filter((tp) => tp.student_id === profileId);

    const completedTopicIds = new Set(
      progressRecords.filter((tp) => tp.status === 'completed').map((tp) => tp.topic_id)
    );
    const inProgressTopicIds = new Set(
      progressRecords.filter((tp) => tp.status === 'in_progress').map((tp) => tp.topic_id)
    );

    let completedRequiredCount = 0;
    let inProgressCount = 0;

    requiredTopics.forEach((t) => {
      if (completedTopicIds.has(t.id)) {
        completedRequiredCount++;
      } else if (inProgressTopicIds.has(t.id)) {
        inProgressCount++;
      }
    });

    const pendingCount = Math.max(0, requiredTopics.length - completedRequiredCount - inProgressCount);
    const nextTopic = applicableTopics.find((t) => !completedTopicIds.has(t.id)) || null;

    return {
      overallPercentage,
      totalRequiredTopics: requiredTopics.length,
      completedRequiredTopics: completedRequiredCount,
      inProgressTopics: inProgressCount,
      pendingTopics: pendingCount,
      totalProjects: applicableProjectsTotal,
      completedProjects: applicableProjectsCompleted,
      breakdown: {
        commonFoundationPercentage: commonPercentage,
        trackPercentage,
        thirdYearPercentage,
        commonProjectsTotal,
        commonProjectsCompleted,
        trackProjectsTotal,
        trackProjectsCompleted,
        isCommonCompleted,
        isTrackCompleted,
      },
      nextRecommendedTopic: nextTopic,
    };
  }

  public updateTopicStatus(
    profileId: string,
    topicId: string,
    status: 'not_started' | 'in_progress' | 'completed',
    notes?: string
  ) {
    const profile = this.db.profiles.find((p) => p.id === profileId);
    if (!profile) throw new Error('Student profile not found');
    const topic = this.db.topics.find((t) => t.id === topicId);
    if (!topic) throw new Error('Topic not found');

    if (status === 'completed') {
      const projectSpec = PROJECT_CATALOG.find((p: any) => p.topic_id === topicId);
      if (projectSpec) {
        const hasProject = this.db.projects.some(
          (p) =>
            p.student_id === profileId &&
            p.topic_id === topicId &&
            (p.status === 'submitted' || p.status === 'approved' || p.status === 'under_review') &&
            p.github_url &&
            p.github_url.trim().length > 0
        );
        if (!hasProject) {
          throw new Error(`Completing "${topic.title}" requires submitting your project with a valid GitHub repository URL in the Projects section.`);
        }
      }
    }

    const now = new Date().toISOString();
    let record = this.db.topicProgress.find((tp) => tp.student_id === profileId && tp.topic_id === topicId);

    if (!record) {
      record = {
        id: `prog-${profileId}-${topicId}`,
        student_id: profileId,
        topic_id: topicId,
        status,
        started_at: status !== 'not_started' ? now : undefined,
        completed_at: status === 'completed' ? now : undefined,
        notes,
        updated_at: now,
      };
      this.db.topicProgress.push(record);
    } else {
      record.status = status;
      if (notes !== undefined) record.notes = notes;
      record.updated_at = now;
      if (status === 'completed' && !record.completed_at) {
        record.completed_at = now;
      }
      if (status !== 'completed') {
        record.completed_at = undefined;
      }
      if (status === 'in_progress' && !record.started_at) {
        record.started_at = now;
      }
    }

    profile.last_active_at = now;

    // Add activity log
    this.db.activityLogs.unshift({
      id: `act-${Date.now()}`,
      student_id: profileId,
      type: 'topic_status',
      description: `Marked "${topic.title}" as ${status.replace('_', ' ')}.`,
      timestamp: now,
    });

    this.saveToDisk();
    const updatedProgress = this.calculateStudentProgress(profileId);
    return { record, progress: updatedProgress };
  }

  public updateResourceStatus(
    profileId: string,
    resourceId: string,
    status: 'not_started' | 'in_progress' | 'completed'
  ) {
    const profile = this.db.profiles.find((p) => p.id === profileId);
    if (!profile) throw new Error('Student profile not found');
    const res = this.db.resources.find((r) => r.id === resourceId);
    if (!res) throw new Error('Resource not found');

    const now = new Date().toISOString();
    let record = this.db.resourceProgress.find((rp) => rp.student_id === profileId && rp.resource_id === resourceId);

    if (!record) {
      record = {
        id: `rprog-${profileId}-${resourceId}`,
        student_id: profileId,
        resource_id: resourceId,
        status,
        completed_at: status === 'completed' ? now : undefined,
        updated_at: now,
      };
      this.db.resourceProgress.push(record);
    } else {
      record.status = status;
      record.updated_at = now;
      if (status === 'completed' && !record.completed_at) {
        record.completed_at = now;
      }
      if (status !== 'completed') {
        record.completed_at = undefined;
      }
    }

    profile.last_active_at = now;

    if (status === 'completed') {
      this.db.activityLogs.unshift({
        id: `act-${Date.now()}`,
        student_id: profileId,
        type: 'resource_completed',
        description: `Completed resource: "${res.title}".`,
        timestamp: now,
      });
    }

    this.saveToDisk();
    return record;
  }

  // --- Project Submissions ---
  public getProjects(filter?: { student_id?: string; status?: string }) {
    let projs = this.db.projects;
    if (filter?.student_id) {
      projs = projs.filter((p) => p.student_id === filter.student_id);
    }
    if (filter?.status && filter.status !== 'all') {
      projs = projs.filter((p) => p.status === filter.status);
    }

    return projs.map((p) => {
      const student = this.db.profiles.find((s) => s.id === p.student_id);
      const user = student ? this.db.users.find((u) => u.id === student.user_id) : null;
      const topic = p.topic_id ? this.db.topics.find((t) => t.id === p.topic_id) : null;
      return {
        ...p,
        student_name: user?.full_name || 'Unknown Student',
        student_roll: student?.roll_number || '',
        student_track: student?.track_id || '',
        student_year: student?.current_year || '',
        topic_title: topic?.title || 'Independent Project',
      };
    });
  }

  public getProjectById(projectId: string) {
    const p = this.db.projects.find((item) => item.id === projectId);
    if (!p) return null;
    const student = this.db.profiles.find((s) => s.id === p.student_id);
    const user = student ? this.db.users.find((u) => u.id === student.user_id) : null;
    const topic = p.topic_id ? this.db.topics.find((t) => t.id === p.topic_id) : null;
    return {
      ...p,
      student_name: user?.full_name || 'Unknown Student',
      student_roll: student?.roll_number || '',
      student_track: student?.track_id || '',
      student_year: student?.current_year || '',
      topic_title: topic?.title || 'Independent Project',
    };
  }

  public saveProject(
    profileId: string,
    data: {
      id?: string;
      topic_id?: string;
      title: string;
      problem_statement: string;
      tech_stack: string[];
      github_url: string;
      deployment_url: string;
      description: string;
      completion_notes?: string;
      architecture_notes?: string;
      demo_video_url?: string;
      testing_notes?: string;
      documentation_url?: string;
      status: 'draft' | 'submitted';
    }
  ) {
    const profile = this.db.profiles.find((p) => p.id === profileId);
    if (!profile) throw new Error('Student profile not found');
    const user = this.db.users.find((u) => u.id === profile.user_id);

    const now = new Date().toISOString();

    if (data.status === 'submitted' && (!data.github_url || !data.github_url.trim())) {
      throw new Error('A valid GitHub repository URL is required to submit your project.');
    }

    if (data.id) {
      const existing = this.db.projects.find((p) => p.id === data.id);
      if (!existing) throw new Error('Project not found');
      if (existing.student_id !== profileId) throw new Error('Unauthorized');
      if (existing.status === 'approved') throw new Error('Approved projects cannot be modified.');

      existing.title = data.title;
      existing.problem_statement = data.problem_statement;
      existing.tech_stack = data.tech_stack;
      existing.github_url = data.github_url;
      existing.deployment_url = data.deployment_url;
      existing.description = data.description;
      if (data.completion_notes !== undefined) existing.completion_notes = data.completion_notes;
      if (data.architecture_notes !== undefined) existing.architecture_notes = data.architecture_notes;
      if (data.demo_video_url !== undefined) existing.demo_video_url = data.demo_video_url;
      if (data.testing_notes !== undefined) existing.testing_notes = data.testing_notes;
      if (data.documentation_url !== undefined) existing.documentation_url = data.documentation_url;
      if (data.topic_id !== undefined) existing.topic_id = data.topic_id;

      if (data.status === 'submitted' && existing.status !== 'submitted') {
        existing.status = 'submitted';
        existing.submitted_at = now;
        existing.history.push({
          date: now,
          action: 'Submitted for Review',
          status: 'submitted',
          by: user?.full_name || 'Student',
        });

        this.db.activityLogs.unshift({
          id: `act-${Date.now()}`,
          student_id: profileId,
          type: 'project_submitted',
          description: `Submitted project "${data.title}" for review.`,
          timestamp: now,
        });
      }

      profile.last_active_at = now;

      // Automatically update topic progress based on project status
      const topicIdToUpdate = existing.topic_id;
      if (topicIdToUpdate) {
        if (existing.status === 'submitted') {
          this.updateTopicStatus(profileId, topicIdToUpdate, 'completed', 'Completed automatically via project submission');
        } else if (existing.status === 'draft') {
          const cur = this.db.topicProgress.find((tp) => tp.student_id === profileId && tp.topic_id === topicIdToUpdate);
          if (!cur || cur.status === 'not_started') {
            this.updateTopicStatus(profileId, topicIdToUpdate, 'in_progress', 'Started project draft');
          }
        }
      }

      this.saveToDisk();
      return existing;
    }

    // New project
    const projectId = `proj-${Date.now()}`;
    const newProj: Project = {
      id: projectId,
      student_id: profileId,
      topic_id: data.topic_id,
      title: data.title,
      problem_statement: data.problem_statement,
      tech_stack: data.tech_stack,
      github_url: data.github_url,
      deployment_url: data.deployment_url,
      description: data.description,
      completion_notes: data.completion_notes,
      architecture_notes: data.architecture_notes,
      demo_video_url: data.demo_video_url,
      testing_notes: data.testing_notes,
      documentation_url: data.documentation_url,
      status: data.status,
      created_at: now,
      submitted_at: data.status === 'submitted' ? now : undefined,
      history: [
        {
          date: now,
          action: data.status === 'submitted' ? 'Created & Submitted for Review' : 'Created Draft',
          status: data.status,
          by: user?.full_name || 'Student',
        },
      ],
    };

    this.db.projects.push(newProj);
    profile.last_active_at = now;

    if (data.status === 'submitted') {
      this.db.activityLogs.unshift({
        id: `act-${Date.now()}`,
        student_id: profileId,
        type: 'project_submitted',
        description: `Submitted project "${data.title}" for review.`,
        timestamp: now,
      });
    }

    // Automatically update topic progress based on project status
    if (newProj.topic_id) {
      if (newProj.status === 'submitted') {
        this.updateTopicStatus(profileId, newProj.topic_id, 'completed', 'Completed automatically via project submission');
      } else if (newProj.status === 'draft') {
        const cur = this.db.topicProgress.find((tp) => tp.student_id === profileId && tp.topic_id === newProj.topic_id);
        if (!cur || cur.status === 'not_started') {
          this.updateTopicStatus(profileId, newProj.topic_id, 'in_progress', 'Started project draft');
        }
      }
    }

    this.saveToDisk();
    return newProj;
  }

  public reviewProject(
    projectId: string,
    mentorUserId: string,
    status: 'approved' | 'changes_requested' | 'under_review',
    feedback: string
  ) {
    const project = this.db.projects.find((p) => p.id === projectId);
    if (!project) throw new Error('Project not found');

    const mentor = this.db.users.find((u) => u.id === mentorUserId);
    const now = new Date().toISOString();

    project.status = status;
    project.reviewed_at = now;
    project.reviewer_id = mentorUserId;
    project.reviewer_feedback = feedback;

    project.history.push({
      date: now,
      action: status === 'approved' ? 'Approved by Mentor' : status === 'changes_requested' ? 'Changes Requested' : 'Under Review',
      status,
      notes: feedback,
      by: mentor?.full_name || 'Mentor',
    });

    this.db.activityLogs.unshift({
      id: `act-${Date.now()}`,
      student_id: project.student_id,
      type: 'project_reviewed',
      description: `Project "${project.title}" review status: ${status.replace('_', ' ')}.`,
      timestamp: now,
    });

    // Automatically mark topic as completed on approval or in_progress on changes_requested
    if (project.topic_id) {
      if (status === 'approved') {
        this.updateTopicStatus(project.student_id, project.topic_id, 'completed', 'Completed automatically upon mentor approval');
      } else if (status === 'changes_requested') {
        this.updateTopicStatus(project.student_id, project.topic_id, 'in_progress', 'Project changes requested by mentor');
      }
    }

    this.saveToDisk();
    return project;
  }

  // --- Analytics & Reports ---
  public getAdminAnalytics() {
    const totalStudents = this.db.profiles.length;
    const activeStudents = this.db.users.filter((u) => u.role === 'student' && u.status === 'active').length;

    // By Year
    const byYear: Record<string, number> = { year_1: 0, year_2: 0, year_3: 0 };
    // By Track
    const byTrack: Record<string, number> = { common: 0, fullstack: 0, ai: 0 };

    let totalPctSum = 0;
    const fourteenDaysAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
    const inactiveStudents: any[] = [];

    this.db.profiles.forEach((p) => {
      byYear[p.current_year] = (byYear[p.current_year] || 0) + 1;
      byTrack[p.track_id] = (byTrack[p.track_id] || 0) + 1;

      const progress = this.calculateStudentProgress(p.id);
      totalPctSum += progress.overallPercentage;

      const lastActive = new Date(p.last_active_at || p.created_at).getTime();
      if (lastActive < fourteenDaysAgo) {
        const user = this.db.users.find((u) => u.id === p.user_id);
        inactiveStudents.push({
          profile_id: p.id,
          full_name: user?.full_name || 'Unknown',
          email: user?.email || '',
          roll_number: p.roll_number,
          current_year: p.current_year,
          track_id: p.track_id,
          last_active_at: p.last_active_at,
          days_inactive: Math.floor((Date.now() - lastActive) / (1000 * 60 * 60 * 24)),
          overall_percentage: progress.overallPercentage,
        });
      }
    });

    const averageCompletion = totalStudents > 0 ? Number((totalPctSum / totalStudents).toFixed(1)) : 0;
    const pendingProjectReviews = this.db.projects.filter((p) => p.status === 'submitted' || p.status === 'under_review').length;

    // Topic completion stats
    const topicStats = this.db.topics.slice(0, 10).map((t) => {
      const completedCount = this.db.topicProgress.filter((tp) => tp.topic_id === t.id && tp.status === 'completed').length;
      return {
        topic_id: t.id,
        title: t.title,
        track_id: t.track_id,
        year_id: t.year_id,
        completed_count: completedCount,
      };
    });

    // Recent activity logs
    const recentActivity = this.db.activityLogs
      .slice(0, 15)
      .map((log) => {
        const student = this.db.profiles.find((s) => s.id === log.student_id);
        const user = student ? this.db.users.find((u) => u.id === student.user_id) : null;
        return {
          ...log,
          student_name: user?.full_name || 'Student',
          roll_number: student?.roll_number || '',
        };
      });

    return {
      totalStudents,
      activeStudents,
      byYear,
      byTrack,
      averageCompletion,
      pendingProjectReviews,
      inactiveStudents,
      topicStats,
      recentActivity,
    };
  }

  public exportProgressCSV(): string {
    const rows = [
      [
        'Student ID',
        'Full Name',
        'College Email',
        'Roll Number',
        'College',
        'Department',
        'Engineering Year',
        'Specialization Track',
        'Account Status',
        'Overall Completion %',
        'Completed Required Topics',
        'Total Required Topics',
        'In-Progress Topics',
        'Approved Projects',
        'Submitted Projects',
        'Last Active Date',
      ],
    ];

    this.db.profiles.forEach((p) => {
      const user = this.db.users.find((u) => u.id === p.user_id);
      const progress = this.calculateStudentProgress(p.id);
      const studentProjects = this.db.projects.filter((proj) => proj.student_id === p.id);
      const approvedCount = studentProjects.filter((proj) => proj.status === 'approved').length;

      rows.push([
        p.id,
        `"${user?.full_name || ''}"`,
        user?.email || '',
        p.roll_number,
        `"${p.college}"`,
        `"${p.department}"`,
        p.current_year,
        p.track_id,
        user?.status || 'inactive',
        progress.overallPercentage.toString(),
        progress.completedRequiredTopics.toString(),
        progress.totalRequiredTopics.toString(),
        progress.inProgressTopics.toString(),
        approvedCount.toString(),
        studentProjects.length.toString(),
        p.last_active_at || '',
      ]);
    });

    return rows.map((r) => r.join(',')).join('\n');
  }
}

export const dbStore = new DBStore();
