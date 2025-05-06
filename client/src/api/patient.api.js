/**
 * Patient API service
 * Handles all patient-related API calls to the backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Cache for doctor details
const doctorCache = new Map();
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Helper function to handle API responses
 * @param {Response} response - Fetch API response
 * @returns {Promise<Object>} Parsed response data
 */
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong');
    error.response = response;
    error.status = response.status;
    error.data = data;
    throw error;
  }
  
  return data;
};

/**
 * Helper function to get authentication token
 * @returns {string} Authentication token
 * @throws {Error} If no token is found
 */
const getAuthToken = () => {
  // Try to get token from sessionStorage
  let token = sessionStorage.getItem('authToken');
  
  // If not in sessionStorage, try localStorage as fallback
  if (!token) {
    token = localStorage.getItem('authToken');
  }
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  return token;
};

/**
 * Get list of doctors (public)
 * @param {Object} params - { location, department, limit, page }
 * @returns {Promise<Object>} Object containing doctors list and pagination info
 */
export const getDoctors = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `${API_URL}/patient/doctors${query ? `?${query}` : ""}`;
  const response = await fetch(url);
  const data = await handleResponse(response);
  
  // Map _id to id for frontend consistency
  const doctors = (data.data || []).map(doc => ({
    id: doc._id,
    name: doc.name,
    photoURL: doc.photoURL,
    specialization: doc.specialization,
    degree: doc.degree,
    experience: doc.experience,
  }));
  
  // Return both doctors and pagination info
  return {
    doctors,
    total: data.total || doctors.length,
    page: data.page || 1,
    limit: data.limit || 8
  };
};

/**
 * Get doctor details by ID (public)
 * @param {string} doctorId - Doctor's ID
 * @param {boolean} bypassCache - Whether to bypass cache and fetch fresh data
 * @returns {Promise<Object>} Doctor details
 */
