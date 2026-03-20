"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type AdminLoadingDestination = {
  city: string;
  country: string;
  emoji: string;
};

export type AdminLoadingUIProps = {
  /**
   * 컴포넌트를 마운트/언마운트 하기보다, 내부 애니메이션만 켜고 끌 때 사용합니다.
   */
  active: boolean;
  progressTitle?: string;
  statusLoadingMessages?: string[];
  statusDoneText?: string;

  destinations?: AdminLoadingDestination[];
  brandName?: string;

  doneTitle?: string;
  doneSubtitle?: string;
  doneButtonText?: string;

  /**
   * 완료 오버레이(버튼 포함)를 노출할지 여부입니다.
   * ADMIN에서는 보통 `active`가 false 되면서 언마운트되므로 기본값을 false로 둡니다.
   */
  showDoneOverlay?: boolean;
  onReset?: () => void;
};

function PlaneSVG() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <path d="M56 16L40 32L48 48L40 44L32 32L8 40L4 36L24 24L16 8L20 4L36 20L56 16Z" fill="currentColor" />
    </svg>
  );
}

function Cloud({ style }: { style: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <ellipse cx="60" cy="40" rx="50" ry="22" fill="currentColor" />
      <ellipse cx="45" cy="35" rx="28" ry="22" fill="currentColor" />
      <ellipse cx="78" cy="32" rx="24" ry="20" fill="currentColor" />
    </svg>
  );
}

