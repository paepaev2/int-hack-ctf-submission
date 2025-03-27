import Answer from '../models/Answer.js';

const CORRECT_ANSWERS = {
  'TASK A': 'answer1',
  'TASK B': 'answer2',
  'TASK C': 'answer3',
  'TASK D': 'answer4',
  'TASK E': 'answer5',
  'TASK F': 'answer6',
  'TASK G': 'answer7',
  'TASK H': 'answer8'
};

export const seedAnswers = async () => {
  await Answer.deleteMany({});
  for (const [task, correctAnswer] of Object.entries(CORRECT_ANSWERS)) {
    await Answer.create({ task, correctAnswer });
  }
};