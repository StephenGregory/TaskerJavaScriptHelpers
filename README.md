# Tasker JavaScript Helpers

In some instances, it's much easier to accomplish things in [Tasker](https://play.google.com/store/apps/details?id=net.dinglisch.android.taskerm&hl=en) by [using JavaScript](http://tasker.dinglisch.net/userguide/en/javascript.html).

Here you'll find my JavaScript helper functions:

## The Walking Dead Next Issue

Retrieves details about the next issue of the Walking Dead comic. It sets the following local task variables:

- `img` - the URL to the issue cover
- `issueno` - the issue number
- `days` - the number of days until the issue
- `date` - the date that the issue with be available (in GMT-0500 time zone)

Do with that information what you will! For example, [you can use AutoNotification](http://imgur.com/a/ZPTwv#0) to notify you when there's a new issue coming out.
