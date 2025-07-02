import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, BarChart3, ListTodo } from "lucide-react";
import type { Task } from "@shared/schema";

export default function TaskStats() {
  const { data: tasks } = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
  });

  const allTasks = tasks || [];
  const totalTasks = allTasks.length;
  const todoTasks = allTasks.filter(task => task.status === 'todo').length;
  const inProgressTasks = allTasks.filter(task => task.status === 'inprogress').length;
  const completedTasks = allTasks.filter(task => task.status === 'done').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: ListTodo,
      color: "bg-blue-100",
      iconColor: "text-primary",
    },
    {
      title: "In Progress",
      value: inProgressTasks,
      icon: Clock,
      color: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      title: "Completed",
      value: completedTasks,
      icon: CheckCircle,
      color: "bg-green-100",
      iconColor: "text-accent",
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      icon: BarChart3,
      color: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`${stat.iconColor} h-6 w-6`} />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary">{stat.title}</p>
                <p className="text-2xl font-bold text-textPrimary">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
