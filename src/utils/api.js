import axios from "axios";

// const API_URL1 = "http://localhost:8000/api/admin";
// const API_URL2 = "http://localhost:8000/api/questions";
// const API_URL3 = "http://localhost:8000/api/candidates";
const API_URL1 = "https://aptitude-test-ojtq.onrender.com/api/admin";
const API_URL2 = "https://aptitude-test-ojtq.onrender.com/api/questions";
const API_URL3 = "https://aptitude-test-ojtq.onrender.com/api/candidates";


export const Signup = async (data) => {
    try {
      const res = await axios.post(`${API_URL3}/condidate`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // console.log(res.data);
      return res.data;
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      throw error;
    }
  };
export const loginApi = async (data) => {
    try {
      const res = await axios.post(`${API_URL3}/login`, data, {
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}`,
        },
      });
      // console.log(res.data);
      return res.data;
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      throw error;
    }
  };
export const AssignQuestions = async (token) => {
  console.log(token,"tokenjdhjsf")
    try {
      const res = await axios.get(`${API_URL3}/assigned-questions`, {
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`,
        },
      });
      
      console.log(res.data,"message");
      return res.data;
    } catch (error) {

      console.error("Error fetching restaurants:", error.status);
      throw error.status;
    }
  };
export const updateMarks = async (data,token) => {
  console.log(token,"tokenjdhjsf")
    try {
      const res = await axios.post(`${API_URL3}/updateCandidateMarks`,data, {
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`,
        },
      });

      console.log(res.data,"message");
      return res.data;
    } catch (error) {

      console.error("Error fetching restaurants:", error.status);
      throw error.status;
    }
  };

