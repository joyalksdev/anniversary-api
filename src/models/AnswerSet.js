import mongoose from 'mongoose'

const answerItemSchema = new mongoose.Schema(
  {
    questionId: { type: String, required: true },
    question: { type: String, required: true },
    choice: { type: String, required: true },
  },
  { _id: false }
)

// There is only ever one answers document (Aleena submits once). We key it
// with a fixed `slug` so GET/POST can always target the same record without
// needing to know a Mongo _id up front.
const answerSetSchema = new mongoose.Schema(
  {
    slug: { type: String, default: 'aleena-answers', unique: true },
    answers: { type: [answerItemSchema], default: [] },
    submittedAt: { type: Date },
  },
  { timestamps: true }
)

export default mongoose.model('AnswerSet', answerSetSchema)
