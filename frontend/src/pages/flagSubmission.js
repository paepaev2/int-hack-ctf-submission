import React, { useState, useEffect } from 'react';
import '../index.css';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { submitAnswer, getLeaderboard, checkUsername } from '../services/apiService';
import { RefreshCw } from 'lucide-react';

const FlagSubmission = () => {
  const [username, setUsername] = useState('');
  const [usernameSubmitted, setUsernameSubmitted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [completedTasks, setCompletedTasks] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        setLeaderboard(data);
      } catch (error) {
        console.error('Failed to fetch leaderboard', error);
        setError('Failed to load leaderboard');
      }
    };

    fetchLeaderboard();
  }, []);

  const handleUsernameSubmit = async () => {
    if (username.trim()) {
      try {
        const response = await checkUsername(username);
        if (response.exists) {
          setCompletedTasks(response.completedTasks || {});
        }
        setUsernameSubmitted(true);
        setError('');
      } catch {
        setError('Error checking name');
      }
    } else {
      setError('Name cannot be empty');
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
        alert('Correct FLAG submitted!');
      }
    } catch (error) {
      alert(error.message || 'Failed to submit FLAG');
    }
  };

  const renderTaskInput = (task) => (
    <div 
      key={task} 
      className="
        mb-4 
        p-4 
        border 
        rounded-lg 
        bg-white 
        shadow-sm 
        hover:shadow-md 
        transition-shadow 
        duration-300
      "
    >
      <h2 className="text-xl mb-2 font-semibold text-gray-800">{task}</h2>
      <div className="flex items-center gap-2">
        <Input 
          placeholder={`Enter FLAG for ${task}`}
          value={answers[task] || ''}
          onChange={(e) => setAnswers(prev => ({ ...prev, [task]: e.target.value }))}
          onKeyDown={(e) => e.key === 'Enter' && handleAnswerSubmit(task)}
          disabled={!usernameSubmitted || completedTasks[task]}
          className="flex-grow"
        />
        <Button 
          onClick={() => handleAnswerSubmit(task)}
          disabled={!usernameSubmitted || completedTasks[task]}
          variant={completedTasks[task] ? 'secondary' : 'primary'}
        >
          {completedTasks[task] ? 'Completed' : 'Submit'}
        </Button>
      </div>
    </div>
  );

  const refreshLeaderboard = async () => {
    try {
      const updatedLeaderboard = await getLeaderboard();
      setLeaderboard(updatedLeaderboard);
    } catch (error) {
      alert('Failed to refresh leaderboard');
    }
  };

  const renderLeaderboard = () => (
    <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Leaderboard</h2>
        <button onClick={refreshLeaderboard} className='bg-gray-50 text-gray-600 opacity-50 px-4 py-2 rounded-md'>
            <RefreshCw size={20} />
        </button>
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-4 text-left">Rank</th>
            <th className="py-3 px-4 text-left">Team</th>
            <th className="py-3 px-4 text-center">Score</th>
            <th className="py-3 px-4 text-left">Time</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {leaderboard.map((entry, index) => (
            <tr 
              key={entry.username} 
              className="border-b border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <td className="py-3 px-4 text-left font-bold">{index + 1}</td>
              <td className="py-3 px-4">{entry.username}</td>
              <td className="py-3 px-4 text-center">
                <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full">
                  {entry.score}
                </span>
              </td>
              <td className="py-3 px-4">
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
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800">
            Capture the Flag Submission
          </h1>
          
          <div className="mb-6">
            <div className="flex space-x-2">
              <Input 
                placeholder="Enter your team number, e.g. 31"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUsernameSubmit()}
                disabled={usernameSubmitted}
                error={!!error}
              />
              <Button 
                onClick={handleUsernameSubmit}
                disabled={usernameSubmitted}
                variant={usernameSubmitted ? 'secondary' : 'primary'}
              >
                {usernameSubmitted ? 'Submitted' : 'Submit'}
              </Button>
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>

          {usernameSubmitted && (
            <>
              <div className="space-y-4">
                {['PROBLEM 1', 'PROBLEM 2', 'PROBLEM 3', 'PROBLEM 4', 'PROBLEM 5', 'PROBLEM 6', 'PROBLEM 7', 'PROBLEM 8'].map(renderTaskInput)}
              </div>
              
              {renderLeaderboard()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlagSubmission;