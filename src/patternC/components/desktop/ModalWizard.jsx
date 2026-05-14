import React, { useState, useCallback, useEffect } from 'react'
import ModalWizardSidebar from './ModalWizardSidebar'

/**
 * ModalWizard: Reusable multi-step modal wrapper with sidebar navigation and state persistence
 * 
 * Props:
 *   - open: boolean - Modal visibility
 *   - onClose: function - Close handler
 *   - steps: Array<{ id, title, description?, icon? }> - Step definitions
 *   - currentStep: string - Current step ID
 *   - onStepChange: function(stepId) - Step change handler
 *   - completedSteps: Set<string> - Set of completed step IDs
 *   - children: ReactNode - Step content (render based on currentStep internally or provide via render prop)
 *   - onFinish: function - Finalize handler (called on last step completion)
 *   - canProceed: boolean - Whether to allow next button (default: true)
 *   - isProcessing: boolean - Show loading state on finish button
 *   - blockReason: string - Reason why proceed is blocked (shows as tooltip/message)
 */
function ModalWizard({
  open,
  onClose,
  steps,
  currentStep,
  onStepChange,
  completedSteps = new Set(),
  children,
  onFinish,
  canProceed = true,
  isProcessing = false,
  blockReason = '',
  title = 'Multi-Step Workflow',
  subtitle = '',
  inline = false,
}) {
  const [stateCache, setStateCache] = useState({})

  if (!open) return null

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)
  const currentStepObj = steps[currentStepIndex]
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === steps.length - 1
  const isStepCompleted = completedSteps.has(currentStep)

  const handlePrevious = () => {
    if (!isFirstStep) {
      const prevStep = steps[currentStepIndex - 1]
      onStepChange(prevStep.id)
    }
  }

  const handleNext = () => {
    if (!canProceed) return
    if (isLastStep && onFinish) {
      onFinish()
    } else {
      const nextStep = steps[currentStepIndex + 1]
      onStepChange(nextStep.id)
    }
  }

  const handleSidebarClick = (stepId) => {
    const stepIndex = steps.findIndex((s) => s.id === stepId)
    if (stepIndex !== -1) {
      onStepChange(stepId)
    }
  }

  const cacheState = useCallback((key, value) => {
    setStateCache((prev) => ({ ...prev, [key]: value }))
  }, [])

  const retrieveState = useCallback((key, defaultValue = null) => {
    return stateCache[key] ?? defaultValue
  }, [stateCache])

  const wizardContent = (
      <div className={`pb-modal pb-wizard-modal${inline ? ' pb-inline-wizard' : ''}`} onClick={(event) => event.stopPropagation()}>
        {/* Header */}
        <div className="pb-modal-head">
          <h3>{title}</h3>
          {subtitle && <p className="pc-muted">{subtitle}</p>}
        </div>

        {/* Main Layout: Sidebar + Content */}
        <div className="pb-wizard-container">
          {/* Sidebar */}
          <ModalWizardSidebar
            steps={steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={handleSidebarClick}
          />

          {/* Content Area */}
          <div className="pb-wizard-content">
            {/* Step Header */}
            <div className="pb-wizard-step-header">
              <div className="pb-wizard-step-meta">
                <span className="pb-wizard-step-number">
                  Step {currentStepIndex + 1} of {steps.length}
                </span>
                <h4 className="pb-wizard-step-title">{currentStepObj?.title}</h4>
              </div>
              {currentStepObj?.description && (
                <p className="pb-wizard-step-description">{currentStepObj.description}</p>
              )}
            </div>

            {/* Progress Bar */}
            <div className="pb-wizard-progress-bar">
              <div
                className="pb-wizard-progress-fill"
                style={{
                  width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
                }}
              />
            </div>

            {/* Step Content */}
            <div className="pb-wizard-step-content">
              {typeof children === 'function'
                ? children({
                    currentStep,
                    stepIndex: currentStepIndex,
                    cacheState,
                    retrieveState,
                  })
                : children}
            </div>

            {/* Action Buttons */}
            <div className="pb-wizard-actions">
              <button
                type="button"
                className="pb-wizard-btn pb-wizard-btn-prev"
                onClick={handlePrevious}
                disabled={isFirstStep}
              >
                ← Back
              </button>

              <div className="pb-wizard-spacer" />

              {!canProceed && blockReason && (
                <p className="pb-wizard-block-reason">{blockReason}</p>
              )}

              <button
                type="button"
                className={`pb-wizard-btn pb-wizard-btn-next${isProcessing ? ' is-loading' : ''}`}
                onClick={handleNext}
                disabled={!canProceed || isProcessing}
              >
                {isLastStep ? (isProcessing ? 'Processing...' : 'Finish') : 'Next →'}
              </button>
            </div>
          </div>
        </div>

        {/* Close Button */}
        {!inline && (
          <button
            type="button"
            className="pb-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        )}
      </div>
  )

  if (inline) {
    return <div className="pb-inline-wizard-host">{wizardContent}</div>
  }

  return (
    <div className="pb-modal-overlay" onClick={(event) => event.stopPropagation()}>
      {wizardContent}
    </div>
  )
}

export default ModalWizard
