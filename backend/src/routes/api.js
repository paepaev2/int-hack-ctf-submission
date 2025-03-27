import express from 'express';
import User from '../models/User.js';
import Answer from '../models/Answer.js';

const router = express.Router();

router.post('/submit-answer', async (req, res) => {
  try {
    const { username, task, answer } = req.body;

    // Find the correct answer
    const correctAnswerDoc = await Answer.findOne({ task });
    if (!correctAnswerDoc) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check if answer is correct
    const isCorrect = answer.toLowerCase().trim() === correctAnswerDoc.correctAnswer.toLowerCase().trim();

    if (!isCorrect) {
      return res.status(400).json({ success: false, message: 'Incorrect answer' });
    }

    // Find or create user
    let user = await User.findOne({ username });
    if (!user) {
      user = new User({ username, completedTasks: {} });
    }

    // Prevent duplicate task submission
    if (user.completedTasks?.get(task)) {
      return res.status(400).json({ success: false, message: 'Task already completed' });
    }

    // Update user's completed tasks
    if (!user.completedTasks) user.completedTasks = new Map();
    user.completedTasks.set(task, { 
      timestamp: new Date(), 
      answer 
    });
    user.totalCorrectAnswers = user.completedTasks.size;

    await user.save();

    // Get leaderboard
    const leaderboard = await User.find()
      .sort({ totalCorrectAnswers: -1, 'completedTasks.timestamp': 1 })
      .limit(10);

    res.json({
      success: true, 
      message: 'Answer submitted successfully',
      timestamp: new Date(),
      leaderboard: leaderboard.map(u => ({
        username: u.username,
        correctCount: u.totalCorrectAnswers,
        lastCorrectTimestamp: Array.from(u.completedTasks.values()).pop()?.timestamp
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await User.find()
      .sort({ totalCorrectAnswers: -1, 'completedTasks.timestamp': 1 })
      .limit(10);

    res.json({
      leaderboard: leaderboard.map(u => ({
        username: u.username,
        correctCount: u.totalCorrectAnswers,
        lastCorrectTimestamp: Array.from(u.completedTasks.values()).pop()?.timestamp
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;