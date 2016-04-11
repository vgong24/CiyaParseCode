
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define("notifyFollowers", function(request, response) {
  var senderUser = request.user;
  var title = senderUser + " changed their status";
  var message = request.params.message;
  var is_background = false;

  //Search for parseUsers who are following the senderUser
  //Query the Parse.Installation for users in the list of following users
  //Send a push notification to those users.

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
	  message: message,
	  is_background: is_background
  },
  useMasterKey: true


  }).then(function() {
      response.success("Push was sent successfully.")
  }, function(error) {
      response.error("Push failed to send with error: " + error.message);
  });
});
