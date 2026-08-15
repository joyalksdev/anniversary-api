import AnswerSet from '../models/AnswerSet.js'

export async function getAnswers(req, res) {
  const doc = await AnswerSet.findOne({ slug: 'aleena-answers' })
  if (!doc || doc.answers.length === 0) {
    return res.json({ submitted: false, answers: [], submittedAt: null })
  }
  return res.json({ submitted: true, answers: doc.answers, submittedAt: doc.submittedAt })
}

export async function submitAnswers(req, res) {
  const { answers } = req.body

  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: 'Answers must be a non-empty list.' })
  }

  for (const a of answers) {
    if (!a?.questionId || !a?.question || !a?.choice) {
      return res.status(400).json({ error: 'Each answer needs questionId, question, and choice.' })
    }
  }

  // Upsert so resubmitting (e.g. she wants to redo it) overwrites cleanly
  // rather than creating duplicate documents.
  const doc = await AnswerSet.findOneAndUpdate(
    { slug: 'aleena-answers' },
    { answers, submittedAt: new Date() },
    { upsert: true, new: true }
  )

  return res.status(201).json({ submitted: true, answers: doc.answers, submittedAt: doc.submittedAt })
}
