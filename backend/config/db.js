import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect("mongodb+srv://moin:moin@moin.uyzzvet.mongodb.net/?retryWrites=true&w=majority&appName=moin")
    .then(() => console.log("MongoDB connected"))  

}