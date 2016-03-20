---
title: Platform.js v1.3.0
description: Platform.js v1.3.0 has just been released. Here’s what’s new, as well as upcoming plans for future releases.
---

[Platform.js](https://github.com/bestiejs/platform.js) is a platform detection library, similar to [`ua-parser`](http://www.uaparser.org/) — a port of [Browserscope](http://www.browserscope.org/)’s user agent parser to other languages. However, it is written in JavaScript, and has a much smaller file size, by focussing on browsers that have larger market shares, as opposed to the [extensive list of browsers](https://github.com/ua-parser/uap-core/blob/master/regexes.yaml) supported by `ua-parser`.

In the latest release — v1.3.0 — we’ve included bug fixes, optimizations and code cleanups galore. Apart from that, we’ve added platform detection support for a few new browsers, including: IE Tech Preview (aka. IE 12), as well as IE Mobile 11 on Windows Mobile 8.1. In this post, we’ll go through an overview of some of the changes we’ve made.

## IE Technical Preview / IE 12

[IE Technical Preview](http://devchannel.modern.ie/) / IE 12 is the developer version of IE. It runs on the [preview version of Windows 10](http://windows.microsoft.com/en-us/windows/preview), and is available for users to test at [remote.modern.ie](https://remote.modern.ie/). It comes with many changes to IE’s user agent string. Before we get to IE Technical Preview, I’d like to go through a brief overview of IE’s user agent string history, as well as how Platform.js uses them.

From IE 6 - IE 7, the user agent string uses the “MSIE” token to indicate IE’s version number:

{% highlight js %}
// In IE 6
navigator.userAgent;
// 'Mozilla/4.0 (Windows; MSIE 6.0; Windows NT 5.0)'

// In IE 7
navigator.userAgent;
// 'Mozilla/5.0 (Windows; U; MSIE 7.0; Windows NT 5.1; en-US)'
{% endhighlight %}

From IE 8 onwards, there is an addition of a “Trident” token, which indicates the version number of IE’s layout engine, Trident:

{% highlight js %}
// In IE 8
navigator.userAgent;
// 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0)'

// In IE 9
navigator.userAgent;
// 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; AMD64; Trident/5.0)'

// In IE 10
navigator.userAgent;
// 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.0; Trident/6.0)'
{% endhighlight %}

This token can also be used to detect if IE is running in compatibility mode.

For IE 11, Microsoft decided that IE was now advanced enough that it should not have the “MSIE” token that puts it in the same class as “oldIE” browsers, **ie.**, IE 6 - IE 8. Instead, it uses the “rv” token to indicate IE’s version number.

{% highlight js %}
// In IE 11
navigator.userAgent;
// 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko'
{% endhighlight %}

This is made even more complicated with [IE 11’s ability to identify as different browsers](http://blogs.msdn.com/b/ieinternals/archive/2013/09/21/internet-explorer-11-user-agent-string-ua-string-sniffing-compatibility-with-gecko-webkit.aspx). This is presumably to fix cases of wrong platform detection causing different (and probably degraded) user experiences. **Note:** Platform.js should only be used for informational purposes. Feature detection should be used instead to test for browser support of different features.

Now, in the latest version of IE Technical Preview, IE identifies as [Google’s Chrome browser](https://google.com/chrome). It even removes the “Trident” token, to make it seem completely unlike previous versions of IE. Instead of “rv” though, an “Edge” token is used to indicate the version, though this will probably change in the final version of IE 12.

{% highlight js %}
// In IE Technical Preview / IE 12
navigator.userAgent;
// 'Mozilla/5.0 (Windows NT 6.4; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.143 Safari/537.36 Edge/12.0'
{% endhighlight %}

With this change, most platform detection libraries will detect IE 12 as Chrome 36.

<!-- include post_image.html image='/blog/platform.js-v1.3.0/jsperf.jpg' caption='IE 12 detected as Chrome 36 on [jsPerf.com](http://jsperf.com/).' -->

In Platform.js v1.3.0 though, we’ve fixed this to ensure that IE Technical Preview’s “Edge” token is used to infer the browser version, allowing for accurate detection of IE 12.

{% highlight js %}
// In IE Technical Preview / IE 12
navigator.userAgent;
// 'Mozilla/5.0 (Windows NT 6.4; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.143 Safari/537.36 Edge/12.0'

platform.description;
// 'IE 12.0 32-bit (platform preview) on Windows 10 64-bit'
platform.name;
// 'IE'
platform.version;
// '12.0'
platform.os;
// 'Windows 10 64-bit'
platform.layout;
// 'Trident'
{% endhighlight %}

## IE Mobile 11

[IE Mobile](http://www.microsoft.com/en-ie/mobile/) is the default browser on [Windows Phone](http://windowsphone.com/), Microsoft’s version of its Windows operating system for mobile phones. Like its desktop counterpart, the latest consumer version of IE Mobile is version 11.

IE Mobile 11’s user agent was previously quite similar to that of IE 9 - IE 10 on desktop, but with the addition of the “rv” token, and using an “IEMobile” token instead of “IE”:

{% highlight js %}
// On IE Mobile 11 (before Windows Phone 8.1 Update 1)
navigator.userAgent;
// 'Mozilla/5.0 (Windows Phone 8.1; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0; NOKIA; Lumia 920) like Gecko'
{% endhighlight %}

However, in the first update to Windows Phone 8.1 (referred to as Windows Phone 8.1 Update 1), the IE Mobile team decided to change IE’s user agent to allow it to be compatible with a larger amount of sites.

What the IE Mobile team did was to include the user agents of other mobile phones into IE Mobile’s user agent string. Here’s an example of the new user agent string:

{% highlight js %}
// On IE Mobile 11 (after Windows Phone 8.1 Update 1)
navigator.userAgent;
// 'Mozilla/5.0 (Mobile; Windows Phone 8.1; Android 4.0; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0; NOKIA; Lumia 920) like iPhone OS 7_0_3 Mac OS X AppleWebKit/537 (KHTML, like Gecko) Mobile Safari/537'
{% endhighlight %}

As you can see, this string includes the phrases “Android 4.0” and “iPhone OS 7_0_3”, which are found in the user agents of Android and iPhone browsers.

This was done because Android and iOS devices occupy a large percentage of the market share globally, and most sites only search for indicators like “Android” and “iPhone” to detect “**smartphones**”, forgoing other devices and browsers, like IE Mobile 11 on Windows Phone, despite it supporting most of the features of the Android WebKit browser as well as Mobile Safari on iOS.

Thus, the user agent change is to allow IE Mobile to identify as either an Android device or an iPhone, so sites that only search for those browsers would also recognise IE Mobile, as described ob the IE Mobile team’s [blog post](http://blogs.msdn.com/b/ie/archive/2014/07/31/the-mobile-web-should-just-work-for-everyone.aspx). This is another reason not to use platform detection for anything other than information. Instead, an alternative way to detect mobile browsers is to search for occurrences of “Mobi” in `navigator.userAgent`.

## Other Changes

We’ve also added support for [Opera Mini for iOS](http://www.opera.com/mobile/mini/iphone), and the recently released [Breach browser](http://breach.cc). Additionally, we’ve fixed issues with the detection of the 64-bit version of Chrome running on Windows.

## Upcoming Changes

For our next release, we intend to add support for [`atom-shell`](https://github.com/atom/atom-shell/releases) and [`node-webkit`](https://github.com/rogerwang/node-webkit). In addition, we are going  to improve detection of mobile browsers running in desktop mode.

For now though, have fun detecting platforms!
