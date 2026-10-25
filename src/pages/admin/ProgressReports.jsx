import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import StatCard from '../../components/StatCard.jsx';
import ProgressBar from '../../components/ProgressBar.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import {
  Download,
  FileSpreadsheet,
  TrendingUp,
  Award,
  Users,
  AlertTriangle,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export default function ProgressReports() {
  const [analytics, setAnalytics] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [aData, sData] = await Promise.all([
          api.getAnalytics(),
          api.getStudents(),
        ]);
        setAnalytics(aData);
        setStudents(sData || []);
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleDownloadCSV = async () => {
    try {
      setDownloading(true);
      const blob = await api.downloadProgressCSV();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `apexlms_student_progress_report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(`Error exporting CSV: ${err.message}`);
    } finally {
      setDownloading(false);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500 font-medium">Generating academic audit reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header & Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Academic Reports & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Cohort performance, topic completion records, and official CSV progress audit export.
          </p>
        </div>

        <button
          onClick={handleDownloadCSV}
          disabled={downloading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold transition-all shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>{downloading ? 'Generating CSV...' : 'Export Progress Report (CSV)'}</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Average Cohort Progress"
          value={`${analytics.averageCompletion}%`}
          subtitle="Computed across all students"
          icon={TrendingUp}
          badge="Cohort Benchmark"
          badgeColor="emerald"
        />
        <StatCard
          title="Total Registered Students"
          value={analytics.totalStudents}
          subtitle={`${analytics.activeStudents} currently active accounts`}
          icon={Users}
          badge="100% Tracked"
          badgeColor="slate"
        />
        <StatCard
          title="Inactive Students (>14d)"
          value={analytics.inactiveStudents?.length || 0}
          subtitle="Flagged for mentor outreach"
          icon={AlertTriangle}
          badge="Requires Follow-up"
          badgeColor={analytics.inactiveStudents?.length > 0 ? 'rose' : 'slate'}
        />
      </div>

      {/* Cohort Progress Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Individual Student Progress Roll</h3>
            <p className="text-xs text-slate-500">
              Verified topic completions and required milestone metrics per student.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
            {students.length} Total Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-4 py-3.5">Year & Track</th>
                <th className="px-4 py-3.5">Completion Rate</th>
                <th className="px-4 py-3.5">Completed Topics</th>
                <th className="px-4 py-3.5">Projects</th>
                <th className="px-5 py-3.5">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-900 text-xs">{st.full_name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {st.roll_number} • {st.email}
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    <span className="font-semibold text-slate-800 block">
                      {st.current_year === 'year_1' ? '1st Year' : st.current_year === 'year_2' ? '2nd Year' : '3rd Year'}
                    </span>
                    <span className="text-[10px] text-slate-500 capitalize">{st.track_id}</span>
                  </td>

                  <td className="px-4 py-4 w-44">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-bold font-mono text-slate-900">
                          {st.progress?.overallPercentage || 0}%
                        </span>
                      </div>
                      <ProgressBar
                        value={st.progress?.overallPercentage || 0}
                        showPercentage={false}
                        size="sm"
                        color="yellow"
                      />
                    </div>
                  </td>

                  <td className="px-4 py-4 font-mono text-slate-700">
                    {st.progress?.completedRequiredTopics || 0} / {st.progress?.totalRequiredTopics || 0}
                  </td>

                  <td className="px-4 py-4 font-mono text-slate-700">
                    <span className="font-bold text-emerald-700">{st.approved_projects_count}</span> approved / {st.projects_count} total
                  </td>

                  <td className="px-5 py-4 font-mono text-slate-500 text-[11px]">
                    {st.last_active_at ? new Date(st.last_active_at).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