export const getDoctorById = async (doctorId, bypassCache = false) => {
  if (!doctorId) {
    throw new Error('Doctor ID is required');
  }
  
  // Check cache first if not bypassing
  if (!bypassCache && doctorCache.has(doctorId)) {
    const cachedData = doctorCache.get(doctorId);
    if (Date.now() < cachedData.expiry) {
      console.log('Using cached doctor data');
      return cachedData.data;
    } else {
      // Cache expired, remove it
      doctorCache.delete(doctorId);
    }
  }
  
  try {
    const url = `${API_URL}/patient/doctors/${doctorId}`;
    const response = await fetch(url);
    const data = await handleResponse(response);
    
    // Map _id to id for frontend consistency
    if (data.data) {
      // Format availability into a readable string if it exists
      let availabilityText = null;
      let availabilityByDay = {};
      
      if (data.data.availability) {
        const { workingDays, startTime, endTime, timeSlots } = data.data.availability;
        
        // If doctor has specific time slots for different days
        if (timeSlots && timeSlots.length > 0) {
          // Process time slots by day
          timeSlots.forEach(daySlot => {
            const day = daySlot.day.charAt(0).toUpperCase() + daySlot.day.slice(1);
            const daySlots = daySlot.slots.map(slot => 
              `${formatTime(slot.startTime)} – ${formatTime(slot.endTime)}`
            ).join(', ');
            availabilityByDay[day] = daySlots;
          });
          
          // Create a summary text for availability with time slots
          const daysWithSlots = Object.keys(availabilityByDay);
          if (daysWithSlots.length > 0) {
            // Convert full day names to abbreviated format
            const abbreviatedDays = daysWithSlots.map(day => {
              const abbrevMap = {
                'Monday': 'Mon',
                'Tuesday': 'Tue',
                'Wednesday': 'Wed',
                'Thursday': 'Thu',
                'Friday': 'Fri',
                'Saturday': 'Sat',
                'Sunday': 'Sun'
              };
              return abbrevMap[day] || day.substring(0, 3);
            });
            
            // Group consecutive days
            let dayRanges = [];
            let currentRange = [abbreviatedDays[0]];
            
            for (let i = 1; i < abbreviatedDays.length; i++) {
              const dayOrder = { 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6, 'Sun': 7 };
              if (dayOrder[abbreviatedDays[i]] - dayOrder[abbreviatedDays[i-1]] === 1) {
                currentRange.push(abbreviatedDays[i]);
              } else {
                dayRanges.push(currentRange);
                currentRange = [abbreviatedDays[i]];
              }
            }
            dayRanges.push(currentRange);
            
            // Format day ranges
            const formattedDays = dayRanges.map(range => {
              if (range.length === 1) return range[0];
              return `${range[0]}-${range[range.length - 1]}`;
            }).join(', ');
            
            availabilityText = `${formattedDays}, with specific time slots`;
          }
        } else {
          // Convert working days to abbreviated format (e.g., "Mon-Sat")
          const days = [];
          if (workingDays.monday) days.push('Mon');
          if (workingDays.tuesday) days.push('Tue');
          if (workingDays.wednesday) days.push('Wed');
          if (workingDays.thursday) days.push('Thu');
          if (workingDays.friday) days.push('Fri');
          if (workingDays.saturday) days.push('Sat');
          if (workingDays.sunday) days.push('Sun');
          
          // Create availability string
          if (days.length > 0) {
            // Group consecutive days
            let dayRanges = [];
            let currentRange = [days[0]];
            
            for (let i = 1; i < days.length; i++) {
              const dayOrder = { 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6, 'Sun': 7 };
              if (dayOrder[days[i]] - dayOrder[days[i-1]] === 1) {
                currentRange.push(days[i]);
              } else {
                dayRanges.push(currentRange);
                currentRange = [days[i]];
              }
            }
            dayRanges.push(currentRange);
            
            // Format day ranges
            const formattedDays = dayRanges.map(range => {
              if (range.length === 1) return range[0];
              return `${range[0]} – ${range[range.length - 1]}`;
            }).join(', ');
            
            availabilityText = `${formattedDays}, ${formatTime(startTime)} – ${formatTime(endTime)}`;
          }
        }
      }
      
      const doctorData = {
        id: data.data._id,
        name: data.data.name,
        email: data.data.email,
        specialization: data.data.specialization,
        experience: data.data.experience,
        degree: data.data.degree,
        hospitalAffiliation: data.data.hospitalAffiliation,
        hospitalAddress: data.data.hospitalAddress,
        licenseNumber: data.data.licenseNumber,
        issuingMedicalCouncil: data.data.issuingMedicalCouncil,
        languages: data.data.languages,
        location: data.data.location,
        consultationFee: data.data.consultationFee,
        photoURL: data.data.photoURL,
        gender: data.data.gender,
        bio: data.data.bio,
        availability: data.data.availability,
        availabilityText: availabilityText,
        availabilityByDay: Object.keys(availabilityByDay).length > 0 ? availabilityByDay : null,
        timezone: data.data.timezone || 'Asia/Kolkata' // Default timezone for India
      };
      
      // Store in cache with expiry
      doctorCache.set(doctorId, {
        data: doctorData,
        expiry: Date.now() + CACHE_EXPIRY
      });
      
      return doctorData;
    }
    
    return null;
  } catch (error) {
    // Provide more specific error messages based on error type
    if (error.status === 404) {
      console.error('Doctor not found or profile not complete');
      throw new Error('Doctor not found or profile not complete');
    } else if (error.status === 400) {
      console.error('Invalid doctor ID format');
      throw new Error('Invalid doctor ID format');
    } else if (error.status >= 500) {
      console.error('Server error, please try again later');
      throw new Error('Server error, please try again later');
    }
    
    console.error('Error getting doctor details:', error);
    throw error;
  }
};

