import $ from 'jquery';

let counter = 0;

export class Player {
  constructor (name) {
    this.id = counter++;
    this.name = name;
    this.suspicious = Math.random();
    this.aggro = Math.random();
  }

  setStats () {
    this.suspicious = Math.random();
    this.aggro = Math.random();
  }
}

export class Mafia extends Player {
  constructor (name) {
    super(name);
    this.status = Status.MAFIA;
  }
}

export class Citizen extends Player {
  constructor (name) {
    super(name);
    this.status = Status.CITIZEN;
  }
}

const Status = {
  MAFIA: 0,
  CITIZEN: 1
};

export class Game {
  constructor (players) {
    this.time = Time.NIGHT;
    this.players = players;
    this.playerIndex = 0;
    this.gameOver = false;
    this.winner = null;
    this.userPlayer = this.players[Math.floor(Math.random()*this.players.length)];
  }

  dayVote() {
    this.players.forEach(function(eachPlayer) {
      eachPlayer.setStats();
    });
    let playersListSuspicious = this.players.slice().sort(function(player1, player2) {
      return player2.suspicious - player1.suspicious;
    });
    let playersListAggro = this.players.slice().sort(function(player1, player2) {
      return player2.aggro - player1.aggro;
    });
    let topCandiates = [playersListSuspicious[0], playersListAggro[0]];
    let finalPick = topCandiates[Math.floor(Math.random()*topCandiates.length)];
    return finalPick;
  }


  nightVote() {
    let victims = this.players.slice().filter(player => player.status === Status.CITIZEN);
    let victim = victims[Math.floor(Math.random()*victims.length)];
    return victim;
  }

  handleVote() {
    let game = this;
    let peopleIdGotVote = [];
    this.players.forEach(function(player, i){
      let pick = game.dayVote();
      peopleIdGotVote.push(pick);
      $("#player"+i+"vote").text(pick.name);
    });
    var frequency = {};
    peopleIdGotVote.forEach(function(player) { frequency[player] = 0; });
    var uniques = peopleIdGotVote.filter(function(player) {
      return ++frequency[player] == 1;
    });
    let peopleIdGotVoteFrequency = uniques.sort(function(player1, player2) {
      return frequency[player1] - frequency[player2];
    });
    console.log(peopleIdGotVoteFrequency[0].name);
    return peopleIdGotVoteFrequency[0];
  }

  logPlayersName(players) {
    players.forEach(function(player, i) {
      $("#player"+i+"name").text(`${player.name}`);
    });
  }

  logPlayers(players) {
    $("#current-players").text("");
    players.forEach(function(player) {
      $("#current-players").append(`${player.name} `);
    });
  }

  logToBeKilled(toBeKilled) {
    let game = this;
    $("#log").text(`${toBeKilled.name} is executed...`);
    (toBeKilled.id === game.userPlayer.id) ? $("#log").append("(You)"): "Not You" ;
  }

  logToBeHunted(toBeHunted) {
    let game = this;
    $("#log").text(`${toBeHunted.name} is murdered during the night...`);
    (toBeHunted.id === game.userPlayer.id) ? $("#log").append("(You)"): "Not You" ;
  }

  logWinner(winner) {
    (winner === 0) ? $("#winner").text("Mafias"):$("#turn").text("Citizens");
  }

  logGameOver() {
    $("#game-over").text("Game Over");
  }

  logTurn(turn) {
    (turn === 0) ? $("#turn").text("Day"):$("#turn").text("Night");
  }

  startGame () {
    //It starts from DAY
    let game = this;
    let thisPlayers = this.players;
    var tick = 0;
    let gameInterval = setInterval(() => {
      tick = 6;
      let tickStarter = function () {
        let tickLogger = setInterval(()=> {
          console.log(tick);
          $("#time").text(tick);
          if (tick > 0)
            tick--;
        }, 1000);

        setTimeout(function ( ) {
          clearInterval(tickLogger);
        },6000);
      };
      tickStarter();

      this.time = (this.time === Time.DAY) ? Time.NIGHT :Time.DAY;
      (this.time === Time.DAY) ? $("body").removeClass("night") : $("body").addClass("night");
      this.logTurn(this.time);
      //Day
      if (this.time === Time.DAY) {
        let toBeKilled = this.handleVote();
        console.log(toBeKilled);
        this.players = this.players.filter(player => player.id !== toBeKilled.id);
        this.logToBeKilled(toBeKilled);
        thisPlayers = this.players;
        console.log(this.players);
        this.logPlayers(thisPlayers);
        if (this.gameOverCheck() === true) {
          console.log("game over");
          game.logGameOver();
          if (this.winner != null) {
            console.log(this.winner);
            let thisWinner = game.winner;
            game.logWinner(thisWinner);
          }
          clearInterval(gameInterval);
        }
      }
      //Night
      else {
        console.log("night");
        let toBeHunted = this.nightVote();
        console.log(toBeHunted.name);
        this.players = this.players.filter(player => player.id !== toBeHunted.id);
        this.logToBeHunted(toBeHunted);
        thisPlayers = this.players;
        console.log(this.players);
        this.logPlayers(thisPlayers);
        if (this.gameOverCheck() === true) {
          console.log("game over (hunted)");
          game.logGameOver();
          if (this.winner != null){
            console.log(this.winner);
            let thisWinner = game.winner;
            game.logWinner(thisWinner);
          }
          clearInterval(gameInterval);
        }
      }
    }, 6000);
  }

  gameOverCheck() {
    if (this.players.includes(this.userPlayer) === false) {
      this.gameOver = true;
      this.winner = (this.userPlayer.status === Status.MAFIA) ? Status.CITIZEN:Status.MAFIA;
      $("#time").hide();
      $("#result").show();
      return true;
    }
    else if (this.players.filter(player => player.status === Status.CITIZEN).length === 0) {
      this.winner = Status.MAFIA;
      this.gameOver = true;
      $("#time").hide();
      $("#result").show();
      return true;
    }
    else if (this.players.filter(player => player.status === Status.MAFIA).length === 0) {
      this.winner = Status.CITIZEN;
      this.gameOver = true;
      $("#time").hide();
      $("#result").show();
      return true;
    }
    else {
      return false;
    }
  }
}

const Time = {
  DAY: 0,
  NIGHT: 1
};
