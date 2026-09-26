import type { Cue, Fixture, ShowDraft } from "./types";

/** Cue 序号由列表位置派生，增删排序后天然保持连续（Cue 01、02、03…） */
export function cueLabel(index: number): string {
  return `Cue ${String(index + 1).padStart(2, "0")}`;
}

export function nextCueId(cues: Cue[]): string {
  let n = cues.length + 1;
  const ids = new Set(cues.map((cue) => cue.id));
  while (ids.has(`cue-${n}`)) n += 1;
  return `cue-${n}`;
}

export function addCue(cues: Cue[]): { cues: Cue[]; created: Cue } {
  const created: Cue = {
    id: nextCueId(cues),
    name: "新Cue（待命名）",
    note: "",
    fixtureIds: []
  };
  return { cues: [...cues, created], created };
}

export function renameCue(cues: Cue[], cueId: string, name: string): Cue[] {
  const trimmed = name.trim();
  if (!trimmed) return cues;
  return cues.map((cue) => (cue.id === cueId ? { ...cue, name: trimmed } : cue));
}

/** 上移/下移一位；越界时原样返回，顺序不变 */
export function moveCue(cues: Cue[], cueId: string, direction: -1 | 1): Cue[] {
  const index = cues.findIndex((cue) => cue.id === cueId);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= cues.length) return cues;
  const next = [...cues];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function updateFixture(
  fixtures: Fixture[],
  fixtureId: string,
  patch: Partial<Omit<Fixture, "id">>
): Fixture[] {
  return fixtures.map((fixture) =>
    fixture.id === fixtureId ? { ...fixture, ...patch } : fixture
  );
}

export interface CueReference {
  cue: Cue;
  /** 在列表中的位置（0 起），用于显示连续序号 */
  index: number;
}

/** 找出所有引用了某灯具的 Cue */
export function cuesUsingFixture(cues: Cue[], fixtureId: string): CueReference[] {
  return cues
    .map((cue, index) => ({ cue, index }))
    .filter(({ cue }) => cue.fixtureIds.includes(fixtureId));
}

export type RemoveFixtureResult =
  | { ok: true; fixtures: Fixture[] }
  | { ok: false; blockers: CueReference[] };

/**
 * 移除灯具的守卫：只要还有 Cue 引用该灯具，就拒绝移除并返回相关 Cue，
 * 灯具列表与 Cue 顺序都保持原样。
 */
export function removeFixture(draft: ShowDraft, fixtureId: string): RemoveFixtureResult {
  const blockers = cuesUsingFixture(draft.cues, fixtureId);
  if (blockers.length > 0) {
    return { ok: false, blockers };
  }
  return { ok: true, fixtures: draft.fixtures.filter((f) => f.id !== fixtureId) };
}

export function clampIntensity(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

/** 焦点留空或标注「待确认」的灯具数量 */
export function pendingFocusCount(fixtures: Fixture[]): number {
  return fixtures.filter(
    (fixture) => fixture.focus.trim() === "" || fixture.focus.includes("待确认")
  ).length;
}
