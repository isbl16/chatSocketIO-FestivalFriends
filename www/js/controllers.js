angular.module('starter.controllers', ['firebase'])

.controller('ChatsCtrl', ['$scope', 'Chats', 'Friends', '$state', function($scope, Chats, Friends, $state) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
    $scope.friends = Friends.all();
    
  $scope.removeChat = function(chat) {
    Chats.remove(chat);
  };
      $scope.removeFriend = function(friend) {
    Friends.remove(friend);
  };
    
}])


.controller('ChatDetailCtrl', ['$scope', '$firebaseArray', '$rootScope', '$state', '$ionicScrollDelegate', function($scope, $firebaseArray, $rootScope, $state, $ionicScrollDelegate) {
    $scope.scrollSmallToBottom = function() {
        $ionicScrollDelegate.$getByHandle('small').scrollBottom();
    };
    
    $scope.userId = 0001;
    var idthing = $scope.userId + $state.params.chatId;
    $scope.convo = [];
    $scope.socket = io(); // client init socket
    $scope.socket.emit('chat.room', idthing);
    $scope.socket.on('chat.convo', function(convo) {
        $scope.convo = convo.messages;
    });
    $scope.send = function() { //when sends message, broadtcast as chat.message event
        $scope.socket.emit('chat.message', $scope.chatmessage, idthing);
        $scope.chatmessage = '';
    };
    // listen for other broadcasted messages from server
    $scope.socket.on('chat.message', function(message, room){
        if (room == idthing) {
            $scope.convo.push(message);
            $scope.$apply();
            $scope.scrollSmallToBottom();            
        }
    });
    $scope.$on('$destroy', function() {
        $scope.socket.removeAllListeners();
    });
    $scope.evalKey = function(keyCode) {
        if (keyCode == 13) {
            $scope.send();   
        }
    }

        
}])


.controller('AccountCtrl', ['$scope', '$rootScope', '$state', function($scope, $rootScope, $state) {
    $scope.user = {};
    $scope.login = function() {
        $rootScope.username = $scope.user.username;
        alert($rootScope.username);
        $state.go('tab.chats');
    }
}])

.controller('HomeCtrl', ['$scope', '$rootScope', '$state', function($scope, $rootScope, $state) {
        var socket = io(); // client init socket
        $scope.messages = [];
        $scope.send = function() { //when sends message, broadtcast as chat.message event
            socket.emit('chat.message', $scope.chatmessage);
           $scope.chatmessage = '';
        };
        // listen for other broadcasted messages from server
        $(document).ready(function(){
            socket.on('chat.message', function(message){
                $scope.messages.push(message);
                $scope.$apply();
                console.log($scope.messages);
            });
        });
}])
