"use client";

import { useEffect, useRef, useState } from "react";
import "./css/admin-loading-ui.css";

type AdminLoadingDestination = {
  city: string;
  country: string;
  emoji: string;
};

type AdminLoadingUIProps = {
  active: boolean;
  progressTitle?: string;
  statusLoadingMessages?: string[];
  statusDoneText?: string;

  destinations?: AdminLoadingDestination[];
  /** 단순 UI에서는 표시하지 않습니다(호환용). */
  brandName?: string;

  doneTitle?: string;
  doneSubtitle?: string;
  doneButtonText?: string;

  showDoneOverlay?: boolean;
  onReset?: () => void;
};

const DOT_THRESHOLDS = [0, 25, 50, 75, 100] as const;

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

  const [visible, setVisible] = useState(false);
  const startedAtRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (active) {
      startedAtRef.current = Date.now();
      queueMicrotask(() => setVisible(true));

      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }

      return;
    }

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
    queueMicrotask(() => {
      setProgress(0);
      setMsgIdx(0);
      setDestIdx(0);
      setDone(false);
    });
  }, [active]);

  useEffect(() => {
    if (!active || done) return;

    const id = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100;
        const next = Math.min(100, p + 0.6);
        if (next >= 100) {
          queueMicrotask(() => setDone(true));
        }
        return next;
      });
    }, 30);

    return () => clearInterval(id);
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
    <div className="admin-loading-root fixed inset-0 z-9999 flex min-h-[300px] items-center justify-center bg-black/35 p-8">
      <div className="border-border/80 bg-card relative w-full max-w-[460px] rounded-lg border px-7 pt-7 pb-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-muted-foreground text-[13px] font-medium">{progressTitle}</span>
          <span className="text-foreground text-[13px] font-medium">{Math.floor(progress)}%</span>
        </div>

        <div className="bg-muted mb-5 h-1 overflow-hidden rounded-sm">
          <div
            className="bg-foreground h-full rounded-sm transition-[width] duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="bg-muted/60 mb-[18px] flex items-center gap-3.5 rounded-md px-4 py-3.5">
          <span
            key={destIdx}
            className="admin-loading-fade-slide shrink-0 text-[22px] leading-none"
          >
            {dest.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <div
              key={`city-${destIdx}`}
              className="admin-loading-fade-slide text-foreground text-sm font-medium"
            >
              {dest.city}
            </div>
            <div className="text-muted-foreground mt-px text-xs">{dest.country}</div>
          </div>
          <div className="ml-auto flex shrink-0 gap-1">
            {DOT_THRESHOLDS.map((t) => (
              <div
                key={t}
                className={`size-[5px] rounded-full ${
                  progress >= t ? "bg-foreground" : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="text-muted-foreground flex min-h-[18px] items-center gap-1.5 text-[12.5px]">
          <span
            className={`size-[5px] shrink-0 rounded-full ${
              done ? "bg-emerald-600" : "bg-muted-foreground admin-loading-status-dot--blink"
            }`}
          />
          <span key={msgIdx} className="admin-loading-fade-slide-short">
            {done ? statusDoneText : statusLoadingMessages[msgIdx]}
          </span>
        </div>

        {done && showDoneOverlay && (
          <div className="bg-background/95 absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-lg p-6 backdrop-blur-sm">
            <div className="bg-primary text-primary-foreground flex size-14 items-center justify-center rounded-full text-2xl">
              ✓
            </div>
            <div className="text-center">
              <p className="text-foreground text-lg font-semibold">{doneTitle}</p>
              <p className="text-muted-foreground mt-1 text-sm">{doneSubtitle}</p>
            </div>
            <button
              type="button"
              className="bg-primary text-primary-foreground mt-1 rounded-full px-8 py-2.5 text-sm font-medium transition hover:opacity-90"
              onClick={() => onReset?.()}
            >
              {doneButtonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
