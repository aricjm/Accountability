import React, { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  runStartDate: string;
  soberStartDate: string;
  defaultMiles: number;
  milesOffset: number;
  onSaveSettings: (settings: {
    runStartDate: string;
    soberStartDate: string;
    defaultMiles: number;
    milesOffset: number;
  }) => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  runStartDate,
  soberStartDate,
  defaultMiles,
  milesOffset,
  onSaveSettings,
  onResetData,
}) => {
  const [localRunStart, setLocalRunStart] = useState(runStartDate);
  const [localSoberStart, setLocalSoberStart] = useState(soberStartDate);
  const [localDefaultMiles, setLocalDefaultMiles] = useState(defaultMiles);
  const [localMilesOffset, setLocalMilesOffset] = useState(milesOffset);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      runStartDate: localRunStart,
      soberStartDate: localSoberStart,
      defaultMiles: Math.max(0, localDefaultMiles),
      milesOffset: localMilesOffset,
    });
    onClose();
  };

  const handleResetConfirm = () => {
    if (
      window.confirm(
        'Are you sure you want to clear all manual logs? This will reset streaks and stats back to your default baseline dates.'
      )
    ) {
      onResetData();
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Settings & Baselines</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="tip-box">
            For days you don't manually log, the app assumes you stayed sober (after your sobriety start date) and ran your daily average miles (after your running start date).
          </div>

          <div className="form-group">
            <label>Running Streak Start Date (30th Birthday)</label>
            <input
              type="date"
              className="form-control"
              value={localRunStart}
              onChange={(e) => setLocalRunStart(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Sobriety Start Date</label>
            <input
              type="date"
              className="form-control"
              value={localSoberStart}
              onChange={(e) => setLocalSoberStart(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Default Daily Run Mileage (for unlogged days)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              className="form-control"
              value={localDefaultMiles}
              onChange={(e) => setLocalDefaultMiles(parseFloat(e.target.value) || 0)}
              required
            />
          </div>

          <div className="form-group">
            <label>Extra Distance Adjustment (Miles Offset)</label>
            <input
              type="number"
              step="1"
              min="0"
              className="form-control"
              value={localMilesOffset}
              onChange={(e) => setLocalMilesOffset(parseFloat(e.target.value) || 0)}
              required
            />
          </div>

          <button type="submit" className="submit-btn" style={{ marginTop: '12px' }}>
            Save Settings
          </button>

          <button type="button" className="danger-btn" onClick={handleResetConfirm}>
            Clear Manual Overrides
          </button>
        </form>
      </div>
    </div>
  );
};
