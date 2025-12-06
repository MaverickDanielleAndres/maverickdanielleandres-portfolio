import React, { useEffect, useRef, useCallback, useMemo } from "react";

interface ProfileCardProps {
  avatarUrl: string;
  iconUrl?: string;
  grainUrl?: string;
  behindGradient?: string;
  innerGradient?: string;
  showBehindGradient?: boolean;
  className?: string;
  enableTilt?: boolean;
  enableMobileTilt?: boolean;
  mobileTiltSensitivity?: number;
  miniAvatarUrl?: string;
  name?: string;
  title?: string;
  handle?: string;
  status?: string;
  contactText?: string;
  showUserInfo?: boolean;
  onContactClick?: () => void;
}

const DEFAULT_BEHIND_GRADIENT =
  "radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.3) 100%)";

const DEFAULT_INNER_GRADIENT =
  "linear-gradient(145deg, rgba(40,40,40,0.9) 0%, rgba(20,20,20,0.95) 100%)";

const ANIMATION_CONFIG = {
  SMOOTH_DURATION: 600,
  INITIAL_DURATION: 1500,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20,
} as const;

const clamp = (value: number, min = 0, max = 100): number =>
  Math.min(Math.max(value, min), max);

const round = (value: number, precision = 3): number =>
  parseFloat(value.toFixed(precision));

const adjust = (
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
): number =>
  round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));

const easeInOutCubic = (x: number): number =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

