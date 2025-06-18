// src/services/ApiService.js
class ApiService {
  static getAuthToken() {
    return localStorage.getItem('tutorlink_token');
  }

  static async request(endpoint, options = {}) {
    const url = `http://localhost:8080${endpoint}`;
    const token = this.getAuthToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Auth endpoints
  static async register(registerData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(registerData),
    });
  }

  static async login(loginData) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
  }

  // Student endpoints
  static async getAllStudents() {
    return this.request('/students');
  }

  // Tutor endpoints
  static async getAllTutors() {
    return this.request('/tutors');
  }

  // Subject endpoints
  static async getAllSubjects() {
    return this.request('/subjects');
  }

  // Appointment endpoints
  static async getAllAppointments() {
    return this.request('/appointments');
  }

  static async createAppointment(studentId, tutorId, subjectId, dateTime, location) {
    const params = new URLSearchParams({
      studentId,
      tutorId,
      subjectId,
      dateTime,
      location,
    });
    return this.request(`/appointments?${params}`, {
      method: 'POST',
    });
  }

  static async updateAppointmentStatus(id, newStatus) {
    const params = new URLSearchParams({ newStatus });
    return this.request(`/appointments/${id}/status?${params}`, {
      method: 'PUT',
    });
  }

  // Tutor management endpoints
  static async updateTutorAvailability(tutorId, availability) {
    return this.request(`/tutors/${tutorId}/availability`, {
      method: 'PUT',
      body: JSON.stringify({ availability }),
    });
  }

  static async updateTutorRates(tutorId, rate) {
    return this.request(`/tutors/${tutorId}/rates`, {
      method: 'PUT',
      body: JSON.stringify({ rate }),
    });
  }

  static async getTutorAnalytics(tutorId) {
    return this.request(`/tutors/${tutorId}/analytics`);
  }

  static async linkTutorToSubject(tutorId, subjectId) {
    return this.request(`/tutor-subjects/${tutorId}/${subjectId}`, {
      method: 'POST',
    });
  }
}

export default ApiService;