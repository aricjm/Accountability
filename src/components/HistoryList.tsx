import React from 'react';
import type { LogsMap } from '../utils/dateHelpers';

interface HistoryListProps {
  logs: LogsMap;
  onDeleteLog: (date: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ logs, onDeleteLog }) => {
  const loggedDates = Object.keys(logs).sort((a, b) => b.localeCompare(a)); // Newest first

  const formatDateDisplay = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loggedDates.length === 0) {
    return (
      <div className="empty-state">
        No manual overrides logged yet. All past days are assumed to be on-track based on your starting dates.
      </div>
    );
  }

  return (
    <div className="history-list">
      {loggedDates.map((dateStr) => {
        const log = logs[dateStr];
        return (
          <div key={dateStr} className="history-item">
            <div>
              <div className="history-date">{formatDateDisplay(dateStr)}</div>
            </div>
            <div className="history-details">
              <span className={`tag ${log.sober ? 'tag-sober' : 'tag-not-sober'}`}>
                {log.sober ? 'Sober' : 'Not Sober'}
              </span>
              <span className={`tag ${log.ran ? 'tag-run' : 'tag-no-run'}`}>
                {log.ran ? `${log.miles} mi` : 'No Run'}
              </span>
              <button
                type="button"
                className="close-btn"
                style={{ width: '22px', height: '22px', fontSize: '11px', background: 'rgba(255,255,255,0.06)' }}
                onClick={() => onDeleteLog(dateStr)}
                title="Reset to default baseline"
              >
                ✕
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
