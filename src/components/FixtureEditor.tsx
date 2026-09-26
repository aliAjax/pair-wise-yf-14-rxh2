import { GELS } from "../data/gels";
import type { CueReference } from "../domain/rules";
import { cueLabel } from "../domain/rules";
import type { Fixture } from "../domain/types";

interface FixtureEditorProps {
  fixture: Fixture | null;
  references: CueReference[];
  onPatch: (fixtureId: string, patch: Partial<Omit<Fixture, "id">>) => void;
  onRemove: (fixtureId: string) => void;
}

/** 灯具编辑：通道、色片、焦点、亮度；修改即时反映到舞台图与当前场景 */
export function FixtureEditor({ fixture, references, onPatch, onRemove }: FixtureEditorProps) {
  if (!fixture) {
    return (
      <section className="panel editor-panel">
        <h2>灯具调整</h2>
        <p className="empty-hint">在舞台图或灯具列表中选择一台灯具开始调整。</p>
      </section>
    );
  }

  return (
    <section className="panel editor-panel">
      <div className="heading">
        <div>
          <p>{fixture.position}</p>
          <h2>{fixture.id}</h2>
        </div>
        <button className="danger" onClick={() => onRemove(fixture.id)}>
          移除灯具
        </button>
      </div>

      <div className="field-grid">
        <label>
          <span>通道号</span>
          <input
            value={fixture.channel}
            onChange={(event) => onPatch(fixture.id, { channel: event.target.value })}
          />
        </label>
        <label>
          <span>色片</span>
          <select
            value={fixture.gel}
            onChange={(event) => onPatch(fixture.id, { gel: event.target.value })}
          >
            {GELS.map((gel) => (
              <option key={gel.name} value={gel.name}>
                {gel.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>焦点位置</span>
          <input
            value={fixture.focus}
            placeholder="如：舞台中前区"
            onChange={(event) => onPatch(fixture.id, { focus: event.target.value })}
          />
        </label>
        <label>
          <span>亮度预设（{fixture.intensity}%）</span>
          <input
            type="range"
            min={0}
            max={100}
            value={fixture.intensity}
            onChange={(event) => onPatch(fixture.id, { intensity: Number(event.target.value) })}
          />
        </label>
      </div>

      {references.length > 0 && (
        <p className="ref-hint">
          被 {references.length} 条 Cue 引用：
          {references.map(({ cue, index }) => `${cueLabel(index)} ${cue.name}`).join("、")}
          ，移除前需先调整这些 Cue。
        </p>
      )}
    </section>
  );
}
