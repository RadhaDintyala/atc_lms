import React from 'react';
import {
  Settings,
  Database,
  Shield,
  Layers,
  Server,
  Code2,
  FileText,
  CheckCircle2,
} from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 text-xs">
      {/* Header */}
      <div className="pb-4 border-b border-[#E4E4E7]">
        <h1 className="text-2xl font-black text-[#111111] tracking-tight">
          LMS Platform Configuration & Architecture
        </h1>
        <p className="text-[#71717A] mt-1 font-normal">
          System health, MongoDB document database configuration, security policies, and curriculum track definitions.
        </p>
      </div>

      {/* Database & Runtime Card */}
      <div className="bg-white rounded-xl border border-[#E4E4E7] p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FEF9E6] border border-[#F9C321]/30 flex items-center justify-center text-[#111111]">
              <Database className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-[#111111]">Database & Persistence Layer</h2>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#111111] bg-[#FEF9E6] px-2.5 py-1 rounded-md border border-[#F9C321]/40">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#111111]" />
            MongoDB Document Store
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7]">
            <span className="text-[10px] uppercase font-bold text-[#71717A] block mb-1">
              Primary Database Engine
            </span>
            <p className="font-bold text-[#111111]">MongoDB 7.0 (NoSQL Document Store)</p>
            <p className="text-[11px] text-[#71717A] mt-0.5 font-mono">
              Service: beacon_mongodb:27017 (Database: beacon_db)
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7]">
            <span className="text-[10px] uppercase font-bold text-[#71717A] block mb-1">
              Database Driver / Async ODM
            </span>
            <p className="font-bold text-[#111111]">Motor (AsyncIO) & PyMongo</p>
            <p className="text-[11px] text-[#71717A] mt-0.5 font-mono">
              Connection pooling: minPoolSize=10, maxPoolSize=50
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7]">
            <span className="text-[10px] uppercase font-bold text-[#71717A] block mb-1">
              Authentication & Passwords
            </span>
            <p className="font-bold text-[#111111]">JWT (HS256) + Argon2 / Bcrypt</p>
            <p className="text-[11px] text-[#71717A] mt-0.5">
              Role-based access control (Admin & Student)
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7]">
            <span className="text-[10px] uppercase font-bold text-[#71717A] block mb-1">
              Backend REST API Framework
            </span>
            <p className="font-bold text-[#111111]">Python 3.10 + FastAPI + Uvicorn</p>
            <p className="text-[11px] text-[#71717A] mt-0.5 font-mono">
              OpenAPI documentation at /docs
            </p>
          </div>
        </div>

        {/* MongoDB Collections & Indexes */}
        <div className="p-4 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] space-y-2">
          <p className="font-bold text-[#111111]">Indexed MongoDB Collections:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-[#71717A]">
            <div className="p-2 bg-white rounded-md border border-[#E4E4E7]">
              <span className="font-bold text-[#111111]">users:</span> unique({'{'}email: 1{'}'})
            </div>
            <div className="p-2 bg-white rounded-md border border-[#E4E4E7]">
              <span className="font-bold text-[#111111]">student_profiles:</span> unique({'{'}roll_number: 1{'}'})
            </div>
            <div className="p-2 bg-white rounded-md border border-[#E4E4E7]">
              <span className="font-bold text-[#111111]">topics:</span> unique({'{'}slug: 1{'}'}), index(year_id, track_id)
            </div>
            <div className="p-2 bg-white rounded-md border border-[#E4E4E7]">
              <span className="font-bold text-[#111111]">student_topic_progress:</span> unique({'{'}student_id, topic_id{'}'})
            </div>
            <div className="p-2 bg-white rounded-md border border-[#E4E4E7]">
              <span className="font-bold text-[#111111]">projects:</span> index({'{'}student_id, status{'}'})
            </div>
            <div className="p-2 bg-white rounded-md border border-[#E4E4E7]">
              <span className="font-bold text-[#111111]">activity_logs:</span> index({'{'}student_id, timestamp: -1{'}'})
            </div>
          </div>
        </div>
      </div>

      {/* Specialization Tracks Overview */}
      <div className="bg-white rounded-xl border border-[#E4E4E7] p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FEF9E6] border border-[#F9C321]/30 flex items-center justify-center text-[#111111]">
            <Layers className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-[#111111]">Configured Engineering Tracks</h2>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-[#111111]">1. Common Foundation (1st Year)</span>
              <span className="font-mono text-[10px] bg-[#E4E4E7] text-[#111111] px-2 py-0.5 rounded font-bold">
                Code: CF • 8 Categories
              </span>
            </div>
            <p className="text-[#71717A] leading-relaxed text-[11px]">
              Programming fundamentals in Python, Java, and JavaScript, Client-server web architecture, Git/GitHub version control, Prompt engineering, and project workflows.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[#E4E4E7] bg-white hover:border-[#111111] transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-[#111111]">2. Track 1: Full-Stack & Application Development (2nd & 3rd Year)</span>
              <span className="font-mono text-[10px] bg-[#111111] text-[#F9C321] px-2 py-0.5 rounded font-bold">
                Code: FSAD • 10 Core + 5 Advanced
              </span>
            </div>
            <p className="text-[#71717A] leading-relaxed text-[11px]">
              Backend frameworks (FastAPI, Spring Boot, Node.js), React frontend, Flutter/React Native mobile, MongoDB & SQL databases, Docker containerization, CI/CD, and distributed microservices.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[#F9C321]/40 bg-[#FEF9E6]/30">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-[#111111]">3. Track 2: AI Engineering (2nd & 3rd Year)</span>
              <span className="font-mono text-[10px] bg-[#F9C321] text-[#111111] px-2 py-0.5 rounded font-bold">
                Code: AIE • 11 Core + 5 Advanced
              </span>
            </div>
            <p className="text-[#71717A] leading-relaxed text-[11px]">
              Python for AI, LLM APIs, Vector Databases & pgvector embeddings, RAG pipelines, Autonomous Agent loops (ReAct), LLM evaluation (RAGAS), AI security/guardrails, and cloud deployment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
