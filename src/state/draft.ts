import type { ShowDraft } from "../domain/types";

const STORAGE_KEY = "hxyfront-62002.rehearsal-draft";

/** 读取本地草稿；没有或数据损坏时返回 null，由调用方回退到种子数据 */
export function loadDraft(): ShowDraft | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ShowDraft;
    if (!Array.isArray(parsed.fixtures) || !Array.isArray(parsed.cues)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveDraft(draft: ShowDraft): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // 存储被禁用或已满时静默失败，界面仍保留内存中的状态
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // 同上
  }
}
