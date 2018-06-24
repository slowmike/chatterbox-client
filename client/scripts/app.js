//
// var app = $.get('http://parse.sfm8.hackreactor.com/', );
//stuff in data.results
//createdAt
//objectID
//roomname
//text
//updatedAt
//username

class App {
  constructor() {
    this.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';
    this.usernames = {};
    this.rooms = {};
    this.friends = {};
    this.username = 'somename&';
    this.roomname = 'someroom&';
    this.currentRoom = 'all';
  }

  init() {
    $('#main').on('click', '.submit', () => this.handleSubmit());
    $('#main').keypress((evt) => {
      if(evt.keyCode === 13) {
        this.handleSubmit();
      }
    });
    this.fetch();
    this.fetchMessages(this.currentRoom);
    setInterval(() => { this.fetchMessages(this.currentRoom); }, 500);
    // var message = '<script>$("#main > h1").text("Hello from HR99");</script>';
    // this.send(message);
    // setInterval(() => { this.send(message); }, 30000)
    // console.log(this);
    // for(var i = this.messages.length-11; i < this.messages.length; i++ ) {
    //   this.renderMessage(this.messages[i]);
    // }
  }

  send(message, room = 'all') {
    var r = document.getElementById("roomSelect");
    if(r.options[r.selectedIndex].value !== 'all') {
      message.roomname = r.options[r.selectedIndex].value;
    }
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log(`chatterbox: Message sent to ${message.roomname}`);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }

  fetch() {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server+'?order=-createdAt',
      type: 'GET',
      success: (data) => {
        for (var message of data.results) {
          this.renderRoom(message.roomname);
        }
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to recieve message', data);
      }
    });
  }

  fetchMessages(room = 'all') {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server+'?order=-createdAt',
      type: 'GET',
      success: (data) => {
        var messages = [];
        var r = document.getElementById("roomSelect");
        room = r.options[r.selectedIndex].value;
        // console.log(e);
        // console.log(renderUserID(room));
        for (var i = 0; i < data.results.length; i++) {
          if (messages.length >= 10) {
            break;
          }
          var message = data.results[i];
          if(!includesScript(message)) {
            if (room === 'all' && notUndefined(message)) {
              messages.push(message);
            } else if (room === renderUserID(message.roomname)) {
              messages.push(message);
            }
          }
        }
        this.renderMessages(messages);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to recieve message', data);
      }
    });
  }

  clearMessages() {
    $('#chats').empty();
  }
//class helpers
  renderMessage(message) {
    this.renderPeople(message);
    // var timeStamp = this.parseTimeStamp(message.updatedAt);
    // $('#chats').append(`<div class="message">${this.renderText(msgUsername)} - ${renderText(message.roomname)}<div class="timestamp">${timeStamp}<div><div class="text"> ${message.text}</div></div>`);
    this.filterMessage(message);
  }

  filterMessage(message) {
    var timeStamp = parseTimeStamp(message.updatedAt);
    var highlight = '';
    var key = JSON.stringify(message.username);
    if(!includesScript(message)) {
      if(this.friends[key] !== undefined) {
        $('#chats').append(`<div class="message" style="color:#ff0">${filterScripts(renderText(message.username))} - ${filterScripts(renderText(message.roomname))}<div class="timestamp">${timeStamp}<div><div class="text"> ${filterScripts(message.text)}</div></div>`);
      } else {
        $('#chats').append(`<div class="message">${filterScripts(renderText(message.username))} - ${filterScripts(renderText(message.roomname))}<div class="timestamp">${timeStamp}<div><div class="text"> ${filterScripts(message.text)}</div></div>`);
      }
    }
  }

  renderMessages(messages) {
    this.clearMessages();
    for (var i = 0; i < messages.length; i++ ) {
      this.renderMessage(messages[i]);
    }
  }

  renderRoom(room) {
    var roomKey = JSON.stringify(room);
    if (!this.rooms[roomKey] && room !== undefined && room !== null && room !== '' && !includesScript(room)) {
      $('#roomSelect').append(`<option value=${renderUserID(room)}>${room}</a>`);
      this.rooms[roomKey] = room;
      $('#roomSelect').on('click', `#${renderUserID(room)}`, () => this.handleOption(room));
    }
  }

  renderPeople(message) {
    var msgUsername = message.username;
    var filteredName = filterNonAlphaNumeric(message.username);
    var key = JSON.stringify(msgUsername);
    if (!this.usernames[key] && notUndefined(message) && !includesScript(msgUsername)) {
      $('#usernames').append(`<div class="username" id="${renderUserID(msgUsername)}">${renderText(msgUsername)}</div>`);
      this.usernames[key] = msgUsername;
      $('#usernames').on('click', `#${renderUserID(msgUsername)}`, () => this.handleUsernameClick(msgUsername));
    }
  }
// handlers
  handleUsernameClick(username) {
    var key = JSON.stringify(username)
    if(!this.friends[key]) {
      $('#friends').append(`<div class=friend id=${renderUserID(username)}>${renderText(username)}</div>`);
      this.friends[key] = username;
    }
  }

  handleSubmit() {
    var message = {
      username: this.username,
      text: $('.inputtxt').val(),
      roomname: this.roomname
    };
    this.send(message);
    $('.inputtxt').val('');
    this.fetch();
    this.fetchMessages();
  }

  handleOption(option) {
    console.log('option');
  }
}



$(document).ready(function() {
  var app = new App();
  app.init();
});