const ProfileCardComponent: React.FC<ProfileCardProps> = ({
  avatarUrl = "https://via.placeholder.com/400x600/333/fff?text=Avatar",
  iconUrl,
  grainUrl,
  behindGradient,
  innerGradient,
  showBehindGradient = false,
  className = "",
  enableTilt = true,
  enableMobileTilt = false,
  mobileTiltSensitivity = 5,
  miniAvatarUrl,
  name = "Javi A. Torres",
  title = "Software Engineer",
  handle = "javicodes",
  status = "Online",
  contactText = "Contact",
  showUserInfo = true,
  onContactClick,
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const animationHandlers = useMemo(() => {
    if (!enableTilt) return null;

    let rafId: number | null = null;

    const updateCardTransform = (
      offsetX: number,
      offsetY: number,
      card: HTMLElement,
      wrap: HTMLElement
    ) => {
      const width = card.clientWidth;
      const height = card.clientHeight;

      const percentX = clamp((100 / width) * offsetX);
      const percentY = clamp((100 / height) * offsetY);

      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const properties = {
        "--pointer-x": `${percentX}%`,
        "--pointer-y": `${percentY}%`,
        "--background-x": `${adjust(percentX, 0, 100, 35, 65)}%`,
        "--background-y": `${adjust(percentY, 0, 100, 35, 65)}%`,
        "--pointer-from-center": `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
        "--pointer-from-top": `${percentY / 100}`,
        "--pointer-from-left": `${percentX / 100}`,
        "--rotate-x": `${round(-(centerX / 5))}deg`,
        "--rotate-y": `${round(centerY / 4)}deg`,
      };

      Object.entries(properties).forEach(([property, value]) => {
        wrap.style.setProperty(property, value);
      });
    };

    const createSmoothAnimation = (
      duration: number,
      startX: number,
      startY: number,
      card: HTMLElement,
      wrap: HTMLElement
    ) => {
      const startTime = performance.now();
      const targetX = wrap.clientWidth / 2;
      const targetY = wrap.clientHeight / 2;

      const animationLoop = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = clamp(elapsed / duration);
        const easedProgress = easeInOutCubic(progress);

        const currentX = adjust(easedProgress, 0, 1, startX, targetX);
        const currentY = adjust(easedProgress, 0, 1, startY, targetY);

        updateCardTransform(currentX, currentY, card, wrap);

        if (progress < 1) {
          rafId = requestAnimationFrame(animationLoop);
        }
      };

      rafId = requestAnimationFrame(animationLoop);
    };

    return {
      updateCardTransform,
      createSmoothAnimation,
      cancelAnimation: () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      },
    };
  }, [enableTilt]);

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      const card = cardRef.current;
      const wrap = wrapRef.current;

      if (!card || !wrap || !animationHandlers) return;

      const rect = card.getBoundingClientRect();
      animationHandlers.updateCardTransform(
        event.clientX - rect.left,
        event.clientY - rect.top,
        card,
        wrap
      );
    },
    [animationHandlers]
  );

  const handlePointerEnter = useCallback(() => {
    const card = cardRef.current;
    const wrap = wrapRef.current;

    if (!card || !wrap || !animationHandlers) return;

    animationHandlers.cancelAnimation();
    wrap.classList.add("active");
    card.classList.add("active");
  }, [animationHandlers]);

  const handlePointerLeave = useCallback(
    (event: PointerEvent) => {
      const card = cardRef.current;
      const wrap = wrapRef.current;

      if (!card || !wrap || !animationHandlers) return;

      animationHandlers.createSmoothAnimation(
        ANIMATION_CONFIG.SMOOTH_DURATION,
        event.offsetX,
        event.offsetY,
        card,
        wrap
      );
      wrap.classList.remove("active");
      card.classList.remove("active");
    },
    [animationHandlers]
  );

  const handleDeviceOrientation = useCallback(
    (event: DeviceOrientationEvent) => {
      const card = cardRef.current;
      const wrap = wrapRef.current;

      if (!card || !wrap || !animationHandlers) return;

      const { beta, gamma } = event;
      if (!beta || !gamma) return;

      animationHandlers.updateCardTransform(
        card.clientHeight / 2 + gamma * mobileTiltSensitivity,
        card.clientWidth / 2 + (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * mobileTiltSensitivity,
        card,
        wrap
      );
    },
    [animationHandlers, mobileTiltSensitivity]
  );

  useEffect(() => {
    if (!enableTilt || !animationHandlers) return;

    const card = cardRef.current;
    const wrap = wrapRef.current;

    if (!card || !wrap) return;

    const pointerMoveHandler = handlePointerMove as EventListener;
    const pointerEnterHandler = handlePointerEnter as EventListener;
    const pointerLeaveHandler = handlePointerLeave as EventListener;
    const deviceOrientationHandler = handleDeviceOrientation as EventListener;

    const handleClick = () => {
      if (!enableMobileTilt || location.protocol !== 'https:') return;
      if (typeof (window.DeviceMotionEvent as any).requestPermission === 'function') {
        (window.DeviceMotionEvent as any)
          .requestPermission()
          .then((state: string) => {
            if (state === 'granted') {
              window.addEventListener('deviceorientation', deviceOrientationHandler);
            }
          })
          .catch((err: any) => console.error(err));
      } else {
        window.addEventListener('deviceorientation', deviceOrientationHandler);
      }
    };

    card.addEventListener("pointerenter", pointerEnterHandler);
    card.addEventListener("pointermove", pointerMoveHandler);
    card.addEventListener("pointerleave", pointerLeaveHandler);
    card.addEventListener('click', handleClick);

    const initialX = wrap.clientWidth - ANIMATION_CONFIG.INITIAL_X_OFFSET;
    const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;

    animationHandlers.updateCardTransform(initialX, initialY, card, wrap);
    animationHandlers.createSmoothAnimation(
      ANIMATION_CONFIG.INITIAL_DURATION,
      initialX,
      initialY,
      card,
      wrap
    );

    return () => {
      card.removeEventListener("pointerenter", pointerEnterHandler);
      card.removeEventListener("pointermove", pointerMoveHandler);
      card.removeEventListener("pointerleave", pointerLeaveHandler);
      card.removeEventListener('click', handleClick);
      window.removeEventListener('deviceorientation', deviceOrientationHandler);
      animationHandlers.cancelAnimation();
    };
  }, [
    enableTilt,
    enableMobileTilt,
    animationHandlers,
    handlePointerMove,
    handlePointerEnter,
    handlePointerLeave,
    handleDeviceOrientation,
  ]);

  const cardStyle = useMemo(
    () =>
      ({
        "--icon": iconUrl ? `url(${iconUrl})` : "none",
        "--grain": grainUrl ? `url(${grainUrl})` : "none",
        "--behind-gradient": showBehindGradient
          ? (behindGradient ?? DEFAULT_BEHIND_GRADIENT)
          : "none",
        "--inner-gradient": innerGradient ?? DEFAULT_INNER_GRADIENT,
      }) as React.CSSProperties,
    [iconUrl, grainUrl, showBehindGradient, behindGradient, innerGradient]
  );

  const handleContactClick = useCallback(() => {
    onContactClick?.();
  }, [onContactClick]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <style>{`
        :root {
          --pointer-x: 50%;
          --pointer-y: 50%;
          --pointer-from-center: 0;
          --pointer-from-top: 0.5;
          --pointer-from-left: 0.5;
          --card-opacity: 0;
          --rotate-x: 0deg;
          --rotate-y: 0deg;
          --background-x: 50%;
          --background-y: 50%;
          --grain: none;
          --icon: none;
          --behind-gradient: none;
          --inner-gradient: none;
          --card-radius: 32px;
        }

        .pc-card-wrapper {
          perspective: 1000px;
          transform: translate3d(0, 0, 0.1px);
          position: relative;
          touch-action: none;
        }

        .pc-card-wrapper::before {
          content: '';
          position: absolute;
          inset: -15px;
          background: radial-gradient(circle at var(--pointer-x) var(--pointer-y), 
            rgba(255, 255, 255, 0.03) 0%, 
            rgba(255, 255, 255, 0.01) 50%, 
            transparent 100%);
          border-radius: calc(var(--card-radius) + 15px);
          transition: all 0.5s ease;
          transform: scale(0.95) translate3d(0, 0, 0.1px);
          opacity: 0;
          filter: blur(20px);
        }

        .pc-card-wrapper:hover::before,
        .pc-card-wrapper.active::before {
          opacity: 1;
          transform: scale(1) translate3d(0, 0, 0.1px);
        }

        .pc-card {
          height: 80vh;
          max-height: 540px;
          display: grid;
          aspect-ratio: 0.718;
          border-radius: var(--card-radius);
          position: relative;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px);
          box-shadow: 
            rgba(255, 255, 255, 0.1) 0 1px 0 inset,
            rgba(255, 255, 255, 0.05) 0 0 0 1px inset,
            rgba(0, 0, 0, 0.3) 0 20px 60px -10px,
            rgba(0, 0, 0, 0.1) 0 10px 30px -5px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: transform 1s ease;
          transform: translate3d(0, 0, 0.1px) rotateX(0deg) rotateY(0deg);
          overflow: hidden;
        }

        .pc-card:hover,
        .pc-card.active {
          transition: none;
          transform: translate3d(0, 0, 0.1px) rotateX(var(--rotate-y)) rotateY(var(--rotate-x));
          box-shadow: 
            rgba(255, 255, 255, 0.15) 0 1px 0 inset,
            rgba(255, 255, 255, 0.08) 0 0 0 1px inset,
            rgba(0, 0, 0, 0.4) calc((var(--pointer-from-left) * 20px) - 10px) calc((var(--pointer-from-top) * 30px) - 15px) 80px -10px,
            rgba(0, 0, 0, 0.2) calc((var(--pointer-from-left) * 10px) - 5px) calc((var(--pointer-from-top) * 15px) - 7px) 40px -5px;
        }

        .pc-card * {
          display: grid;
          grid-area: 1/-1;
          border-radius: var(--card-radius);
          transform: translate3d(0, 0, 0.1px);
          pointer-events: none;
        }

        .pc-inside {
          inset: 2px;
          position: absolute;
          background: linear-gradient(145deg, 
            rgba(255, 255, 255, 0.03) 0%, 
            rgba(255, 255, 255, 0.01) 50%,
            rgba(0, 0, 0, 0.02) 100%);
          backdrop-filter: blur(40px);
          transform: translate3d(0, 0, 0.01px);
          border-radius: calc(var(--card-radius) - 2px);
        }

        .pc-shine {
          transform: translate3d(0, 0, 1px);
          overflow: hidden;
          z-index: 3;
          background: radial-gradient(
            circle at var(--pointer-x) var(--pointer-y),
            rgba(255, 255, 255, calc(0.1 * var(--pointer-from-center))) 0%,
            rgba(255, 255, 255, 0.02) 50%,
            transparent 100%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .pc-card:hover .pc-shine,
        .pc-card.active .pc-shine {
          opacity: 1;
        }

        .pc-glare {
          transform: translate3d(0, 0, 1.1px);
          overflow: hidden;
          background: radial-gradient(
            circle at var(--pointer-x) var(--pointer-y),
            rgba(255, 255, 255, 0.05) 0%,
            rgba(255, 255, 255, 0.01) 50%,
            transparent 100%
          );
          z-index: 4;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .pc-card:hover .pc-glare,
        .pc-card.active .pc-glare {
          opacity: 1;
        }

        .pc-avatar-content {
          overflow: hidden;
        }

        .pc-avatar-content .avatar {
          width: 100%;
          position: absolute;
          left: 50%;
          transform: translateX(-50%) scale(1);
          bottom: 2px;
          opacity: 1;
        }

        .pc-avatar-content::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(to bottom,
              transparent 0%,
              transparent 60%,
              rgba(0, 0, 0, 0.3) 90%,
              rgba(0, 0, 0, 0.6) 100%);
          pointer-events: none;
        }

        .pc-user-info {
          position: absolute;
          bottom: 20px;
          left: 20px;
          right: 20px;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          padding: 14px 18px;
          pointer-events: auto;
          box-shadow: 
            rgba(255, 255, 255, 0.1) 0 1px 0 inset,
            rgba(0, 0, 0, 0.1) 0 8px 32px;
        }

        .pc-user-details {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .pc-mini-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.2);
          flex-shrink: 0;
        }

        .pc-mini-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .pc-user-text {
          display: flex;
          align-items: flex-start;
          flex-direction: column;
          gap: 6px;
        }

        .pc-handle {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1;
        }

        .pc-status {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1;
        }

        .pc-contact-btn {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          padding: 10px 20px;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.95);
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(20px);
          box-shadow: 
            rgba(255, 255, 255, 0.1) 0 1px 0 inset,
            rgba(0, 0, 0, 0.1) 0 4px 12px;
        }

        .pc-contact-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
          box-shadow: 
            rgba(255, 255, 255, 0.15) 0 1px 0 inset,
            rgba(0, 0, 0, 0.15) 0 8px 25px;
        }

        .pc-content {
          max-height: 100%;
          overflow: hidden;
          text-align: center;
          position: relative;
          transform: translate3d(
            calc(var(--pointer-from-left) * -4px + 2px), 
            calc(var(--pointer-from-top) * -4px + 2px), 
            0.1px
          ) !important;
          z-index: 5;
        }

        .pc-details {
          width: 100%;
          position: absolute;
          top: 3em;
          display: flex;
          flex-direction: column;
        }

        .pc-details h3 {
          font-weight: 600;
          margin: 0;
          font-size: min(5vh, 3em);
          color: #ffffff;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
        }

        .pc-details p {
          font-weight: 400;
          position: relative;
          top: -12px;
          white-space: nowrap;
          font-size: 16px;
          margin: 0 auto;
          width: min-content;
          color: rgba(255, 255, 255, 0.7);
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
        }

        @media (max-width: 768px) {
          .pc-card {
            height: 70vh;
            max-height: 450px;
          }

          .pc-details {
            top: 2em;
          }

          .pc-details h3 {
            font-size: min(4vh, 2.5em);
          }

          .pc-details p {
            font-size: 14px;
          }

          .pc-user-info {
            bottom: 15px;
            left: 15px;
            right: 15px;
            padding: 10px 12px;
          }

          .pc-mini-avatar {
            width: 40px;
            height: 40px;
          }

          .pc-user-details {
            gap: 10px;
          }

          .pc-handle {
            font-size: 13px;
          }

          .pc-status {
            font-size: 11px;
          }

          .pc-contact-btn {
            padding: 6px 12px;
            font-size: 11px;
          }
        }

        @media (max-width: 480px) {
          .pc-card {
            height: 60vh;
            max-height: 380px;
          }

          .pc-details {
            top: 1.5em;
          }

          .pc-details h3 {
            font-size: min(3.5vh, 2em);
          }

          .pc-details p {
            font-size: 12px;
            top: -8px;
          }
        }
      `}</style>
      <div
        ref={wrapRef}
        className={`pc-card-wrapper ${className}`.trim()}
        style={cardStyle}
      >
        <section ref={cardRef} className="pc-card">
          <div className="pc-inside">
            <div className="pc-shine" />
            <div className="pc-glare" />
            <div className="pc-content pc-avatar-content">
              <img
                className="avatar"
                src={avatarUrl}
                alt={`${name || "User"} avatar`}
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
              {showUserInfo && (
                <div className="pc-user-info">
                  <div className="pc-user-details">
                    <div className="pc-mini-avatar">
                      <img
                        src={miniAvatarUrl || avatarUrl}
                        alt={`${name || "User"} mini avatar`}
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.opacity = "0.5";
                          target.src = avatarUrl;
                        }}
                      />
                    </div>
                    <div className="pc-user-text">
                      <div className="pc-handle">@{handle}</div>
                      <div className="pc-status">{status}</div>
                    </div>
                  </div>
                  <button
                    className="pc-contact-btn"
                    onClick={handleContactClick}
                    style={{ pointerEvents: "auto" }}
                    type="button"
                    aria-label={`Contact ${name || "user"}`}
                  >
                    {contactText}
                  </button>
                </div>
              )}
            </div>
            <div className="pc-content">
              <div className="pc-details">
                <h3>{name}</h3>
                <p>{title}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const ProfileCard = React.memo(ProfileCardComponent);

export default ProfileCard;