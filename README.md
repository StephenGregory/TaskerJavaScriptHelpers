# Tasker JavaScript Helpers

![Logo](docs/assets/TaskerJS.svg)

In some instances, it's much easier to accomplish things in [Tasker](https://play.google.com/store/apps/details?id=net.dinglisch.android.taskerm&hl=en), such as data manipulation, by [using JavaScript](http://tasker.dinglisch.net/userguide/en/javascript.html).

Here you'll find a sandbox to make writing and testing JavaScript for Tasker easier, plus my own JavaScript helper functions.

This repository gives you an environment that lets you:
- organize your JavaScript into multiple files for code re-use
- export your JavaScript to a single file, per script/helper, which Tasker expects
- test your script on your computer without cluttering it with initialization of Tasker local variables or placeholder functions; the script on your computer will be exactly the same as what's on your Android device
- know exactly how your script will behave on your Android device
- use npm packages to enhance your JavaScript

## Table of Contents

1. [Quick Start](#quick-start)
2. [Motivation](#motivation)
3. [Helper functions in this repository](helper-functions)
    - [Sparkle Laundry Status](#sparkle-laundry-status)
    - [The Walking Dead Next Issue](#the-walking-dead-next-issue)

## Quick Start

### One-time steps
First you need to install [Node.js](https://nodejs.org/download/).

### From a fresh clone or fetch of the repository

Install dependencies:

    $ npm install

Create Tasker-friendly versions of any helpers in `./src`:

    $ npm run taskerfy

Move the exported helper(s) in `./dist` onto your Android device.

Within a Tasker task, create a JavaScript action, disable "Auto Exit", and point to any of the helpers. That's it!

<img src="docs/assets/tasker.task.action.javascript.png" width="300" />

## Motivation

Writing and testing JavaScript for use with Tasker can painful.

While writing it directly on your Android device may seem convenient at first, you'll eventually want to write something more complex. With complexity, comes bugs, and Tasker lacks tools that we sometimes take for granted in an IDE.

For that reason, it's more enticing to code on a computer. As well, there are countless libraries out there that you can use instead of reinventing the wheel.

With both, I've discovered pain points:
- coding directly on your Android device
    - it is tedious and error prone
    - if something unexpected happens, you have very limited ways to figure out what went wrong. If there is an error, you'll get a stacktrace that _might_ be useful. If there's no error, but you get unexpected behavior, you don't have any debugging tools at your disposal.
    - you will fight with auto-correct as you try to write code, or you'll easily mistype variable or function names
- coding on a computer
    - if your script relies on local Tasker variables, the documentation will tell you that [Tasker will inject these into your script](https://tasker.joaoapps.com/userguide/en/javascript.html#localvars). Since your computer is a separate environment and won't have those variables injected, you need to initialize the local variables, but also must remember to remove that initialization before using the script on your Android device. Otherwise, your script won't use the values from Tasker, but instead use what you defined in your script for testing.
        ```JavaScript
        /*
          For testing, initialize the local Tasker variable, but remember to remove the next line
          before you put this script on your Android device, otherwise it will always be `50`.
        */
        const localVariableThatYouNeed = 50;

        //display a toast
        const remainder = localVariableThatYouNeed % 2;
        flash(`Remainder of localVariableThatYouNeed divided by 2: ${remainder}`);
        ```
    - the global functions that Tasker injects to allow you to interact with it (e.g. set local variables, flash text, get/set global variables) are not available on your computer. To test your script by running it on your computer, you need to either create placeholder functions or comment-out calls to those global functions while testing. If you do add placeholder functions, you must remove them before putting the script on your Android device.
        ```JavaScript
        //for testing, initialize `localVariableThatYouNeed`
        const localVariableThatYouNeed = 50;

        // for testing, create placeholder `flash`, but remember to remove this before
        // putting this script on your Android device, too
        function flash(text) {
          console.log(`Displaying toast in Tasker with flash: ${text}`)
        }

        //display a toast
        const remainder = localVariableThatYouNeed % 2;
        flash(`Remainder of localVariableThatYouNeed divided by 2: ${remainder}`);
        ```
    - you need to ensure all your code ends up in a single file before you use it in Tasker. If you import other libraries, you need to ensure the final file that Tasker uses has the contents of those libraries within that file. Also, since you cannot split your own code across files your code can easily become long and messy.
        ```JavaScript
        /*
          Import some-math-library, which loads in a separate file or npm package
          when running this script on your device, you need the contents of
          some-math-library to be in the final file.

          'require' won't exist on your Android device, neither will 'some-math-libary',
           so this script will fail to run on your Android device as-is.
        */
        const someMathLibrary = require('some-math-library');

        //for testing, initialize variables and functions
        var localVariableThatYouNeed = 50;
        function flash(text) {
          console.log(`Displaying toast in Tasker with flash: ${text}`)
        }

        const remainder = someMathLibrary.getRemainder(localVariableThatYouNeed, 2);
        flash(`Remainder of localVariableThatYouNeed divided by 2: ${someValue}`);
        ```

You can see how quickly testing on your computer becomes less convenient as well. So you may write code on your computer, then modify it to run on your Android device, only to discover you made a mistake. This is tedious and inefficient.

This repository aims to address all of these frustrations to get you up and running faster.

## Helper functions

### Sparkle Laundry Status

![](https://mysparkle.ca/images/logos/mysparkle.png)

If you live in an apartment building with Sparkle Laundry machines, [their website](https://mysparkle.ca/) gives a lot of information on what machines are in use and who used them last.

#### Requirements

Setup a task in Tasker to login, then request data from https://mysparkle.ca/machines.json.

Before you call this helper, set the following local variables:

- `allmachinesjson` - a JSON string of https://mysparkle.ca/machines.json
- `address` - exact or partial address where the laundry machines are located
- `cardnumber` - your laundry card number
- `availability_wait_time_mins` - estimated time, in minutes, it takes for someone to retrieve their laundry after the cycle is done

#### Output

On completion, sets the following variables:
- `dryer_availability` - how many dryers are available (e.g. 8/11)
- `washer_availability` - how many washers are available
- `done_machines` - a list of washer and dryer machine names you've used that are done
- `in_progress_machines` - a list of washer and dryer machine names you've used that are still in progress (with time estimations on when they'll be complete)
- `washer_time_remaining_min` - of the washers you have recently used, the min time remaining
- `washer_time_remaining_max` - of the washers you have recently used, the max time remaining
- `dryer_time_remaining_min` - of the dryers you have recently used, the min time remaining
- `dryer_time_remaining_max` - of the dryers you have recently used, the max time remaining

### The Walking Dead Next Issue

![The Walking Dead Cover](https://vignette.wikia.nocookie.net/walkingdead/images/1/18/Twd100cover_adlard.jpg/revision/latest?cb=20120616020008)

Retrieves details about the next issue of the Walking Dead comic. It sets the following local task variables:

- `img` - the URL to the issue cover
- `issueno` - the issue number
- `days` - the number of days until the issue
- `date` - the date that the issue with be available.

Do with that information what you will! For example, [you can use AutoNotification](http://imgur.com/a/ZPTwv#0) to notify you when there's a new issue coming out.
