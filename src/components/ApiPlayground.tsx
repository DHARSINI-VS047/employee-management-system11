import React, { useState } from 'react';
import { Employee, ApiRequestLog } from '../types';
import { DEPARTMENTS } from '../data/djangoProjectCode';
import { Play, RotateCcw, Copy, Check, Terminal, Database, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ApiPlaygroundProps {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  onResetData: () => void;
}

export const ApiPlayground: React.FC<ApiPlaygroundProps> = ({
  employees,
  setEmployees,
  onResetData
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [endpointPath, setEndpointPath] = useState<string>('/api/employees/');
  const [searchParam, setSearchParam] = useState<string>('');
  const [deptParam, setDeptParam] = useState<string>('');
  const [targetId, setTargetId] = useState<number>(1);

  // Form state for POST / PUT
  const [postData, setPostData] = useState({
    name: 'Sarah Connor',
    email: 'sarah.connor@example.com',
    department: 'Engineering',
    salary: '82000.00',
    date_joined: new Date().toISOString().split('T')[0]
  });

  // Response state
  const [currentResponse, setCurrentResponse] = useState<{
    status: number;
    statusText: string;
    durationMs: number;
    body: any;
  } | null>({
    status: 200,
    statusText: 'OK',
    durationMs: 14,
    body: employees
  });

  const [curlCopied, setCurlCopied] = useState(false);
  const [history, setHistory] = useState<ApiRequestLog[]>([]);

  // Generate equivalent curl command
  const getCurlCommand = () => {
    let url = `http://127.0.0.1:8000${endpointPath}`;
    const queryParts: string[] = [];
    if (selectedMethod === 'GET' && endpointPath === '/api/employees/') {
      if (searchParam.trim()) queryParts.push(`search=${encodeURIComponent(searchParam.trim())}`);
      if (deptParam.trim()) queryParts.push(`department=${encodeURIComponent(deptParam.trim())}`);
      if (queryParts.length > 0) {
        url += `?${queryParts.join('&')}`;
      }
    } else if (endpointPath === '/api/employees/{id}/') {
      url = `http://127.0.0.1:8000/api/employees/${targetId}/`;
    }

    if (selectedMethod === 'GET') {
      return `curl -X GET "${url}"`;
    }
    if (selectedMethod === 'DELETE') {
      return `curl -X DELETE "${url}"`;
    }

    const payload = {
      name: postData.name,
      email: postData.email,
      department: postData.department,
      salary: parseFloat(postData.salary) || 0,
      date_joined: postData.date_joined
    };

    return `curl -X ${selectedMethod} "${url}" \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(payload, null, 2)}'`;
  };

  const handleCopyCurl = async () => {
    try {
      await navigator.clipboard.writeText(getCurlCommand());
      setCurlCopied(true);
      setTimeout(() => setCurlCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  // Simulate Django REST Framework execution with true database constraints
  const executeRequest = () => {
    const startTime = performance.now();

    if (selectedMethod === 'GET') {
      if (endpointPath === '/api/employees/stats/') {
        // Stats aggregate action
        const total = employees.length;
        const totalPayroll = employees.reduce((sum, e) => sum + e.salary, 0);
        const avgSalary = total > 0 ? totalPayroll / total : 0;
        
        // Department counts
        const deptCounts: Record<string, { count: number; totalSalary: number }> = {};
        employees.forEach(e => {
          if (!deptCounts[e.department]) {
            deptCounts[e.department] = { count: 0, totalSalary: 0 };
          }
          deptCounts[e.department].count += 1;
          deptCounts[e.department].totalSalary += e.salary;
        });

        const deptList = Object.entries(deptCounts).map(([department, data]) => ({
          department,
          count: data.count,
          avg_salary: Math.round(data.totalSalary / data.count)
        }));

        const result = {
          total_employees: total,
          total_payroll: totalPayroll,
          average_salary: Math.round(avgSalary * 100) / 100,
          departments: deptList
        };

        setCurrentResponse({
          status: 200,
          statusText: 'OK',
          durationMs: Math.round(performance.now() - startTime + 8),
          body: result
        });
        return;
      }

      if (endpointPath === '/api/employees/{id}/') {
        const found = employees.find(e => e.id === targetId);
        if (!found) {
          setCurrentResponse({
            status: 404,
            statusText: 'Not Found',
            durationMs: Math.round(performance.now() - startTime + 5),
            body: { detail: `Employee with id ${targetId} not found.` }
          });
          return;
        }

        setCurrentResponse({
          status: 200,
          statusText: 'OK',
          durationMs: Math.round(performance.now() - startTime + 5),
          body: found
        });
        return;
      }

      // Filtered list
      let filtered = [...employees];
      if (searchParam.trim()) {
        const q = searchParam.trim().toLowerCase();
        filtered = filtered.filter(
          e =>
            e.name.toLowerCase().includes(q) ||
            e.email.toLowerCase().includes(q) ||
            e.department.toLowerCase().includes(q)
        );
      }
      if (deptParam.trim()) {
        filtered = filtered.filter(
          e => e.department.toLowerCase() === deptParam.trim().toLowerCase()
        );
      }

      setCurrentResponse({
        status: 200,
        statusText: 'OK',
        durationMs: Math.round(performance.now() - startTime + 7),
        body: filtered
      });
      return;
    }

    if (selectedMethod === 'POST') {
      // DRF Serializer & SQLite Constraints Validation
      const errors: Record<string, string[]> = {};

      if (!postData.name || postData.name.trim().length < 2) {
        errors.name = ['Employee name must be at least 2 characters long.'];
      }

      if (!postData.email || !postData.email.includes('@')) {
        errors.email = ['Enter a valid email address.'];
      } else {
        // SQLite unique constraint check
        const normalized = postData.email.trim().toLowerCase();
        const exists = employees.some(e => e.email.toLowerCase() === normalized);
        if (exists) {
          errors.email = ['An employee with this email address already exists.'];
        }
      }

      const salaryNum = parseFloat(postData.salary);
      if (isNaN(salaryNum) || salaryNum <= 0) {
        errors.salary = ['Salary must be a positive number greater than 0.'];
      }

      if (!postData.department) {
        errors.department = ['This field is required.'];
      }

      if (Object.keys(errors).length > 0) {
        setCurrentResponse({
          status: 400,
          statusText: 'Bad Request',
          durationMs: Math.round(performance.now() - startTime + 6),
          body: errors
        });
        return;
      }

      // Successful insertion into SQLite
      const nextId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
      const newEmployee: Employee = {
        id: nextId,
        name: postData.name.trim(),
        email: postData.email.trim().toLowerCase(),
        department: postData.department,
        salary: salaryNum,
        date_joined: postData.date_joined || new Date().toISOString().split('T')[0]
      };

      setEmployees(prev => [newEmployee, ...prev]);

      setCurrentResponse({
        status: 201,
        statusText: 'Created',
        durationMs: Math.round(performance.now() - startTime + 12),
        body: {
          message: 'Employee created successfully.',
          data: newEmployee
        }
      });
      return;
    }

    if (selectedMethod === 'PUT') {
      const foundIndex = employees.findIndex(e => e.id === targetId);
      if (foundIndex === -1) {
        setCurrentResponse({
          status: 404,
          statusText: 'Not Found',
          durationMs: Math.round(performance.now() - startTime + 5),
          body: { detail: `Employee with id ${targetId} does not exist.` }
        });
        return;
      }

      // Validation
      const errors: Record<string, string[]> = {};
      if (!postData.name || postData.name.trim().length < 2) {
        errors.name = ['Employee name must be at least 2 characters long.'];
      }

      const normalized = postData.email.trim().toLowerCase();
      const duplicate = employees.some(
        e => e.id !== targetId && e.email.toLowerCase() === normalized
      );
      if (duplicate) {
        errors.email = ['An employee with this email address already exists.'];
      }

      const salaryNum = parseFloat(postData.salary);
      if (isNaN(salaryNum) || salaryNum <= 0) {
        errors.salary = ['Salary must be a positive number greater than 0.'];
      }

      if (Object.keys(errors).length > 0) {
        setCurrentResponse({
          status: 400,
          statusText: 'Bad Request',
          durationMs: Math.round(performance.now() - startTime + 6),
          body: errors
        });
        return;
      }

      const updatedEmployee: Employee = {
        id: targetId,
        name: postData.name.trim(),
        email: normalized,
        department: postData.department,
        salary: salaryNum,
        date_joined: postData.date_joined
      };

      const copy = [...employees];
      copy[foundIndex] = updatedEmployee;
      setEmployees(copy);

      setCurrentResponse({
        status: 200,
        statusText: 'OK',
        durationMs: Math.round(performance.now() - startTime + 9),
        body: {
          message: 'Employee updated successfully.',
          data: updatedEmployee
        }
      });
      return;
    }

    if (selectedMethod === 'DELETE') {
      const found = employees.find(e => e.id === targetId);
      if (!found) {
        setCurrentResponse({
          status: 404,
          statusText: 'Not Found',
          durationMs: Math.round(performance.now() - startTime + 5),
          body: { detail: `Employee with id ${targetId} not found.` }
        });
        return;
      }

      setEmployees(prev => prev.filter(e => e.id !== targetId));

      setCurrentResponse({
        status: 200,
        statusText: 'OK',
        durationMs: Math.round(performance.now() - startTime + 8),
        body: {
          message: `Employee '${found.name}' (ID: ${found.id}) successfully deleted.`
        }
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner with SQLite Engine info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-neutral-900 text-neutral-100 border border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-amber-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">Django REST + SQLite In-Memory Simulator</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Simulates SQLite tables, constraint enforcement (unique email, not null), and DRF ViewSet responses.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onResetData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition-colors"
            title="Reset database to default seed records"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset DB Seed</span>
          </button>
        </div>
      </div>

      {/* Grid: Controller and Response */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Request Builder (7 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-neutral-600" />
              <span>HTTP Request Dispatcher</span>
            </h3>
            <span className="text-xs text-neutral-500 font-mono">http://127.0.0.1:8000</span>
          </div>

          {/* Method & Endpoint selection */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-neutral-700">Endpoint & Verb</label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['GET', 'POST', 'PUT', 'DELETE'] as const).map(method => (
                <button
                  key={method}
                  id={`method-btn-${method.toLowerCase()}`}
                  onClick={() => {
                    setSelectedMethod(method);
                    if (method === 'POST') {
                      setEndpointPath('/api/employees/');
                    } else if (method === 'PUT' || method === 'DELETE') {
                      setEndpointPath('/api/employees/{id}/');
                    }
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold tracking-wide font-mono transition-colors ${
                    selectedMethod === method
                      ? method === 'GET'
                        ? 'bg-blue-600 text-white'
                        : method === 'POST'
                        ? 'bg-emerald-600 text-white'
                        : method === 'PUT'
                        ? 'bg-amber-600 text-white'
                        : 'bg-rose-600 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>

            {/* Path selector */}
            <div className="flex gap-2 mt-1">
              <select
                id="endpoint-selector"
                value={endpointPath}
                onChange={e => setEndpointPath(e.target.value)}
                className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-400"
              >
                {selectedMethod === 'GET' ? (
                  <>
                    <option value="/api/employees/">/api/employees/ (List with filters)</option>
                    <option value="/api/employees/{id}/">/api/employees/{'{id}'}/ (Retrieve by ID)</option>
                    <option value="/api/employees/stats/">/api/employees/stats/ (Custom @action stats)</option>
                  </>
                ) : selectedMethod === 'POST' ? (
                  <option value="/api/employees/">/api/employees/ (Create employee)</option>
                ) : (
                  <option value="/api/employees/{id}/">/api/employees/{'{id}'}/ (Target resource)</option>
                )}
              </select>
            </div>
          </div>

          {/* Conditional Controls based on selection */}
          {selectedMethod === 'GET' && endpointPath === '/api/employees/' && (
            <div className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-200/80 flex flex-col gap-3">
              <div className="text-xs font-medium text-neutral-700">Query Parameters (Search & Filter)</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-neutral-500 font-mono block mb-1">
                    ?search= (Name or Department)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Alex or Engineering"
                    value={searchParam}
                    onChange={e => setSearchParam(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-neutral-500 font-mono block mb-1">
                    ?department= (Exact match)
                  </label>
                  <select
                    value={deptParam}
                    onChange={e => setDeptParam(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-500"
                  >
                    <option value="">All Departments</option>
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {(endpointPath === '/api/employees/{id}/' || selectedMethod === 'DELETE' || selectedMethod === 'PUT') && (
            <div className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-200/80">
              <label className="text-xs font-medium text-neutral-700 block mb-1">
                Target Employee ID (URL path param: /{targetId}/)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  value={targetId}
                  onChange={e => setTargetId(parseInt(e.target.value) || 1)}
                  className="w-24 px-2.5 py-1.5 text-xs font-mono rounded border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-500"
                />
                <span className="text-xs text-neutral-500">
                  Select an ID from the SQLite table below (e.g., 1, 2, 3...)
                </span>
              </div>
            </div>
          )}

          {(selectedMethod === 'POST' || selectedMethod === 'PUT') && (
            <div className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-200/80 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-700">JSON Request Body</span>
                <span className="text-[11px] text-neutral-400 font-mono">application/json</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] text-neutral-600 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={postData.name}
                    onChange={e => setPostData({ ...postData, name: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-neutral-600 block mb-1">Corporate Email (Unique)</label>
                  <input
                    type="email"
                    value={postData.email}
                    onChange={e => setPostData({ ...postData, email: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-neutral-600 block mb-1">Department</label>
                  <select
                    value={postData.department}
                    onChange={e => setPostData({ ...postData, department: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-500"
                  >
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-neutral-600 block mb-1">Salary (Decimal USD)</label>
                  <input
                    type="number"
                    step="500"
                    value={postData.salary}
                    onChange={e => setPostData({ ...postData, salary: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] text-neutral-600 block mb-1">Date Joined</label>
                  <input
                    type="date"
                    value={postData.date_joined}
                    onChange={e => setPostData({ ...postData, date_joined: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <button
              id="send-request-btn"
              onClick={executeRequest}
              className="w-full py-2.5 px-4 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Send Request to Django REST Backend</span>
            </button>
          </div>

          {/* Equivalent cURL block */}
          <div className="mt-2 p-3 rounded-lg bg-neutral-950 text-neutral-300 border border-neutral-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-mono text-neutral-400">Equivalent Terminal cURL:</span>
              <button
                onClick={handleCopyCurl}
                className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white transition-colors"
              >
                {curlCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{curlCopied ? 'Copied' : 'Copy cURL'}</span>
              </button>
            </div>
            <pre className="text-[11px] font-mono text-amber-300/90 whitespace-pre-wrap overflow-x-auto">
              {getCurlCommand()}
            </pre>
          </div>
        </div>

        {/* Right: Response Inspector (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-neutral-600" />
              <span>DRF Response Inspector</span>
            </h3>
            {currentResponse && (
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                    currentResponse.status >= 200 && currentResponse.status < 300
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : currentResponse.status >= 400
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-neutral-100 text-neutral-700'
                  }`}
                >
                  {currentResponse.status} {currentResponse.statusText}
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  {currentResponse.durationMs}ms
                </span>
              </div>
            )}
          </div>

          {/* Response Payload Viewer */}
          <div className="flex-1 flex flex-col min-h-[350px] rounded-lg bg-neutral-950 border border-neutral-800 overflow-hidden">
            <div className="px-3 py-2 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-400 font-mono">
              <span>HTTP/1.1 {currentResponse?.status} {currentResponse?.statusText}</span>
              <span>Content-Type: application/json</span>
            </div>
            <pre className="flex-1 p-3.5 text-xs font-mono text-emerald-400 overflow-auto whitespace-pre leading-relaxed">
              {currentResponse
                ? JSON.stringify(currentResponse.body, null, 2)
                : '// No response yet. Click "Send Request"'}
            </pre>
          </div>

          <div className="text-[11px] text-neutral-500 leading-normal flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
            <span>
              Try testing edge cases! Submitting an existing email or negative salary will trigger real DRF validation errors (HTTP 400).
            </span>
          </div>
        </div>
      </div>

      {/* SQLite Live Database Records View */}
      <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-neutral-600" />
              <span>SQLite Table: `employees` (db.sqlite3)</span>
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Live representation of SQLite table rows and schema constraints. Total records: {employees.length}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
            <span className="px-2 py-1 rounded bg-neutral-100 border border-neutral-200">
              ENGINE: sqlite3
            </span>
            <span className="px-2 py-1 rounded bg-neutral-100 border border-neutral-200">
              TABLE: employees
            </span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-neutral-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-medium font-mono">
                <th className="py-2.5 px-3">id (PK)</th>
                <th className="py-2.5 px-3">name (NOT NULL)</th>
                <th className="py-2.5 px-3">email (UNIQUE, NOT NULL)</th>
                <th className="py-2.5 px-3">department (NOT NULL)</th>
                <th className="py-2.5 px-3">salary (DECIMAL, &gt; 0)</th>
                <th className="py-2.5 px-3">date_joined (DATE)</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 font-mono">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-400">
                    No records found in SQLite database. Click "Reset DB Seed" to restore.
                  </td>
                </tr>
              ) : (
                employees.map(emp => (
                  <tr key={emp.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-neutral-800">{emp.id}</td>
                    <td className="py-2.5 px-3 text-neutral-900 font-sans font-medium">{emp.name}</td>
                    <td className="py-2.5 px-3 text-blue-700">{emp.email}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-sans font-medium bg-neutral-100 text-neutral-700 border border-neutral-200">
                        {emp.department}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-emerald-700 font-semibold">
                      ${emp.salary.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-600">{emp.date_joined}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => {
                          setTargetId(emp.id);
                          setSelectedMethod('DELETE');
                          setEndpointPath('/api/employees/{id}/');
                        }}
                        className="text-xs text-rose-600 hover:text-rose-800 font-sans font-medium hover:underline mr-2"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => {
                          setTargetId(emp.id);
                          setPostData({
                            name: emp.name,
                            email: emp.email,
                            department: emp.department,
                            salary: emp.salary.toString(),
                            date_joined: emp.date_joined
                          });
                          setSelectedMethod('PUT');
                          setEndpointPath('/api/employees/{id}/');
                        }}
                        className="text-xs text-neutral-700 hover:text-neutral-900 font-sans font-medium hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
