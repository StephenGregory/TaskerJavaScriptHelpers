var Tasker = {
    flashVariable: function (text) {
        /*global flash*/
        flash(text);
    },
    setLocalVariable: function (name, value) {
        /*global setLocal*/
        setLocal(name, value);
    },
    leaveJavaScriptlet: function () {
        /*global exit*/
        exit();
    }
};

var theNextIssueData = {
    number: null,
    releaseDate: null,
    coverImage: null
};

var theNextIssueDataRetriever = {
    retrieveData: function (dataSourceUrl, dataSourceParser) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', dataSourceUrl, true);

        var _this = this;

        xhr.onload = function () {
            var parser = new DOMParser();
            var doc = parser.parseFromString(this.responseText, 'text/html');

            var parsedData = dataSource.parsePageForParameters(doc);

            var wholeDaysUntilNextIssue = _this._getDaysUntilDate(parsedData.releaseDate);

            _this._setComicVariablesInTasker(parsedData.coverImage, parsedData.number, wholeDaysUntilNextIssue, _this._getDateString(parsedData.releaseDate));

            Tasker.leaveJavaScriptlet();
        };

        xhr.send();
    },
    _getDateString(date) {
        return date.toLocaleDateString();
    },
    _getDaysUntilDate: function (date) {
        var millisecondsUntilNextIssue = date - new Date();
        var days = millisecondsUntilNextIssue / 1000 / 60 / 60 / 24;
        var wholeDaysUntilNextIssue = Math.floor(days);
        return wholeDaysUntilNextIssue;
    },
    _setComicVariablesInTasker: function (issueCoverImageUrl, issueNumber, wholeDaysUntilNextIssue, releaseDateString) {
        this._setLocalVariable('img', issueCoverImageUrl);
        this._setLocalVariable('issueno', issueNumber);
        this._setLocalVariable('days', wholeDaysUntilNextIssue);
        this._setLocalVariable('date', releaseDateString);
    },
    _setLocalVariable: function (name, value, debug) {
        if (debug) {
            Tasker.flashVariable('setting ' + name + ' to ' + value);
        }
        Tasker.setLocalVariable(name, value);
    }
};

var dataSource = {
    source: 'https://imagecomics.com/comics/series/the-walking-dead',
    parsePageForParameters: function (document) {
        var upcomingReleasesNode = document.querySelector('.upcoming_releases');

        var titleNode = Array.prototype.filter.call(upcomingReleasesNode.querySelectorAll('a'), this._isNodeTheIssueTitleNode)[0];
        var issueNumber = titleNode.innerText.substr(titleNode.innerText.indexOf('#') + 1);

        var availabilityDateText = upcomingReleasesNode.querySelector('h4').innerText;
        var imageUrlPortion = upcomingReleasesNode.querySelector('img').getAttribute('src');

        theNextIssueData.number = issueNumber;
        theNextIssueData.releaseDate = new Date(availabilityDateText);
        theNextIssueData.coverImage = this._getHigherResolutionImage(imageUrlPortion) || 'https://imagecomics.com' + imageUrlPortion;

        return theNextIssueData;
    },
    _isNodeTheIssueTitleNode: function (node) {
        return node.textContent.indexOf('#') !== -1;
    },
    _getHigherResolutionImage: function (urlFragment) {
        var marker = 'https_';
        var startIndex = urlFragment.indexOf(marker);

        if (startIndex === -1) {
            return null;
        }

        var imageUrl = urlFragment.substr(startIndex);

        var breadcrumbs = imageUrl.split('/');

        var imageFilename = breadcrumbs[breadcrumbs.length - 1];

        var newImageFilename = imageFilename.replace(/_\d+_\d+\./, '.');

        breadcrumbs[breadcrumbs.length - 1] = newImageFilename;

        var highResolutionImageUrl = breadcrumbs.join('/').replace('_', '://');

        return highResolutionImageUrl;
    }
};

theNextIssueDataRetriever.retrieveData(dataSource.source, dataSource);
