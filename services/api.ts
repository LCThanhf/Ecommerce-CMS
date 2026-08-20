const BASE_URL = 'https://localhost:7289/api'

// Helper function to get headers with Authorization token
const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (typeof window !== 'undefined') {
    const isAdmin = window.location.pathname.startsWith('/admin');
    const token = isAdmin ? localStorage.getItem('admin_token') : localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
}

const checkResponse = (response: Response) => {
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      const isAdmin = window.location.pathname.startsWith('/admin');
      window.dispatchEvent(new CustomEvent('session-expired', { detail: { isAdmin } }));
    }
    throw new Error('Unauthorized');
  }
  if (!response.ok) {
    throw new Error('Bad response');
  }
}

export const api = {
  get: async <T>(url: string): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      headers: getHeaders(),
    })
    checkResponse(response);
    return response.json() as Promise<T>
  },
  post: async <T>(url: string, data: any): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    })
    checkResponse(response);
    return response.json() as Promise<T>
  },
  put: async <T>(url: string, data: any): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    })
    checkResponse(response);
    if (response.status === 204) return {} as T;
    return response.json() as Promise<T>
  },
  delete: async <T>(url: string): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'DELETE',
      headers: getHeaders(),
    })
    checkResponse(response);
    if (response.status === 204) return {} as T;
    return response.json() as Promise<T>
  },
}
