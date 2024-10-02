import { Request, Response } from 'express';
import { TaskService } from '../services/TaskService';
import { IPerson, ISkill, ITask } from '../models/Task';

const taskService = new TaskService();

export class TaskController {
  async createTask(req: Request, res: Response) {
    try {
      const userId = (req as any).userId; 
      const task = await taskService.createTask(req.body, userId);
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ message: 'Error creating task', error });
    }
  }

  async getTasks(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const tasks = await taskService.getTasks(userId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tasks', error });
    }
  }
  

  async updateTask(req: Request, res: Response) {
    const { taskId } = req.params;
    const taskData: Partial<ITask> = req.body; 
  
    try {
      const updatedTask = await taskService.updateTask(taskId, taskData);
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.status(200).json(updatedTask); 
    } catch (error) {
      res.status(500).json({ message: 'Error updating task', error });
    }
  }

  async deleteTask(req: Request, res: Response) {
    const { taskId } = req.params;
  
    try {
      const deletedTask = await taskService.deleteTask(taskId);
      if (!deletedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.status(200).json({ message: 'Task deleted successfully', task: deletedTask });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting task', error });
    }
  }
  
  async getTaskById(req: Request, res: Response) {
    const { taskId } = req.params;
  
    try {
      const task = await taskService.getTaskById(taskId);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching task', error });
    }
  }
  
  

  async addPerson(req: Request, res: Response) {
    const { taskId } = req.params; 
    const { fullName, age, skills } = req.body; 

    if (!skills || skills.length === 0) {
        return res.status(400).json({ message: 'At least one skill is required' });
    }

    try {
        const updatedTask = await taskService.addPersonToTask(taskId, { fullName, age, skills });
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(404).json({ message: error }); 
    }
}


async removePerson(req: Request, res: Response) {
  const { taskId, personId } = req.params; 

  try {
    const updatedTask = await taskService.removePersonFromTask(taskId, personId);
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found or person not removed' });
    }
    res.status(200).json(updatedTask); 
  } catch (error) {
    res.status(500).json({ message: error }); 
  }
}

async updatePersonStatus(req: Request, res: Response) {
  const { taskId, personId } = req.params; 
  const { status } = req.body; 

  try {
    const updatedTask = await taskService.updatePersonStatus(taskId, personId, status);
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found or person not updated' });
    }
    res.status(200).json(updatedTask); 
  } catch (error) {
    res.status(500).json({ message: 'Error updating person status', error });
  }
}

async addSkill(req: Request, res: Response) {
  const { taskId, personId } = req.params;
  const skill: ISkill = req.body;

  try {
    const updatedTask = await taskService.addSkillToPerson(taskId, personId, skill);
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task or person not found' });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error adding skill', error });
  }
}

async updateSkill(req: Request, res: Response) {
  const { taskId, personId } = req.params;
  const skill: ISkill = req.body;

  try {
    const updatedTask = await taskService.updateSkillInPerson(taskId, personId, skill);
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task or person not found' });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error updating skill', error });
  }
}

}