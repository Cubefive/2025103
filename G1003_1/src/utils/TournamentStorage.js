export default class TournamentStorage {
  constructor() {
    console.log('Constructing TournamentStorage');
    this.tournamentDatabase = this.loadTournamentDatabase();
    this.setupEventListeners();
  }

  setupEventListeners() {
    console.log('Setting up event listeners for TournamentStorage');
    try {
      window.addEventListener('tournamentDatabaseUpdated', () => {
        console.log('tournamentDatabaseUpdated event received in TournamentStorage');
        this.tournamentDatabase = this.loadTournamentDatabase();
        console.log('Tournament database updated:', this.tournamentDatabase);
      });
    } catch (error) {
      console.error('Error setting up event listeners for TournamentStorage:', error);
    }
  }

  loadTournamentDatabase() {
    console.log('Loading tournament database from localStorage');
    const rawData = localStorage.getItem('tournamentDatabase');
    console.log('Raw tournamentDatabase from localStorage:', rawData);
    if (rawData) {
      return JSON.parse(rawData);
    }
    const defaultTournaments = [
      {
        id: 't1',
        name: 'Test Tournament 2025',
        date: '2025-06-15',
        maxTeams: 16,
        stacksPerTeam: 4,
        location: 'Casino',
        startTime: '10:00',
        type: 'No Limit Hold\'em',
        maxTables: 4,
        stackSize: 10000,
        status: 'Upcoming',
        organizer: 'Poker Club',
        maxSeatsPerTable: 9,
        allocationMode: 'random',
        checkedInTeams: ['1', '2', '3', '4', '5'],
        startTimestamp: null
      },
      {
        id: 't2',
        name: 'October Classic',
        date: '2025-10-18',
        maxTeams: 10,
        stacksPerTeam: 3,
        location: 'Krukan',
        startTime: '12:00',
        type: 'Pot Limit Omaha',
        maxTables: 3,
        stackSize: 15000,
        status: 'Upcoming',
        organizer: 'Krukan Poker Society',
        maxSeatsPerTable: 9,
        allocationMode: 'random',
        checkedInTeams: [],
        startTimestamp: null
      }
    ];
    this.saveTournamentDatabase(defaultTournaments);
    console.log('No tournamentDatabase found in localStorage, initialized with default data: 2 tournaments');
    return defaultTournaments;
  }

  getTournamentDatabase() {
    console.log('Getting tournament database:', this.tournamentDatabase.length, 'tournaments');
    return this.tournamentDatabase;
  }

  addTournament(tournament) {
    console.log('Adding tournament:', tournament);
    // Kontrollera om turneringen redan finns för att undvika dubbletter
    if (!this.tournamentDatabase.find(t => t.id === tournament.id)) {
      this.tournamentDatabase.push(tournament);
      this.saveTournamentDatabase();
      console.log('Tournament added, new database size:', this.tournamentDatabase.length);
      window.dispatchEvent(new Event('tournamentDatabaseUpdated'));
    } else {
      console.warn('Tournament with id already exists:', tournament.id);
    }
  }

  editTournament(id, tournament) {
    console.log('Editing tournament:', id, tournament);
    const index = this.tournamentDatabase.findIndex(t => t.id === id);
    if (index !== -1) {
      this.tournamentDatabase[index] = { ...this.tournamentDatabase[index], ...tournament };
      this.saveTournamentDatabase();
      window.dispatchEvent(new Event('tournamentDatabaseUpdated'));
    } else {
      console.warn('Tournament not found for editing:', id);
    }
  }

  deleteTournament(id) {
    console.log('Deleting tournament:', id);
    this.tournamentDatabase = this.tournamentDatabase.filter(t => t.id !== id);
    this.saveTournamentDatabase();
    window.dispatchEvent(new Event('tournamentDatabaseUpdated'));
  }

  saveTournamentDatabase(data = this.tournamentDatabase) {
    console.log('Saving tournament database to localStorage:', data);
    localStorage.setItem('tournamentDatabase', JSON.stringify(data));
    console.log('Tournament database saved successfully:', data.length, 'tournaments');
  }
}