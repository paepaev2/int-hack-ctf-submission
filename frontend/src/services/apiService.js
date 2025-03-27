import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const submitAnswer = async (username, task, answer) => {
  try {
    const response = await axios.post(`${API_URL}/submit-answer`, {
      username,
      task,
      answer
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Failed to submit answer');
  }
};

export const getLeaderboard = async () => {
  try {
    const response = await axios.get(`${API_URL}/leaderboard`);
    return response.data.leaderboard;
  } catch (error) {
    throw error.response?.data || new Error('Failed to fetch leaderboard');
  }
};