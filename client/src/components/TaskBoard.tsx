import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import { Plus } from "lucide-react";
import type { Task } from "@shared/schema";

type TaskFilter = 'all' | 'active' | 'completed';

export default function TaskBoard() {
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { toast } = useToast();

  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: number) => {
      await apiRequest('DELETE', `/api/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Task> }) => {
      const response = await apiRequest('PATCH', `/api/tasks/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-10 w-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-lg p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-20"></div>
              <div className="space-y-3">
                {[1, 2].map(j => (
                  <div key={j} className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const allTasks = tasks || [];
  const todoTasks = allTasks.filter(task => task.status === 'todo');
  const inProgressTasks = allTasks.filter(task => task.status === 'inprogress');
  const doneTasks = allTasks.filter(task => task.status === 'done');
  const activeTasks = [...todoTasks, ...inProgressTasks];
  
  const filteredTasks = filter === 'all' ? allTasks : 
                      filter === 'active' ? activeTasks : doneTasks;

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTaskMutation.mutate(taskId);
    }
  };

  const handleStatusChange = (taskId: number, newStatus: string) => {
    updateTaskMutation.mutate({
      id: taskId,
      updates: { status: newStatus }
    });
  };

  const openModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Task Filters */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex space-x-4">
            <Button
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-primary text-white' : 'bg-gray-200 text-textPrimary hover:bg-gray-300'}
            >
              All Tasks <span className="ml-2 bg-blue-600 px-2 py-1 rounded-full text-xs">{allTasks.length}</span>
            </Button>
            <Button
              onClick={() => setFilter('active')}
              className={filter === 'active' ? 'bg-primary text-white' : 'bg-gray-200 text-textPrimary hover:bg-gray-300'}
            >
              Active <span className="ml-2 bg-gray-400 px-2 py-1 rounded-full text-xs text-white">{activeTasks.length}</span>
            </Button>
            <Button
              onClick={() => setFilter('completed')}
              className={filter === 'completed' ? 'bg-primary text-white' : 'bg-gray-200 text-textPrimary hover:bg-gray-300'}
            >
              Completed <span className="ml-2 bg-gray-400 px-2 py-1 rounded-full text-xs text-white">{doneTasks.length}</span>
            </Button>
          </div>
          <Button 
            onClick={openModal}
            className="bg-accent text-white hover:bg-green-600 flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Task Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Todo Column */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-textPrimary flex items-center">
              <div className="w-3 h-3 bg-gray-400 rounded-full mr-3"></div>
              Todo
            </h3>
            <span className="bg-gray-100 text-textSecondary px-2 py-1 rounded-full text-sm font-medium">
              {todoTasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {todoTasks.length === 0 ? (
              <p className="text-secondary text-sm text-center py-8">No tasks in this column</p>
            ) : (
              todoTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))
            )}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-textPrimary flex items-center">
              <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
              In Progress
            </h3>
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
              {inProgressTasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {inProgressTasks.length === 0 ? (
              <p className="text-secondary text-sm text-center py-8">No tasks in this column</p>
            ) : (
              inProgressTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))
            )}
          </div>
        </div>

        {/* Done Column */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-textPrimary flex items-center">
              <div className="w-3 h-3 bg-accent rounded-full mr-3"></div>
              Done
            </h3>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
              {doneTasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {doneTasks.length === 0 ? (
              <p className="text-secondary text-sm text-center py-8">No tasks in this column</p>
            ) : (
              doneTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={editingTask}
      />
    </>
  );
}
