import mongoose, { Schema, Model } from "mongoose";
import bcrypt from 'bcrypt';

interface IUser {
  name: string,
  username: string,
  password: string,
  refreshTokens?: string[]
}

interface IUserMethods {
  comparePassword(inputPassword: string): Promise<boolean>;
}

interface UserModel extends Model<IUser, {}, IUserMethods> {}

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    refreshTokens: [String]
  },
  {
    versionKey: false
  }
)

userSchema.pre(
  'save',
  async function (next) {
    if (!this.isModified('password')) return next();

    const hash = await bcrypt.hashSync(this.password, 10);

    this.password = hash;
    return next();
  }
)

userSchema.method(
  'comparePassword',
  async function (inputPassword: string): Promise<boolean> {
    const match = await bcrypt.compare(inputPassword, this.password);
    return match;
  }
)

export default mongoose.model<IUser, UserModel>('User', userSchema);
