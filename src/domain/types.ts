export type LightPosition = "面光" | "侧光" | "逆光" | "效果光";

export const LIGHT_POSITIONS: LightPosition[] = ["面光", "侧光", "逆光", "效果光"];

export interface Fixture {
  /** 灯具编号，如 FOH-01 */
  id: string;
  /** 光位 */
  position: LightPosition;
  /** 通道号，如 CH 021 */
  channel: string;
  /** 色片名称，对应 data/gels.ts */
  gel: string;
  /** 焦点位置 */
  focus: string;
  /** 亮度预设 0-100 */
  intensity: number;
  /** 舞台平面图坐标（百分比，0-100） */
  x: number;
  y: number;
}

export interface Cue {
  id: string;
  name: string;
  note: string;
  /** 该 Cue 引用的灯具编号 */
  fixtureIds: string[];
}

/** 一份排演草稿的全部可持久化数据 */
export interface ShowDraft {
  showName: string;
  versionNote: string;
  currentCueId: string;
  fixtures: Fixture[];
  cues: Cue[];
}
