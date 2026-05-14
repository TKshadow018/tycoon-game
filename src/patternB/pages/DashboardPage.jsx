import { useTranslation } from 'react-i18next'
import ControlPanel from '../components/dashboard/ControlPanel'
import HudBar from '../components/dashboard/HudBar'
import ModuleNav from '../components/dashboard/ModuleNav'
import ModulePanel from '../components/dashboard/ModulePanel'
import LanguageSwitcher from '../components/common/LanguageSwitcher'
import { GAME_CONFIG } from '../config/gameConfig'
import { selectHeaderSnapshot } from '../../common/store/selectors'
import { useGameStore } from '../../common/store/useGameStore'
import styles from './DashboardPage.module.scss'

function DashboardPage() {
  const { t } = useTranslation()
  const headerSnapshot = useGameStore(selectHeaderSnapshot)
  const profile = useGameStore((state) => state.profile)
  const activeModule = useGameStore((state) => state.ui.activeModule)
  const setActiveModule = useGameStore((state) => state.setActiveModule)
  const proceedTimeline = useGameStore((state) => state.proceedTimeline)

  return (
    <main className={styles.dashboard}>
      <section className={styles.shell}>
        <header className={styles.topBar}>
          <div>
            <h1>{t('dashboard.welcome', { playerName: profile.playerName })}</h1>
            <p>{t('dashboard.company', { companyName: profile.companyName })}</p>
            <small>{t('dashboard.nextEvent', { days: GAME_CONFIG.eventCycleDays })}</small>
          </div>
          <LanguageSwitcher />
        </header>

        <HudBar snapshot={headerSnapshot} />

        <section className={styles.workspace}>
          <aside className={styles.sidebar}>
            <ControlPanel isEventDay={headerSnapshot.isEventDay} onProceed={proceedTimeline} />
            <ModuleNav activeModule={activeModule} onSelect={setActiveModule} />
          </aside>
          <ModulePanel moduleId={activeModule} />
        </section>
      </section>
    </main>
  )
}

export default DashboardPage
