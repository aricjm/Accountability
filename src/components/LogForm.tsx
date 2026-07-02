import React, { useState, useEffect } from 'react';
import type { DailyLog, LogsMap } from '../utils/dateHelpers';
import { getTodayString } from '../utils/dateHelpers';

interface LogFormProps {
  onSaveLog: (date: string, log: DailyLog) => void;
  logs: LogsMap;
  defaultMiles: number;
}

export const LogForm: React.FC<LogFormProps> = ({ onSaveLog, logs, defaultMiles }) => {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [sober, setSober] = useState<boolean>(true);
  const [ran, setRan] = useState<boolean>(true);
  const [miles, setMiles] = useState<number>(defaultMiles);

  // When selected date changes or logs are updated, prefill the form with existing data
  useEffect(() => {
    const existingLog = logs[selectedDate];
    if (existingLog) {
      setSober(existingLog.sober);
      setRan(existingLog.ran);
      setMiles(existingLog.miles);
    } else {
      // Default state for unlogged day
      setSober(true);
      setRan(true);
      setMiles(defaultMiles);
    }
  }, [selectedDate, logs, defaultMiles]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveLog(selectedDate, {
      sober,
      ran,
      miles: ran ? Math.max(0, miles) : 0,
    });
  };

  const adjustMiles = (amount: number) => {
    setMiles((prev) => {
      const newVal = parseFloat((prev + amount).toFixed(2));
      return Math.max(0, newVal);
    });
  };

  const handleMilesInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setMiles(isNaN(val) ? 0 : val);
  };

  return (
    <form className="log-panel" onSubmit={handleSave}>
      <div className="log-date-picker">
        <span className="date-label">Date to Log</span>
        <input
          type="date"
          className="date-input"
          value={selectedDate}
          max={getTodayString()}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="log-row">
        <div className="log-row-header">
          <span className="log-label">Did you stay sober?</span>
          <div className="toggle-group">
            <button
              type="button"
              className={`toggle-btn yes ${sober ? 'active' : ''}`}
              onClick={() => setSober(true)}
            >
              Yes
            </button>
            <button
              type="button"
              className={`toggle-btn no ${!sober ? 'active' : ''}`}
              onClick={() => setSober(false)}
            >
              No
            </button>
          </div>
        </div>
      </div>

      <div className="log-row">
        <div className="log-row-header">
          <span className="log-label">Did you run?</span>
          <div className="toggle-group">
            <button
              type="button"
              className={`toggle-btn yes ${ran ? 'active' : ''}`}
              onClick={() => setRan(true)}
            >
              Yes
            </button>
            <button
              type="button"
              className={`toggle-btn no ${!ran ? 'active' : ''}`}
              onClick={() => setRan(false)}
            >
              No
            </button>
          </div>
        </div>

        {ran && (
          <div className="miles-input-container">
            <button
              type="button"
              className="miles-control-btn"
              onClick={() => adjustMiles(-0.5)}
            >
              -
            </button>
            <input
              type="number"
              step="0.1"
              min="0"
              className="miles-text-input"
              value={miles === 0 ? '' : miles}
              onChange={handleMilesInputChange}
              placeholder="0.0"
            />
            <span className="miles-unit">mi</span>
            <button
              type="button"
              className="miles-control-btn"
              onClick={() => adjustMiles(0.5)}
            >
              +
            </button>
          </div>
        )}
      </div>

      <button type="submit" className="submit-btn">
        Save Daily Entry
      </button>
    </form>
  );
};
