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

            var parsedData = dataSourceParser.parsePageForParameters(doc);

            var wholeDaysUntilNextIssue = _this._getDaysUntilDate(parsedData.releaseDate);

            _this._setComicVariablesInTasker(parsedData.coverImage, parsedData.number, wholeDaysUntilNextIssue, _this._getDateString(parsedData.releaseDate));

            Tasker.leaveJavaScriptlet();
        };

        xhr.send();
    },
    _getDateString: function(date) {
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
    source: 'https://imagecomics.com/comics/release-archive/series/the-walking-dead',
    parsePageForParameters: function (document) {
        var today = new Date();
        var books = document.querySelectorAll('.book');

        var titleRegex = /^The Walking Dead\s#\d+$/i;

        var nextIssueDetails = Array.prototype.reduce.call(books, function(previousValue, currentNode) {
            var publishInfoNode = currentNode.querySelector('.book__text');

            var publishDate = new Date(publishInfoNode.innerText.substr(publishInfoNode.innerText.indexOf(':') + 1));

            if (publishDate < today || (previousValue.date && publishDate > previousValue.date)) {
                return previousValue;
            }

            var titleNode = currentNode.querySelector('.book__headline a');
            var title = titleNode.innerText.trim();

            if (!titleRegex.test(title)) {
                return previousValue;
            }

            return {
                imageSource: currentNode.querySelector('img').getAttribute('src'),
                date: publishDate,
                title: title
            };
        }, {});

        var issueNumber = nextIssueDetails.title.substr(nextIssueDetails.title.indexOf('#') + 1);

        var imageUrl = nextIssueDetails.imageSource;

        theNextIssueData.number = issueNumber;
        theNextIssueData.releaseDate = nextIssueDetails.date;
        theNextIssueData.coverImage = this._getHigherResolutionImage(imageUrl);

        return theNextIssueData;
    },
    _getHigherResolutionImage: function (smallResolutionImageUrl) {
        return smallResolutionImageUrl.replace('_small/', '');
    }
};

theNextIssueDataRetriever.retrieveData(dataSource.source, dataSource);
