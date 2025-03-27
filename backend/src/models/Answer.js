import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
  task: { type: String, required: true },
  correctAnswer: { type: String, required: true }
});

export default mongoose.model('Answer', AnswerSchema);