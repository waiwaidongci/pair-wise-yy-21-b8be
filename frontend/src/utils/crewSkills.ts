// 班组技能标签以逗号分隔存储
export const parseSkillTags = (raw: string): string[] =>
  raw.split(/[,，]/).map((tag) => tag.trim()).filter(Boolean);
