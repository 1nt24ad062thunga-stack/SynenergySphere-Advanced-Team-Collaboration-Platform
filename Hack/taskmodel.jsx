import React, { useState, useEffect } from "react";
import { Task } from "@/entities/Task";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Save, 
  Trash2, 
  Calendar,
  Flag,
  User,
  Tag,
  X
} from "lucide-react";

export default function TaskModal({ 
  task, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete,
  projectMembers = [],
  defaultStatus = 'todo'
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_to: '',
    status: defaultStatus,
    priority: 'medium',
    due_date: '',
    tags: []
  });
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        assigned_to: task.assigned_to || '',
        status: task.status || defaultStatus,
        priority: task.priority || 'medium',
        due_date: task.due_date || '',
        tags: task.tags || []
      });
    } else {
      setFormData({
        title: '',
        description: '',
        assigned_to: '',
        status: defaultStatus,
        priority: 'medium',
        due_date: '',
        tags: []
      });
    }
  }, [task, defaultStatus]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = async () => {
    if (!formData.title.trim()) return;
    
    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!task) return;
    
    setIsLoading(true);
    try {
      await onDelete(task.id);
