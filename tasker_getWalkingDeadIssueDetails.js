var Tasker = {
    flashVariable: function (text) {
        flash(text);
    },
    setLocalVariable: function (name, value) {
        setLocal(name, value);
    },
    leaveJavaScriptlet: function () {
        exit();
    }
};

var theNextIssueData = {
    number: undefined,
    releaseDate: undefined,
    coverImage: undefined
};

var theNextIssueDataRetriever = {
    retrieveData: function(dataSource, dataSourceParser) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', dataSource, true);

        var _this = this;

        xhr.onload = function () {
            var parser = new DOMParser();
            var doc = parser.parseFromString(this.responseText, 'text/html');

            var parsedData = dataSourceParser(doc);

            var wholeDaysUntilNextIssue = _this._getDaysUntilDate(releaseDate);

            _this._setComicVariablesInTasker(parsedData.coverImage, parsedData.number, wholeDaysUntilNextIssue, parsedData.releaseDate);

            Tasker.leaveJavaScriptlet();
        };

        xhr.send();
    },
    _getDaysUntilDate: function (date) {
        var millisecondsUntilNextIssue = date - new Date();
        var days = millisecondsUntilNextIssue / 1000 / 60 / 60 / 24;
        var wholeDaysUntilNextIssue = Math.floor(days);
        return wholeDaysUntilNextIssue;
    },
    _setComicVariablesInTasker: function (issueCoverImageURL, issueNumber, wholeDaysUntilNextIssue, releaseDateString) {
        this._setLocalVariable('img', issueCoverImageURL);
        this. _setLocalVariable('issueno', issueNumber);
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
        var titleNode = document.getElementById('p-title');
        var issueNumber = titleNode.innerText.substr(titleNode.innerText.indexOf('#')+1);
        var availabilityText = document.querySelector('div.vision-contentbox-content.tt-content-style-black > span').innerText;
        var dateStart = availabilityText.substr(availabilityText.indexOf(':') + 1).trim();
        var array = dateStart.split(' ');
        var releaseDateString = _getIssueDateString(array[0], array[1], array[2]);
        theNextIssueData.releaseDate = issueNumber;
        theNextIssueData.releaseDate = new Date(releaseDateString);
        theNextIssueData.coverImage = _generateIssueCoverURL(issueNumber);
        return theNextIssueData;
    },
    _generateIssueCoverURL: function (issueNo) {
        if (issueNo.length === 1) {
            issueNo = '0' + issueNo;
        }
        return ['http://i1.wp.com/walkingdeadcomics.org/wp-images/gallery/standard/', issueNo, '.jpg'].join('');
    },
    _getIssueDateString: function (month, day, year) {
        return [month, day, year, '09:00 GMT-0500'].join(' ');
    }
};

theNextIssueDataRetriever.retrieveData(dataSource.source, dataSource.parsePageForParameters);
