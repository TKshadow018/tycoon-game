import React from 'react'

/**
 * ModalWizardSidebar: Navigation sidebar for multi-step wizard modals
 * Shows step indicators with completion status and current step highlighting
 */
function ModalWizardSidebar({ steps, currentStep, completedSteps, onStepClick }) {
  return (
    <nav className="pb-wizard-sidebar">
      <div className="pb-wizard-step-list">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep
          const isCompleted = completedSteps.has(step.id)
          const isAccessible = index <= steps.findIndex((s) => s.id === currentStep) + 1

          return (
            <button
              key={step.id}
              type="button"
              className={`pb-wizard-step-item${isActive ? ' is-active' : ''}${isCompleted ? ' is-completed' : ''}${!isAccessible ? ' is-locked' : ''}`}
              onClick={() => isAccessible && onStepClick(step.id)}
              disabled={!isAccessible}
              title={step.title}
            >
              {/* Step Indicator */}
              <div className="pb-wizard-step-indicator">
                {isCompleted ? (
                  <span className="pb-wizard-step-icon pb-wizard-checkmark">✓</span>
                ) : (
                  <span className="pb-wizard-step-number-sm">{index + 1}</span>
                )}
              </div>

              {/* Step Info */}
              <div className="pb-wizard-step-info">
                <p className="pb-wizard-step-name">{step.title}</p>
                {step.icon && <span className="pb-wizard-step-icon-visual">{step.icon}</span>}
              </div>

              {/* Connector Line (between steps) */}
              {index < steps.length - 1 && <div className="pb-wizard-step-connector" />}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default ModalWizardSidebar
