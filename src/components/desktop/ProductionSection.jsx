import { Camera } from 'lucide-react'

const secondaryActions = [
  { key: 'create-website', label: 'Create Website' },
  { key: 'manage-website', label: 'Manage Website' },
  { key: 'training', label: 'Training' },
  { key: 'manage-economy', label: 'Manage Economy' },
  { key: 'see-statistics', label: 'See Statistics' },
  { key: 'organize-party', label: 'Organize Party' },
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
      <h2><Camera size={16} /> Action</h2>
      <button className="pc-add-btn" onClick={onOpenProductionModal}>Start Project</button>
      <p className="pc-muted">Run your studio operations from one place.</p>
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
      <div className="pc-action-grid">
        {secondaryActions.map((action) => (
          <button
            key={action.key}
            type="button"
            className="pc-action-btn"
            disabled={
              (action.key === 'create-website' && isCreateWebsiteDisabled) ||
              (action.key === 'manage-website' && isManageWebsiteDisabled)
            }
            onClick={() => onSelectAction(action.key, action.label)}
          >
            {action.label}
            {actionCostLabels?.[action.key] ? ` (${actionCostLabels[action.key]})` : ''}
          </button>
        ))}
      </div>
    </article>
  )
}

export default ProductionSection
