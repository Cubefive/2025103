export default class Storage {
  constructor(playerStorage, teamStorage, tournamentStorage) {
    console.log('Constructing Storage with storages:', { playerStorage, teamStorage, tournamentStorage });
    this.playerStorage = playerStorage;
    this.teamStorage = teamStorage;
    this.tournamentStorage = tournamentStorage;
  }

  getPlayerDatabase() {
    console.log('Getting player database');
    return this.playerStorage.getPlayerDatabase();
  }

  addPlayer(player) {
    console.log('Adding player:', player);
    this.playerStorage.addPlayer(player);
  }

  editPlayer(playerId, updatedPlayer) {
    console.log('Editing player:', playerId, updatedPlayer);
    this.playerStorage.editPlayer(playerId, updatedPlayer);
  }

  deletePlayer(playerId) {
    console.log('Deleting player:', playerId);
    this.playerStorage.deletePlayer(playerId);
  }

  getTeamDatabase() {
    console.log('Getting team database');
    return this.teamStorage.getTeamDatabase();
  }

  addTeam(team) {
    console.log('Adding team:', team);
    this.teamStorage.addTeam(team);
  }

  editTeam(teamId, updatedTeam) {
    console.log('Editing team:', teamId, updatedTeam);
    this.teamStorage.editTeam(teamId, updatedTeam);
  }

  deleteTeam(teamId) {
    console.log('Deleting team:', teamId);
    this.teamStorage.deleteTeam(teamId);
  }

  getTournamentDatabase() {
    console.log('Getting tournament database');
    const db = this.tournamentStorage.getTournamentDatabase();
    console.log('Tournament database retrieved:', db.length, 'tournaments');
    return db;
  }

  addTournament(tournament) {
    console.log('Adding tournament:', tournament);
    this.tournamentStorage.addTournament(tournament);
  }

  editTournament(tournamentId, updatedTournament) {
    console.log('Editing tournament:', tournamentId, updatedTournament);
    this.tournamentStorage.editTournament(tournamentId, updatedTournament);
  }

  deleteTournament(tournamentId) {
    console.log('Deleting tournament:', tournamentId);
    this.tournamentStorage.deleteTournament(tournamentId);
  }
}