import React, { useState } from 'react';
import { CODE_FILES, INITIAL_EMPLOYEES } from './data/djangoProjectCode';
import { Employee } from './types';
import { CodeViewer } from './components/CodeViewer';
import { ApiPlayground } from './components/ApiPlayground';
import { ArchitectureView } from './components/ArchitectureView';
import {
  FileCode,
  Terminal,
  Database,
  GraduationCap,
  Download,
  Copy,
  Check,
  Server
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'code' | 'api' | 'architecture'>('code');
  const [activeFileId, setActiveFileId] = useState<string>('models');
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleResetData = () => {
    setEmployees(INITIAL_EMPLOYEES);
  };

  const handleDownloadAllFiles = () => {
    // Downloads all code as a consolidated archive markdown/text bundle
    const bundleContent = CODE_FILES.map(
      f => `================================================================================\nFILE: ${f.path}\nDESCRIPTION: ${f.description}\n================================================================================\n\n${f.code}\n\n`
    ).join('\n');

    const blob = new Blob([bundleContent], { type: 'text/plain;charset=utf-8' });
    const element = document.createElement('a');
    element.href = URL.createObjectURL(blob);
    element.download = 'django_employee_management_backend.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopyAll = async () => {
    const bundleContent = CODE_FILES.map(
      f => `# =========================================\n# FILE: ${f.path}\n# =========================================\n\n${f.code}\n`
    ).join('\n');
    try {
      await navigator.clipboard.writeText(bundleContent);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 flex flex-col font-sans selection:bg-neutral-900 selection:text-white">
      {/* Top Navigation / App Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3.5">
            {/* Title & Badge */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-neutral-900 text-white shadow-xs">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
                    Employee Management System
                  </h1>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    Django REST + SQLite
                  </span>
                </div>
                <p className="text-xs text-neutral-500">
                  College Project Production-Ready Backend Codebase &amp; Interactive REST API Inspector
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                id="copy-all-btn"
                onClick={handleCopyAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors border border-neutral-300"
                title="Copy all backend files to clipboard"
              >
                {copiedAll ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied All</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Copy All Code</span>
                  </>
                )}
              </button>

              <button
                id="download-all-btn"
                onClick={handleDownloadAllFiles}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-900 hover:bg-neutral-800 text-white transition-colors shadow-xs"
                title="Download consolidated code bundle"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Bundle</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 border-t border-neutral-200/80 pt-2 pb-1 overflow-x-auto">
            <button
              id="tab-code-viewer"
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors whitespace-nowrap ${
                activeTab === 'code'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>Complete Source Files ({CODE_FILES.length})</span>
            </button>

            <button
              id="tab-api-playground"
              onClick={() => setActiveTab('api')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors whitespace-nowrap ${
                activeTab === 'api'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Interactive API &amp; SQLite Simulator</span>
            </button>

            <button
              id="tab-architecture"
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors whitespace-nowrap ${
                activeTab === 'architecture'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>SOP Docs, Postman Tests &amp; Architecture</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'code' && (
          <div className="h-[calc(100vh-185px)] min-h-[550px]">
            <CodeViewer
              files={CODE_FILES}
              activeFileId={activeFileId}
              onSelectFile={setActiveFileId}
            />
          </div>
        )}

        {activeTab === 'api' && (
          <ApiPlayground
            employees={employees}
            setEmployees={setEmployees}
            onResetData={handleResetData}
          />
        )}

        {activeTab === 'architecture' && <ArchitectureView />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 py-3 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>College Project Reference • Python 3.10+ / Django 4.2+ / Django REST Framework 3.14+ / SQLite 3</span>
          <div className="flex items-center gap-4 text-neutral-600">
            <span>GET / POST / PUT / DELETE</span>
            <span>•</span>
            <span>Search &amp; Filter</span>
            <span>•</span>
            <span>Unique Constraints</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
