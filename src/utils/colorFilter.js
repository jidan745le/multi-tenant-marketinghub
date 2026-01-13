/**
 * 根据主题色生成 CSS filter 的函数
 * 用于将 SVG 图标颜色转换为指定的主题色
 * 
 * @param {string} hexColor - 十六进制颜色值
 * @returns {string} CSS filter 字符串
 */
export const getColorFilter = (hexColor) => {
  if (!hexColor) return 'brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(346deg) brightness(118%) contrast(118%)';
  
  // 将十六进制颜色转换为 RGB
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  // 计算 HSL 的 Hue（色相）
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  
  if (max !== min) {
    const delta = max - min;
    if (max === r) {
      h = (((g - b) / delta) % 6) * 60;
    } else if (max === g) {
      h = ((b - r) / delta + 2) * 60;
    } else {
      h = ((r - g) / delta + 4) * 60;
    }
  }
  if (h < 0) h += 360;
  
  // 计算亮度和饱和度
  const l = (max + min) / 2;
  const s = max === min ? 0 : (max - min) / (1 - Math.abs(2 * l - 1));

  const orangeHue = 35;
  const hueRotate = Math.round(h - orangeHue);
  
  const invertValue = Math.round((1 - l) * 100);
  const sepiaValue = Math.round(Math.min(s * 100, 100));
  const saturateValue = Math.round(Math.min(s * 2000, 3000));
  
  // 根据色相动态调整亮度值
  let brightnessValue;
  let contrastValue;
  
  if (h >= 100 && h <= 160) {
    // 绿：降低亮度
    brightnessValue = l > 0.5 ? 0.95 : 0.85;
    contrastValue = 1.0;
  } else if (h >= 20 && h <= 50) {
    // 橙：保持较高亮度
    brightnessValue = l > 0.5 ? 1.15 : 1.05;
    contrastValue = 1.05;
  } else {
    // 其他颜色：使用中等亮度
    brightnessValue = l > 0.5 ? 1.05 : 0.95;
    contrastValue = 1.05;
  }
  
  return `brightness(0) saturate(100%) invert(${invertValue}%) sepia(${sepiaValue}%) saturate(${saturateValue}%) hue-rotate(${hueRotate}deg) brightness(${brightnessValue}) contrast(${contrastValue})`;
};

