import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User as UserModel } from './models/User';
import { Task as TaskModel } from './models/Task';
import {
  type User,
  type UpsertUser,
  type Task,
  type InsertTask,
  type UpdateTask,
  type RegisterUser,
  type LoginUser,
} from "@shared/schema";
import { Types } from 'mongoose';

// Interface for storage operations
export interface IStorage {
  // User operations
  registerUser(userData: RegisterUser): Promise<{ user: User; token: string }>;
  loginUser(credentials: LoginUser): Promise<{ user: User; token: string }>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;

  // Task operations
  getTasks(userId: string): Promise<Task[]>;
  getTask(id: string, userId: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, userId: string, updates: UpdateTask, lastEditedTimestamp?: string): Promise<Task | undefined>;
  deleteTask(id: string, userId: string): Promise<boolean>;
}

export class MongoStorage implements IStorage {
  private generateToken(userId: string): string {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }
    return jwt.sign({ userId }, jwtSecret, { expiresIn: '7d' });
  }

  private formatUser(user: any): User {
    return {
      id: user._id.toString(),
      _id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private formatTask(task: any): Task {
    return {
      id: task._id.toString(),
      _id: task._id.toString(),
      title: task.title,
      description: task.description,
      status: task.status,
      userId: task.userId,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      completedAt: task.completedAt,
      lastEdited: task.lastEdited,
    };
  }

  // User operations
  async registerUser(userData: RegisterUser): Promise<{ user: User; token: string }> {
    const existingUser = await UserModel.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const newUser = new UserModel({
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
    });

    const savedUser = await newUser.save();
    const token = this.generateToken(savedUser._id.toString());

    return {
      user: this.formatUser(savedUser),
      token
    };
  }

  async loginUser(credentials: LoginUser): Promise<{ user: User; token: string }> {
    const user = await UserModel.findOne({ email: credentials.email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken(user._id.toString());

    return {
      user: this.formatUser(user),
      token
    };
  }

  async getUserById(id: string): Promise<User | undefined> {
    const user = await UserModel.findById(id);
    return user ? this.formatUser(user) : undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ email });
    return user ? this.formatUser(user) : undefined;
  }

  // Task operations
  async getTasks(userId: string): Promise<Task[]> {
    const tasks = await TaskModel.find({ userId }).sort({ createdAt: -1 });
    return tasks.map(task => {
      const formattedTask = this.formatTask(task);
      return {
        id: formattedTask.id,
        _id: formattedTask._id,
        title: formattedTask.title,
        description: formattedTask.description,
        status: formattedTask.status,
        userId: formattedTask.userId,
        createdAt: formattedTask.createdAt,
        updatedAt: formattedTask.updatedAt,
        completedAt: formattedTask.completedAt,
        lastEdited: formattedTask.lastEdited
      };
    });
  }

  async getTask(id: string, userId: string): Promise<Task | undefined> {
    const task = await TaskModel.findOne({ _id: id, userId });
    if (!task) {
      return undefined;
    }

    const formattedTask = this.formatTask(task);
    return {
      id: formattedTask.id,
      _id: formattedTask._id,
      title: formattedTask.title,
      description: formattedTask.description,
      status: formattedTask.status,
      userId: formattedTask.userId,
      createdAt: formattedTask.createdAt,
      updatedAt: formattedTask.updatedAt,
      completedAt: formattedTask.completedAt,
      lastEdited: formattedTask.lastEdited
    };
  }

  async createTask(taskData: InsertTask): Promise<Task> {
    try {
      // Smart Assign: Find user with fewest active tasks
      let assignedUserId = taskData.userId;

      if (!taskData.userId) {
        const users = await UserModel.find({});
        let minTaskCount = Infinity;

        for (const user of users) {
          const activeTaskCount = await TaskModel.countDocuments({
            userId: user._id.toString(),
            status: { $in: ['todo', 'inprogress'] }
          });

          if (activeTaskCount < minTaskCount) {
            minTaskCount = activeTaskCount;
            assignedUserId = user._id.toString();
          }
        }
      }

      const task = new TaskModel({
        ...taskData,
        userId: assignedUserId,
        _id: new Types.ObjectId().toString(),
        lastEdited: new Date(),
      });

      await task.save();

      return {
        id: task._id.toString(),
        _id: task._id.toString(),
        title: task.title,
        description: task.description,
        status: task.status,
        userId: task.userId,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        completedAt: task.completedAt,
        lastEdited: task.lastEdited,
      };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async updateTask(id: string, userId: string, updates: UpdateTask, lastEditedTimestamp?: string): Promise<Task | undefined> {
    try {
      const task = await TaskModel.findOne({
        _id: id,
        userId: userId
      });

      if (!task) {
        return undefined;
      }

      // Conflict detection
      if (lastEditedTimestamp) {
        const clientLastEdited = new Date(lastEditedTimestamp);
        const serverLastEdited = task.lastEdited;

        if (serverLastEdited > clientLastEdited) {
          // Conflict detected - return both versions
          throw {
            type: 'CONFLICT',
            serverVersion: {
              id: task._id.toString(),
              _id: task._id.toString(),
              title: task.title,
              description: task.description,
              status: task.status,
              userId: task.userId,
              createdAt: task.createdAt,
              updatedAt: task.updatedAt,
              completedAt: task.completedAt,
              lastEdited: task.lastEdited
            },
            clientVersion: updates
          };
        }
      }

      const updateData: any = { ...updates };

      // Update completedAt when status changes to 'done'
      if (updates.status === 'done' && task.status !== 'done') {
        updateData.completedAt = new Date();
      } else if (updates.status !== 'done') {
        updateData.completedAt = null;
      }

      updateData.lastEdited = new Date();

      const updatedTask = await TaskModel.findOneAndUpdate(
        { _id: id, userId },
        updateData,
        { new: true }
      );

      if (!updatedTask) {
        return undefined;
      }

      const formattedTask = this.formatTask(updatedTask);
      return {
        id: formattedTask.id,
        _id: formattedTask._id,
        title: formattedTask.title,
        description: formattedTask.description,
        status: formattedTask.status,
        userId: formattedTask.userId,
        createdAt: formattedTask.createdAt,
        updatedAt: formattedTask.updatedAt,
        completedAt: formattedTask.completedAt,
        lastEdited: formattedTask.lastEdited
      };

    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async deleteTask(id: string, userId: string): Promise<boolean> {
    const result = await TaskModel.deleteOne({ _id: id, userId });
    return result.deletedCount > 0;
  }
}

export const storage = new MongoStorage();