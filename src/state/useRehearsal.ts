import { useEffect, useMemo, useState } from "react";
import { SEED_DRAFT } from "../data/seed";
import {
  addCue as addCueRule,
  clampIntensity,
  cuesUsingFixture,
  moveCue as moveCueRule,
  pendingFocusCount,
  removeFixture as removeFixtureRule,
  renameCue as renameCueRule,
  updateFixture as updateFixtureRule,
  type CueReference
} from "../domain/rules";
import type { Fixture, LightPosition, ShowDraft } from "../domain/types";
import { clearDraft, loadDraft, saveDraft } from "./draft";

export interface BlockedRemoval {
  fixture: Fixture;
  references: CueReference[];
}

export function useRehearsal() {
  const [draft, setDraft] = useState<ShowDraft>(() => loadDraft() ?? SEED_DRAFT);
  const [positionFilter, setPositionFilter] = useState<LightPosition | "全部">("全部");
  const [selectedFixtureId, setSelectedFixtureId] = useState<string | null>(
    draft.fixtures[0]?.id ?? null
  );
  const [blockedRemoval, setBlockedRemoval] = useState<BlockedRemoval | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  // 排演调整自动落盘为本地草稿（轻微防抖，避免拖动亮度条时频繁写入）
  useEffect(() => {
    const timer = window.setTimeout(() => {
      saveDraft(draft);
      setSavedAt(new Date().toLocaleTimeString("zh-CN", { hour12: false }));
    }, 400);
    return () => window.clearTimeout(timer);
  }, [draft]);

  const visibleFixtures = useMemo(
    () =>
      positionFilter === "全部"
        ? draft.fixtures
        : draft.fixtures.filter((fixture) => fixture.position === positionFilter),
    [draft.fixtures, positionFilter]
  );

  const selectedFixture =
    draft.fixtures.find((fixture) => fixture.id === selectedFixtureId) ?? null;

  const currentCueIndex = draft.cues.findIndex((cue) => cue.id === draft.currentCueId);
  const currentCue = currentCueIndex >= 0 ? draft.cues[currentCueIndex] : null;

  const currentCueFixtures = useMemo(() => {
    if (!currentCue) return [];
    return currentCue.fixtureIds
      .map((id) => draft.fixtures.find((fixture) => fixture.id === id))
      .filter((fixture): fixture is Fixture => Boolean(fixture));
  }, [currentCue, draft.fixtures]);

  const metrics = useMemo(
    () => ({
      fixtureCount: draft.fixtures.length,
      cueCount: draft.cues.length,
      pendingFocus: pendingFocusCount(draft.fixtures)
    }),
    [draft.fixtures, draft.cues]
  );

  function patchFixture(fixtureId: string, patch: Partial<Omit<Fixture, "id">>): void {
    const nextPatch =
      patch.intensity !== undefined
        ? { ...patch, intensity: clampIntensity(patch.intensity) }
        : patch;
    setDraft((prev) => ({
      ...prev,
      fixtures: updateFixtureRule(prev.fixtures, fixtureId, nextPatch)
    }));
  }

  /** 请求移除灯具：被 Cue 引用时弹出阻挡提示，灯具与 Cue 顺序保持原样 */
  function requestRemoveFixture(fixtureId: string): void {
    const result = removeFixtureRule(draft, fixtureId);
    if (!result.ok) {
      const fixture = draft.fixtures.find((f) => f.id === fixtureId);
      if (fixture) setBlockedRemoval({ fixture, references: result.blockers });
      return;
    }
    setDraft((prev) => ({ ...prev, fixtures: result.fixtures }));
    if (selectedFixtureId === fixtureId) {
      const remaining = result.fixtures;
      setSelectedFixtureId(remaining[0]?.id ?? null);
    }
  }

  function addCue(): void {
    setDraft((prev) => {
      const { cues, created } = addCueRule(prev.cues);
      return { ...prev, cues, currentCueId: created.id };
    });
  }

  function renameCue(cueId: string, name: string): void {
    setDraft((prev) => ({ ...prev, cues: renameCueRule(prev.cues, cueId, name) }));
  }

  function moveCue(cueId: string, direction: -1 | 1): void {
    setDraft((prev) => ({ ...prev, cues: moveCueRule(prev.cues, cueId, direction) }));
  }

  function setCurrentCue(cueId: string): void {
    setDraft((prev) => ({ ...prev, currentCueId: cueId }));
  }

  function updateShowMeta(patch: Partial<Pick<ShowDraft, "showName" | "versionNote">>): void {
    setDraft((prev) => ({ ...prev, ...patch }));
  }

  /** 放弃本地草稿，恢复初始演出数据 */
  function resetDraft(): void {
    clearDraft();
    setDraft(SEED_DRAFT);
    setBlockedRemoval(null);
    setSelectedFixtureId(SEED_DRAFT.fixtures[0]?.id ?? null);
    setPositionFilter("全部");
  }

  return {
    draft,
    metrics,
    positionFilter,
    setPositionFilter,
    visibleFixtures,
    selectedFixture,
    selectFixture: setSelectedFixtureId,
    currentCue,
    currentCueIndex,
    currentCueFixtures,
    blockedRemoval,
    dismissBlockedRemoval: () => setBlockedRemoval(null),
    savedAt,
    patchFixture,
    requestRemoveFixture,
    addCue,
    renameCue,
    moveCue,
    setCurrentCue,
    updateShowMeta,
    resetDraft,
    referencesOf: (fixtureId: string) => cuesUsingFixture(draft.cues, fixtureId)
  };
}
