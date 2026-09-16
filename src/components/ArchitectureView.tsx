import React, { useState } from 'react';
import { Database, ShieldCheck, Route, FileCheck2, Cpu, GraduationCap, CheckCircle2, FileText, Send, Copy, Check } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = async (text: string, sectionId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(sectionId);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="flex flex-col gap-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-neutral-200 bg-white shadow-xs flex flex-col gap-2">
          <div className="flex items-center gap-2 text-neutral-900 font-semibold text-sm">
            <Database className="w-4 h-4 text-blue-600" />
            <span>1. Database Model</span>
          </div>
          <p className="text-xs text-neutral-600">
            Defined in <code className="font-mono text-neutral-800 font-medium">models.py</code> using Django ORM. Auto-generates SQLite <code className="font-mono">db.sqlite3</code> schema with primary key, <code className="font-mono">unique=True</code> email, and non-null constraints.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 bg-white shadow-xs flex flex-col gap-2">
          <div className="flex items-center gap-2 text-neutral-900 font-semibold text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>2. Serializer / DTO</span>
          </div>
          <p className="text-xs text-neutral-600">
            Defined in <code className="font-mono text-neutral-800 font-medium">serializers.py</code> with <code className="font-mono">EmployeeSerializer</code>. Validates format, enforces positive salary, checks uniqueness, and transforms ORM models to JSON.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 bg-white shadow-xs flex flex-col gap-2">
          <div className="flex items-center gap-2 text-neutral-900 font-semibold text-sm">
            <Cpu className="w-4 h-4 text-amber-600" />
            <span>3. ViewSet Controller</span>
          </div>
          <p className="text-xs text-neutral-600">
            Defined in <code className="font-mono text-neutral-800 font-medium">views.py</code> using <code className="font-mono">ModelViewSet</code>. Dispatches standard REST verbs (GET, POST, PUT, DELETE) and query filters (<code className="font-mono">?name=</code>, <code className="font-mono">?department=</code>).
          </p>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 bg-white shadow-xs flex flex-col gap-2">
          <div className="flex items-center gap-2 text-neutral-900 font-semibold text-sm">
            <Route className="w-4 h-4 text-purple-600" />
            <span>4. URL Routing</span>
          </div>
          <p className="text-xs text-neutral-600">
            Defined in <code className="font-mono text-neutral-800 font-medium">urls.py</code> via <code className="font-mono">DefaultRouter</code>. Automatically routes RESTful endpoints and binds viewset actions cleanly.
          </p>
        </div>
      </div>

      {/* Model Schema Specification */}
      <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
        <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-neutral-700" />
          <span>Entity & Database Schema Specification</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600">
                <th className="py-2.5 px-3">Field Name</th>
                <th className="py-2.5 px-3">Django Field Type</th>
                <th className="py-2.5 px-3">SQLite Storage Type</th>
                <th className="py-2.5 px-3">Constraints</th>
                <th className="py-2.5 px-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-neutral-800">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-blue-700">id</td>
                <td className="py-2.5 px-3">BigAutoField</td>
                <td className="py-2.5 px-3">INTEGER</td>
                <td className="py-2.5 px-3">PRIMARY KEY AUTOINCREMENT</td>
                <td className="py-2.5 px-3 font-sans text-neutral-600">Unique identifier for each employee</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-blue-700">name</td>
                <td className="py-2.5 px-3">CharField(max_length=100)</td>
                <td className="py-2.5 px-3">VARCHAR(100)</td>
                <td className="py-2.5 px-3">NOT NULL, BLANK=FALSE</td>
                <td className="py-2.5 px-3 font-sans text-neutral-600">Full employee name (min 2 chars)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-blue-700">email</td>
                <td className="py-2.5 px-3">EmailField(max_length=255)</td>
                <td className="py-2.5 px-3">VARCHAR(255)</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">UNIQUE, NOT NULL</td>
                <td className="py-2.5 px-3 font-sans text-neutral-600">Enforces uniqueness across the database</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-blue-700">department</td>
                <td className="py-2.5 px-3">CharField(max_length=50)</td>
                <td className="py-2.5 px-3">VARCHAR(50)</td>
                <td className="py-2.5 px-3">NOT NULL</td>
                <td className="py-2.5 px-3 font-sans text-neutral-600">Designated business department</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-blue-700">salary</td>
                <td className="py-2.5 px-3">DecimalField(10, 2)</td>
                <td className="py-2.5 px-3">DECIMAL</td>
                <td className="py-2.5 px-3">NOT NULL, &gt; 0.00</td>
                <td className="py-2.5 px-3 font-sans text-neutral-600">Base salary with fixed-point accuracy</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-blue-700">date_joined</td>
                <td className="py-2.5 px-3">DateField(default=timezone.now)</td>
                <td className="py-2.5 px-3">DATE</td>
                <td className="py-2.5 px-3">NOT NULL</td>
                <td className="py-2.5 px-3 font-sans text-neutral-600">Hire date (cannot be in the future)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* College Project Viva / Presentation Tips */}
      <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-5 shadow-xs flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-indigo-600" />
          <h3 className="text-sm font-semibold text-neutral-900">
            College Project Presentation & Evaluation Guide
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-neutral-700">
          <div className="p-3.5 rounded-lg bg-white border border-neutral-200 flex flex-col gap-1.5">
            <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Demonstrating REST Endpoints</span>
            </div>
            <p>
              In your demo or screen share, open the Django Browsable API at <code className="font-mono text-neutral-900">http://127.0.0.1:8000/api/employees/</code> or send requests using Postman/cURL. Show that creating an employee returns <code className="font-mono text-emerald-700 font-semibold">201 Created</code> and list queries return <code className="font-mono text-blue-700 font-semibold">200 OK</code>.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-white border border-neutral-200 flex flex-col gap-1.5">
            <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Demonstrating Constraints</span>
            </div>
            <p>
              Show the professor what happens when submitting a duplicate email: Django returns <code className="font-mono text-rose-700 font-semibold">400 Bad Request</code> with <code className="font-mono">"An employee with this email address already exists."</code>, proving database & serializer constraints work.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-white border border-neutral-200 flex flex-col gap-1.5">
            <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Demonstrating Search & Filtering</span>
            </div>
            <p>
              Append query strings to your URL: <code className="font-mono text-neutral-900">?search=Engineering</code> or <code className="font-mono text-neutral-900">?name=Alex</code>. Explain how Django ORM translates this into SQL queries like <code className="font-mono">WHERE name LIKE '%Alex%'</code>.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-white border border-neutral-200 flex flex-col gap-1.5">
            <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Demonstrating SQLite Database</span>
            </div>
            <p>
              Point to <code className="font-mono text-neutral-900">db.sqlite3</code> file created in the project root. Mention that SQLite is ACID-compliant, zero-configuration, and ideal for rapid development and testing.
            </p>
          </div>
        </div>
      </div>

      {/* Postman API Test Cases & SOP Validation Suite */}
      <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-orange-600" />
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">
                Postman API Test Suite (College SOP Compliant)
              </h3>
              <p className="text-xs text-neutral-500">
                Covers positive, negative, and constraint test cases for all CRUD operations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 border border-neutral-200">
              Base URL: http://127.0.0.1:8000/api
            </span>
          </div>
        </div>

        {/* Test Matrix */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold font-mono">
                <th className="py-2.5 px-3">Test ID</th>
                <th className="py-2.5 px-3">Action / Objective</th>
                <th className="py-2.5 px-3">HTTP Method</th>
                <th className="py-2.5 px-3">Endpoint URI</th>
                <th className="py-2.5 px-3">Payload Type</th>
                <th className="py-2.5 px-3">Expected Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-neutral-800 font-mono">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-neutral-900">TC-01</td>
                <td className="py-2.5 px-3 font-sans">List All Employees</td>
                <td className="py-2.5 px-3"><span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[11px] font-bold">GET</span></td>
                <td className="py-2.5 px-3 text-neutral-600">/employees/</td>
                <td className="py-2.5 px-3 font-sans text-neutral-500">None</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">200 OK</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-neutral-900">TC-02</td>
                <td className="py-2.5 px-3 font-sans">Search Employees by Query</td>
                <td className="py-2.5 px-3"><span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[11px] font-bold">GET</span></td>
                <td className="py-2.5 px-3 text-neutral-600">/employees/?search=Alex</td>
                <td className="py-2.5 px-3 font-sans text-neutral-500">Query Param</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">200 OK</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-neutral-900">TC-03</td>
                <td className="py-2.5 px-3 font-sans">Filter by Department</td>
                <td className="py-2.5 px-3"><span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[11px] font-bold">GET</span></td>
                <td className="py-2.5 px-3 text-neutral-600">/employees/?department=Engineering</td>
                <td className="py-2.5 px-3 font-sans text-neutral-500">Query Param</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">200 OK</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-neutral-900">TC-04</td>
                <td className="py-2.5 px-3 font-sans">Create Employee (Valid Data)</td>
                <td className="py-2.5 px-3"><span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">POST</span></td>
                <td className="py-2.5 px-3 text-neutral-600">/employees/</td>
                <td className="py-2.5 px-3 font-sans text-emerald-600 font-medium">Valid JSON</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">201 Created</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-neutral-900">TC-05</td>
                <td className="py-2.5 px-3 font-sans">Duplicate Email Constraint Check</td>
                <td className="py-2.5 px-3"><span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">POST</span></td>
                <td className="py-2.5 px-3 text-neutral-600">/employees/</td>
                <td className="py-2.5 px-3 font-sans text-rose-600 font-medium">Duplicate Email</td>
                <td className="py-2.5 px-3 text-rose-700 font-bold">400 Bad Request</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-neutral-900">TC-06</td>
                <td className="py-2.5 px-3 font-sans">Negative Salary Validation</td>
                <td className="py-2.5 px-3"><span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">POST</span></td>
                <td className="py-2.5 px-3 text-neutral-600">/employees/</td>
                <td className="py-2.5 px-3 font-sans text-rose-600 font-medium">salary: -5000</td>
                <td className="py-2.5 px-3 text-rose-700 font-bold">400 Bad Request</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-neutral-900">TC-07</td>
                <td className="py-2.5 px-3 font-sans">Missing Required Fields (NOT NULL)</td>
                <td className="py-2.5 px-3"><span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">POST</span></td>
                <td className="py-2.5 px-3 text-neutral-600">/employees/</td>
                <td className="py-2.5 px-3 font-sans text-rose-600 font-medium">Empty JSON {'{}'}</td>
                <td className="py-2.5 px-3 text-rose-700 font-bold">400 Bad Request</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-neutral-900">TC-08</td>
                <td className="py-2.5 px-3 font-sans">Get Single Employee by Primary Key</td>
                <td className="py-2.5 px-3"><span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[11px] font-bold">GET</span></td>
                <td className="py-2.5 px-3 text-neutral-600">/employees/1/</td>
                <td className="py-2.5 px-3 font-sans text-neutral-500">None</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">200 OK</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-neutral-900">TC-09</td>
                <td className="py-2.5 px-3 font-sans">Query Non-Existent ID</td>
                <td className="py-2.5 px-3"><span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[11px] font-bold">GET</span></td>
                <td className="py-2.5 px-3 text-neutral-600">/employees/9999/</td>
                <td className="py-2.5 px-3 font-sans text-neutral-500">None</td>
                <td className="py-2.5 px-3 text-rose-700 font-bold">404 Not Found</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-neutral-900">TC-10</td>
                <td className="py-2.5 px-3 font-sans">Update Existing Employee Record</td>
                <td className="py-2.5 px-3"><span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[11px] font-bold">PUT</span></td>
                <td className="py-2.5 px-3 text-neutral-600">/employees/1/</td>
                <td className="py-2.5 px-3 font-sans text-emerald-600 font-medium">Valid JSON</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">200 OK</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-neutral-900">TC-11</td>
                <td className="py-2.5 px-3 font-sans">Delete Employee Record</td>
                <td className="py-2.5 px-3"><span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 text-[11px] font-bold">DELETE</span></td>
                <td className="py-2.5 px-3 text-neutral-600">/employees/1/</td>
                <td className="py-2.5 px-3 font-sans text-neutral-500">None</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">200 OK / 204</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Sample Payloads Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {/* Valid Payload */}
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-emerald-800">
                Sample Valid POST Payload (TC-04)
              </span>
              <button
                onClick={() =>
                  copyToClipboard(
                    `{\n  "name": "Jordan Bell",\n  "email": "jordan.bell@example.com",\n  "department": "Design",\n  "salary": 72500.00,\n  "date_joined": "2024-03-01"\n}`,
                    'valid-json'
                  )
                }
                className="flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-900"
              >
                {copiedSection === 'valid-json' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'valid-json' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="text-xs font-mono bg-white p-3 rounded border border-emerald-200 text-neutral-800 overflow-x-auto">
{`{
  "name": "Jordan Bell",
  "email": "jordan.bell@example.com",
  "department": "Design",
  "salary": 72500.00,
  "date_joined": "2024-03-01"
}`}
            </pre>
            <p className="text-[11px] text-emerald-700 mt-2">
              Expected Outcome: Returns <strong>201 Created</strong> with auto-assigned primary key ID.
            </p>
          </div>

          {/* Invalid Payload */}
          <div className="rounded-lg border border-rose-200 bg-rose-50/40 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-rose-800">
                Sample Invalid Payloads (TC-05 / TC-06)
              </span>
              <button
                onClick={() =>
                  copyToClipboard(
                    `// 1. Duplicate Email Check:\n{\n  "name": "Duplicate User",\n  "email": "alex.rivera@example.com",\n  "department": "Engineering",\n  "salary": 70000.00,\n  "date_joined": "2024-03-01"\n}\n\n// 2. Negative Salary Check:\n{\n  "name": "Invalid Salary",\n  "email": "new.user@example.com",\n  "department": "Finance",\n  "salary": -5000.00,\n  "date_joined": "2024-03-01"\n}`,
                    'invalid-json'
                  )
                }
                className="flex items-center gap-1 text-[11px] text-rose-700 hover:text-rose-900"
              >
                {copiedSection === 'invalid-json' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'invalid-json' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="text-xs font-mono bg-white p-3 rounded border border-rose-200 text-neutral-800 overflow-x-auto">
{`// Duplicate Email:
{
  "email": ["An employee with this email already exists."]
}

// Negative Salary:
{
  "salary": ["Salary must be a positive number greater than 0."]
}`}
            </pre>
            <p className="text-[11px] text-rose-700 mt-2">
              Expected Outcome: Returns <strong>400 Bad Request</strong> with serializer validation errors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