/* Format time from 24h to 12h format
* @param {string} time - Time in 24h format (HH:MM)
* @returns {string} Time in 12h format
*/
const formatTime = (time) => {
 if (!time) return '';
 const [hours, minutes] = time.split(':');
 const hour = parseInt(hours);
 const ampm = hour >= 12 ? 'PM' : 'AM';
 const formattedHour = hour % 12 || 12;
 return `${formattedHour}:${minutes} ${ampm}`;
};

/**
 * Get doctor reviews by doctor ID (public)
 * @param {string} doctorId - Doctor's ID
 * @param {Object} params - { page, limit }
 * @returns {Promise<Object>} Reviews and pagination info
 */
export const getDoctorReviews = async (doctorId, params = {}) => {
  if (!doctorId) {
    throw new Error('Doctor ID is required');
  }
  
  try {
    const query = new URLSearchParams(params).toString();
    const url = `${API_URL}/patient/doctors/${doctorId}/reviews${query ? `?${query}` : ""}`;
    const response = await fetch(url);
    const data = await handleResponse(response);
    
    return {
      reviews: data.data.reviews || [],
      averageRating: data.data.averageRating || 0,
      totalReviews: data.data.totalReviews || 0,
      page: data.data.page || 1,
      limit: data.data.limit || 10,
      totalPages: data.data.totalPages || 1
    };
  } catch (error) {
    // Provide more specific error messages based on error type
    if (error.status === 404) {
      console.error('Doctor not found or profile not complete');
      throw new Error('Doctor not found or profile not complete');
    } else if (error.status === 400) {
      console.error('Invalid doctor ID format');
      throw new Error('Invalid doctor ID format');
    } else if (error.status >= 500) {
      console.error('Server error, please try again later');
      throw new Error('Server error, please try again later');
    }
    
    console.error('Error getting doctor reviews:', error);
    throw error;
  }
};

/**
 * Submit patient details to a doctor
 * @param {Object} patientDetails - Patient details object
 * @param {string} patientDetails.doctorId - ID of the doctor
 * @param {string} patientDetails.fullName - Patient's full name
 * @param {number} patientDetails.age - Patient's age
 * @param {string} patientDetails.relation - Relation with patient
 * @param {string} patientDetails.contactNumber - Patient's contact number
 * @param {string} patientDetails.email - Patient's email
 * @param {string} patientDetails.gender - Patient's gender
 * @param {string} patientDetails.emergencyContact - Emergency contact
 * @param {string} patientDetails.problem - Description of the medical problem
 * @param {FileList|File[]} patientDetails.medicalFiles - Medical files to upload
 * @returns {Promise<Object>} Submission details
 */
