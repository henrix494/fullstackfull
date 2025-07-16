import mongoose, { Schema } from "mongoose";
interface IUser {
  username: string;
  email: string;
  password: string;
  createdAt?: Date;
  listOfGifts?:
    | {
        _id?: string;
        giftName: string;
        giftLink: string;
        giftPrice: number;
        giftDescription: string;
      }[]
    | undefined;
  ListOfUsers?: mongoose.Types.ObjectId[] | undefined;
}
const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  listOfGifts: [
    {
      giftName: { type: String },
      giftLink: { type: String },
      giftPrice: { type: Number },
      giftDescription: { type: String },
    },
  ],
  ListOfUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
});
export default mongoose.model<IUser>("User", userSchema);
