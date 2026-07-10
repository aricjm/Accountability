import React from 'react';

interface NutrientTrackerProps {
  title: string;
  icon: React.ReactNode;
  currentMg: number;
  goalMg: number;
  variant: 'potassium' | 'sodium';
}

export const NutrientTracker: React.FC<NutrientTrackerProps> = ({
  title,
  icon,
  currentMg,
  goalMg,
  variant,
}) => {
  const ratio = Math.min(currentMg / goalMg, 1.5);
  const percentage = Math.min(ratio * 100, 100);

  const getBarColor = () => {
    if (variant === 'potassium') {
      if (ratio >= 1) return 'var(--success-green)';
      if (ratio >= 0.7) return '#5bd97a';
      return 'var(--accent-potassium)';
    } else {
      if (ratio >= 1) return 'var(--danger-red)';
      if (ratio >= 0.75) return 'var(--accent-sodium)';
      return 'var(--success-green)';
    }
  };

  const getStatusText = () => {
    if (variant === 'potassium') {
      if (ratio >= 1) return 'Goal reached! 🎉';
      if (ratio >= 0.7) return 'Almost there!';
      return 'Keep going';
    } else {
      if (ratio >= 1) return 'Over limit ⚠️';
      if (ratio >= 0.75) return 'Getting close';
      return 'On track';
    }
  };

  const barColor = getBarColor();
  const glowColor = variant === 'potassium'
    ? 'rgba(48, 209, 88, 0.25)'
    : ratio >= 0.75
      ? 'rgba(255, 69, 58, 0.25)'
      : 'rgba(48, 209, 88, 0.25)';

  return (
    <div className={`stat-card nutrient-card nutrient-${variant}`}>
      <div className="card-header">
        <span className="card-icon">{icon}</span>
        <span className="card-title">{title}</span>
      </div>

      <div className="nutrient-amount-row">
        <span className="nutrient-current" style={{ color: barColor }}>
          {currentMg.toLocaleString()}
        </span>
        <span className="nutrient-separator">/</span>
        <span className="nutrient-goal">{goalMg.toLocaleString()} mg</span>
      </div>

      <div className="nutrient-bar-track">
        <div
          className="nutrient-bar-fill"
          style={{
            width: `${percentage}%`,
            background: barColor,
            boxShadow: `0 0 12px ${glowColor}`,
          }}
        />
      </div>

      <div className="nutrient-status">
        <span>{getStatusText()}</span>
        <span className="nutrient-pct">{Math.round(ratio * 100)}%</span>
      </div>
    </div>
  );
};
