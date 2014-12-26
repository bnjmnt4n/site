---
layout: post
title: New in JSON 3 v4.0
description: Version 4 of the JSON 3 library (oh, the irony) included some major optimizations and a breaking change. This post briefly good through what’s new in this release.
---

[JSON 3](https://bestiejs.github.io/json3) is a “[polyfill](https://remysharp.com/2010/10/08/what-is-a-polyfill)” for the [JSON object](https://es5.github.io/#x15.12) defined in [ECMAScript 5](https://es5.github.io/). It was originally created by [Kit Cambridge](http://kitcambridge.be/) ([@kitcambridge](https://twitter.com/kitcambridge)) as a successor to [JSON 2](https://github.com/douglascrockford/JSON-js), [Douglas Crockford](http://www.crockford.com/)’s polyfill for the JSON specification. It is now maintained by myself and Kit, as part of the [BestieJS](https://github.com/bestiejs/bestiejs) collection of modules. Over the past year, JSON 3 had grown, with the addition of `JSON3.runInContext` and `JSON3.noConflict` in [v3.3.0](https://github.com/bestiejs/json3/releases/tag/v3.3.0), which seek to increase interoperability of the JSON 3 polyfill between different scripts running on different module loaders.

Now, we’ve just released [version 4](https://github.com/bestiejs/json3/releases/tag/v4.0.0), containing major optimizations, as well as a breaking change — hence the major version bump, as per [SemVer](http://semver.org/). In particular, we’ve rewritten parts of our core programming to use the native `JSON.stringify` function where possible; removed support for older versions of the Prototype JavaScript framework; and included some optimizations to our code.

## `JSON.stringify` in Firefox

[Firefox](https://www.mozilla.org/en-US/firefox) is a web browser developed by [Mozilla](https://www.mozilla.org/), used [around the world](http://www.w3counter.com/globalstats.php). As of the time of writing, Firefox — the stable channel — is currently at [version 34](https://www.mozilla.org/en-US/firefox/34.0/releasenotes). Firefox has included the `JSON.parse` and `JSON.stringify` methods since [version 3.5](http://website-archive.mozilla.org/www.mozilla.org/firefox_releasenotes/en-US/firefox/3.5/releasenotes), which was released more than 5 years ago. However, to this day, Firefox has had a bug in its `JSON.stringify` implementation.

As reported by [Helder Magalhães](http://heldermagalhaes.com/), Firefox’s `JSON.stringify` implementation is unable to serialize [extended years](https://es5.github.io/#x15.9.1.15.1) accurately. What does this mean for us? Because JSON 3 uses feature tests to determine if the native JSON implementation follows the specification, the absence of a little used feature would mean that JSON 3 would override the native `JSON.stringify` method. As you might guess, this might not be good for performance as the [native implementation](https://github.com/mozilla/gecko-dev/blob/master/js/src/json.cpp) would probably be much faster than ours.

Helder then created an issue on GitHub informing us about this performance issue — [issue #65](https://github.com/bestiejs/json3/issues/65). After some discussion, our solution was to use the native implementation with a wrapper function around it to override the [`Date#toJSON` method](https://es5.github.io/#x15.9.5.44).

### `Date#toJSON`

The `toJSON` method is defined in the ECMAScript 5 specification as a way to provide a custom value when serializing objects with `JSON.stringify`. This method, when present, can be used to provide specific information about an object when serialized, as opposed to serializing **all** of the object’s properties.

By overriding the `Date#toJSON` method, we are able to ensure that dates are serialized accurately, while not sacrificing the performance that the native implementation offers. Since this was by far [the simplest route to take](https://github.com/bestiejs/json3/issues/65#issuecomment-66227149), we’ve included it in version 4.

## Removal of Prototype ≤ 1.6.1 Support

The [Prototype](http://prototypejs.org/) JavaScript library is a popular library, meant to simplify the creation of user interfaces. In older versions of JSON 3, a workaround was included for Prototype ≤ 1.6.1’s [incorrect implementations of the `toJSON` method](https://github.com/bestiejs/json3/issues/8). This issue was since fixed in a later version of Prototype — [v1.7](http://prototypejs.org/2010/11/22/prototype-1-7), released in 2010.

Since then, it has been nearly 5 years, and we felt that it would be acceptable to remove a unnecessary workaround for an outdated library, with the added benefit that it simplified code. This was a breaking change, and this we bumped out version number to v4.0.0, as per the [Semantic Versioning specification](http://semver.org/).

## Performance Optimizations

In this release, we’ve also attempted to optimize our code, to show for faster parsing of JSON, as well as faster serialization of JavaScript objects. This can be seen in [jsPerf](http://jsperf.com/) tests for [`JSON.stringify`](http://jsperf.com/) and [`JSON.parse`](http://jsperf.com/).

## What’s Next

After this major release, we’ll be focusing more on improving performance, especially on older browsers like IE 8, and mobile browsers. We’re also working to improve our test system on [Travis CI](https://travis-ci.org/), including:

 * adding [automated browser testing runs](https://github.com/bestiejs/json3/pull/49) on [Sauce Labs](http://saucelabs.com/); and
 * using [Istanbul](http://istanbul-js.org/) to [track our code coverage](https://github.com/bestiejs/json3/issues/47)

## Conclusion

JSON 3 is, in my opinion, one of the better polyfills around. (Shameless self-promotion there, don’t mind me.) As part of the [BestieJS module collection](https://github.com/bestiejs/bestiejs), it includes lots of documentation, and is tested in many pre-ES5 environments, including older browsers (oldIE, *cough*), server-side JavaScript environments (Node.js, Rhino, etc.), and JavaScript engines (V8, SpiderMonkey, etc.), which is much more than other libraries do.

JSON 3 v4.0.0 is our most extensive release yet, and we hope you enjoy it! If you find bugs, have suggestions, or just want to say “Hi!”, feel free to tweet to myself ([@demoneaux](https://twitter.com/demoneaux)) or Kit ([@kitcambridge](https://twitter.com/kitcambridge)). That’s all for now! Happy new year and here’s to a great 2015!
