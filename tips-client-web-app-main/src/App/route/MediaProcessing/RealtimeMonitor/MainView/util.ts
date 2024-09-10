
function Utf8ArrayToStr(array: any) {
  var out, i, len, c
  var char2, char3
  out = ''
  len = array.length
  i = 0
  while (i < len) {
    c = array[i++]
    switch (c >> 4) {
        case 7:
          out += String.fromCharCode(c)
          break
        case 13:
          char2 = array[i++]
          out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F))
          break
        case 14:
          char2 = array[i++]
          char3 = array[i++]
          out += String.fromCharCode(((c & 0x0F) << 12) |
            ((char2 & 0x3F) << 6) |
            ((char3 & 0x3F) << 0))
          break
    }
  }
  return out
}

function browserDetector() {
  var Browser
  var ua = global.self.navigator.userAgent.toLowerCase()
  var match =
      /(edge)\/([\w.]+)/.exec(ua) ||
      /(opr)[\/]([\w.]+)/.exec(ua) ||
      /(chrome)[ \/]([\w.]+)/.exec(ua) ||
      /(iemobile)[\/]([\w.]+)/.exec(ua) ||
      /(version)(applewebkit)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(ua) ||
      /(webkit)[ \/]([\w.]+).*(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(
        ua
      ) ||
      /(webkit)[ \/]([\w.]+)/.exec(ua) ||
      /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
      /(msie) ([\w.]+)/.exec(ua) ||
      (ua.indexOf('trident') >= 0 && /(rv)(?::| )([\w.]+)/.exec(ua)) ||
      (ua.indexOf('compatible') < 0 && /(firefox)[ \/]([\w.]+)/.exec(ua)) || []
  var platform_match =
      /(ipad)/.exec(ua) ||
      /(ipod)/.exec(ua) ||
      /(windows phone)/.exec(ua) ||
      /(iphone)/.exec(ua) ||
      /(kindle)/.exec(ua) ||
      /(android)/.exec(ua) ||
      /(windows)/.exec(ua) ||
      /(mac)/.exec(ua) ||
      /(linux)/.exec(ua) ||
      /(cros)/.exec(ua) || []
  var matched = {
    browser: match[5] || match[3] || match[1] || '',
    version: match[2] || match[4] || '0',
    majorVersion: match[4] || match[2] || '0',
    platform: platform_match[0] || ''
  }
  var browser: any = {}

  if (matched.browser) {
    browser[matched.browser] = true
    var versionArray = matched.majorVersion.split('.')
    browser.version = {
      major: parseInt(matched.majorVersion, 10),
      string: matched.version
    }

    if (versionArray.length > 1) {
      browser.version.minor = parseInt(versionArray[1], 10)
    }

    if (versionArray.length > 2) {
      browser.version.build = parseInt(versionArray[2], 10)
    }
  }

  if (matched.platform) {
    browser[matched.platform] = true
  }

  if (browser.chrome || browser.opr || browser.safari) {
    browser.webkit = true
  } // MSIE. IE11 has 'rv' identifer

  if (browser.rv || browser.iemobile) {
    if (browser.rv) {
      delete browser.rv
    }

    var msie = 'msie'
    matched.browser = msie
    browser[msie] = true
  } // Microsoft Edge

  if (browser.edge) {
    delete browser.edge
    var msedge = 'msedge'
    matched.browser = msedge
    browser[msedge] = true
  } // Opera 15+

  if (browser.opr) {
    var opera = 'opera'
    matched.browser = opera
    browser[opera] = true
  } // Stock android browsers are marked as Safari

  if (browser.safari && browser.android) {
    var android = 'android'
    matched.browser = android
    browser[android] = true
  }

  browser.name = matched.browser
  browser.platform = matched.platform


  return browser
}