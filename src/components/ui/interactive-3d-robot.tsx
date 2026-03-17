'use client';

import { Suspense } from 'react';

interface InteractiveRobotSplineProps {
  scene: string;
  className?: string;
}

export function InteractiveRobotSpline({ scene, className }: InteractiveRobotSplineProps) {
  return (
    <Suspense
      fallback={
        <div className={`w-full h-full flex items-center justify-center bg-slate-900 text-white ${className ?? ''}`}>
          <div className="text-center">
            <svg className="animate-spin h-8 w-8 text-white mr-3 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2-2.647z"></path>
            </svg>
            <p className="mt-4 text-sm">Loading 3D Scene...</p>
          </div>
        </div>
      }
    >
      <iframe
        src={scene}
        frameBorder="0"
        className={`${className ?? ''}`}
        style={{ border: 'none', width: '100%', height: '100%' }}
        allowFullScreen
      />
    </Suspense>
  );
}
