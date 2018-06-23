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
    this.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages?order=-createdAt';
    this.usernames = {};
    this.rooms = {};
    this.username = 'somename';
    this.roomname = 'someroom';
  }

  init() {
    $('#main').on('click', '.submit', () => this.handleSubmit());
    this.fetch();
    this.fetchMessages();
    setInterval(() => { this.fetchMessages(); }, 5000);
    // console.log(this);
    // for(var i = this.messages.length-11; i < this.messages.length; i++ ) {
    //   this.renderMessage(this.messages[i]);
    // }
  }

  send(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
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
      url: this.server,
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
      url: this.server,
      type: 'GET',
      success: (data) => {
        var messages = [];
        for (var i = 0; i < data.results.length; i++) {
          if (messages.length >= 10) {
            break;
          }
          var message = data.results[i];
          if (room === 'all' && message.username !== undefined) {
            messages.push(message);
          } else if (room === message.roomname) {
            messages.push(message);
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

  renderMessages(messages) {
    this.clearMessages();
    for (var i = 0; i < messages.length; i++ ) {
      this.renderMessage(messages[i]);
    }
  }

  renderMessage(message) {
    var msgUsername = message.username;
    var timeStamp = this.parseTimeStamp(message.updatedAt);
    var key = JSON.stringify(msgUsername);
    if (!this.usernames[key] && msgUsername !== undefined && msgUsername !== null && msgUsername !== '') {
      $('#usernames').append(`<div class="username">${msgUsername}</div>`);
      this.usernames[key] = msgUsername;
    }
    $('#chats').append(`<div class="message">${msgUsername} - ${message.roomname}<div class="timestamp">${timeStamp}<div><div class="text"> ${message.text}</div></div>`);
    $('#main').on('click', '.username', app.handleUsernameClick);
  }

  parseTimeStamp(timestamp) {
    var date = timestamp.slice(0, 10);
    var hour = timestamp.slice(11, 13);
    var minSec = timestamp.slice(13, 19);
    var pstHour = (parseInt(hour, 10)+17)%24;
    var time = pstHour+minSec;
    return `${date} (${time} Pacific Time)`;
  }

  renderRoom(room) {
    var roomKey = JSON.stringify(room);
    if (!this.rooms[roomKey] && room !== undefined && room !== null) {
      $('#roomSelect').append(`<option id="roomSelect" class=${room}>${room}</option>`);
      this.rooms[roomKey] = room;
    }
  }

  handleUsernameClick() {
    console.log('clicked');
  }

  handleSubmit() {
    var message = {
      username: this.username,
      text: $('.inputtxt').val(),
      roomname: this.roomname
    };
    this.send(message);
    this.fetch();
    this.fetchMessages();
  }

  handleOption() {

  }
}


var app = new App();

$(document).ready(function() {
  app.init();
  // var data = $.get(app.server, function(data) {
  //   var input = data.results;
  //   for(var i = input.length-11; i < input.length; i++) {
  //     $('body').append('<div>' + `${input[i].username}: ${input[i].text}` + '</div>');
  //   }
  // });

});
