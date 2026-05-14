import { useEffect, useState } from 'react'
import ModalCloseButton from './ModalCloseButton'

function InterviewModal({ open, onClose, session, onSubmit, onSkip }) {
  const [answers, setAnswers] = useState({})
  const [questionIndex, setQuestionIndex] = useState(0)

  useEffect(() => {
    if (!open || !session?.questions) {
      setAnswers({})
      setQuestionIndex(0)
      return
    }

    setAnswers({})
    setQuestionIndex(0)
  }, [open, session])

  if (!open || !session?.questions?.length) return null

  const currentQuestion = session.questions[questionIndex]
  const isLastQuestion = questionIndex === session.questions.length - 1
  const currentAnswer = answers[currentQuestion.id]

  const handleOptionSelect = (questionId, optionId) => {
    setAnswers((current) => ({
      ...current,
      [questionId]: optionId,
    }))
  }

  const handleSubmit = () => {
    const payload = {
      day: session.day,
      answers: session.questions.map((question) => ({
        questionId: question.id,
        optionId: answers[question.id],
      })),
    }

    onSubmit(payload)
  }

  const handleNext = () => {
    if (!currentAnswer) return

    if (isLastQuestion) {
      handleSubmit()
      return
    }

    setQuestionIndex((current) => Math.min(current + 1, session.questions.length - 1))
  }

  const handleSkip = () => {
    onSkip({ day: session.day })
  }

  return (
    <div className="pc-modal-overlay" onClick={(event) => event.stopPropagation()}>
      <div className="pc-modal pc-interview-modal" onClick={(event) => event.stopPropagation()}>
        <ModalCloseButton onClose={onClose} />
        <div className="pb-modal-head">
          <h3>Press Briefing</h3>
          <p className="pc-muted">Your answers shape popularity and reputation momentum.</p>
        </div>

        <div className="pb-mini-stats">
          <span>Question {questionIndex + 1}/{session.questions.length}</span>
          <span>Answered {Object.keys(answers).length}</span>
        </div>

        {session.context?.image && (
          <img src={session.context.image} alt={session.context.label || 'Interview context'} className="pc-interview-context-image" />
        )}
        {session.context?.label && (
          <p className="pc-interview-context-label">{session.context.label}</p>
        )}

        <div className="pc-interview-questions pb-interview-shell">
          <section key={currentQuestion.id} className="pc-interview-question-card pb-market-card">
            <h4>Question {questionIndex + 1} of {session.questions.length}</h4>
            <p className="pc-interview-question-text">{currentQuestion.question}</p>
            <div className="pc-interview-options">
              {currentQuestion.options.map((option) => {
                const id = `${currentQuestion.id}-${option.id}`
                return (
                  <label key={id} htmlFor={id} className="pc-check-item">
                    <input
                      id={id}
                      type="radio"
                      name={currentQuestion.id}
                      checked={answers[currentQuestion.id] === option.id}
                      onChange={() => handleOptionSelect(currentQuestion.id, option.id)}
                    />
                    <span>{option.text}</span>
                  </label>
                )
              })}
            </div>
          </section>
        </div>

        <div className="pc-interview-footer">
          <button type="button" className="pc-interview-skip-btn" onClick={handleSkip}>
            Skip Briefing
          </button>
          <button type="button" onClick={handleNext} disabled={!currentAnswer}>
            {isLastQuestion ? 'Finish Briefing' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default InterviewModal
