import { z } from "zod";

// User types for MongoDB compatibility
export interface User {
  _id?: string;
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RegisterUser {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

// Task types for MongoDB compatibility
export interface Task {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  status: 'todo' | 'inprogress' | 'done';
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
  completedAt?: Date;
}

// Zod schemas for validation
export const registerUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const loginUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const insertTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters"),
  description: z.string().optional(),
  status: z.enum(["todo", "inprogress", "done"]).default("todo"),
  userId: z.string(),
});

export const updateTaskSchema = insertTaskSchema.partial().omit({ userId: true });

export type UpsertUser = RegisterUser;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type UpdateTask = z.infer<typeof updateTaskSchema>;
