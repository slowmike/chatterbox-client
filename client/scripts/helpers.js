
filterScripts = (str) =>{
  return includesScript(str) ? str.replace(/</g, "&lt;").replace(/>/g, "&gt;") : str;
}

includesScript = (str) => {
  if(typeof(str) !== 'string') {
    return false;
  }
  return str.includes('</script>') || str.includes('%3C/script%3E');
}

filterNonAlphaNumeric = (str) => {
  return str.replace(/\W\d/g, '');
}

renderText = (text) => {
  var space = text.indexOf('%20');
  if(space > 0) {
    username = text.slice(0, space) + ' ' + text.slice(space+3);
  }
  return text;
}

renderUserID = (username) => {
  return username !== undefined ? username.replace(/[^a-zA-Z0-9]/, 'somearbitrarilylongstring') : username;
}

parseTimeStamp = (timestamp) => {
  var d = new Date(timestamp);
  var day = [, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return `${day[d.getDay()]} ${d.toLocaleString('en-US')}`;
}

notUndefined = (message) => {
  return message.username !== undefined && message.username !== null && message.roomname !== undefined && message.roomname !== null && message.text !== undefined && message.text !== null && message.text !== '';
}
