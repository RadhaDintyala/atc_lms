import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dbStore } from './server/dbStore.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Auth Middleware
interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: 'student' | 'admin';
    profileId?: string;
  };
}

const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  const token = authHeader.split(' ')[1];
  const payload = dbStore.verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }
  req.user = payload;
  next();
};

const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  requireAuth(req, res, () => {
    if (req.user?.role !== 'admin') {
      res.status(403).json({ error: 'Administrator access required' });
      return;
    }
    next();
  });
};

// ======================== API ROUTES ========================

// 1. Auth Endpoints
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }
    const result = dbStore.authenticate(email, password);
    if (!result) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }
    const { token, user, profile } = result;
    const { password_hash, ...safeUser } = user;
    res.json({ token, user: safeUser, profile });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Login failed' });
  }
});

app.get('/api/auth/me', requireAuth, (req: AuthRequest, res: Response) => {
  const user = dbStore.getUserById(req.user!.userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  const { password_hash, ...safeUser } = user;
  const profile = dbStore.getProfileByUserId(user.id);
  res.json({ user: safeUser, profile });
});

// 2. Student Management (Admin & Self)
app.get('/api/students', requireAdmin, (req: Request, res: Response) => {
  try {
    const students = dbStore.getAllStudents();
    res.json(students);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/students', requireAdmin, (req: Request, res: Response) => {
  try {
    const { full_name, email, password, roll_number, college, department, current_year, track_id, github_url } = req.body;
    if (!full_name || !email || !password || !roll_number || !current_year || !track_id) {
      res.status(400).json({ error: 'Missing required student fields' });
      return;
    }
    const result = dbStore.createStudent({
      full_name,
      email,
      passwordPlain: password,
      roll_number,
      college: college || 'Apex Institute of Technology',
      department: department || 'Engineering',
      current_year,
      track_id,
      github_url,
    });
    const { password_hash, ...safeUser } = result.user;
    res.status(201).json({ user: safeUser, profile: result.profile });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/students/:id', requireAuth, (req: AuthRequest, res: Response) => {
  const profileId = req.params.id;
  // Students can only view their own profile; admins can view any
  if (req.user?.role !== 'admin' && req.user?.profileId !== profileId) {
    res.status(403).json({ error: 'Forbidden: You cannot access other students records' });
    return;
  }

  const detail = dbStore.getStudentDetail(profileId);
  if (!detail) {
    res.status(404).json({ error: 'Student record not found' });
    return;
  }
  if (detail.user) {
    const { password_hash, ...safeUser } = detail.user;
    detail.user = safeUser as any;
  }
  res.json(detail);
});

app.put('/api/students/:id', requireAuth, (req: AuthRequest, res: Response) => {
  const profileId = req.params.id;
  const isAdmin = req.user?.role === 'admin';
  const isSelf = req.user?.profileId === profileId;

  if (!isAdmin && !isSelf) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  try {
    // Non-admins can only update allowed profile fields (name, github_url, profile_image)
    const allowedData: any = {};
    if (isAdmin) {
      allowedData.full_name = req.body.full_name;
      allowedData.roll_number = req.body.roll_number;
      allowedData.department = req.body.department;
      allowedData.college = req.body.college;
      allowedData.current_year = req.body.current_year;
      allowedData.track_id = req.body.track_id;
      allowedData.github_url = req.body.github_url;
      allowedData.profile_image = req.body.profile_image;
      allowedData.status = req.body.status;
    } else {
      if (req.body.full_name) allowedData.full_name = req.body.full_name;
      if (req.body.github_url !== undefined) allowedData.github_url = req.body.github_url;
      if (req.body.profile_image !== undefined) allowedData.profile_image = req.body.profile_image;
    }

    const updated = dbStore.updateStudentProfile(profileId, allowedData);
    const { password_hash, ...safeUser } = updated.user;
    res.json({ user: safeUser, profile: updated.profile });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 3. Curriculum & Topics
app.get('/api/curriculum', requireAuth, (req: AuthRequest, res: Response) => {
  const year = req.query.year as string | undefined;
  const track = req.query.track as string | undefined;
  const curriculum = dbStore.getCurriculum(year, track);

  // If student, attach applicable flag
  if (req.user?.role === 'student' && req.user.profileId) {
    const applicableTopics = dbStore.getApplicableTopicsForStudent(req.user.profileId);
    const applicableIds = new Set(applicableTopics.map((t) => t.id));
    const studentProgress = dbStore.calculateStudentProgress(req.user.profileId);

    const enrichedTopics = curriculum.topics.map((t) => ({
      ...t,
      is_applicable: applicableIds.has(t.id),
    }));

    res.json({
      ...curriculum,
      topics: enrichedTopics,
      studentProgress,
    });
    return;
  }

  res.json(curriculum);
});

app.get('/api/topics/:id', requireAuth, (req: Request, res: Response) => {
  const topic = dbStore.getTopicById(req.params.id);
  if (!topic) {
    res.status(404).json({ error: 'Topic not found' });
    return;
  }
  res.json(topic);
});

app.post('/api/topics', requireAdmin, (req: Request, res: Response) => {
  try {
    const topic = dbStore.createTopic(req.body);
    res.status(201).json(topic);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/topics/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const topic = dbStore.updateTopic(req.params.id, req.body);
    res.json(topic);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/topics/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const result = dbStore.deleteTopic(req.params.id);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Categories (Admin)
app.post('/api/categories', requireAdmin, (req: Request, res: Response) => {
  try {
    const cat = dbStore.createCategory(req.body);
    res.status(201).json(cat);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/categories/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const cat = dbStore.updateCategory(req.params.id, req.body);
    res.json(cat);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/categories/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const result = dbStore.deleteCategory(req.params.id);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Resources Management
app.get('/api/resources', requireAuth, (req: Request, res: Response) => {
  const topicId = req.query.topic_id as string | undefined;
  const list = dbStore.getResources(topicId);
  res.json(list);
});

app.post('/api/resources', requireAdmin, (req: Request, res: Response) => {
  try {
    const resource = dbStore.createResource(req.body);
    res.status(201).json(resource);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/resources/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const resource = dbStore.updateResource(req.params.id, req.body);
    res.json(resource);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/resources/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const result = dbStore.deleteResource(req.params.id);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 4. Progress Tracking
app.get('/api/progress', requireAuth, (req: AuthRequest, res: Response) => {
  const profileId = (req.query.student_id as string) || req.user?.profileId;
  if (!profileId) {
    res.status(400).json({ error: 'Student ID required' });
    return;
  }
  if (req.user?.role !== 'admin' && req.user?.profileId !== profileId) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  const progress = dbStore.calculateStudentProgress(profileId);
  const detail = dbStore.getStudentDetail(profileId);
  res.json({
    ...progress,
    topicProgress: detail?.topicProgress || [],
    resourceProgress: detail?.resourceProgress || [],
  });
});

app.post('/api/progress/topic', requireAuth, (req: AuthRequest, res: Response) => {
  const profileId = req.user?.profileId;
  if (!profileId) {
    res.status(403).json({ error: 'Only students have learning progress' });
    return;
  }

  const { topic_id, status, notes } = req.body;
  if (!topic_id || !status) {
    res.status(400).json({ error: 'topic_id and status are required' });
    return;
  }

  try {
    const result = dbStore.updateTopicStatus(profileId, topic_id, status, notes);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/progress/resource', requireAuth, (req: AuthRequest, res: Response) => {
  const profileId = req.user?.profileId;
  if (!profileId) {
    res.status(403).json({ error: 'Only students have resource progress' });
    return;
  }

  const { resource_id, status } = req.body;
  if (!resource_id || !status) {
    res.status(400).json({ error: 'resource_id and status are required' });
    return;
  }

  try {
    const record = dbStore.updateResourceStatus(profileId, resource_id, status);
    res.json(record);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 5. Project Submissions & Reviews
app.get('/api/projects', requireAuth, (req: AuthRequest, res: Response) => {
  const status = req.query.status as string | undefined;
  if (req.user?.role === 'admin') {
    const studentId = req.query.student_id as string | undefined;
    const list = dbStore.getProjects({ student_id: studentId, status });
    res.json(list);
  } else {
    const profileId = req.user?.profileId;
    const list = dbStore.getProjects({ student_id: profileId, status });
    res.json(list);
  }
});

app.get('/api/projects/:id', requireAuth, (req: AuthRequest, res: Response) => {
  const proj = dbStore.getProjectById(req.params.id);
  if (!proj) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  if (req.user?.role !== 'admin' && proj.student_id !== req.user?.profileId) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }
  res.json(proj);
});

app.post('/api/projects', requireAuth, (req: AuthRequest, res: Response) => {
  const profileId = req.user?.profileId;
  if (!profileId) {
    res.status(403).json({ error: 'Only students can submit projects' });
    return;
  }

  const { id, topic_id, title, problem_statement, tech_stack, github_url, deployment_url, description, completion_notes, status } = req.body;

  if (!title || !problem_statement || !description) {
    res.status(400).json({ error: 'Title, problem statement, and description are required' });
    return;
  }

  try {
    const saved = dbStore.saveProject(profileId, {
      id,
      topic_id,
      title,
      problem_statement,
      tech_stack: Array.isArray(tech_stack) ? tech_stack : (tech_stack ? tech_stack.split(',').map((s: string) => s.trim()) : []),
      github_url: github_url || '',
      deployment_url: deployment_url || '',
      description,
      completion_notes,
      status: status === 'submitted' ? 'submitted' : 'draft',
    });
    res.status(201).json(saved);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/projects/:id/review', requireAdmin, (req: AuthRequest, res: Response) => {
  const projectId = req.params.id;
  const { status, feedback } = req.body;
  if (!status || !['approved', 'changes_requested', 'under_review'].includes(status)) {
    res.status(400).json({ error: 'Valid review status is required (approved, changes_requested, under_review)' });
    return;
  }
  if (!feedback) {
    res.status(400).json({ error: 'Feedback comments are required' });
    return;
  }

  try {
    const updated = dbStore.reviewProject(projectId, req.user!.userId, status, feedback);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 6. Admin Analytics & CSV Export
app.get('/api/admin/analytics', requireAdmin, (req: Request, res: Response) => {
  try {
    const analytics = dbStore.getAdminAnalytics();
    res.json(analytics);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/reports/progress-csv', requireAdmin, (req: Request, res: Response) => {
  try {
    const csvContent = dbStore.exportProgressCSV();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="student_progress_report.csv"');
    res.send(csvContent);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 7. OpenAPI / Health info
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    service: 'ApexLMS Engineering Platform API',
    uptime: process.uptime(),
  });
});

// ======================== VITE DEV / PRODUCTION INTEGRATION ========================
async function setupVite() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 ApexLMS Server running on http://0.0.0.0:${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
