import express from 'express';
import User from '../models/User.js';
import Answer from '../models/Answer.js';

const router = express.Router();

const SCORE_MAP = {
    'PROBLEM 1': 100, 'PROBLEM 2': 100, 'PROBLEM 3': 100,
    'PROBLEM 4': 150, 'PROBLEM 5': 150, 'PROBLEM 6': 150,
    'PROBLEM 7': 200, 'PROBLEM 8': 200
  };  

router.post('/submit-answer', async (req, res) => {
  try {
    const { username, task, answer } = req.body;

    // Find the correct answer
    const correctAnswerDoc = await Answer.findOne({ task });
    if (!correctAnswerDoc) {
      return res.status(404).json({ success: false, message: 'PROBLEM not found' });
    }

    // Check if answer is correct
    const isCorrect = answer.trim() === correctAnswerDoc.correctAnswer.trim();

    if (!isCorrect) {
      return res.status(400).json({ success: false, message: 'Incorrect FLAG' });
    }

    // Find or create user
    let user = await User.findOne({ username });
    if (!user) {
      user = new User({ username, completedTasks: {} });
    }

    // Prevent duplicate task submission
    if (user.completedTasks?.get(task)) {
        return res.status(400).json({ success: false, message: 'PROBLEM already completed' });
    }
  
    // Update user's completed tasks
    if (!user.completedTasks) user.completedTasks = new Map();
    user.completedTasks.set(task, { 
        timestamp: new Date()
    });
  
    // Update user’s total score
    user.totalScore += SCORE_MAP[task] || 0;
  
    await user.save();

    // Get leaderboard
    const leaderboard = await User.find();

    // Compute the most recent timestamp for each user
    const leaderboardData = leaderboard.map(u => {
      const lastCorrectTimestamp = Array.from(u.completedTasks.values())
        .sort((a, b) => b.timestamp - a.timestamp)[0]?.timestamp;

      return {
        username: u.username,
        score: u.totalScore,
        lastCorrectTimestamp,
      };
    });

    // Sort leaderboard by correct answers and then by the most recent timestamp (earlier timestamp ranks higher)
    leaderboardData.sort((a, b) => {
        if (b.score === a.score) {
            return new Date(a.lastCorrectTimestamp) - new Date(b.lastCorrectTimestamp); // Earlier timestamp first
        }
        return b.score - a.score; // Higher score first
    });

    res.json({
      success: true, 
      message: 'FLAG submitted successfully',
      timestamp: new Date(),
      leaderboard: leaderboardData,
    //   leaderboard: leaderboard.map(u => ({
    //     username: u.username,
    //     score: u.totalScore,
    //     lastCorrectTimestamp: Array.from(u.completedTasks.values()).pop()?.timestamp
    //   }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/leaderboard', async (req, res) => {
    try {
        const leaderboard = await User.find();
  
        // Compute the most recent timestamp for each user
        const leaderboardData = leaderboard.map(u => {
            const lastCorrectTimestamp = Array.from(u.completedTasks.values())
            .sort((a, b) => b.timestamp - a.timestamp)[0]?.timestamp;
    
            return {
            username: u.username,
            score: u.totalScore,
            lastCorrectTimestamp,
            };
        });
    
        // Sort leaderboard by correct answers and then by the most recent timestamp (earlier timestamp ranks higher)
        leaderboardData.sort((a, b) => {
            if (b.score === a.score) {
                return new Date(a.lastCorrectTimestamp) - new Date(b.lastCorrectTimestamp); // Earlier timestamp first
            }
            return b.score - a.score; // Higher score first
        });
    
        res.json({
            leaderboard: leaderboardData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});  

router.get('/check-username', async (req, res) => {
    const { username } = req.query;
  
    try {
      const user = await User.findOne({ username });
  
      if (user) {
        return res.json({
          exists: true,
          completedTasks: user.completedTasks || {} // Send completed tasks
        });
      }
  
      return res.json({ exists: false, completedTasks: {} });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;