export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  salary: number;
  date_joined: string;
}

export interface CodeFile {
  id: string;
  name: string;
  path: string;
  category: 'core' | 'project' | 'docs';
  description: string;
  language: string;
  code: string;
}

export interface ApiRequestLog {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  status: number;
  statusText: string;
  durationMs: number;
  requestBody?: any;
  responseBody: any;
}
