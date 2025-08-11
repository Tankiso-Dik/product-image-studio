function buildControllers(src = {}) {
  const controllers = {
    addressBar: src.addressBar ?? src.url,
    mainHeading: src.mainHeading ?? src.title,
    subHeading: src.subHeading ?? src.subtitle,
    brandIcon: src.brandIcon ?? src.icon,
    browserScreenshot: src.browserScreenshot ?? src.image,
    browserScreenshotLeft: src.browserScreenshotLeft ?? src.imageLeft,
    browserScreenshotRight: src.browserScreenshotRight ?? src.imageRight,
    theme: src.theme ?? src.background,
    themeColor: src.themeColor ?? src.bgcolor,
  };
  for (let i = 1; i <= 4; i++) {
    const bsKey = `browserScreenshot${i}`;
    const slKey = `stepLabel${i}`;
    const stKey = `stepText${i}`;
    if (Object.prototype.hasOwnProperty.call(src, bsKey)) controllers[bsKey] = src[bsKey];
    if (Object.prototype.hasOwnProperty.call(src, slKey)) controllers[slKey] = src[slKey];
    if (Object.prototype.hasOwnProperty.call(src, stKey)) controllers[stKey] = src[stKey];
  }
  Object.keys(controllers).forEach((k) => controllers[k] == null && delete controllers[k]);
  return controllers;
}

module.exports = { buildControllers };
