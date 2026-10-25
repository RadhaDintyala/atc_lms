import React from 'react';
import {
  Settings,
  Database,
  Shield,
  Layers,
  Server,
  Code2,
  FileText,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 text-xs">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          LMS Platform Configuration & Architecture
        </h1>
        <p className="text-slate-500 mt-1">
          System health, MongoDB document database configuration, security policies, and curriculum track definitions.
        </p>
      </div>

      {/* Database & Runtime Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">Database & Persistence Layer</h2>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            MongoDB Document Store
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Primary Database Engine
            </span>
            <p className="font-semibold text-slate-900">MongoDB 7.0 (NoSQL Document Store)</p>
            <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
              Service: apexlms_mongodb:27017 (Database: apexlms_db)
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Database Driver / Async ODM
            </span>
            <p className="font-semibold text-slate-900">Motor (AsyncIO) & PyMongo</p>
            <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
              Connection pooling: minPoolSize=10, maxPoolSize=50
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Authentication & Passwords
            </span>
            <p className="font-semibold text-slate-900">JWT (HS256) + Argon2 / Bcrypt</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Role-based access control (Admin & Student)
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Backend REST API Framework
            </span>
            <p className="font-semibold text-slate-900">Python 3.10 + FastAPI + Uvicorn</p>
            <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
              OpenAPI documentation at /docs
            </p>
          </div>
        </div>

        {/* MongoDB Collections & Indexes */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2">
          <p className="font-bold text-slate-900">Indexed MongoDB Collections:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-slate-600">
            <div className="p-2 bg-white rounded border border-slate-200">
              <span className="font-bold text-slate-800">users:</span> unique({'{'}email: 1{'}'})
            </div>
            <div className="p-2 bg-white rounded border border-slate-200">
              <span className="font-bold text-slate-800">student_profiles:</span> unique({'{'}roll_number: 1{'}'})
            </div>
            <div className="p-2 bg-white rounded border border-slate-200">
              <span className="font-bold text-slate-800">topics:</span> unique({'{'}slug: 1{'}'}), index(year_id, track_id)
            </div>
            <div className="p-2 bg-white rounded border border-slate-200">
              <span className="font-bold text-slate-800">student_topic_progress:</span> unique({'{'}student_id, topic_id{'}'})
            </div>
            <div className="p-2 bg-white rounded border border-slate-200">
              <span className="font-bold text-slate-800">projects:</span> index({'{'}student_id, status{'}'})
            </div>
            <div className="p-2 bg-white rounded border border-slate-200">
              <span className="font-bold text-slate-800">activity_logs:</span> index({'{'}student_id, timestamp: -1{'}'})
            </div>
          </div>
        </div>
      </div>

      {/* Specialization Tracks Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">Configured Engineering Tracks</h2>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-slate-900">1. Common Foundation (1st Year)</span>
              <span className="font-mono text-[10px] bg-slate-200/80 px-2 py-0.5 rounded text-slate-700">
                Code: CF • 8 Categories
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Programming fundamentals in Python, Java, and JavaScript, Client-server web architecture, Git/GitHub version control, Prompt engineering, and project workflows.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-slate-900">2. Track 1: Full-Stack & Application Development (2nd & 3rd Year)</span>
              <span className="font-mono text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                Code: FSAD • 10 Core + 5 Advanced
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Backend frameworks (FastAPI, Spring Boot, Node.js), React frontend, Flutter/React Native mobile, MongoDB & SQL databases, Docker containerization, CI/CD, and distributed microservices.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/30">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-slate-900">3. Track 2: AI Engineering (2nd & 3rd Year)</span>
              <span className="font-mono text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">
                Code: AIE • 11 Core + 5 Advanced
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Python for AI, LLM APIs, Vector Databases & pgvector embeddings, RAG pipelines, Autonomous Agent loops (ReAct), LLM evaluation (RAGAS), AI security/guardrails, and cloud deployment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
