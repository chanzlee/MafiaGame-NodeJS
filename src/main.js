import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import { Mafia, Citizen, Game } from './mafia';

$(document).ready(function() {
  $("#game").hide();
  $("#user-answer").hide();
  $("#info").hide();
  $("#result").hide();

  $("#start-menu").click(function(){
    $("#start-menu").hide();
    $("#game").show();
    // $("#user-answer").show();
    $("#info").show();

    let allPlayersList = [];
    allPlayersList.push(new Mafia("Mafia1"));
    allPlayersList.push(new Mafia("Mafia2"));
    allPlayersList.push(new Citizen("Citizen1"));
    allPlayersList.push(new Citizen("Citizen2"));
    allPlayersList.push(new Citizen("Citizen3"));
    let game = new Game(allPlayersList);
    game.logPlayersName(allPlayersList);
    game.logPlayers(allPlayersList);
    game.logTurn("Day");
    game.startGame();

  });
});
