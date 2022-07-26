import mongoose, { Model, Schema, Types} from "mongoose";

interface ITask {
  userId: Types.ObjectId,
  task: string,
  done: boolean
}

interface ITaskMethods {}

interface TaskModel extends Model<ITask, {}, ITaskMethods> {}

const taskSchema = new Schema<ITask, TaskModel, ITaskMethods> (
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    task: { type: String, required: true },
    done: { type: Boolean, required: true, default: false }
  },
  {
    versionKey: false
  }
)

export default mongoose.model<ITask, TaskModel>('Task', taskSchema);
