import React, { useState, useEffect } from 'react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { submitAnswer, getLeaderboard } from '../services/apiService';

const FlagSubmission = () => {
  const [username, setUsername] = useState('');
  const [usernameSubmitted, setUsernameSubmitted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [completedTasks, setCompletedTasks] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        setLeaderboard(data);
      } catch (error) {
        console.error('Failed to fetch leaderboard', error);
      }
    };

    fetchLeaderboard();
  }, []);

  const handleUsernameSubmit = () => {
    if (username.trim()) {
      setUsernameSubmitted(true);
    }
  };

  const handleAnswerSubmit = async (task) => {
    const answer = answers[task] || '';

    try {
      const response = await submitAnswer(username, task, answer);

      if (response.success) {
        setCompletedTasks(prev => ({
          ...prev,
          [task]: true
        }));

        setLeaderboard(response.leaderboard);
        alert('Correct answer submitted!');
      }
    } catch (error) {
      alert(error.message || 'Failed to submit answer');
    }
  };

  const renderTaskInput = (task) => (
    <div key={task} className="mb-4 p-4 border rounded">
      <h2 className="text-xl mb-2">{task}</h2>
      <div className="flex items-center gap-2">
        <Input 
          placeholder={`Enter answer for ${task}`}
          value={answers[task] || ''}
          onChange={(e) => setAnswers(prev => ({ ...prev, [task]: e.target.value }))}
          disabled={!usernameSubmitted || completedTasks[task]}
        />
        <Button 
          onClick={() => handleAnswerSubmit(task)}
          disabled={!usernameSubmitted || completedTasks[task]}
        >
          {completedTasks[task] ? 'Completed' : 'Submit'}
        </Button>
      </div>
    </div>
  );

  const renderLeaderboard = () => (
    <div className="mt-8">
      <h2 className="text-2xl mb-4">Leaderboard</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Rank</th>
            <th className="border p-2">Username</th>
            <th className="border p-2">Correct Answers</th>
            <th className="border p-2">Last Correct Answer</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={entry.username} className="hover:bg-gray-50">
              <td className="border p-2 text-center">{index + 1}</td>
              <td className="border p-2">{entry.username}</td>
              <td className="border p-2 text-center">{entry.correctCount}</td>
              <td className="border p-2">
                {entry.lastCorrectTimestamp 
                  ? new Date(entry.lastCorrectTimestamp).toLocaleString() 
                  : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-6">Flag Submission</h1>
      
      <div className="mb-4">
        <Input 
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={usernameSubmitted}
        />
        <Button 
          onClick={handleUsernameSubmit}
          disabled={usernameSubmitted}
          className="ml-2"
        >
          {usernameSubmitted ? 'Username Submitted' : 'Submit Username'}
        </Button>
      </div>

      {usernameSubmitted && (
        <>
          {['TASK A', 'TASK B', 'TASK C', 'TASK D', 'TASK E', 'TASK F', 'TASK G', 'TASK H'].map(renderTaskInput)}
          
          {renderLeaderboard()}
        </>
      )}
    </div>
  );
};

export default FlagSubmission;