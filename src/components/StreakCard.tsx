import React from 'react';

interface StreakCardProps {
  title: string;
  icon: React.ReactNode;
  streak: number;
  startDate: string;
  extraStatName?: string;
  extraStatValue?: string | number;
  className?: string;
}

export const StreakCard: React.FC<StreakCardProps> = ({
  title,
  icon,
  streak,
  startDate,
  extraStatName,
  extraStatValue,
  className = '',
}) => {
  // Format the start date for display (e.g., "Sept 5, 2022")
  const formatDateDisplay = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={`stat-card ${className}`}>
      <div className="card-header">
        <span className="card-icon">{icon}</span>
        <span className="card-title">{title}</span>
      </div>
      <div className="streak-display">
        <span className="streak-number">{streak.toLocaleString()}</span>
        <span className="streak-label">days</span>
      </div>
      <div className="card-footer">
        <span>Since {formatDateDisplay(startDate)}</span>
        {extraStatName && extraStatValue !== undefined && (
          <span>
            {extraStatName}: <span className="miles-count">{extraStatValue}</span>
          </span>
        )}
      </div>
    </div>
  );
};
