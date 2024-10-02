import Task, { IPerson, ISkill, ITask } from '../models/Task';
import mongoose from 'mongoose';

export class TaskService {
  async createTask(taskData: Partial<ITask>, userId: string): Promise<ITask> {
    const task = new Task({ ...taskData, userId });
    return await task.save();
  }

  async getTasks(userId: string, completed?: boolean): Promise<ITask[]> {
    const query: any = { userId };
  
    if (completed !== undefined) {
      query.completed = completed;
    }
  
    return await Task.find(query);
  }
  

  async getTaskById(taskId: string): Promise<ITask | null> {
    return await Task.findById(taskId);
  }
  

  async updateTask(taskId: string, taskData: Partial<ITask>): Promise<ITask | null> {
    return await Task.findByIdAndUpdate(taskId, taskData, { new: true });
  }

  async deleteTask(taskId: string): Promise<ITask | null> {
    return await Task.findByIdAndDelete(taskId);
  }

  async removePersonFromTask(taskId: string, personId: string): Promise<ITask | null> {
    return await Task.findByIdAndUpdate(
      taskId,
      { $pull: { persons: { personId } } }, 
      { new: true }
    );
  }

  async updatePersonStatus(taskId: string, personId: string, status: boolean): Promise<ITask | null> {
    const task = await Task.findById(taskId);
    if (task) {
      const person = task.persons.find(p => p.personId.toString() === personId);
      if (person) {
        person.completed = status; 
        await task.save();
        return task;
      }
    }
    return null;
  }

  async addPersonToTask(taskId: string, personData: { fullName: string; age: number; skills: ISkill[] }): Promise<ITask | null> {
    const task = await Task.findById(taskId);
    if (!task) {
        throw new Error('Task not found'); 
    }

    const personId = new mongoose.Types.ObjectId();

    const person: IPerson = {
        personId, 
        fullName: personData.fullName,
        age: personData.age,
        skills: personData.skills,
        completed: false
    };

    task.persons.push(person);

    await task.save(); 
    return task;
}

async addSkillToPerson(taskId: string, personId: string, skill: ISkill): Promise<ITask | null> {
  if (!mongoose.Types.ObjectId.isValid(taskId) || !mongoose.Types.ObjectId.isValid(personId)) {
    throw new Error('Invalid taskId or personId');
  }

  const task = await Task.findById(taskId);
  if (!task) {
    throw new Error('Task not found');
  }

  const person = task.persons.find(p => p.personId.toString() === personId);
  if (!person) {
    throw new Error('Person not found in the task');
  }

  const skillExists = person.skills.some(s => s.name === skill.name);
  if (!skillExists) {
    person.skills.push(skill);
    await task.save();
    return task;
  } else {
    throw new Error('Skill already exists for this person');
  }
}


  async updateSkillInPerson(taskId: string, personId: string, skill: ISkill): Promise<ITask | null> {
    const task = await Task.findById(taskId);
    if (task) {
      const person = task.persons.find(p => p.personId.toString() === personId);
      if (person) {
        const existingSkill = person.skills.find(s => s.name === skill.name);
        if (existingSkill) {
          existingSkill.name = skill.name; 
          await task.save();
        }
        return task;
      }
    }
    return null;
  }
  
  
  
}