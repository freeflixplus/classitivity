/**
 * Classitivity — API Client
 * Communicates with the NestJS backend at /api (proxied) or NEXT_PUBLIC_API_URL.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface ApiOptions extends RequestInit {
  /** If true, attach the stored access token */
  auth?: boolean;
}

class ApiError extends Error {
  status: number;
  data: Record<string, unknown> | null;

  constructor(message: string, status: number, data: Record<string, unknown> | null = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function request<T = unknown>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { auth = false, headers: customHeaders, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(customHeaders as Record<string, string>),
  };

  if (auth) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('classitivity_access_token') : null;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!res.ok) {
    let errorData = null;
    try {
      errorData = await res.json();
    } catch {
      // ignore parse error
    }
    throw new ApiError(
      errorData?.message || `Request failed (${res.status})`,
      res.status,
      errorData,
    );
  }

  // Handle 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json();
}

// ─── Auth Endpoints ────────────────────────────────────────────────

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: 'PLATFORM_ADMIN' | 'SCHOOL_ADMIN' | 'TEACHER';
    schoolId?: string;
    schoolName?: string;
    curriculumVersion?: string;
  };
  accessToken: string;
  refreshToken: string;
}

export const auth = {
  login: (email: string, password: string, loginPortal: 'admin' = 'admin') =>
    request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, loginPortal }),
    }),

  register: (data: {
    schoolName: string;
    curriculumVersion: string;
    country: string;
    phone?: string;
    adminName: string;
    email: string;
    password: string;
  }) =>
    request<LoginResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  refresh: (userId: string, refreshToken: string) =>
    request<{ accessToken: string; refreshToken: string }>('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ userId, refreshToken }),
    }),

  forgotPassword: (email: string) =>
    request<{ message: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, newPassword: string) =>
    request<{ message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    }),

  verifyEmail: (token: string) =>
    request<{ message: string }>('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),

  logout: () =>
    request('/api/auth/logout', {
      method: 'POST',
      auth: true,
    }),
};

// ─── Teacher Endpoints ─────────────────────────────────────────────

export const teacher = {
  getDashboard: () =>
    request<any>('/api/teachers/dashboard', {
      method: 'GET',
      auth: true,
    }),

  getClasses: () =>
    request<any>('/api/teachers/classes', {
      method: 'GET',
      auth: true,
    }),

  getLessons: (grade: string, subject: string) =>
    request<any>(`/api/teachers/classes/${grade}/${subject}`, {
      method: 'GET',
      auth: true,
    }),

  getResourceUrl: (resourceId: string) =>
    request<{ url: string; type: string; fileName: string; isDownloadable: boolean; isViewOnly: boolean }>(`/api/teachers/resources/${resourceId}/url`, {
      method: 'GET',
      auth: true,
    }),
};

// ─── Subscription Endpoints ────────────────────────────────────────

export const subscriptions = {
  list: () =>
    request<any>('/api/subscriptions', {
      method: 'GET',
      auth: true,
    }),

  create: (gradeLevel: string, billingCycle: 'MONTHLY' | 'TERMLY' | 'ANNUALLY') =>
    request<any>('/api/subscriptions', {
      method: 'POST',
      body: JSON.stringify({ gradeLevel, billingCycle }),
      auth: true,
    }),

  cancel: (subscriptionId: string) =>
    request<any>(`/api/subscriptions/${subscriptionId}`, {
      method: 'DELETE',
      auth: true,
    }),
};

// ─── School Admin Endpoints ────────────────────────────────────────

export const schoolAdmin = {
  getDashboard: () =>
    request<any>('/api/school-admin/dashboard', {
      method: 'GET',
      auth: true,
    }),

  getTeachers: () =>
    request<any>('/api/school-admin/teachers', {
      method: 'GET',
      auth: true,
    }),

  addTeacher: (name: string, email: string) =>
    request<any>('/api/school-admin/teachers', {
      method: 'POST',
      body: JSON.stringify({ name, email }),
      auth: true,
    }),

  getSubscriptions: () =>
    request<any>('/api/school-admin/subscriptions', {
      method: 'GET',
      auth: true,
    }),

  getBillingHistory: () =>
    request<any>('/api/school-admin/billing', {
      method: 'GET',
      auth: true,
    }),
};

// ─── Platform Admin Endpoints ──────────────────────────────────────

export const platformAdmin = {
  getDashboard: () =>
    request<any>('/api/platform-admin/dashboard', { method: 'GET', auth: true }),

  getSchools: (page = 1, limit = 20) =>
    request<any>(`/api/platform-admin/schools?page=${page}&limit=${limit}`, { method: 'GET', auth: true }),

  createSchool: (data: { name: string; curriculumVersion: string; country: string; adminName: string; email: string; phone?: string }) =>
    request<any>('/api/platform-admin/schools', { method: 'POST', body: JSON.stringify(data), auth: true }),

  updateSchool: (id: string, data: { isActive?: boolean; name?: string }) =>
    request<any>(`/api/platform-admin/schools/${id}`, { method: 'PATCH', body: JSON.stringify(data), auth: true }),

  getContentOverview: (page = 1, limit = 50) =>
    request<any>(`/api/platform-admin/content?page=${page}&limit=${limit}`, { method: 'GET', auth: true }),

  createCourse: (data: { title: string; subjectCode: string; curriculumVersion: string; gradeLevel: string; term: number; week: number; description?: string; status?: string }) =>
    request<any>('/api/platform-admin/courses', { method: 'POST', body: JSON.stringify(data), auth: true }),

  uploadResource: (lessonId: string, file: File, resourceType: string, price: number, currency: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('resourceType', resourceType);
    formData.append('price', price.toString());
    formData.append('currency', currency);
    
    // We can't use the standard `request` wrapper easily with FormData because 
    // it automatically sets Content-Type to application/json.
    // So we make a direct fetch call for uploads.
    const token = localStorage.getItem('classitivity_access_token');
    return fetch(`/api/admin/content/lessons/${lessonId}/resources`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }).then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Upload failed');
      }
      return res.json();
    });
  },

  getAnalytics: () =>
    request<any>('/api/platform-admin/analytics', { method: 'GET', auth: true }),

  getPayments: (page = 1, limit = 50) =>
    request<any>(`/api/platform-admin/payments?page=${page}&limit=${limit}`, { method: 'GET', auth: true }),
};

export { request, ApiError };


