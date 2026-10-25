import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard.jsx';
import MyLearningPath from './pages/student/MyLearningPath.jsx';
import TopicDetailPage from './pages/student/TopicDetailPage.jsx';
import ResourcesDirectory from './pages/student/ResourcesDirectory.jsx';
import ProjectsModule from './pages/student/ProjectsModule.jsx';
import StudentProgress from './pages/student/StudentProgress.jsx';
import StudentProfile from './pages/student/StudentProfile.jsx';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import StudentManagement from './pages/admin/StudentManagement.jsx';
import CurriculumManagement from './pages/admin/CurriculumManagement.jsx';
import ResourceManagement from './pages/admin/ResourceManagement.jsx';
import ProjectReviews from './pages/admin/ProjectReviews.jsx';
import ProgressReports from './pages/admin/ProgressReports.jsx';
import AdminSettings from './pages/admin/AdminSettings.jsx';

function AppContent() {
  const { user, isAdmin, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState(isAdmin ? 'admin-dashboard' : 'dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Selected topic for topic-detail view
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  // Initial topic passed to project submission
  const [topicForProject, setTopicForProject] = useState(null);

  // When role changes (e.g. from demo switcher), sync tab
  React.useEffect(() => {
    if (isAdmin && !currentTab.startsWith('admin-')) {
      setCurrentTab('admin-dashboard');
    } else if (!isAdmin && currentTab.startsWith('admin-')) {
      setCurrentTab('dashboard');
    }
  }, [isAdmin]);

  const handleNavigateToTopic = (topicId) => {
    setSelectedTopicId(topicId);
    setCurrentTab('topic-detail');
  };

  const handleOpenProjectModal = (topic) => {
    setTopicForProject(topic);
    setCurrentTab('projects');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Loading ApexLMS Environment...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col antialiased">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 relative">
        <Sidebar
          currentTab={currentTab}
          setTab={setCurrentTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 w-full min-w-0 overflow-y-auto">
          {/* Student Views */}
          {!isAdmin && (
            <>
              {currentTab === 'dashboard' && (
                <StudentDashboard
                  onNavigateToTopic={handleNavigateToTopic}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                />
              )}
              {currentTab === 'learning-path' && (
                <MyLearningPath onSelectTopic={handleNavigateToTopic} />
              )}
              {currentTab === 'topic-detail' && (
                <TopicDetailPage
                  topicId={selectedTopicId}
                  onBack={() => setCurrentTab('learning-path')}
                  onOpenProjectModal={handleOpenProjectModal}
                />
              )}
              {currentTab === 'resources' && <ResourcesDirectory />}
              {currentTab === 'projects' && (
                <ProjectsModule
                  initialTopicForProject={topicForProject}
                  onClearInitialTopic={() => setTopicForProject(null)}
                />
              )}
              {currentTab === 'my-progress' && (
                <StudentProgress onSelectTopic={handleNavigateToTopic} />
              )}
              {currentTab === 'profile' && <StudentProfile />}
            </>
          )}

          {/* Admin Views */}
          {isAdmin && (
            <>
              {currentTab === 'admin-dashboard' && (
                <AdminDashboard onNavigateTab={(tab) => setCurrentTab(tab)} />
              )}
              {currentTab === 'admin-students' && <StudentManagement />}
              {currentTab === 'admin-curriculum' && <CurriculumManagement />}
              {currentTab === 'admin-resources' && <ResourceManagement />}
              {currentTab === 'admin-reviews' && <ProjectReviews />}
              {currentTab === 'admin-reports' && <ProgressReports />}
              {currentTab === 'admin-settings' && <AdminSettings />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
