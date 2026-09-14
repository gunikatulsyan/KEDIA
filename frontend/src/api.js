import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const client = axios.create({ baseURL: API });

// attach admin token if present
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('kedia_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Public
export const getServices = () => client.get('/services').then((r) => r.data);
export const getExpertise = () => client.get('/expertise').then((r) => r.data);
export const submitInquiry = (payload) => client.post('/inquiries', payload).then((r) => r.data);

// Auth
export const adminLogin = (username, password) =>
  client.post('/admin/login', { username, password }).then((r) => r.data);

// Admin - inquiries
export const listInquiries = () => client.get('/inquiries').then((r) => r.data);
export const deleteInquiry = (id) => client.delete(`/inquiries/${id}`).then((r) => r.data);

// Admin - services
export const createService = (data) => client.post('/services', data).then((r) => r.data);
export const updateService = (id, data) => client.put(`/services/${id}`, data).then((r) => r.data);
export const deleteService = (id) => client.delete(`/services/${id}`).then((r) => r.data);

// Admin - expertise
export const createExpertise = (data) => client.post('/expertise', data).then((r) => r.data);
export const updateExpertise = (id, data) => client.put(`/expertise/${id}`, data).then((r) => r.data);
export const deleteExpertise = (id) => client.delete(`/expertise/${id}`).then((r) => r.data);

export default client;
