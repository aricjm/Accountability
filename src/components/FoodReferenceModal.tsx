import React from 'react';

const POTASSIUM_FOODS = [
  { food: 'Avocado (1 whole)', mg: 975 },
  { food: 'Sweet Potato (1 large, baked)', mg: 855 },
  { food: 'Banana (1 medium)', mg: 422 },
  { food: 'Spinach (1 cup, cooked)', mg: 839 },
  { food: 'Salmon (6 oz fillet)', mg: 980 },
  { food: 'White Beans (1 cup, cooked)', mg: 1004 },
  { food: 'Potato (1 medium, baked)', mg: 926 },
  { food: 'Coconut Water (1 cup)', mg: 600 },
  { food: 'Yogurt (1 cup, plain)', mg: 573 },
  { food: 'Lentils (1 cup, cooked)', mg: 731 },
  { food: 'Acorn Squash (1 cup, baked)', mg: 896 },
  { food: 'Beet Greens (1 cup, cooked)', mg: 1309 },
  { food: 'Orange Juice (1 cup)', mg: 496 },
  { food: 'Tomato Sauce (1 cup)', mg: 728 },
  { food: 'Edamame (1 cup)', mg: 676 },
  { food: 'Chicken Breast (6 oz)', mg: 640 },
  { food: 'Black Beans (1 cup, cooked)', mg: 611 },
  { food: 'Cantaloupe (1 cup, cubed)', mg: 427 },
  { food: 'Dried Apricots (½ cup)', mg: 755 },
  { food: 'Swiss Chard (1 cup, cooked)', mg: 961 },
  { food: 'Pomegranate (1 whole)', mg: 666 },
  { food: 'Milk (1 cup, whole)', mg: 366 },
  { food: 'Pistachios (1 oz)', mg: 285 },
  { food: 'Watermelon (2 cups, diced)', mg: 320 },
  { food: 'Broccoli (1 cup, cooked)', mg: 457 },
];

interface FoodReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FoodReferenceModal: React.FC<FoodReferenceModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  // Sort by highest potassium first
  const sortedFoods = [...POTASSIUM_FOODS].sort((a, b) => b.mg - a.mg);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content food-ref-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            Potassium-Rich Foods
          </h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="food-ref-body">
          <div className="food-ref-tip">
            Daily goal: <strong>5,000 mg</strong> potassium. Here are popular foods ranked by potassium content.
          </div>

          <div className="food-ref-list">
            {sortedFoods.map((item, index) => {
              const barWidth = Math.min((item.mg / 1400) * 100, 100);
              return (
                <div key={index} className="food-ref-item">
                  <div className="food-ref-info">
                    <span className="food-ref-name">{item.food}</span>
                    <span className="food-ref-mg">{item.mg.toLocaleString()} mg</span>
                  </div>
                  <div className="food-ref-bar-track">
                    <div
                      className="food-ref-bar-fill"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
