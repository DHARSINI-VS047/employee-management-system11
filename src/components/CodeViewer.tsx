import React, { useState } from 'react';
import { CodeFile } from '../types';
import { Check, Copy, Download, FileCode, Layers, Terminal } from 'lucide-react';

interface CodeViewerProps {
  files: CodeFile[];
  activeFileId: string;
  onSelectFile: (id: string) => void;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  files,
  activeFileId,
  onSelectFile
}) => {
  const [copied, setCopied] = useState(false);

  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeFile.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([activeFile.code], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = activeFile.name.split(' ')[0];
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const lines = activeFile.code.split('\n');

  return (
    <div className="flex flex-col lg:flex-row h-full rounded-xl border border-neutral-200 bg-white shadow-xs overflow-hidden">
      {/* File Navigation Sidebar */}
      <div className="w-full lg:w-72 bg-neutral-50/80 border-b lg:border-b-0 lg:border-r border-neutral-200 p-4 flex flex-col gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
            <Layers className="w-4 h-4 text-neutral-600" />
            <span>Project Files</span>
          </div>
          <p className="text-xs text-neutral-500">
            Select a file to inspect the complete production code, constraints, and logic.
          </p>
        </div>

        {/* Group by category */}
        <div className="flex flex-col gap-4 overflow-y-auto max-h-[500px] lg:max-h-none pr-1">
          <div>
            <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1 px-2">
              Core Backend (Django REST)
            </div>
            <div className="flex flex-col gap-1">
              {files
                .filter(f => f.category === 'core')
                .map(file => (
                  <button
                    key={file.id}
                    id={`file-tab-${file.id}`}
                    onClick={() => onSelectFile(file.id)}
                    className={`flex items-center justify-between text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeFileId === file.id
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'text-neutral-700 hover:bg-neutral-200/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode className={`w-4 h-4 shrink-0 ${activeFileId === file.id ? 'text-amber-400' : 'text-neutral-500'}`} />
                      <span className="font-mono text-xs">{file.name}</span>
                    </div>
                  </button>
                ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1 px-2">
              Project Config & SQLite
            </div>
            <div className="flex flex-col gap-1">
              {files
                .filter(f => f.category === 'project')
                .map(file => (
                  <button
                    key={file.id}
                    id={`file-tab-${file.id}`}
                    onClick={() => onSelectFile(file.id)}
                    className={`flex items-center justify-between text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeFileId === file.id
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'text-neutral-700 hover:bg-neutral-200/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode className={`w-4 h-4 shrink-0 ${activeFileId === file.id ? 'text-blue-400' : 'text-neutral-500'}`} />
                      <span className="font-mono text-xs">{file.name}</span>
                    </div>
                  </button>
                ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1 px-2">
              Guide & Viva Q&A
            </div>
            <div className="flex flex-col gap-1">
              {files
                .filter(f => f.category === 'docs')
                .map(file => (
                  <button
                    key={file.id}
                    id={`file-tab-${file.id}`}
                    onClick={() => onSelectFile(file.id)}
                    className={`flex items-center justify-between text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeFileId === file.id
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'text-neutral-700 hover:bg-neutral-200/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Terminal className={`w-4 h-4 shrink-0 ${activeFileId === file.id ? 'text-emerald-400' : 'text-neutral-500'}`} />
                      <span className="font-mono text-xs">{file.name}</span>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Code Display Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-neutral-950 text-neutral-100">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-neutral-900/90 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-medium bg-neutral-800 text-neutral-300 border border-neutral-700">
              {activeFile.path}
            </span>
            <span className="text-xs text-neutral-400 hidden sm:inline">
              {lines.length} lines • {activeFile.language}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="copy-code-button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-md transition-colors border border-neutral-700"
              title="Copy entire code to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Copy Code</span>
                </>
              )}
            </button>

            <button
              id="download-code-button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-md transition-colors border border-neutral-700"
              title="Download file"
            >
              <Download className="w-3.5 h-3.5 text-neutral-400" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* File explanation banner */}
        <div className="px-4 py-2.5 bg-neutral-900/40 border-b border-neutral-800/80 text-xs text-neutral-400">
          {activeFile.description}
        </div>

        {/* Code editor / pre block */}
        <div className="flex-1 overflow-auto font-mono text-xs leading-relaxed p-4 selection:bg-neutral-700">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx} className="hover:bg-neutral-900/60">
                  <td className="w-12 pr-4 text-right select-none text-neutral-600 align-top text-[11px]">
                    {idx + 1}
                  </td>
                  <td className="whitespace-pre text-neutral-200 font-mono">
                    {line || ' '}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
