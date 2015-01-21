var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://walkingdeadcomics.org/the-walking-dead-next-issue/', true);

xhr.onload = function () {
  var parser = new DOMParser();
  var doc = parser.parseFromString(xhr.responseText, 'text/html');

  var titleNode = doc.getElementById('p-title');
  var issuenumber = titleNode.innerText.substr(titleNode.innerText.indexOf('#')+1);
  var availabilityText = doc.querySelector('div.vision-contentbox-content.tt-content-style-black > span').innerText;
  var dateStart = availabilityText.substr(availabilityText.indexOf(':') + 1).trim();
  var array = dateStart.split(' ');
  var releasedatestring = array[0] + ' ' + array[1] + ' ' + array[2] + ' 09:00 GMT-0500';

  var releaseDate = new Date(releasedatestring);

  var msUntil = releaseDate - new Date();

  var days = msUntil/1000/60/60/24;
  var wholedays = Math.floor(days);
  var img = doc.querySelector('#jig1 a').href;
  
  setVariablesInTasker(img, issuenumber, wholedays, releasedatestring);

  //leave the Tasker javascriptlet
  exit();
};

xhr.send();

function setVariablesInTasker(img, issuenumber, wholedays, releasedatestring) {
  setLocalVariable('img',img);
  setLocalVariable('issueno',issuenumber);
  setLocalVariable('days',wholedays);
  setLocalVariable('date',releasedatestring);
}

function setLocalVariable(name, value, debug) {
    if (debug) {
    flash('setting ' + name + ' to ' + value);
	}
	setLocal(name,value);
};