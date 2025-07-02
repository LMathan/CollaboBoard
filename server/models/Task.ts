import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'inprogress' | 'done';
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  lastEdited: Date;
}

const taskSchema = new Schema<ITask>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255,
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['todo', 'inprogress', 'done'],
    default: 'todo',
  },
  userId: {
    type: String,
    required: true,
    ref: 'User',
  },
  completedAt: {
    type: Date,
    default: null,
  },
  lastEdited: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

export const Task = mongoose.model<ITask>('Task', taskSchema);