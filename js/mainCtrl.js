angular.module('blackjack').controller('mainCtrl', function($scope, $http, blackjackService){

  $scope.getDeck = function() {
    $http.get('https://deckofcardsapi.com/api/deck/new/draw/?count=2')
    .then(function(response) {
      $scope.deck = response.data;
      var value = 0;
      $scope.deck.points = 0;
      console.log($scope.deck);
      $scope.cardsValue($scope.deck.cards);
      $scope.cards = $scope.deck.cards;
      return $scope.deck;
    });
  };

  $scope.draw = function() {
    $http.get('https://deckofcardsapi.com/api/deck/' + $scope.deck.deck_id + '/draw/?count=1')
    .then(function(response) {
      // console.log(response.data.cards[0]);
      $scope.deck.cards.push(response.data.cards[0]);
      $scope.deck.remaining--;
      $scope.cardValue($scope.deck.cards);
      return $scope.deck;
    });
  };

  $scope.cardsValue = function(cards) {
    $scope.deck.points = 0;
    for(var i = 0; i < cards.length; i++) {
      console.log(cards[i].value);
      if(cards[i].value === 'ACE') {
        cards[i].cardvalue = 11;
      } else if(cards[i].value === 'KING' || cards[i].value === 'QUEEN' || cards[i].value === 'JACK') {
        cards[i].cardvalue = 10;
      } else {
        cards[i].cardvalue = parseInt(cards[i].value);
      }
      console.log(cards[i].cardvalue);
      $scope.deck.points += cards[i].cardvalue
      console.log($scope.deck.points);
    }
  }

  //CREATE A VALUE FOR EACH CARD IN A HAND ON THE CARDS ARRAY
  //AND RE-QUERY THE TOTAL SCORE EACH TIME A NEW CARD IS DRAWN

  $scope.cardValue = function(cards) {
    for(var i = cards.length - 1; i < cards.length; i++) {
      if(cards[i].value === 'ACE') {
        if($scope.deck.points <= 10) {
          cards[i].cardvalue = 11;
        } else {
          cards[i].cardvalue = 1;
        }
      } else if(cards[i].value === 'KING' || cards[i].value === 'QUEEN' || cards[i].value === 'JACK') {
        cards[i].cardvalue = 10;
      } else {
        cards[i].cardvalue = parseInt(cards[i].value);
      }
      $scope.deck.points += cards[i].cardvalue
    }
    for(var i = 0; i < cards.length - 1; i++) {
      if(cards[i].value === 'ACE') {
        if($scope.deck.points > 21) {
          if(!cards[i].ace) {
            $scope.deck.points -= 10;
            cards[i].ace = true;
          }
        }
      }
    }
  }

});
