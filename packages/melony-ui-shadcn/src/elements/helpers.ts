// Helper function to darken a hex color
export const darkenColor = (color: string, amount: number): string => {
  const num = parseInt(color.replace("#", ""), 16);
  const r = Math.max(0, ((num >> 16) & 0xff) - amount);
  const g = Math.max(0, ((num >> 8) & 0xff) - amount);
  const b = Math.max(0, (num & 0xff) - amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
};

export const widthMap: Record<string, string> = {
  full: "w-full",
  auto: "w-auto",
  "1/2": "w-1/2",
  "1/3": "w-1/3",
  "2/3": "w-2/3",
  "1/4": "w-1/4",
  "3/4": "w-3/4",
};