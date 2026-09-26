export interface GelOption {
  name: string;
  /** 舞台图与场景预览用的显示颜色 */
  color: string;
}

export const GELS: GelOption[] = [
  { name: "无（白光）", color: "#e2e8f0" },
  { name: "R80 冷蓝", color: "#3b82f6" },
  { name: "L203 青", color: "#06b6d4" },
  { name: "R09 暖黄", color: "#f59e0b" },
  { name: "R26 暖红", color: "#ef4444" },
  { name: "G235 绿", color: "#22c55e" },
  { name: "R54 紫", color: "#7c3aed" }
];

export function gelColor(name: string): string {
  return GELS.find((gel) => gel.name === name)?.color ?? "#e2e8f0";
}
