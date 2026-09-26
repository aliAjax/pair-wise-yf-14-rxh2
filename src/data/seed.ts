import type { ShowDraft } from "../domain/types";

/**
 * 初始演出数据。排演期间的修改只写入本地草稿，
 * 这里的种子数据保持不变，用于「重置草稿」。
 */
export const SEED_DRAFT: ShowDraft = {
  showName: "《夜航》二幕排演版",
  versionNote: "版本B · 二幕开场冷色调，谢幕待导演确认",
  currentCueId: "cue-1",
  fixtures: [
    { id: "FOH-01", position: "面光", channel: "CH 021", gel: "R09 暖黄", focus: "舞台中前区", intensity: 80, x: 30, y: 6 },
    { id: "FOH-02", position: "面光", channel: "CH 022", gel: "R09 暖黄", focus: "舞台中区", intensity: 80, x: 50, y: 6 },
    { id: "FOH-03", position: "面光", channel: "CH 023", gel: "无（白光）", focus: "门口（待确认）", intensity: 65, x: 70, y: 6 },
    { id: "BOOM-L1", position: "侧光", channel: "CH 031", gel: "R80 冷蓝", focus: "左侧走廊", intensity: 65, x: 8, y: 30 },
    { id: "BOOM-L2", position: "侧光", channel: "CH 032", gel: "R80 冷蓝", focus: "左后区", intensity: 60, x: 8, y: 46 },
    { id: "BOOM-R1", position: "侧光", channel: "CH 033", gel: "L203 青", focus: "右侧走廊", intensity: 65, x: 92, y: 30 },
    { id: "BACK-01", position: "逆光", channel: "CH 041", gel: "R54 紫", focus: "天幕前区", intensity: 55, x: 38, y: 20 },
    { id: "BACK-02", position: "逆光", channel: "CH 042", gel: "R54 紫", focus: "天幕中区", intensity: 55, x: 62, y: 20 },
    { id: "FX-01", position: "效果光", channel: "CH 051", gel: "G235 绿", focus: "地板纹理（待确认）", intensity: 40, x: 24, y: 52 },
    { id: "FX-02", position: "效果光", channel: "CH 052", gel: "R26 暖红", focus: "谢幕扫台", intensity: 70, x: 76, y: 52 }
  ],
  cues: [
    { id: "cue-1", name: "冷蓝侧光", note: "二幕开场", fixtureIds: ["BOOM-L1", "BOOM-L2", "BOOM-R1"] },
    { id: "cue-2", name: "追光入场", note: "需演员走位确认", fixtureIds: ["FOH-03", "BACK-01"] },
    { id: "cue-3", name: "天幕独白", note: "逆光压暗侧光", fixtureIds: ["BACK-01", "BACK-02", "BOOM-L2"] },
    { id: "cue-4", name: "暖色谢幕", note: "全台面光80%", fixtureIds: ["FOH-01", "FOH-02", "FOH-03", "FX-02"] }
  ]
};