export const submitPatientDetails = async (patientDetails) => {
  const token = getAuthToken();

  try {
    const formData = new FormData();
    
    // Add text fields to form data
    formData.append('doctorId', patientDetails.doctorId);
    formData.append('fullName', patientDetails.fullName);
    formData.append('age', patientDetails.age);
    formData.append('relation', patientDetails.relation);
    formData.append('contactNumber', patientDetails.contactNumber);
    formData.append('email', patientDetails.email);
    formData.append('gender', patientDetails.gender);
    
    if (patientDetails.emergencyContact) {
      formData.append('emergencyContact', patientDetails.emergencyContact);
    }
    
    formData.append('problem', patientDetails.problem);
    
    // Add medical files to form data
    if (patientDetails.medicalFiles && patientDetails.medicalFiles.length > 0) {
      for (let i = 0; i < patientDetails.medicalFiles.length; i++) {
        formData.append('medicalFiles', patientDetails.medicalFiles[i]);
      }
    }
    
    const response = await fetch(`${API_URL}/patient/patient-details`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error submitting patient details:', error);
    throw error;
  }
};

/**
 * Get the latest response for the authenticated patient
 * @returns {Promise<Object>} Response details
 */
export const getPatientResponse = async () => {
  const token = getAuthToken();
  
  try {
    const response = await fetch(`${API_URL}/patient/response`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await handleResponse(response);
    
    // Format the response for easier consumption
    return {
      success: data.success,
      id: data.data.id,
      status: data.data.status,
      doctorId: data.data.doctorId,
      doctorResponse: data.data.doctorResponse ? {
        message: data.data.doctorResponse.message || '',
        responseDate: data.data.doctorResponse.responseDate ? new Date(data.data.doctorResponse.responseDate) : null,
        secondOpinionRequired: data.data.doctorResponse.secondOpinionRequired || false,
        responseFiles: data.data.doctorResponse.responseFiles || []
      } : null,
      appointmentDetails: data.data.appointmentDetails ? {
        date: data.data.appointmentDetails.date ? new Date(data.data.appointmentDetails.date) : null,
        time: data.data.appointmentDetails.time || null,
        notes: data.data.appointmentDetails.notes || '',
        isCompleted: data.data.appointmentDetails.isCompleted || false,
        completedAt: data.data.appointmentDetails.completedAt ? new Date(data.data.appointmentDetails.completedAt) : null
      } : null
    };
  } catch (error) {
    // Provide more specific error messages based on error type
    if (error.status === 404) {
      console.error('No submissions found');
      throw new Error('No submissions found');
    } else if (error.status >= 500) {
      console.error('Server error, please try again later');
      throw new Error('Server error, please try again later');
    }
    
    console.error('Error getting patient response:', error);
    throw error;
  }
};

/**
 * Get available time slots for a doctor on a specific date
 * @param {string} doctorId - Doctor's ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Array>} Array of available time slots
 */
export const getAvailableTimeSlots = async (doctorId, date) => {
  if (!doctorId) {
    console.error('getAvailableTimeSlots called without doctorId');
    throw new Error('Doctor ID is required');
  }
  
  if (!date) {
    console.error('getAvailableTimeSlots called without date');
    throw new Error('Date is required');
  }
  
  try {
    const token = getAuthToken();
    const url = `${API_URL}/patient/doctors/${doctorId}/available-slots?date=${date}`;
    
    console.log('Fetching available slots from URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await handleResponse(response);
    console.log('Date format:', date);
    console.log('API response for slots:', data);
    
    // Make sure we're accessing the correct property in the response
    const slots = data.data?.availableSlots || [];
    console.log('Extracted slots:', slots);
    
    return slots;
  } catch (error) {
    console.error('Error fetching available slots:', error);
    throw error;
  }
};

/**
 * Request appointment with a doctor
 * @param {string} submissionId - ID of the submission
 * @param {Object} appointmentDetails - Appointment details
 * @param {string} appointmentDetails.date - Appointment date (YYYY-MM-DD)
 * @param {string} appointmentDetails.time - Appointment time
 * @param {string} appointmentDetails.notes - Additional notes (optional)
 * @returns {Promise<Object>} Updated appointment details
 */
export const requestAppointment = async (submissionId, appointmentDetails) => {
  if (!submissionId) {
    throw new Error('Submission ID is required');
  }
  
  if (!appointmentDetails.date || !appointmentDetails.time) {
    throw new Error('Date and time are required');
  }
  
  const token = getAuthToken();
  
  try {
    const response = await fetch(`${API_URL}/patient/response/${submissionId}/appointment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(appointmentDetails)
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error requesting appointment:', error);
    throw error;
  }
};

/**
 * Submit a review for a doctor after appointment
 * @param {string} submissionId - ID of the patient submission
 * @param {Object} reviewData - { rating, comment }
 * @returns {Promise<Object>} Review submission result
 */
export const submitReview = async (submissionId, reviewData) => {
  if (!submissionId) {
    throw new Error('Submission ID is required');
  }
  
  if (!reviewData || !reviewData.rating) {
    throw new Error('Rating is required');
  }
  
  try {
    const token = getAuthToken();
    const url = `${API_URL}/patient/response/${submissionId}/review`;
    
    console.log('Submitting review to:', url, reviewData);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        rating: reviewData.rating,
        comment: reviewData.comment || ''
      })
    });
    
    const data = await handleResponse(response);
    return data;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};
