Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define("notifyAllUsers", function(request, response) {
  var title = "notifyTest";
  var message = "this is a test post";

  Parse.Push.send({
    where: {
      "deviceType": {
        "$in": ["ios", "android"]
      }
    },
    data: {
      title: title,
      message: message
    }
  }, {
    success: function() {
      // Push was successful
      response.success("notification sent");
    },
    error: function(error) {
      // Handle error
      response.error("Push failed to send : " + error.message + " " + title + " " + message);
    },
    useMasterKey: true
  });

});

Parse.Cloud.define("notifyFollowers", function(request, response) {
  var senderUserId = request.params.senderId;
  var title = senderUser + " changed their status";
  var message = request.params.message;
  var is_background = false;
  var pushQuery = new Parse.Query(Parse.Installation);
  var followersQuery = new Parse.Query(Parse.Favorites);
  var userQuery = new Parse.Query(Parse.User);

  var recipientUser = new Parse.User();
  recipientUser.id = senderUserId;
  //Search for Favorite objects who are following the senderUser
  followersQuery.equalTo("favorite", recipientUser);

  //Get the users who are followers of the Favorites
  userQuery.include("follower");
  userQuery.matchesQuery('follower', followersQuery);

  //Query the Parse.Installation for users in the list of following users
  pushQuery.exists("pUser");
  pushQuery.include("pUser");
  pushQuery.matchesQuery('pUser', userQuery);

  //Send a push notification to those users.
  // Send the push notification to results of the query
  Parse.Push.send({
    where: pushQuery,
    data: {
      title: title,
      message: message
    }
  }, {
    success: function() {
      // Push was successful
      response.success("notification sent");
    },
    error: function(error) {
      // Handle error
      response.error("Push failed to send : " + error.message + " " + title + " " + message);
    },
    useMasterKey: true
  });

});

Parse.Cloud.define("getAllFollowers", function(request, response) {
  var favoriteUser = request.params.user;

});

Parse.Cloud.define("sendPushToUser", function(request, response) {
  var senderUser = request.user;
  var recipientUserId = request.params.recipientId;
  var message = request.params.message;
  var title = request.params.title;
  var is_background = request.params.isBackground;


  // Validate the message text.
  // For example make sure it is under 140 characters
  if (message.length > 140) {
    // Truncate and add a ...
    message = message.substring(0, 137) + "...";
  }

  // Send the push.
  // Find devices associated with the recipient user
  var recipientUser = new Parse.User();
  recipientUser.id = recipientUserId;
  var pushQuery = new Parse.Query(Parse.Installation);
  pushQuery.equalTo("pUser", recipientUser);

  // Send the push notification to results of the query
  Parse.Push.send({
    where: pushQuery,
    data: {
      title: title,
      message: message
    }
  }, {
    success: function() {
      // Push was successful
      response.success("notification sent");
    },
    error: function(error) {
      // Handle error
      response.error("Push failed to send : " + error.message + " " + title + " " + message);
    },
    useMasterKey: true
  });


});
