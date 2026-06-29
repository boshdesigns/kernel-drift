/* eslint-disable camelcase */

const iPHONE1_3 = 'iPhone 1/3g/3gs';
const iPHONE4_4S = 'iPhone 4/4s';
const iPHONE5_5C_5S = 'iPhone 5/5c/5s';
const iPHONE6_6S_7_8 = 'iPhone 6/6s/7/8';
const iPHONE6_6S_7_8_DZ = 'iPhone 6/6s/7/8 (Display Zoom)';
const iPHONE6_6S_7P_8P = 'iPhone 6/6s/7 Plus/8 Plus';
const iPHONE6_6S_7P_8P_DZ = 'iPhone 6/6s/7 Plus/8 Plus (Display Zoom)';
const iPHONEX = 'iPhone X';
const iPHONE13 = 'iPhone 13';

const IPAD1_2_MINI1 = 'iPad 1/2 | Mini 1';
const IPAD3_5_PRO_MINI2_4 = 'iPad 3-5, iPad Air 1-2, iPad Mini 2-4, iPad Pro 9.7';
const IPAD_PRO_10 = 'iPad Pro 10.5';
const IPAD_PRO_12 = 'iPad Pro 12.9, Pro 12.9 (2nd Gen)';

const NEXUS_TABLET = /Android.*Nexus[\\s]+(7|9|10)/;
const GALAXY_TAB_4 = /SM-T530|SM-T330|SM-N8010/;
const HTC_PHONE =
  /HTC|HTC.*(Sensation|Evo|Vision|Explorer|6800|8100|8900|A7272|S510e|C110e|Legend|Desire|T8282)|APX515CKT|Qtek9090|APA9292KT|HD_mini|Sensation.*Z710e|PG86100|Z715e|Desire.*(A8181|HD)|ADR6200|ADR6400L|ADR6425|001HT|Inspire 4G|Android.*\\bEVO\\b|T-Mobile G1|Z520m|Android [0-9.]+; Pixel/;
const HTC_TABLET = /HTC_Flyer_P512|HTC Flyer|HTC Jetstream|HTC-P715a|HTC EVO View 4G|PG41200|PG09410/;
const SAMSUNG_TABE = /sm-t377|sm-t56/;
const TESCO_HUDL = /hudl/;

// prettier-ignore
import { getPlatform } from './platformDetection';
/**
 * @constant PERFORMANCE_CATEGORY
 * @description constants representing performance level
 * @property {string} LOW_END=LOW_END string representing low end device and should be served the minimal experience
 * @property {string} MID_END=MID_END string representingedium end device and should be served a medium experience
 * @property {string} HIGH_END=HIGH_END string representing high end device and should be served a maximum experience
 * @see getDeviceMetric
 *
 */

export const isDesktop = () => {
  return getPlatform().type;
};

export const PERFORMANCE_CATEGORY = {
  LOW_END: 'LOW_END',
  MID_END: 'MID_END',
  HIGH_END: 'HIGH_END',
};
const IOS = {
  LOW_END: `${iPHONE1_3},${iPHONE4_4S},${iPHONE5_5C_5S},${IPAD1_2_MINI1}`,
  MID_END: `${iPHONE6_6S_7_8},${iPHONE6_6S_7_8_DZ},${iPHONE6_6S_7P_8P},${iPHONE6_6S_7P_8P_DZ},${IPAD3_5_PRO_MINI2_4}`,
};

// Internet Explorer
export const isIE = () => {
  const ua = window.navigator.userAgent;
  const msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }
  const trident = ua.indexOf('Trident/');
  if (trident > 0) {
    // IE 11 => return version number
    const rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }
  return false;
};

export const isiOS = () => {
  return !!navigator.platform.match(/iPhone|iPod|iPad/);
};

export const isTouchDevice = () => {
  return 'ontouchstart' in window;
};

export const isIE11 = () => {
  // detection code from https://stackoverflow.com/questions/21825157/internet-explorer-11-detection/29715168
  return !!window.MSInputMethodContext && !!document.documentMode;
};

// iOS
export const getIPhoneModel = () => {
  const width = window.screen.width > window.screen.height ? window.screen.height : window.screen.width;
  const height = window.screen.width > window.screen.height ? window.screen.width : window.screen.height;
  const wh = width / height;
  const ratio = window.devicePixelRatio;

  if (wh === 320 / 480 && ratio === 1) {
    return iPHONE1_3;
  }

  if (wh === 640 / 960 && ratio === 2) {
    return iPHONE4_4S;
  }

  if (wh === 640 / 1136 && ratio === 2) {
    return iPHONE5_5C_5S;
  }

  if (wh === 750 / 1334 && ratio === 2) {
    return iPHONE6_6S_7_8;
  }

  if (wh === 640 / 1136 && ratio === 2) {
    return iPHONE6_6S_7_8_DZ;
  }

  if (wh === 1242 / 2208 && ratio === 3) {
    return iPHONE6_6S_7P_8P;
  }

  if (wh === 1125 / 2001 && ratio === 3) {
    return iPHONE6_6S_7P_8P_DZ;
  }

  if (wh === 375 / 812 && ratio === 3) {
    return iPHONEX;
  }

  if (wh === 390 / 844 && ratio === 3) {
    return iPHONE13;
  }
  return '';
};

export const getIPadModel = () => {
  const width = window.screen.width > window.screen.height ? window.screen.height : window.screen.width;
  const height = window.screen.width > window.screen.height ? window.screen.width : window.screen.height;
  const wh = width / height;
  const ratio = window.devicePixelRatio;
  if (wh === 768 / 1024) {
    if (ratio === 1) {
      return IPAD1_2_MINI1;
    } else {
      return IPAD3_5_PRO_MINI2_4;
    }
  }
  if (wh === 834 / 1112) {
    return IPAD_PRO_10;
  }
  if (wh === 1024 / 1366) {
    return IPAD_PRO_12;
  }
};

