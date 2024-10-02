import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill {
  name: string;
}

export interface IPerson {
  personId: mongoose.Types.ObjectId; 
  fullName: string;
  age: number;
  skills: ISkill[];
  completed: boolean; 
}


export interface ITask extends Document {
  name: string;
  dueDate: Date;
  completed: boolean;
  persons: IPerson[];
  userId: mongoose.Types.ObjectId;
}

const TaskSchema: Schema = new Schema({
  name: { type: String, required: true },
  dueDate: { type: Date, required: true },
  completed: { type: Boolean, default: false },
  persons: [{
    personId: { type: Schema.Types.ObjectId, ref: 'Person', required: true }, 
    fullName: { type: String, required: true },
    age: { type: Number, required: true, min: 18 },
    skills: { 
      type: [{ name: { type: String, required: true } }], 
      required: true, 
      validate: [(val: ISkill[]) => val.length > 0, 'At least one skill is required']
     },
    completed: { type: Boolean, default: false }
  }],
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

export default mongoose.model<ITask>('Task', TaskSchema);