function hashStringToSeed(input: string): number {
  // FNV-1a 계열(순수/결정적) 간단 해시로 seed를 만듭니다.
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function AdminLoadingUI({
  active,
  progressTitle = "데이터를 불러오는 중",
  statusLoadingMessages = [
    "최저가 항공권을 탐색하는 중...",
    "완벽한 숙소를 찾는 중...",
    "현지 맛집을 큐레이션하는 중...",
    "최적 여행 일정을 계산하는 중...",
    "특별 할인 혜택을 확인하는 중...",
  ],
  statusDoneText = "모든 준비가 완료되었습니다!",

  destinations = [
    { city: "파리", country: "France", emoji: "🗼" },
    { city: "발리", country: "Indonesia", emoji: "🌴" },
    { city: "산토리니", country: "Greece", emoji: "🏛️" },
    { city: "교토", country: "Japan", emoji: "⛩️" },
    { city: "두바이", country: "UAE", emoji: "🌆" },
  ],
  brandName = "Voyageur",

  doneTitle = "준비 완료!",
  doneSubtitle = "요청 결과를 준비했습니다.",
  doneButtonText = "다시 시도",

  showDoneOverlay = false,
  onReset,
}: AdminLoadingUIProps) {
  const MIN_VISIBLE_MS = 1000;

  const [progress, setProgress] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);
  const [destIdx, setDestIdx] = useState(0);
  const [done, setDone] = useState(false);

  // active 토글 타이밍과 무관하게, 최소 1초 동안은 UI를 유지합니다.
  const [visible, setVisible] = useState(false);
  const startedAtRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // active가 true로 바뀔 때 애니메이션을 다시 시작합니다.
  const starsSeed = useMemo(() => hashStringToSeed(active ? "on" : "off"), [active]);
  const stars = useMemo(() => {
    const rand = mulberry32(starsSeed);
    return Array.from({ length: 60 }).map((_, i) => {
      const left = rand() * 100;
      const top = rand() * 80;
      const dur = 2 + rand() * 4;
      const delay = rand() * 4;
      const isBig = rand() > 0.7;
      return { i, left, top, dur, delay, size: isBig ? 3 : 2 };
    });
  }, [starsSeed]);

  useEffect(() => {
    if (active) {
      // 로딩 시작: 즉시 표시 + 시작 시각 기록
      startedAtRef.current = Date.now();
      // effect 바디에서 즉시 setState 하면 ESLint/React 경고가 발생할 수 있어 microtask로 처리합니다.
      queueMicrotask(() => setVisible(true));

      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }

      return;
    }

    // 로딩 종료: 최소 표시 시간 만족 후 숨깁니다.
    if (!visible) return;

    const startedAt = startedAtRef.current;
    const elapsed = startedAt ? Date.now() - startedAt : MIN_VISIBLE_MS;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    hideTimeoutRef.current = setTimeout(() => {
      setVisible(false);
      hideTimeoutRef.current = null;
    }, remaining);
  }, [active, visible]);

  useEffect(() => {
    if (!active) return;
    // effect 바디에서 동기 setState를 호출하면 ESLint/React 경고가 발생할 수 있어
    // 다음 마이크로태스크에서 상태를 초기화합니다.
    queueMicrotask(() => {
      setProgress(0);
      setMsgIdx(0);
      setDestIdx(0);
      setDone(false);
    });
  }, [active, starsSeed]);

  useEffect(() => {
    if (!active || done) return;

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setDone(true);
          return 100;
        }
        return p + 0.6;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [active, done]);

  useEffect(() => {
    if (!active || done) return;

    const interval = setInterval(() => {
      setMsgIdx((i) => (i + 1) % statusLoadingMessages.length);
    }, 1800);

    return () => clearInterval(interval);
  }, [active, done, statusLoadingMessages.length]);

  useEffect(() => {
    if (!active || done) return;

    const interval = setInterval(() => {
      setDestIdx((i) => (i + 1) % destinations.length);
    }, 1200);

    return () => clearInterval(interval);
  }, [active, done, destinations.length]);

  const dest = destinations[destIdx];

  if (!visible) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 9999;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding-top: 48px;
        }

        /* 로딩 박스 (카드) */
        .wrapper {
          width: min(520px, 92vw);
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 28px;
          padding: 40px 28px 34px;
          backdrop-filter: blur(20px);
          box-shadow: 0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset;
          overflow: hidden;
          position: relative;
          font-family: 'DM Sans', sans-serif;
        }

        .stars { position: absolute; inset: 0; pointer-events: none; }
        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          background: #fff;
          animation: twinkle var(--d, 3s) ease-in-out infinite;
        }
        @keyframes twinkle {
          0%,100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }

        .horizon {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 140px;
          background: linear-gradient(to top, #FF6B35 0%, #FF8C42 15%, transparent 60%);
          opacity: 0.18;
          pointer-events: none;
        }

        .clouds { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
        .cloud-wrap {
          position: absolute;
          color: rgba(255,255,255,0.06);
          animation: driftCloud var(--dur, 22s) linear infinite;
        }
        @keyframes driftCloud {
          from { transform: translateX(-200px); }
          to   { transform: translateX(calc(100vw + 200px)); }
        }

        .card { position: relative; }

        .dest-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 26px;
        }
        .dest-emoji {
          font-size: 28px;
          line-height: 1;
          animation: popIn 0.35s cubic-bezier(.34,1.56,.64,1);
        }
        @keyframes popIn {
          from { transform: scale(0.4) rotate(-15deg); opacity: 0; }
          to   { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .dest-text { display: flex; flex-direction: column; }
        .dest-city {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          color: #fff;
          letter-spacing: 0.02em;
          animation: fadeSlide 0.4s ease;
        }
        .dest-country {
          font-size: 12px;
          color: rgba(255,255,255,0.45);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-top: 2px;
        }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .track-wrap { position: relative; margin-bottom: 26px; height: 56px; }
        .track-line {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: rgba(255,255,255,0.10);
        }
        .track-dots {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 4px;
        }
        .track-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          flex-shrink: 0;
        }
        .track-dot.passed { background: #FF6B35; box-shadow: 0 0 6px #FF6B35; }

        .plane-wrap {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 36px;
          height: 36px;
          color: #FF6B35;
          filter: drop-shadow(0 0 8px rgba(255,107,53,0.7));
          transition: left 0.3s ease;
        }
        .plane-trail {
          position: absolute;
          top: 50%;
          left: 0;
          height: 2px;
          background: linear-gradient(to right, transparent, rgba(255,107,53,0.5));
          transform: translateY(-50%);
          transition: width 0.3s ease;
        }

        .progress-label {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 10px;
        }
        .progress-title {
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
        }
        .progress-pct {
          font-size: 28px;
          font-family: 'Playfair Display', serif;
          color: #fff;
          letter-spacing: -0.02em;
        }
        .progress-track {
          height: 4px;
          background: rgba(255,255,255,0.08);
          border-radius: 99px;
          overflow: hidden;
          margin-bottom: 18px;
        }
        .progress-fill {
          height: 100%;
          border-radius: 99px;
          background: linear-gradient(to right, #FF6B35, #FFAD5F);
          box-shadow: 0 0 12px rgba(255,107,53,0.6);
          transition: width 0.2s ease;
          position: relative;
        }
        .progress-fill::after {
          content: '';
          position: absolute;
          right: 0;
          top: -4px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #FFAD5F;
          box-shadow: 0 0 10px rgba(255,173,95,0.9);
        }

        .status {
          font-size: 13.5px;
          color: rgba(255,255,255,0.55);
          min-height: 20px;
          animation: fadeSlide 0.4s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          padding-left: 2px;
        }
        .status-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #FF6B35;
          animation: pulse 1.4s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }

        .done-overlay {
          position: absolute;
          inset: 0;
          border-radius: 28px;
          background: rgba(11,26,46,0.92);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          animation: fadeIn 0.5s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .done-check {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FF6B35, #FFAD5F);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          animation: popIn 0.5s cubic-bezier(.34,1.56,.64,1) 0.1s both;
        }
        .done-title { font-family: 'Playfair Display', serif; font-size: 22px; color: #fff; }
        .done-sub { font-size: 13px; color: rgba(255,255,255,0.45); }
        .done-btn {
          margin-top: 8px;
          padding: 12px 32px;
          border-radius: 99px;
          border: none;
          background: linear-gradient(to right, #FF6B35, #FFAD5F);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          letter-spacing: 0.04em;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .done-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,107,53,0.4); }

        .brand { margin-bottom: 28px; display: flex; align-items: center; gap: 10px; }
        .brand-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, #FF6B35, #FFAD5F);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }
        .brand-name { font-family: 'Playfair Display', serif; font-size: 18px; color: rgba(255,255,255,0.85); letter-spacing: 0.04em; }
      `}</style>

      <div className="overlay">
        <div className="wrapper">
        <div className="stars">
          {stars.map((s) => (
            <div
              key={s.i}
              className="star"
              style={{
                left: `${s.left}%`,
                top: `${s.top}%`,
                "--d": `${s.dur}s`,
                animationDelay: `${s.delay}s`,
                width: `${s.size}px`,
                height: `${s.size}px`,
              } as React.CSSProperties}
            />
          ))}
        </div>

        <div className="horizon" />

        <div className="clouds">
          {[
            { top: "20%", width: 140, dur: 28, delay: 0 },
            { top: "35%", width: 100, dur: 22, delay: -8 },
            { top: "55%", width: 180, dur: 34, delay: -15 },
            { top: "70%", width: 120, dur: 26, delay: -4 },
          ].map((c, i) => (
            <div
              key={i}
              className="cloud-wrap"
              style={{
                top: c.top,
                width: c.width,
                "--dur": `${c.dur}s`,
                animationDelay: `${c.delay}s`,
              } as React.CSSProperties}
            >
              <Cloud style={{ width: "100%", height: "auto" }} />
            </div>
          ))}
        </div>

        <div className="card">
          <div className="brand">
            <div className="brand-icon">✈</div>
            <span className="brand-name">{brandName}</span>
          </div>

          <div className="dest-badge">
            <span className="dest-emoji" key={destIdx}>
              {dest.emoji}
            </span>
            <div className="dest-text">
              <span className="dest-city" key={`city-${destIdx}`}>
                {dest.city}
              </span>
              <span className="dest-country">{dest.country}</span>
            </div>
          </div>

          <div className="track-wrap">
            <div className="track-line" />
            <div className="plane-trail" style={{ width: `calc(${progress}% - 18px)` }} />
            <div className="track-dots">
              {[0, 25, 50, 75, 100].map((p) => (
                <div key={p} className={`track-dot${progress >= p ? " passed" : ""}`} />
              ))}
            </div>
            <div className="plane-wrap" style={{ left: `calc(${progress}% - 18px)` }}>
              <PlaneSVG />
            </div>
          </div>

          <div className="progress-label">
            <span className="progress-title">{progressTitle}</span>
            <span className="progress-pct">{Math.floor(progress)}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <div className="status" key={msgIdx}>
            {!done && <span className="status-dot" />}
            {done ? statusDoneText : statusLoadingMessages[msgIdx]}
          </div>

          {done && showDoneOverlay && (
            <div className="done-overlay">
              <div className="done-check">✓</div>
              <div className="done-title">{doneTitle}</div>
              <div className="done-sub">{doneSubtitle}</div>
              <button
                className="done-btn"
                type="button"
                onClick={() => {
                  onReset?.();
                  // active는 부모가 제어하는 구조이므로, 버튼 클릭은 콜백 호출 용도로만 둡니다.
                }}
              >
                {doneButtonText}
              </button>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
}

