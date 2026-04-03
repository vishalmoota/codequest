import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    setTransitioning(true);
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setTransitioning(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div
      className={`transition-all duration-300 ease-out ${
        transitioning
          ? 'opacity-0 translate-y-3 scale-[0.99]'
          : 'opacity-100 translate-y-0 scale-100'
      }`}
    >
      {displayChildren}
    </div>
  );
};

export default PageTransition;
