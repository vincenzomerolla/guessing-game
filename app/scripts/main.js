'use strict';

$(function () {
  var randNumber = null;
  var numGuesses = 0;
  var guesses = [];
  var isGameOver = false;
  var submit = $('#submit-guess');
  var hint = $('#hint');
  var guess = $('#guess');
  var playAgain = $('#play-again');
  var fillerText = $('.filler-text');
  var gameForm = $('.game-form');
  var guessesLeft = $('#guesses-left');
  var numberRow = $('#guess-chart #number');
  var levelRow = $('#guess-chart #level');
       
  
  function genRandNumber() {
    randNumber = Math.floor((Math.random() * 100) + 1);
    console.log('generated a random number: ' + randNumber);
  }

  function isValidNumber(input) {
    if ( !isNaN(input) && input > 0 && input < 101 ) {
      return true;
    }
    return false;
  }

  function restartGame() {
    isGameOver = false;
    numberRow.find('td:gt(0)').remove();
    levelRow.find('td:gt(0)').remove();
    if (fillerText.hasClass('hide')) {
      fillerText.removeClass('hide');
    } 
    submit.prop({ disabled: false });
    hint.prop({ disabled: true });
    genRandNumber();
    guess.val('');
    guesses = [];
    numGuesses = 0;
    guessesLeft.text(5);
    hint.data('bs.popover').options.content = randNumber;
  }

  function endGame() {
    isGameOver = true;
    submit.prop({ disabled: true });
  }

  // function repeat 
  // http://stackoverflow.com/questions/202605/repeat-string-javascript
  function repeat(pattern, count) {
    if (count < 1) return '';
    var result = '';
    while (count > 1) {
        if (count & 1) result += pattern;
        count >>= 1, pattern += pattern;
    }
    return result + pattern;
  }

  // Initialization for Bootstrap javascript elements
  genRandNumber();
  hint.popover({ content: randNumber});
  guessesLeft.text(5);

  // Submit button click event
  submit.click(function(event) {
    if ( isValidNumber(guess.val()) ) {
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
        if (numGuesses === 0) { 
          hint.prop({ disabled: false });
          fillerText.toggleClass('hide');
        }
        guesses.push(guessedNumber);
        numGuesses++;
        guessesLeft.text(5 - numGuesses);
        
        var str = '<td>'+guessedNumber+'&nbsp;';
             
        str += guessedNumber < randNumber ? '<span class="ion-arrow-up-a"></span></td>' : '<span class="ion-arrow-down-a"></span></td>';
  

        numberRow.append(str);

        var diff = Math.abs(randNumber - guessedNumber);
        if (diff < 5) {
          levelRow.append('<td>' + repeat('<span class="red ion-fireball"></span>', 3) + '</td>');
        } else if (diff < 10) {
          levelRow.append('<td>'+ repeat('<span class="red ion-fireball"></span>', 2) +'</td>');
        } else  if (diff < 15) {
          levelRow.append('<td><span class="red ion-fireball"></span></td>');
        } else  if (diff < 20) {
          levelRow.append('<td><span class="blue ion-cube"></span></td>');
        } else  if (diff < 25) {
          levelRow.append('<td>' + repeat('<span class="blue ion-cube"></span>', 2) + '</td>');
        } else  {
          levelRow.append('<td>' + repeat('<span class="blue ion-cube"></span>', 3) + '</td>');
        }


        if (numGuesses === 5) { 
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
    if(e.which === 13 && !isGameOver) {
      submit.trigger('click');
    }
  });
  
  // Play again button resets the game
  playAgain.click(function(event) {
    restartGame();
    $.growl('The game has been reset.', {
      allow_dismiss: false,
      type: 'warning'
    });
  });

  // On click listener to close out popover
  $('html').on('click', function(e) {
    if (typeof $(e.target).data('original-title') === 'undefined') {
      $('[data-original-title]').popover('hide');
    }
  });

});
