import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authenticateToken } from "./middleware/auth";
import { 
  insertTaskSchema, 
  updateTaskSchema,
  registerUserSchema,
  loginUserSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post('/api/register', async (req, res) => {
    try {
      const userData = registerUserSchema.parse(req.body);
      const result = await storage.registerUser(userData);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      console.error("Error registering user:", error);
      const message = error instanceof Error ? error.message : "Failed to register user";
      res.status(400).json({ message });
    }
  });

  app.post('/api/login', async (req, res) => {
    try {
      const credentials = loginUserSchema.parse(req.body);
      const result = await storage.loginUser(credentials);
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid credentials", errors: error.errors });
      }
      console.error("Error logging in user:", error);
      const message = error instanceof Error ? error.message : "Failed to login";
      res.status(401).json({ message });
    }
  });

  app.get('/api/user', authenticateToken, async (req: any, res) => {
    try {
      res.json(req.user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Task routes
  app.get("/api/tasks", authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.id || req.user._id;
      const tasks = await storage.getTasks(userId);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.get("/api/tasks/:id", authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.id || req.user._id;
      const taskId = req.params.id;

      const task = await storage.getTask(taskId, userId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.json(task);
    } catch (error) {
      console.error("Error fetching task:", error);
      res.status(500).json({ message: "Failed to fetch task" });
    }
  });

  app.post("/api/tasks", authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.id || req.user._id;
      const smartAssign = req.body.smartAssign || false;
      
      // Prepare task data for validation
      const taskDataForValidation = {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status || "todo",
        // Only include userId if not using smart assign
        ...(smartAssign ? {} : { userId: userId })
      };
      
      const taskData = insertTaskSchema.parse(taskDataForValidation);

      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      console.error("Error creating task:", error);
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.patch("/api/tasks/:id", authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.id || req.user._id;
      const taskId = req.params.id;

      const updates = updateTaskSchema.parse(req.body);
      const lastEditedTimestamp = req.headers['x-last-edited'];
      
      const task = await storage.updateTask(taskId, userId, updates, lastEditedTimestamp);
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.json(task);
    } catch (error) {
      if (error.type === 'CONFLICT') {
        return res.status(409).json({
          message: "Conflict detected",
          type: "CONFLICT",
          serverVersion: error.serverVersion,
          clientVersion: error.clientVersion
        });
      }
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      console.error("Error updating task:", error);
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.id || req.user._id;
      const taskId = req.params.id;

      const deleted = await storage.deleteTask(taskId, userId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
