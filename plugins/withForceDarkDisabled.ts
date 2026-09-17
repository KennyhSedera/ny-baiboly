const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withForceDarkDisabled(config: any) {
  return withAndroidManifest(config, (config: any) => {
    const application = config.modResults.manifest.application[0];
    application.$['android:forceDarkAllowed'] = 'false';
    return config;
  });
};