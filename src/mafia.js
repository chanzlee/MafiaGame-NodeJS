let counter = 0;

export class Player {
  constructor (name) {
    this.id = counter++;
    this.name = name;
    this.suspicious = Math.random();
  }

  setSuspicious () {
    this.suspicious = Math.random();
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
    this.time = Time.DAY;
    this.players = players;
    this.playerIndex = 0;
    this.gameOver = false;
    this.winner = null;
    this.userPlayer = this.players[Math.floor(Math.random()*this.players.length)];
  }
    
  dayVote() {
    this.players.forEach(function(eachPlayer) {
      eachPlayer.setSuspicious();
    });
    let playersListSorted = this.players.slice().sort(function(player1, player2) {
      return player2.suspicious - player1.suspicious;
    });
    return playersListSorted[0];
  }

  nightVote() {
    let victims = this.players.slice().filter(player => player.status === Status.CITIZEN);
    let victim = victims[Math.floor(Math.random()*victims.length)];
    return victim;
  }

  startGame () {
    //It starts from DAY
    let toBeKilled = this.dayVote().id;
    
    console.log(toBeKilled);
    this.players = this.players.filter(player => player.id !== toBeKilled);
    console.log(this.players);
    if (this.gameOverCheck() === true) {
      console.log("game over");
      clearInterval(gameInterval);
    }

    let gameInterval = setInterval(() => {
      this.time = (this.time === Time.DAY) ? Time.NIGHT:Time.DAY;
      if (this.time === Time.DAY) {
        let toBeKilled = this.dayVote().id;
        console.log(toBeKilled);
        this.players = this.players.filter(player => player.id !== toBeKilled);
        console.log(this.players);
        if (this.gameOverCheck() === true) {
          console.log("game over");
          if (this.winner != null) console.log(this.winner);
          
          clearInterval(gameInterval);
        }
      }
      else {
        console.log("night");
        let toBeHunted = this.nightVote().id;
        console.log(toBeHunted);
        this.players = this.players.filter(player => player.id !== toBeHunted);
        console.log(this.players);
        if (this.gameOverCheck() === true) {
          console.log("game over (hunted)");
          if (this.winner != null) console.log(this.winner);
          
          clearInterval(gameInterval);
        }
      }
    }, 3000);
  }

  gameOverCheck() {
    if (this.players.includes(this.userPlayer) === false) {
      this.gameOver = true;
      this.winner = (this.userPlayer.status === Status.MAFIA) ? Status.CITIZEN:Status.MAFIA;
      return true;
    }
    else if (this.players.filter(player => player.status === Status.CITIZEN).length === 0) {
      this.winner = Status.MAFIA;
      this.gameOver = true;
      return true;
    }
    else if (this.players.filter(player => player.status === Status.MAFIA).length === 0) {
      this.winner = Status.CITIZEN;
      this.gameOver = true;
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