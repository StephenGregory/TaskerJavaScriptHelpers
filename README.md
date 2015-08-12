# Tasker JavaScript Helpers

In some instances, it's much easier to accomplish things in [Tasker](https://play.google.com/store/apps/details?id=net.dinglisch.android.taskerm&hl=en) by [using JavaScript](http://tasker.dinglisch.net/userguide/en/javascript.html).

Here you'll find my JavaScript helper functions:

## Helper functions

### The Walking Dead Next Issue

![alt tag](https://imagecomics.com/images/made/images/remote/https_d138hkes00e90m.cloudfront.net/release_images/TWD143-2x3-300_200_308.jpg)

Retrieves details about the next issue of the Walking Dead comic. It sets the following local task variables:

- `img` - the URL to the issue cover
- `issueno` - the issue number
- `days` - the number of days until the issue
- `date` - the date that the issue with be available.

Do with that information what you will! For example, [you can use AutoNotification](http://imgur.com/a/ZPTwv#0) to notify you when there's a new issue coming out.

## How the heck do I use these things?!

First you need to install [Node.js](https://nodejs.org/download/).

Second, from a fresh clone, run the following commands to obtain the distribution versions of the helpers:

    npm install
    gulp

That'll do a little wizardry and create Tasker friendly versons in `./dist`. Now put those helpers on your Android device.

Within a Tasker task, create a _JavaScript action_ and point to any of the helpers! Then you may use the use the variables, defined above, any way you can think of!
