var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://walkingdeadcomics.org/the-walking-dead-next-issue/', true);

xhr.onload = function () {
  var parser = new DOMParser();
  var doc = parser.parseFromString(xhr.responseText, 'text/html');

  var titleNode = doc.getElementById('p-title');
  var issueNumber = titleNode.innerText.substr(titleNode.innerText.indexOf('#')+1);
  var availabilityText = doc.querySelector('div.vision-contentbox-content.tt-content-style-black > span').innerText;
  var dateStart = availabilityText.substr(availabilityText.indexOf(':') + 1).trim();
  var array = dateStart.split(' ');
  var releaseDateString = array[0] + ' ' + array[1] + ' ' + array[2] + ' 09:00 GMT-0500';

  var releaseDate = new Date(releaseDateString);

  var millisecondsUntilNextIssue = releaseDate - new Date();

  var days = millisecondsUntilNextIssue/1000/60/60/24;
  var wholeDays = Math.floor(days);
  var issueCoverImageURL = getIssueImagePath(issueNumber);
  
  setVariablesInTasker(issueCoverImageURL, issueNumber, wholeDays, releaseDateString);

  //leave the Tasker javascriptlet
  exit();
};

xhr.send();

function getIssueImagePath(issueNo) {
    if (issueNo.length === 1) {
	    issueNo = '0' + issueNo;
	}
	return ['http://i1.wp.com/walkingdeadcomics.org/wp-images/gallery/standard/', issueNo, '.jpg'].join('')
}

function setVariablesInTasker(issueCoverImageURL, issueNumber, wholeDays, releaseDateString) {
  setLocalVariable('img',issueCoverImageURL);
  setLocalVariable('issueno',issueNumber);
  setLocalVariable('days',wholeDays);
  setLocalVariable('date',releaseDateString);
}

function setLocalVariable(name, value, debug) {
    if (debug) {
    flash('setting ' + name + ' to ' + value);
	}
	setLocal(name, value);
};