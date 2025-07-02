
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Task } from "@shared/schema";

interface ConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverVersion: Task;
  clientVersion: Partial<Task>;
  onResolve: (resolvedTask: Partial<Task>) => void;
}

export default function ConflictModal({
  isOpen,
  onClose,
  serverVersion,
  clientVersion,
  onResolve,
}: ConflictModalProps) {
  const [selectedVersion, setSelectedVersion] = useState<'server' | 'client' | 'merge'>('merge');
  const [mergedTask, setMergedTask] = useState<Partial<Task>>({
    title: clientVersion.title || serverVersion.title,
    description: clientVersion.description || serverVersion.description,
    status: clientVersion.status || serverVersion.status,
  });

  const handleResolve = () => {
    let finalTask: Partial<Task>;
    
    switch (selectedVersion) {
      case 'server':
        finalTask = {
          title: serverVersion.title,
          description: serverVersion.description,
          status: serverVersion.status,
        };
        break;
      case 'client':
        finalTask = clientVersion;
        break;
      case 'merge':
        finalTask = mergedTask;
        break;
    }
    
    onResolve(finalTask);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">Conflict Detected</DialogTitle>
          <p className="text-secondary">
            This task was modified by another user. Please choose how to resolve the conflict:
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Server Version */}
          <Card className={`cursor-pointer transition-colors ${
            selectedVersion === 'server' ? 'border-primary bg-blue-50' : ''
          }`} onClick={() => setSelectedVersion('server')}>
            <CardHeader>
              <CardTitle className="text-sm text-foreground">Server Version (Latest)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <label className="text-xs font-medium text-secondary">Title:</label>
                <p className="text-foreground">{serverVersion.title}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-secondary">Description:</label>
                <p className="text-foreground">{serverVersion.description || 'No description'}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-secondary">Status:</label>
                <p className="text-foreground capitalize">{serverVersion.status}</p>
              </div>
            </CardContent>
          </Card>

          {/* Client Version */}
          <Card className={`cursor-pointer transition-colors ${
            selectedVersion === 'client' ? 'border-primary bg-blue-50' : ''
          }`} onClick={() => setSelectedVersion('client')}>
            <CardHeader>
              <CardTitle className="text-sm text-foreground">Your Version</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <label className="text-xs font-medium text-secondary">Title:</label>
                <p className="text-foreground">{clientVersion.title}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-secondary">Description:</label>
                <p className="text-foreground">{clientVersion.description || 'No description'}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-secondary">Status:</label>
                <p className="text-foreground capitalize">{clientVersion.status}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Merge Option */}
        <Card className={`cursor-pointer transition-colors ${
          selectedVersion === 'merge' ? 'border-primary bg-blue-50' : ''
        }`} onClick={() => setSelectedVersion('merge')}>
          <CardHeader>
            <CardTitle className="text-sm text-foreground">Merge Changes (Recommended)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs font-medium text-secondary">Title:</label>
              <input
                type="text"
                value={mergedTask.title || ''}
                onChange={(e) => setMergedTask(prev => ({ ...prev, title: e.target.value }))}
                className="w-full mt-1 px-3 py-2 border border-input rounded-md text-foreground bg-background"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-secondary">Description:</label>
              <textarea
                value={mergedTask.description || ''}
                onChange={(e) => setMergedTask(prev => ({ ...prev, description: e.target.value }))}
                className="w-full mt-1 px-3 py-2 border border-input rounded-md text-foreground bg-background"
                rows={3}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-secondary">Status:</label>
              <select
                value={mergedTask.status || 'todo'}
                onChange={(e) => setMergedTask(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full mt-1 px-3 py-2 border border-input rounded-md text-foreground bg-background"
              >
                <option value="todo">Todo</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="text-foreground">
            Cancel
          </Button>
          <Button onClick={handleResolve} className="bg-primary text-white">
            Resolve Conflict
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
