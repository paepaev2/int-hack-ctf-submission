import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  completedTasks: { 
    type: Map, 
    of: {
      timestamp: { type: Date, default: Date.now },
      answer: String
    }
  },
  totalCorrectAnswers: { type: Number, default: 0 }
});

export default mongoose.model('User', UserSchema);