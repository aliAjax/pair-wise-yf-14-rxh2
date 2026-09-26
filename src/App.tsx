import { CueList } from "./components/CueList";
import { FixtureEditor } from "./components/FixtureEditor";
import { ScenePreview } from "./components/ScenePreview";
import { StagePlot } from "./components/StagePlot";
import { cueLabel } from "./domain/rules";
import { LIGHT_POSITIONS } from "./domain/types";
import { useRehearsal } from "./state/useRehearsal";
import "./styles.css";

function App() {
  const rehearsal = useRehearsal();
  const { draft, metrics, blockedRemoval } = rehearsal;

  const visibleIds = new Set(rehearsal.visibleFixtures.map((fixture) => fixture.id));

  return (
    <main className="app">
      <section className="hero">
        <p>hxyfront-62002 · 排演模式</p>
        <h1>{draft.showName}</h1>
        <div className="hero-meta">
          <label>
            <span>演出名称</span>
            <input
              value={draft.showName}
              onChange={(event) => rehearsal.updateShowMeta({ showName: event.target.value })}
            />
          </label>
          <label>
            <span>演出版本备注</span>
            <input
              value={draft.versionNote}
              onChange={(event) => rehearsal.updateShowMeta({ versionNote: event.target.value })}
            />
          </label>
        </div>
        <div className="draft-bar">
          <span>{rehearsal.savedAt ? `草稿已保存到本地 · ${rehearsal.savedAt}` : "调整将自动存为本地草稿"}</span>
          <button onClick={rehearsal.resetDraft}>放弃草稿，恢复初始数据</button>
        </div>
      </section>

      <section className="metrics">
        <article>
          <small>灯具数量</small>
          <strong>{metrics.fixtureCount}</strong>
        </article>
        <article>
          <small>Cue数量</small>
          <strong>{metrics.cueCount}</strong>
        </article>
        <article>
          <small>当前场景</small>
          <strong>
            {rehearsal.currentCue ? cueLabel(rehearsal.currentCueIndex).replace("Cue ", "") : "—"}
          </strong>
        </article>
        <article>
          <small>待确认焦点</small>
          <strong>{metrics.pendingFocus}</strong>
        </article>
      </section>

      <section className="workspace">
        <aside className="panel">
          <h2>光位筛选</h2>
          <div className="chips">
            {["全部", ...LIGHT_POSITIONS].map((position) => (
              <button
                key={position}
                className={rehearsal.positionFilter === position ? "is-active" : ""}
                onClick={() => rehearsal.setPositionFilter(position as typeof rehearsal.positionFilter)}
              >
                {position}
              </button>
            ))}
          </div>
          <h2 className="fixture-list-title">灯具（{rehearsal.visibleFixtures.length}）</h2>
          <div className="fixture-list">
            {rehearsal.visibleFixtures.map((fixture) => (
              <button
                key={fixture.id}
                className={`fixture-item${
                  rehearsal.selectedFixture?.id === fixture.id ? " is-active" : ""
                }`}
                onClick={() => rehearsal.selectFixture(fixture.id)}
              >
                <b>{fixture.id}</b>
                <span>
                  {fixture.channel} · {fixture.intensity}%
                </span>
              </button>
            ))}
            {rehearsal.visibleFixtures.length === 0 && (
              <p className="empty-hint">该光位下暂无灯具。</p>
            )}
          </div>
        </aside>

        <section className="panel">
          <div className="heading">
            <div>
              <p>灯位图</p>
              <h2>舞台平面图</h2>
            </div>
          </div>
          <StagePlot
            fixtures={draft.fixtures}
            visibleIds={visibleIds}
            currentCue={rehearsal.currentCue}
            selectedId={rehearsal.selectedFixture?.id ?? null}
            filter={rehearsal.positionFilter}
            onSelect={rehearsal.selectFixture}
          />
        </section>

        <FixtureEditor
          fixture={rehearsal.selectedFixture}
          references={
            rehearsal.selectedFixture ? rehearsal.referencesOf(rehearsal.selectedFixture.id) : []
          }
          onPatch={rehearsal.patchFixture}
          onRemove={rehearsal.requestRemoveFixture}
        />
      </section>

      <section className="bottom-grid">
        <CueList
          cues={draft.cues}
          currentCueId={draft.currentCueId}
          onAdd={rehearsal.addCue}
          onRename={rehearsal.renameCue}
          onMove={rehearsal.moveCue}
          onSetCurrent={rehearsal.setCurrentCue}
        />
        <ScenePreview
          cue={rehearsal.currentCue}
          cueIndex={rehearsal.currentCueIndex}
          fixtures={rehearsal.currentCueFixtures}
          onSelect={rehearsal.selectFixture}
        />
      </section>

      {blockedRemoval && (
        <div className="modal-backdrop" role="alertdialog" aria-modal="true">
          <div className="modal">
            <h2>无法移除 {blockedRemoval.fixture.id}</h2>
            <p>以下 Cue 仍引用该灯具，移除已被阻止，灯具与 Cue 顺序保持原样：</p>
            <ul>
              {blockedRemoval.references.map(({ cue, index }) => (
                <li key={cue.id}>
                  <b>{cueLabel(index)}</b> {cue.name}
                  {cue.note ? `（${cue.note}）` : ""}
                </li>
              ))}
            </ul>
            <p className="modal-tip">请先在相关 Cue 中调整灯具引用，再移除该灯具。</p>
            <button className="primary" onClick={rehearsal.dismissBlockedRemoval}>
              知道了
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
