import { gelColor } from "../data/gels";
import type { Cue, Fixture, LightPosition } from "../domain/types";

interface StagePlotProps {
  fixtures: Fixture[];
  visibleIds: Set<string>;
  currentCue: Cue | null;
  selectedId: string | null;
  filter: LightPosition | "全部";
  onSelect: (fixtureId: string) => void;
}

/** 舞台平面图：点击灯位选中灯具，颜色随色片、亮度随强度实时变化 */
export function StagePlot({
  fixtures,
  visibleIds,
  currentCue,
  selectedId,
  filter,
  onSelect
}: StagePlotProps) {
  const inCue = new Set(currentCue?.fixtureIds ?? []);

  return (
    <div className="stage-plot">
      <svg viewBox="0 0 100 64" role="img" aria-label="舞台平面灯位图">
        {/* 观众席 / FOH 区 */}
        <rect x="0" y="0" width="100" height="11" rx="1.5" className="plot-foh" />
        <text x="50" y="7.5" className="plot-zone-label">
          观众席 · 面光吊杆
        </text>
        {/* 舞台区 */}
        <rect x="4" y="14" width="92" height="46" rx="1.5" className="plot-stage" />
        <text x="50" y="18.5" className="plot-zone-label">
          舞台（上）
        </text>
        <line x1="4" y1="56" x2="96" y2="56" className="plot-apron" />
        <text x="50" y="59.5" className="plot-zone-label">
          台唇（下）
        </text>

        {fixtures.map((fixture) => {
          const dimmed = !visibleIds.has(fixture.id);
          const selected = fixture.id === selectedId;
          const active = inCue.has(fixture.id);
          const radius = 2.2 + (fixture.intensity / 100) * 1.6;
          return (
            <g
              key={fixture.id}
              className={`plot-fixture${dimmed ? " is-dimmed" : ""}`}
              onClick={() => onSelect(fixture.id)}
            >
              {active && (
                <circle
                  cx={fixture.x}
                  cy={fixture.y}
                  r={radius + 2.2}
                  className="plot-halo"
                  style={{ fill: gelColor(fixture.gel) }}
                />
              )}
              <circle
                cx={fixture.x}
                cy={fixture.y}
                r={radius}
                className={`plot-dot${selected ? " is-selected" : ""}`}
                style={{
                  fill: gelColor(fixture.gel),
                  fillOpacity: 0.35 + (fixture.intensity / 100) * 0.65
                }}
              />
              <text x={fixture.x} y={fixture.y + radius + 3.4} className="plot-label">
                {fixture.id}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="plot-legend">
        {filter === "全部" ? "显示全部光位" : `仅显示「${filter}」，其余光位已淡化`}
        {currentCue ? ` · 光圈为当前场景「${currentCue.name}」引用灯具` : ""}
        ，圆点大小/深浅随亮度变化
      </p>
    </div>
  );
}
