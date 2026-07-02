import { useState, useEffect } from 'react';
import { StreakCard } from './components/StreakCard';
import { LogForm } from './components/LogForm';
import { HistoryList } from './components/HistoryList';
import { SettingsModal } from './components/SettingsModal';
import type { DailyLog, LogsMap } from './utils/dateHelpers';
import {
  calculateSoberStreak,
  calculateRunningStreak,
  calculateTotalMiles,
} from './utils/dateHelpers';

const DEFAULT_SETTINGS = {
  runStartDate: '2022-09-05', // Sept 5, 2022 (30th Birthday)
  soberStartDate: '2026-06-26', // June 26, 2026
  defaultMiles: 1.0,
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
  const totalMiles = calculateTotalMiles(logs, settings.runStartDate, settings.defaultMiles);

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
        <button
          className="settings-btn"
          onClick={() => setIsSettingsOpen(true)}
          aria-label="Settings"
        >
          ⚙️
        </button>
      </header>

      <main>
        <section className="streaks-grid">
          <StreakCard
            title="Sober Streak"
            icon="✨"
            streak={soberStreak}
            startDate={settings.soberStartDate}
            className="sober-card"
          />
          <StreakCard
            title="Running Streak"
            icon="🏃‍♂️"
            streak={runningStreak}
            startDate={settings.runStartDate}
            extraStatName="Total Distance"
            extraStatValue={`${totalMiles.toLocaleString()} mi`}
            className="run-card"
          />
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
        onSaveSettings={handleSaveSettings}
        onResetData={handleResetData}
      />
    </>
  );
}

export default App;
