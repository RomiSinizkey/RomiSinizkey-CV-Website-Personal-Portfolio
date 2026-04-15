'use client';

import { useEffect, useRef, useState } from 'react';
import { Application } from '@splinetool/runtime';


import type { RefObject } from 'react';
export interface InteractiveRobotSplineProps {
  scene: string;
  className?: string;
  canvasRef?: RefObject<HTMLCanvasElement | null>;
}

export function InteractiveRobotSpline({ scene, className, canvasRef }: InteractiveRobotSplineProps) {
  const internalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const actualCanvasRef = canvasRef ?? internalCanvasRef;
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const usesIframeEmbed = scene.includes('my.spline.design');

  useEffect(() => {
    if (usesIframeEmbed) {
      setIsLoaded(true);
      setHasError(false);
      return;
    }

    const canvas = actualCanvasRef.current;
    if (!canvas) return;

    let isCancelled = false;
    const spline = new Application(canvas);

    setIsLoaded(false);
    setHasError(false);

    spline.load(scene)
      .then(() => {
        if (!isCancelled) {
          setIsLoaded(true);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setHasError(true);
        }
      });

    return () => {
      isCancelled = true;
      spline.stop();
    };
  }, [scene, usesIframeEmbed]);

  if (usesIframeEmbed) {
    return (
      <div className={`relative ${className ?? ""}`} data-cursor="interactive">
        <iframe
          src={scene}
          title="Interactive 3D Robot"
          className="h-full w-full border-0"
          allow="fullscreen"
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className ?? ""}`} data-cursor="interactive">
      <canvas ref={actualCanvasRef} className="h-full w-full" />

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-white pointer-events-none">
          <div className="text-center">
            <svg className="animate-spin h-8 w-8 text-white mr-3 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2-2.647z"></path>
            </svg>
            <p className="mt-4 text-sm">Loading 3D Scene...</p>
          </div>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 text-white pointer-events-none">
          <p className="text-sm font-medium">Unable to load 3D scene.</p>
        </div>
      )}
    </div>
  );
}
