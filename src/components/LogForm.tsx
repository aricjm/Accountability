import React, { useState, useEffect } from 'react';
import type { DailyLog, LogsMap, NutrientEntry } from '../utils/dateHelpers';
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
  const [potassiumEntries, setPotassiumEntries] = useState<NutrientEntry[]>([]);
  const [sodiumEntries, setSodiumEntries] = useState<NutrientEntry[]>([]);
  const [potassiumInput, setPotassiumInput] = useState<number>(0);
  const [sodiumInput, setSodiumInput] = useState<number>(0);

  // When selected date changes or logs are updated, prefill the form with existing data
  useEffect(() => {
    const existingLog = logs[selectedDate];
    if (existingLog) {
      setSober(existingLog.sober);
      setRan(existingLog.ran);
      setMiles(existingLog.miles);
      setPotassiumEntries(existingLog.potassiumEntries || []);
      setSodiumEntries(existingLog.sodiumEntries || []);
    } else {
      // Default state for unlogged day
      setSober(true);
      setRan(true);
      setMiles(defaultMiles);
      setPotassiumEntries([]);
      setSodiumEntries([]);
    }
    setPotassiumInput(0);
    setSodiumInput(0);
  }, [selectedDate, logs, defaultMiles]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveLog(selectedDate, {
      sober,
      ran,
      miles: ran ? Math.max(0, miles) : 0,
      potassiumEntries,
      sodiumEntries,
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

  const addPotassiumEntry = () => {
    if (potassiumInput <= 0) return;
    setPotassiumEntries((prev) => [...prev, { amount: potassiumInput }]);
    setPotassiumInput(0);
  };

  const removePotassiumEntry = (index: number) => {
    setPotassiumEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const addSodiumEntry = () => {
    if (sodiumInput <= 0) return;
    setSodiumEntries((prev) => [...prev, { amount: sodiumInput }]);
    setSodiumInput(0);
  };

  const removeSodiumEntry = (index: number) => {
    setSodiumEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const adjustNutrient = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    amount: number
  ) => {
    setter((prev) => Math.max(0, prev + amount));
  };

  const potassiumTotal = potassiumEntries.reduce((s, e) => s + e.amount, 0);
  const sodiumTotal = sodiumEntries.reduce((s, e) => s + e.amount, 0);

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
              onClick={() => adjustMiles(-0.1)}
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
              onClick={() => adjustMiles(0.1)}
            >
              +
            </button>
          </div>
        )}
      </div>

      {/* Potassium Entry */}
      <div className="log-row nutrient-log-row">
        <div className="log-row-header">
          <span className="log-label nutrient-label-k">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }}>
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            Potassium
          </span>
          <span className="nutrient-running-total nutrient-total-k">
            {potassiumTotal.toLocaleString()} mg
          </span>
        </div>

        <div className="nutrient-input-row">
          <button
            type="button"
            className="miles-control-btn"
            onClick={() => adjustNutrient(setPotassiumInput, -50)}
          >
            -
          </button>
          <input
            type="number"
            step="50"
            min="0"
            className="miles-text-input"
            value={potassiumInput === 0 ? '' : potassiumInput}
            onChange={(e) => setPotassiumInput(Math.max(0, parseInt(e.target.value) || 0))}
            placeholder="0"
          />
          <span className="miles-unit">mg</span>
          <button
            type="button"
            className="miles-control-btn"
            onClick={() => adjustNutrient(setPotassiumInput, 50)}
          >
            +
          </button>
          <button
            type="button"
            className="nutrient-add-btn nutrient-add-k"
            onClick={addPotassiumEntry}
          >
            Add
          </button>
        </div>

        {potassiumEntries.length > 0 && (
          <div className="nutrient-entries">
            {potassiumEntries.map((entry, i) => (
              <span key={i} className="nutrient-chip nutrient-chip-k">
                {entry.amount} mg
                <button
                  type="button"
                  className="chip-remove"
                  onClick={() => removePotassiumEntry(i)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Sodium Entry */}
      <div className="log-row nutrient-log-row">
        <div className="log-row-header">
          <span className="log-label nutrient-label-na">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }}>
              <path d="M12 2a10 10 0 1 0 10 10" />
              <path d="M12 2v10l6.93 4" />
            </svg>
            Sodium
          </span>
          <span className="nutrient-running-total nutrient-total-na">
            {sodiumTotal.toLocaleString()} mg
          </span>
        </div>

        <div className="nutrient-input-row">
          <button
            type="button"
            className="miles-control-btn"
            onClick={() => adjustNutrient(setSodiumInput, -50)}
          >
            -
          </button>
          <input
            type="number"
            step="50"
            min="0"
            className="miles-text-input"
            value={sodiumInput === 0 ? '' : sodiumInput}
            onChange={(e) => setSodiumInput(Math.max(0, parseInt(e.target.value) || 0))}
            placeholder="0"
          />
          <span className="miles-unit">mg</span>
          <button
            type="button"
            className="miles-control-btn"
            onClick={() => adjustNutrient(setSodiumInput, 50)}
          >
            +
          </button>
          <button
            type="button"
            className="nutrient-add-btn nutrient-add-na"
            onClick={addSodiumEntry}
          >
            Add
          </button>
        </div>

        {sodiumEntries.length > 0 && (
          <div className="nutrient-entries">
            {sodiumEntries.map((entry, i) => (
              <span key={i} className="nutrient-chip nutrient-chip-na">
                {entry.amount} mg
                <button
                  type="button"
                  className="chip-remove"
                  onClick={() => removeSodiumEntry(i)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <button type="submit" className="submit-btn">
        Save Daily Entry
      </button>
    </form>
  );
};
