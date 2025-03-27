import Answer from '../models/Answer.js';

const CORRECT_ANSWERS = {
  'PROBLEM 1': 'SPAGHETTI',
  'PROBLEM 2': 'CONAN',
  'PROBLEM 3': 'Hello_web_developer',
  'PROBLEM 4': '08934821',
  'PROBLEM 5': 'HTTP_POST_the_flAg',
  'PROBLEM 6': 'i_XOR_y0u',
  'PROBLEM 7': 'ILOVEDOG',
  'PROBLEM 8': 'STEVE'
};

export const seedAnswers = async () => {
  await Answer.deleteMany({});
  for (const [task, correctAnswer] of Object.entries(CORRECT_ANSWERS)) {
    await Answer.create({ task, correctAnswer });
  }
};