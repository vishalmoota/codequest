import { useEffect, useState } from 'react';

const XPFloatLabel = ({ amount, x = '50%', y = '50%', onDone }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, 1500);
    return () => clearTimeout(t);
  }, [onDone]);

  if (!visible) return null;

  return (
    <div
      className="xp-float-label"
      style={{ left: x, top: y, transform: 'translate(-50%,-50%)' }}
    >
      +{amount} XP ⚡
    </div>
  );
};

export default XPFloatLabel;
