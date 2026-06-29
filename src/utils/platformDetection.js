// prettier-ignore
const KINDLE_DEVICES = /KFONWI|KFMAWI|KFSUWI|KFAUWI|KFDOWI|KFGIWI|KFFOWI|KFMEWI|KFTBWI|KFARWI|KFASWI|KFSAWA|KFSAWI|KFAPWA|KFAPWI|KFSOWI|KFJWA|KFTHWI|KFTHWA|KFJWI|KFTT|KFOT|SD4930UR|Kindle|Kindle Fire/i;
// https://en.wikipedia.org/wiki/Fire_HD
// https://docs.aws.amazon.com/silk/latest/developerguide/screen-size.html
const KINDLE_GENERATIONS = {
  KFONWI: { gen: 10, description: 'Fire HD 8, 8+ (10th Gen)' },

  KFMAWI: { gen: 9, description: 'Fire HD 10 (9th Gen)' },
  KFMUWI: { gen: 9, description: 'Fire 7 (9th Gen)' },

  KFKAWI: { gen: 8, description: 'Fire HD 8 (8th Gen)' },

  KFSUWI: { gen: 7, description: 'Fire 7 (7th Gen)' },
  KFAUWI: { gen: 7, description: 'Fire HD 10 (7th Gen)' },
  KFDOWI: { gen: 7, description: 'Fire HD 8 (7th Gen)' },

  KFGIWI: { gen: 6, description: 'Fire HD 8 (6th Gen)' },

  KFTBWI: { gen: 5, description: 'Fire HD 10 (5th Gen)' },
  KFMEWI: { gen: 5, description: 'Fire HD 8 (5th Gen)' },
  KFFOWI: { gen: 5, description: 'Fire (5th Gen)' },

  KFSAWI: { gen: 4, description: 'Fire HDX 8.9 (4th Gen)' },
  KFSAWA: { gen: 4, description: 'Fire HDX 8.9 LTE (4th Gen)' },
  KFASWI: { gen: 4, description: 'Fire HD 7 (4th Gen)' },
  KFARWI: { gen: 4, description: 'Fire HD 6 (4th Gen)' },

  KFAPWI: { gen: 3, description: 'Fire HDX 8.9 (3rd Gen)' },
  KFAPWA: { gen: 3, description: 'Fire HDX 8.9 LTE (3rd Gen)' },
  KFTHWI: { gen: 3, description: 'Fire HDX 7 (3rd Gen)' },
  KFTHWA: { gen: 3, description: 'Fire HDX 7 LTE (3rd Gen)' },
  KFSOWI: { gen: 3, description: 'Fire HD 7 (3rd Gen)' },

  SD4930UR: { gen: 1, description: 'Fire Phone' },
};

function detectTablet(ua) {
  const isTablet = ua.match(/Tablet|Android.*Pixel C|PlayBook|Hudl HT7S3|Hudl 2|Nexus 7/);
  return isTablet ? 'tablet' : 'smartphone';
}

// eslint-disable-next-line max-statements
function detectPlatform() {
  const platform = window.navigator.platform;
  const ua = window.navigator.userAgent; // window.navigator.userAgent || window.navigator.vendor || window.opera;
  const device = { type: 'unknown', os: 'unknown', family: 'unknown', version: 'unknown' };
  if (!window.MSStream) {
    const iphone = ua.match(/iPhone|iPod/);
    const ipad = ua.match(/iPad/);
    const ipadOS13 = platform === 'MacIntel' && navigator.maxTouchPoints && navigator.maxTouchPoints > 2;

    if (iphone || ipad || ipadOS13) {
      const version = navigator.userAgent.match(/Version\/(\d+)\.(\d+)\.?(\d+)?/);
      const major = version && version[1] ? version[1] : '';
      const minor = version && version[2] ? version[2] : '';
      const patch = version && version[3] ? version[3] : '';

      device.os = 'ios';
      device.family = 'ios';
      device.type = iphone ? 'smartphone' : 'tablet';
      device.majorVersion = !isNaN(parseInt(major)) ? parseInt(major) : 0;
      device.version = `${major}.${minor}.${patch}`;
      return device;
    }
  }

  const kindle = ua.match(KINDLE_DEVICES);
  if (kindle) {
    const generation = KINDLE_GENERATIONS[kindle] || { gen: 0, description: 'unknown' };
    device.type = 'tablet';
    device.os = 'fire';
    device.family = 'android';
    device.kindle = generation;
    return device;
  }

  const android = ua.match(/(Android)\s+([\d.]+)/);
  if (android) {
    device.type = detectTablet(ua);
    device.os = 'android';
    device.family = 'android';
    device.version = android[2];
    return device;
  }

  const webos = ua.match(/webOS|hpwOS/);
  if (webos) {
    device.type = detectTablet(ua);
    device.os = 'webos';
    device.family = 'webos';
    return device;
  }
  const blackberry = ua.match(
    /BlackBerry|\\bBB10\\b|rim[0-9]+|\\b(BBA100|BBB100|BBD100|BBE100|BBF100|STH100)\\b-[0-9]+/
  );
  if (blackberry) {
    device.type = detectTablet(ua);
    device.os = 'blackberry';
    device.family = 'blackberry';
    return device;
  }

  const windowsMobileOS = ua.match(
    /Windows CE.*(PPC|Smartphone|Mobile|[0-9]{3}x[0-9]{3})|Windows Mobile|Windows Phone [0-9.]+|WCE/
  );
  const WindowsPhoneOS = ua.match(
    /Windows Phone 10.0|Windows Phone 8.1|Windows Phone 8.0|Windows Phone OS|XBLWP7|ZuneWP7|Windows NT 6.[23]; ARM/
  );
  if (windowsMobileOS || WindowsPhoneOS) {
    device.type = 'smartphone';
    device.os = 'windows';
    device.family = 'windows';
    return device;
  }

  const windows = ua.match(/windows/i);
  const macintosh = ua.match(/macintosh/i);
  const cros = ua.match(/cros/i); // linux
  const desktop = windows || macintosh || cros;
  if (desktop) {
    device.type = 'desktop';
    device.os = windows ? 'windows' : macintosh ? 'macintosh' : cros ? 'linux' : 'unknown';
    return device;
  }

  return device;
}

/**
 * Get estimated platform game is running on
 * @returns detected platform
 */
export const getPlatform = () => {
  return detectPlatform();
};
