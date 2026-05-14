import { Camera } from 'lucide-react'

const secondaryActions = [
  { key: 'create-website', label: 'Launch Website', group: 'Distribution' },
  { key: 'manage-website', label: 'Run Websites', group: 'Distribution' },
  { key: 'training', label: 'Training Ops', group: 'Development' },
  { key: 'manage-economy', label: 'Finance Console', group: 'Management' },
  { key: 'see-statistics', label: 'Trend Analytics', group: 'Management' },
  { key: 'organize-party', label: 'Team Event', group: 'Development' },
]

function ProductionSection({
  onOpenProductionModal,
  onSelectAction,
  isCreateWebsiteDisabled,
  isManageWebsiteDisabled,
  actionCostLabels,
  activeTheme,
  onThemeChange,
  themeOptions,
}) {
  return (
    <article className="pc-card">
      <div className="pb-production-head">
        <h2><Camera size={16} /> Mission Control</h2>
        <p className="pc-muted">Plan and launch every production cycle from one cockpit.</p>
      </div>

      <div className="pb-production-controls">
        <button className="pc-add-btn" onClick={onOpenProductionModal}>Open Production Pipeline</button>

        <div className="pc-theme-switch-row">
          <label className="pc-theme-switch-label" htmlFor="pc-theme-switch">Theme</label>
          <select
            id="pc-theme-switch"
            className="pc-theme-switch-select"
            value={activeTheme}
            onChange={(event) => onThemeChange?.(event.target.value)}
          >
            {themeOptions.map((theme) => (
              <option key={theme.key} value={theme.key}>{theme.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="pb-action-grid-b">
        {secondaryActions.map((action) => (
          <button
            key={action.key}
            type="button"
            className="pb-action-cell"
            disabled={
              (action.key === 'create-website' && isCreateWebsiteDisabled) ||
              (action.key === 'manage-website' && isManageWebsiteDisabled)
            }
            onClick={() => onSelectAction(action.key, action.label)}
          >
            <span>{action.group}</span>
            <strong>{action.label}</strong>
            <small>{actionCostLabels?.[action.key] ? `${actionCostLabels[action.key]}` : 'No AP'}</small>
          </button>
        ))}
      </div>
    </article>
  )
}

export default ProductionSection
