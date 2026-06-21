import { useEffect, useState } from 'react';

const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setIsLoading(false), 600);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className={`loading-screen transition-opacity duration-700 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center">
        <div className="relative mx-auto w-24 h-24 mb-8">
          <div className="loading-spinner absolute inset-0" />
          <div className="absolute inset-3 rounded-full gradient-bg flex items-center justify-center">
            <span className="text-white font-display font-bold text-xl">A</span>
          </div>
        </div>
        <p className="loading-logo tracking-tight">Aryo.dev</p>
        <div className="mt-4 mx-auto w-48 h-1 rounded-full bg-secondary overflow-hidden">
          <div className="h-full w-1/4 rounded-full gradient-bg animate-loading-bar" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
