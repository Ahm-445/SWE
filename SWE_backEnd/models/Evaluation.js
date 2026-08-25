import mongoose from "mongoose";

const TargetSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ["doctor", "subject"], required: true },
  department: { type: String, default: "هندسة البرمجيات" },
  viewsCount: { type: Number, default: 0 },
});


const ReviewSchema = new mongoose.Schema({
  targetId: { type: mongoose.Schema.Types.ObjectId, ref: "Target", required: true },
  

  ratings: {
    explanation: { type: Number, required: true, min: 1, max: 5 }, // الشرح
    dealing: { type: Number, required: true, min: 1, max: 5 },     // التعامل
    grading: { type: Number, required: true, min: 1, max: 5 },     // الدرجات
    attendance: { type: Number, required: true, min: 1, max: 5 },  // التحضير
  },


  tags: [{ type: String }],


  comment: { type: String, trim: true, maxlength: 500 },
  subjectName: { type: String, trim: true },
  grade: { type: String },

  createdAt: { type: Date, default: Date.now },
});

export const Target = mongoose.model("Target", TargetSchema);
export const Review = mongoose.model("Review", ReviewSchema);