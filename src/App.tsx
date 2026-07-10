import { useState, useEffect } from 'react';
import { StreakCard } from './components/StreakCard';
import { LogForm } from './components/LogForm';
import { HistoryList } from './components/HistoryList';
import { SettingsModal } from './components/SettingsModal';
import { NutrientTracker } from './components/NutrientTracker';
import { FoodReferenceModal } from './components/FoodReferenceModal';
import type { DailyLog, LogsMap } from './utils/dateHelpers';
import {
  calculateSoberStreak,
  calculateRunningStreak,
  calculateTotalMiles,
  getDailyPotassium,
  getDailySodium,
  getTodayString,
} from './utils/dateHelpers';

const DEFAULT_SETTINGS = {
  runStartDate: '2022-09-05', // Sept 5, 2022 (30th Birthday)
  soberStartDate: '2026-06-26', // June 26, 2026
  defaultMiles: 1.0,
  milesOffset: 500.0,
};

function App() {
  // Load initial logs from localStorage
  const [logs, setLogs] = useState<LogsMap>(() => {
    const saved = localStorage.getItem('accountability_logs');
    return saved ? JSON.parse(saved) : {};
  });

  // Load initial settings from localStorage
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('accountability_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFoodRefOpen, setIsFoodRefOpen] = useState(false);

  // Sync logs to localStorage
  useEffect(() => {
    localStorage.setItem('accountability_logs', JSON.stringify(logs));
  }, [logs]);

  // Sync settings to localStorage
  useEffect(() => {
    localStorage.setItem('accountability_settings', JSON.stringify(settings));
  }, [settings]);

  // Calculations
  const soberStreak = calculateSoberStreak(logs, settings.soberStartDate);
  const runningStreak = calculateRunningStreak(logs, settings.runStartDate);
  const totalMiles = calculateTotalMiles(logs, settings.runStartDate, settings.defaultMiles) + (settings.milesOffset || 0);

  // Today's nutrient totals
  const todayLog = logs[getTodayString()];
  const todayPotassium = getDailyPotassium(todayLog);
  const todaySodium = getDailySodium(todayLog);

  const handleSaveLog = (date: string, log: DailyLog) => {
    setLogs((prev) => ({
      ...prev,
      [date]: log,
    }));
  };

  const handleDeleteLog = (date: string) => {
    setLogs((prev) => {
      const copy = { ...prev };
      delete copy[date];
      return copy;
    });
  };

  const handleSaveSettings = (newSettings: typeof DEFAULT_SETTINGS) => {
    setSettings(newSettings);
  };

  const handleResetData = () => {
    setLogs({});
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <>
      <header className="app-header">
        <h1 className="app-title">Accountability</h1>
        <div className="header-actions">
          <button
            className="settings-btn food-ref-btn"
            onClick={() => setIsFoodRefOpen(true)}
            aria-label="Potassium Food Reference"
            title="Potassium Food Reference"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </button>
          <button
            className="settings-btn"
            onClick={() => setIsSettingsOpen(true)}
            aria-label="Settings"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>
        </div>
      </header>

      <main>
        <section className="streaks-grid">
          <StreakCard
            title="Sober Streak"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="M9 11l2 2 4-4"></path>
              </svg>
            }
            streak={soberStreak}
            startDate={settings.soberStartDate}
            className="sober-card"
          />
          <StreakCard
            title="Running Streak"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            }
            streak={runningStreak}
            startDate={settings.runStartDate}
            extraStatName="Total Distance"
            extraStatValue={`${totalMiles.toLocaleString()} mi`}
            className="run-card"
          />
        </section>

        <section className="nutrient-section">
          <h2 className="section-title">Today's Nutrition</h2>
          <div className="nutrient-grid">
            <NutrientTracker
              title="Potassium"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              }
              currentMg={todayPotassium}
              goalMg={5000}
              variant="potassium"
            />
            <NutrientTracker
              title="Sodium"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                  <path d="M12 2a10 10 0 1 0 10 10" />
                  <path d="M12 2v10l6.93 4" />
                </svg>
              }
              currentMg={todaySodium}
              goalMg={1500}
              variant="sodium"
            />
          </div>
        </section>

        <section>
          <h2 className="section-title">Log Today or Edit Date</h2>
          <LogForm
            onSaveLog={handleSaveLog}
            logs={logs}
            defaultMiles={settings.defaultMiles}
          />
        </section>

        <section style={{ marginTop: '24px' }}>
          <h2 className="section-title">Override History</h2>
          <HistoryList logs={logs} onDeleteLog={handleDeleteLog} />
        </section>
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        runStartDate={settings.runStartDate}
        soberStartDate={settings.soberStartDate}
        defaultMiles={settings.defaultMiles}
        milesOffset={settings.milesOffset || 0}
        onSaveSettings={handleSaveSettings}
        onResetData={handleResetData}
      />

      <FoodReferenceModal
        isOpen={isFoodRefOpen}
        onClose={() => setIsFoodRefOpen(false)}
      />
    </>
  );
}

export default App;