export const iOSversion = () => {
  if (/iP(hone|od|ad)/.test(navigator.platform)) {
    // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
    const v = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
    return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
  } else if (navigator.userAgent.match(/Mac/) && navigator.maxTouchPoints && navigator.maxTouchPoints > 2) {
    return 13;
  }
};

/*
 * Checks specific devices via UA and categories
 * specific models as LOW_END
 */
export const isOld = () => {
  // check specific devices
  const ua = window.navigator.userAgent;
  if (ua.match(NEXUS_TABLET)) {
    return true;
  }
  if (ua.match(GALAXY_TAB_4)) {
    return true;
  }
  if (ua.match(HTC_PHONE) || ua.match(HTC_TABLET)) {
    return true;
  }
  if (ua.match(SAMSUNG_TABE)) {
    return true;
  }
  return !!ua.match(TESCO_HUDL);
};

const getAndroidCategory = (platform) => {
  if (isOld()) {
    return PERFORMANCE_CATEGORY.LOW_END;
  }
  const version = (platform.version && parseInt(platform.version)) || 0;
  /*
   * finally check android version
   * <= 6 = LOW_END
   * MID_END
   * > 9 = HIGH_END
   */
  if (version <= 6) {
    return PERFORMANCE_CATEGORY.LOW_END;
  } else if (version > 9) {
    return PERFORMANCE_CATEGORY.HIGH_END;
  }
  return PERFORMANCE_CATEGORY.MID_END;
};

const getKindleCategory = (platform) => {
  let category = PERFORMANCE_CATEGORY.MID_END;
  if (platform.kindle.gen < 8) {
    category = PERFORMANCE_CATEGORY.LOW_END;
  }
  return category;
};

const getIosCategory = (platform) => {
  let category = PERFORMANCE_CATEGORY.HIGH_END;
  if (platform.type === 'tablet') {
    const model = getIPadModel();
    if (model === '') {
      return category;
    } else if (IOS.LOW_END.includes(model)) {
      category = PERFORMANCE_CATEGORY.LOW_END;
    } else if (IOS.MID_END.includes(model)) {
      // if device is running < ios 13 then it is likely to be an older mid end device
      category = platform.majorVersion < 13 ? PERFORMANCE_CATEGORY.LOW_END : PERFORMANCE_CATEGORY.MID_END;
    }
  } else if (platform.type === 'smartphone') {
    const model = getIPhoneModel();
    if (model === '') {
      return category;
    } else if (IOS.LOW_END.includes(model)) {
      category = PERFORMANCE_CATEGORY.LOW_END;
    } else if (IOS.MID_END.includes(model)) {
      category = PERFORMANCE_CATEGORY.MID_END;
    }
  }
  return category;
};

/**
 * @method getDeviceMetric
 * @description get an estimated device performance level
 * @returns PERFORMANCE_CATEGORY.LOW_END, PERFORMANCE_CATEGORY.MID_END or PERFORMANCE_CATEGORY.HIGH_END
 * @see PERFORMANCE_CATEGORY
 */
export const getDeviceMetric = () => {
  let category = PERFORMANCE_CATEGORY.MID_END;
  const platform = getPlatform();
  if (platform.type === 'desktop') {
    category = PERFORMANCE_CATEGORY.HIGH_END;
  } else if (platform.type !== 'unknown') {
    switch (platform.os) {
      case 'windows':
      case 'blackberry':
      case 'webos':
        category = PERFORMANCE_CATEGORY.LOW_END;
        break;
      case 'fire':
        category = getKindleCategory(platform);
        break;
      case 'android':
        category = getAndroidCategory(platform);
        break;
      case 'ios': {
        category = getIosCategory(platform);
        break;
      }
    }

    return { platform, category };
  }
  return { platform, category };
};

/*
 * https://everyi.com/by-capability/maximum-supported-ios-version-for-ipod-iphone-ipad.html
 *
 * iPad iOS 13 and 14 (drops iPad Air 1, iPad Mini 2)
 * -------------------
 * iPad Air 2 (2014)
 * iPad Air (2019)
 * iPad mini 4 (2015)
 * iPad mini (2019)
 * iPad (2017, 2018, 2019)
 * iPad Pro 9.7in (2016)
 * iPad Pro 10.5in (2017)
 * iPad Pro 11in (2018, 2020)
 * iPad Pro 12.9in (2015, 2017, 2018, 2020)
 *
 */

/*
 * http://dorianroy.com/blog/category/ios-support-matrix/
 *
 * iOS 13 and 14 (drops iPhone 5S and iPhone 6, iPhone 6 Plus)
 * -------------------
 * iPhone 6S, iPhone 6S Plus
 * iPhone SE (1st generation), iPhone SE (2nd generation)
 * iPhone 7, iPhone 7 Plus
 * iPhone 8, iPhone 8 Plus
 * iPhone X, iPhone XS, iPhone XS Max, iPhone XR
 * iPhone 11, iPhone 11 Pro, iPhone 11 Pro Max
 * iPhone 12 Mini, iPhone 12, iPhone 12 Pro, iPhone 12 Pro Max
 *
 * iOS 12
 * -------------------
 * iPhone 5S
 * iPhone 6, iPhone 6 Plus
 * iPhone 6S, iPhone 6S Plus
 * iPhone SE (1st generation), iPhone SE (2nd generation)
 * iPhone 7, iPhone 7 Plus
 * iPhone 8, iPhone 8 Plus
 * iPhone X, iPhone XS, iPhone XS Max, iPhone XR
 *
 */
