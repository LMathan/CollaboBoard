import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, BarChart3 } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/auth";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">CollaboBoard</h1>
            </div>
            <Button onClick={handleLogin} className="bg-primary hover:bg-blue-700">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-textPrimary mb-4">
            Professional Task Management
          </h1>
          <p className="text-xl text-secondary mb-8 max-w-2xl mx-auto">
            Organize your work with our intuitive kanban board. Track tasks, collaborate with your team, and boost productivity.
          </p>
          <Button onClick={handleLogin} size="lg" className="bg-primary hover:bg-blue-700 text-lg px-8 py-3">
            Get Started
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-textPrimary mb-2">Task Management</h3>
              <p className="text-secondary">
                Create, edit, and organize tasks with ease. Keep track of your progress with our intuitive interface.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-textPrimary mb-2">Status Tracking</h3>
              <p className="text-secondary">
                Monitor task progress through Todo, In Progress, and Done columns. Stay on top of your workflow.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-textPrimary mb-2">Analytics</h3>
              <p className="text-secondary">
                Get insights into your productivity with task statistics and completion rates.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-textPrimary mb-4">
                Ready to boost your productivity?
              </h2>
              <p className="text-secondary mb-6">
                Join thousands of professionals who trust CollaboBoard for their task management needs.
              </p>
              <Button onClick={handleLogin} size="lg" className="bg-accent hover:bg-green-600">
                Start Managing Tasks
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
