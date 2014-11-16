'use strict';

$(function () {
  var randNumber;
  var numGuesses = 5;
  var submit = $('#submit-guess');
  var alert = $('.alert');
  var hint = $('#hint');
  var guess = $('#guess');
  var playAgain = $('#play-again');
  var gameForm = $('.game-form');
  var guessesLeft = $('#guesses-left');
  var guesses = [];
  var numberRow = $('#guess-chart #number');
  var levelRow = $('#guess-chart #level');
       
  
  function genRandNumber() {
    randNumber = Math.floor((Math.random() * 100) + 1);
    console.log('generated a random number: ' + randNumber);
  }

  function checkValidity(input) {
    if ( input > 0 && input < 101 ) {
      return true;
    }
    return false;
  }

  function restartGame() {
    numberRow.find('td:gt(0)').remove();
    levelRow.find('td:gt(0)').remove();
    $('.filler-text').toggleClass('hide');
    submit.prop({ disabled: false });
    playAgain.prop({ disabled: true });
    genRandNumber();
    guess.val('');
    guesses = [];
    numGuesses = 5;
    guessesLeft.text(numGuesses);
    hint.data('bs.popover').options.content = randNumber;
  }

  function endGame() {
    submit.prop({ disabled: true });
    playAgain.prop({ disabled: false });
  }

  // Initialization for Bootstrap javascript elements
  alert.alert();
  genRandNumber();
  hint.popover({ content: randNumber});
  guessesLeft.text(numGuesses);

  // Submit button click event
  submit.click(function(event) {
    if ( checkValidity(guess.val()) ) {
      var guessedNumber = Number(guess.val());
      if ( guessedNumber === randNumber) {
        $.growl('<strong>'+ guess.val() + '</strong> is the correct answer! You have won the game!', {
          allow_dismiss: false,
          type: 'success'
        });
        endGame();
      } else if (guesses.indexOf(guessedNumber) !== -1 ) {
        //guess was previously made
        $.growl('Guess was previously made.', {
          allow_dismiss: false,
          type: 'danger'
        });
      } else {
        if (numGuesses === 5) { $('.filler-text').toggleClass('hide');}
        guesses.push(guessedNumber);
        numGuesses--;
        guessesLeft.text(numGuesses);
        numberRow.append('<td>'+guessedNumber+'</td>');

        var diff = Math.abs(randNumber - guessedNumber);
        if (diff < 5) {
          levelRow.append('<td><span class="red ion-fireball"></span><span class="red ion-fireball"></span><span class="red ion-fireball"></span></td>');
        } else if (diff < 10) {
          levelRow.append('<td><span class="red ion-fireball"></span><span class="red ion-fireball"></span></td>');
        } else  if (diff < 15) {
          levelRow.append('<td><span class="red ion-fireball"></span></td>');
        } else  if (diff < 20) {
          levelRow.append('<td><span class="blue ion-cube"></span></td>');
        } else  if (diff < 25) {
          levelRow.append('<td><span class="blue ion-cube"></span><span class="blue ion-cube"></span></td>');
        } else  {
          levelRow.append('<td><span class="blue ion-cube"></span><span class="blue ion-cube"></span><span class="blue ion-cube"></span></td>');
        }


        if (numGuesses === 0) { 
          $.growl('Sorry, but the correct answer was <strong>' + randNumber + '</strong>.', {
            allow_dismiss: false,
            type: 'danger'
          });
          endGame(); 
        }
      }
      guess.val('');
    } else {
      gameForm.addClass('has-error animated shake'); 
      setTimeout(function() { gameForm.removeClass('animated shake'); } , 1100);  
      setTimeout(function() { gameForm.removeClass('has-error'); } , 1700);
    }
  });

  // Input enter keypress --- triggers submit button click event
  guess.keypress(function(e) {
    if(e.which === 13 && numGuesses !== 0) {
      submit.trigger('click');
    }
  });
  
  // Play again button resets the game
  playAgain.click(function(event) {
    restartGame();
  });


});
