import { useState } from "react";
import { cueLabel } from "../domain/rules";
import type { Cue } from "../domain/types";

interface CueListProps {
  cues: Cue[];
  currentCueId: string;
  onAdd: () => void;
  onRename: (cueId: string, name: string) => void;
  onMove: (cueId: string, direction: -1 | 1) => void;
  onSetCurrent: (cueId: string) => void;
}

/** Cue 列表：新增、改名、上下排序；序号由位置派生，始终连续 */
export function CueList({ cues, currentCueId, onAdd, onRename, onMove, onSetCurrent }: CueListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  function startRename(cue: Cue) {
    setEditingId(cue.id);
    setEditingName(cue.name);
  }

  function commitRename() {
    if (editingId) onRename(editingId, editingName);
    setEditingId(null);
  }

  return (
    <section className="panel cue-panel">
      <div className="heading">
        <div>
          <p>触发顺序</p>
          <h2>Cue 列表</h2>
        </div>
        <button className="primary" onClick={onAdd}>
          + 新增 Cue
        </button>
      </div>
      <div className="cue-list">
        {cues.map((cue, index) => {
          const isCurrent = cue.id === currentCueId;
          const isEditing = cue.id === editingId;
          return (
            <article key={cue.id} className={`cue-row${isCurrent ? " is-current" : ""}`}>
              <b className="cue-no">{cueLabel(index)}</b>
              <div className="cue-main">
                {isEditing ? (
                  <input
                    autoFocus
                    value={editingName}
                    aria-label="Cue 名称"
                    onChange={(event) => setEditingName(event.target.value)}
                    onBlur={commitRename}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") commitRename();
                      if (event.key === "Escape") setEditingId(null);
                    }}
                  />
                ) : (
                  <h3>{cue.name}</h3>
                )}
                <p>
                  {cue.note || "（无备注）"} · 引用 {cue.fixtureIds.length} 台灯具：
                  {cue.fixtureIds.join("、") || "无"}
                </p>
              </div>
              <div className="cue-actions">
                <button
                  aria-label="上移"
                  disabled={index === 0}
                  onClick={() => onMove(cue.id, -1)}
                >
                  ↑
                </button>
                <button
                  aria-label="下移"
                  disabled={index === cues.length - 1}
                  onClick={() => onMove(cue.id, 1)}
                >
                  ↓
                </button>
                {isEditing ? (
                  <button onClick={commitRename}>完成</button>
                ) : (
                  <button onClick={() => startRename(cue)}>改名</button>
                )}
                <button
                  className={isCurrent ? "current-btn is-on" : "current-btn"}
                  disabled={isCurrent}
                  onClick={() => onSetCurrent(cue.id)}
                >
                  {isCurrent ? "当前场景" : "设为当前"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
