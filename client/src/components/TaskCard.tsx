import { Button } from "@/components/ui/button";
import { Edit, Trash2, CheckCircle } from "lucide-react";
import type { Task } from "@shared/schema";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onStatusChange: (taskId: number, newStatus: string) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const formatDate = (date: string | Date | null) => {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Created just now';
    if (diffInHours < 24) return `Created ${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Created 1 day ago';
    return `Created ${diffInDays} days ago`;
  };

  const getNextStatus = () => {
    switch (task.status) {
      case 'todo': return 'inprogress';
      case 'inprogress': return 'done';
      default: return 'todo';
    }
  };

  const getActionText = () => {
    switch (task.status) {
      case 'todo': return 'Start Task';
      case 'inprogress': return 'Complete';
      default: return 'Reopen';
    }
  };

  const cardBgClass = task.status === 'done' ? 'bg-green-50 border-green-200' :
                     task.status === 'inprogress' ? 'bg-yellow-50 border-yellow-200' :
                     'bg-gray-50 border-gray-200';

  return (
    <div className={`task-card p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer ${cardBgClass}`}>
      <div className="flex items-start justify-between mb-2">
        <h4 className={`font-medium ${task.status === 'done' ? 'line-through text-secondary' : 'text-textPrimary'}`}>
          {task.title}
        </h4>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            className="h-6 w-6 p-0 text-secondary hover:text-primary"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.id)}
            className="h-6 w-6 p-0 text-secondary hover:text-red-500"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {task.description && (
        <p className={`text-secondary text-sm mb-3 ${task.status === 'done' ? 'line-through' : ''}`}>
          {task.description}
        </p>
      )}
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-secondary">
          {task.status === 'done' && task.completedAt 
            ? `Completed ${formatDate(task.completedAt)}`
            : formatDate(task.createdAt)
          }
        </span>
        
        {task.status === 'done' ? (
          <CheckCircle className="h-4 w-4 text-accent" />
        ) : (
          <Button
            size="sm"
            onClick={() => onStatusChange(task.id, getNextStatus())}
            className={`text-xs px-3 py-1 h-auto ${
              task.status === 'inprogress' 
                ? 'bg-accent hover:bg-green-600 text-white' 
                : 'bg-primary hover:bg-blue-700 text-white'
            }`}
          >
            {getActionText()}
          </Button>
        )}
      </div>
    </div>
  );
}
