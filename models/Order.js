import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  name: String,
  email: String,
  vin: { type: String, default: "" },
  message: { type: String, default: "" },
  fileUrl: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
