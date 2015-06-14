var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://walkingdeadcomics.org/the-walking-dead-next-issue/', true);

xhr.onload = function () {
  var parser = new DOMParser();
  var doc = parser.parseFromString(this.responseText, 'text/html');

  var titleNode = doc.getElementById('p-title');
  var issueNumber = titleNode.innerText.substr(titleNode.innerText.indexOf('#')+1);
  var availabilityText = doc.querySelector('div.vision-contentbox-content.tt-content-style-black > span').innerText;
  var dateStart = availabilityText.substr(availabilityText.indexOf(':') + 1).trim();
  var array = dateStart.split(' ');
  var releaseDateString = getIssueDateString(array[0], array[1], array[2]);

  var releaseDate = new Date(releaseDateString);
  var wholeDaysUntilNextIssue = getDaysUntilDate(releaseDate);
  var issueCoverImageURL = generateIssueCoverURL(issueNumber);

  setComicVariablesInTasker(issueCoverImageURL, issueNumber, wholeDaysUntilNextIssue, releaseDateString);

  //signal to Tasker that the code is completed
  exit();
};

xhr.send();

function getIssueDateString(month, day, year) {
    return [month, day, year, '09:00 GMT-0500'].join(' ');
}

function getDaysUntilDate(date) {
  var millisecondsUntilNextIssue = date - new Date();
  var days = millisecondsUntilNextIssue/1000/60/60/24;
  var wholeDaysUntilNextIssue = Math.floor(days);

  return wholeDaysUntilNextIssue;
}

function generateIssueCoverURL(issueNo) {
    if (issueNo.length === 1) {
	    issueNo = '0' + issueNo;
	}
	return ['http://i1.wp.com/walkingdeadcomics.org/wp-images/gallery/standard/', issueNo, '.jpg'].join('');
}

function setComicVariablesInTasker(issueCoverImageURL, issueNumber, wholeDaysUntilNextIssue, releaseDateString) {
  setLocalVariable('img', issueCoverImageURL);
  setLocalVariable('issueno', issueNumber);
  setLocalVariable('days', wholeDaysUntilNextIssue);
  setLocalVariable('date', releaseDateString);
}

function setLocalVariable(name, value, debug) {
  if (debug) {
      flash('setting ' + name + ' to ' + value);
	}
	setLocal(name, value);
};