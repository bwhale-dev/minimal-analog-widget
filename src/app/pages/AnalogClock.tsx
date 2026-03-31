import React, { useMemo } from 'react';

interface AnalogClockProps {
  time: Date;
  size?: number; // 時計の大きさ（px）
}

export function AnalogClock({ time, size = 120 }: AnalogClockProps) {
  const { hours, minutes, seconds } = useMemo(() => {
    return {
      hours: time.getHours() % 12,
      minutes: time.getMinutes(),
      seconds: time.getSeconds(),
    };
  }, [time]);

  // 針の回転角度を計算
  const secondAngle = (seconds * 6); // 秒: 360 / 60 = 6度 per second
  const minuteAngle = (minutes * 6) + (seconds * 0.1); // 分: 6度 per minute
  const hourAngle = (hours * 30) + (minutes * 0.5); // 時: 30度 per hour

  const radius = size / 2;
  const centerX = radius;
  const centerY = radius;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{
        filter: 'url(#roughEdges)',
      }}
    >
      {/* 時計の外枠（背景透過） */}
      <circle cx={centerX} cy={centerY} r={radius - 2} fill="none" stroke="black" strokeWidth="5" />

      {/* 時間マーカー */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30) * (Math.PI / 180);
        const x1 = centerX + Math.sin(angle) * (radius - 8);
        const y1 = centerY - Math.cos(angle) * (radius - 8);
        const x2 = centerX + Math.sin(angle) * (radius - 2);
        const y2 = centerY - Math.cos(angle) * (radius - 2);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="black"
            strokeWidth="3"
          />
        );
      })}

      {/* 時針（短い） */}
      <line
        x1={centerX}
        y1={centerY}
        x2={centerX + Math.sin((hourAngle) * (Math.PI / 180)) * (radius * 0.5)}
        y2={centerY - Math.cos((hourAngle) * (Math.PI / 180)) * (radius * 0.5)}
        stroke="black"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* 分針（長い） */}
      <line
        x1={centerX}
        y1={centerY}
        x2={centerX + Math.sin((minuteAngle) * (Math.PI / 180)) * (radius * 0.7)}
        y2={centerY - Math.cos((minuteAngle) * (Math.PI / 180)) * (radius * 0.7)}
        stroke="black"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* 秒針（赤色） */}
      <line
        x1={centerX}
        y1={centerY}
        x2={centerX + Math.sin((secondAngle) * (Math.PI / 180)) * (radius * 0.75)}
        y2={centerY - Math.cos((secondAngle) * (Math.PI / 180)) * (radius * 0.75)}
        stroke="#ff0000"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* 中心の円 */}
      <circle cx={centerX} cy={centerY} r="4" fill="black" />
    </svg>
  );
}
