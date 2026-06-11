import mongoose, { Schema, Document, Model, models } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  orders: number;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    orders: {
      type: Number,
      default: 0,
    },

    role: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> =
  models.User as Model<IUser> ||
  mongoose.model<IUser>("User", UserSchema);

export default User;