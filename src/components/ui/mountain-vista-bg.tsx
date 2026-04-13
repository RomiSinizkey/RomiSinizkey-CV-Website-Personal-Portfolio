import React, { useMemo } from "react";

type LayerConfig = {
  className: string;
  speed: string;
  size: string;
  zIndex: number;
  image: string;
  animation?: string;
  bottom?: string;
  noRepeat?: boolean;
};

const layersData: LayerConfig[] = [
  { className: "mvp-layer-6", speed: "120s", size: "222px", zIndex: 1, image: "6" },
  { className: "mvp-layer-5", speed: "95s", size: "311px", zIndex: 1, image: "5" },
  { className: "mvp-layer-4", speed: "75s", size: "468px", zIndex: 1, image: "4" },
  { className: "mvp-bike-1", speed: "10s", size: "75px", zIndex: 2, image: "bike", animation: "mvp-parallax-bike", bottom: "32px", noRepeat: true },
  { className: "mvp-bike-2", speed: "15s", size: "75px", zIndex: 2, image: "bike", animation: "mvp-parallax-bike", bottom: "32px", noRepeat: true },
  { className: "mvp-layer-3", speed: "55s", size: "158px", zIndex: 3, image: "3" },
  { className: "mvp-layer-2", speed: "30s", size: "145px", zIndex: 4, image: "2" },
  { className: "mvp-layer-1", speed: "20s", size: "136px", zIndex: 5, image: "1" },
];

export default function MountainVistaParallax() {
  const dynamicStyles = useMemo(() => {
    const layerRules = layersData
      .map((layer) => {
        const url = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/24650/${layer.image}.png`;
        return `
          .${layer.className} {
            background-image: url(${url});
            animation-duration: ${layer.speed};
            background-size: auto ${layer.size};
            z-index: ${layer.zIndex};
            ${layer.animation ? `animation-name: ${layer.animation};` : ""}
            ${layer.bottom ? `bottom: ${layer.bottom};` : ""}
            ${layer.noRepeat ? "background-repeat: no-repeat;" : ""}
          }
        `;
      })
      .join("\n");

    return `
      .mvp-root {
        position: absolute;
        inset: 0;
        overflow: hidden;
        background:
          linear-gradient(180deg, #d8f0ff 0%, #eff8ff 36%, #f4efe6 68%, #dde6c3 100%);
      }

      .mvp-root::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02) 28%, rgba(22, 26, 20, 0.06) 100%);
        pointer-events: none;
        z-index: 6;
      }

      .mvp-layer {
        position: absolute;
        inset: 0;
        background-position: 0 100%;
        background-repeat: repeat-x;
        animation-name: mvp-parallax-scroll;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        pointer-events: none;
      }

      .mvp-bike-1 {
        left: -20%;
      }

      .mvp-bike-2 {
        left: 38%;
        animation-delay: -7s;
      }

      @keyframes mvp-parallax-scroll {
        from { background-position: 0 100%; }
        to { background-position: -1920px 100%; }
      }

      @keyframes mvp-parallax-bike {
        from { transform: translateX(-18%); }
        to { transform: translateX(148%); }
      }

      ${layerRules}
    `;
  }, []);

  return (
    <div className="mvp-root" aria-hidden="true">
      <style>{dynamicStyles}</style>
      {layersData.map((layer) => (
        <div key={layer.className} className={`mvp-layer ${layer.className}`} />
      ))}
    </div>
  );
}

export const MemoizedMountainVistaParallax = React.memo(MountainVistaParallax);
