import { gelColor } from "../data/gels";
import { cueLabel } from "../domain/rules";
import type { Cue, Fixture } from "../domain/types";

interface ScenePreviewProps {
  cue: Cue | null;
  cueIndex: number;
  fixtures: Fixture[];
  onSelect: (fixtureId: string) => void;
}

/** 当前场景预览：随灯具调整实时更新 */
export function ScenePreview({ cue, cueIndex, fixtures, onSelect }: ScenePreviewProps) {
  return (
    <section className="panel scene-panel">
      <div className="heading">
        <div>
          <p>当前场景</p>
          <h2>{cue ? `${cueLabel(cueIndex)} · ${cue.name}` : "未选择 Cue"}</h2>
        </div>
      </div>
      {fixtures.length === 0 ? (
        <p className="empty-hint">该 Cue 尚未引用灯具。</p>
      ) : (
        <div className="scene-list">
          {fixtures.map((fixture) => (
            <button
              key={fixture.id}
              className="scene-row"
              onClick={() => onSelect(fixture.id)}
              title="点击选中该灯具"
            >
              <i
                className="scene-swatch"
                style={{ background: gelColor(fixture.gel) }}
                aria-hidden
              />
              <span className="scene-id">{fixture.id}</span>
              <span className="scene-meta">
                {fixture.channel} · {fixture.gel} · {fixture.focus || "焦点未定"}
              </span>
              <span className="scene-bar" aria-label={`亮度 ${fixture.intensity}%`}>
                <i style={{ width: `${fixture.intensity}%` }} />
              </span>
              <span className="scene-intensity">{fixture.intensity}%</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
