export default class TableDistribution {
  constructor(tournamentStorage, teamStorage) {
    console.log('Constructing TableDistribution');
    this.tournamentStorage = tournamentStorage;
    this.teamStorage = teamStorage;
    this.tableDatabase = null;
    this.loadTableDatabase();
    this.setupEventListeners();
  }

  setupEventListeners() {
    console.log('Setting up event listeners for TableDistribution');
    try {
      document.removeEventListener('tournamentDatabaseUpdated', this.handleTournamentDatabaseUpdated);
      this.handleTournamentDatabaseUpdated = () => {
        console.log('tournamentDatabaseUpdated event received in TableDistribution');
        try {
          this.updateTournamentDatabase();
        } catch (error) {
          console.error('Error in tournamentDatabaseUpdated handler:', error);
        }
      };
      document.addEventListener('tournamentDatabaseUpdated', this.handleTournamentDatabaseUpdated);
    } catch (error) {
      console.error('Error setting up event listeners for TableDistribution:', error);
    }
  }

  loadTableDatabase() {
    console.log('Loading table database from localStorage');
    try {
      const rawData = localStorage.getItem('tableDatabase');
      if (rawData) {
        this.tableDatabase = JSON.parse(rawData);
        console.log('Loaded tableDatabase:', this.tableDatabase);
      } else {
        this.tableDatabase = [];
        console.log('No tableDatabase found in localStorage, initialized as empty array');
      }
    } catch (error) {
      console.error('Error loading table database:', error);
      this.tableDatabase = [];
    }
  }

  saveTableDatabase() {
    console.log('Saving table database to localStorage:', this.tableDatabase);
    try {
      localStorage.setItem('tableDatabase', JSON.stringify(this.tableDatabase));
      console.log('Table database saved');
    } catch (error) {
      console.error('Error saving table database:', error);
    }
  }

  updateTournamentDatabase() {
    console.log('Updating tournament database in TableDistribution');
    try {
      this.tournamentStorage.reloadTournamentDatabase();
      console.log('Tournament database updated:', this.tournamentStorage.getTournamentDatabase());
    } catch (error) {
      console.error('Error updating tournament database:', error);
    }
  }

  distributeTables(tournamentId, allocationMode = 'random') {
    console.log(`Distributing tables for tournamentId: ${tournamentId}, allocationMode: ${allocationMode}`);
    try {
      // Tvinga omladdning av tournamentDatabase
      this.updateTournamentDatabase();
      const tournament = this.tournamentStorage.getTournamentDatabase().find(t => t.id === tournamentId);
      if (!tournament) {
        console.error(`Tournament not found for id: ${tournamentId}`);
        throw new Error('Tournament not found');
      }
      console.log('Tournament found:', tournament);

      const checkedInTeams = tournament.checkedInTeams || [];
      if (checkedInTeams.length === 0) {
        console.warn('No teams checked in for tournament:', tournamentId);
        return [];
      }

      const maxTables = tournament.maxTables || 10;
      const maxSeatsPerTable = tournament.maxSeatsPerTable || 9;
      const stacksPerTeam = tournament.stacksPerTeam || 4;
      console.log(`Distribution parameters: maxTables=${maxTables}, maxSeatsPerTable=${maxSeatsPerTable}, stacksPerTeam=${stacksPerTeam}`);

      const totalStacks = checkedInTeams.length * stacksPerTeam;
      const minTablesNeeded = Math.ceil(totalStacks / maxSeatsPerTable);
      const numTables = Math.min(minTablesNeeded, maxTables);
      console.log(`Total stacks: ${totalStacks}, Min tables needed: ${minTablesNeeded}, Using ${numTables} tables`);

      if (numTables > maxTables) {
        console.warn(`Cannot distribute ${totalStacks} stacks with max ${maxTables} tables and ${maxSeatsPerTable} seats per table`);
        return [];
      }

      const tables = Array.from({ length: numTables }, (_, index) => ({
        tournamentId,
        tableId: index + 1,
        seats: []
      }));

      const seats = [];
      checkedInTeams.forEach(teamId => {
        for (let i = 1; i <= stacksPerTeam; i++) {
          seats.push({ teamId, stackNumber: i });
        }
      });

      if (allocationMode.toLowerCase() === 'sequential') {
        let seatIndex = 0;
        tables.forEach(table => {
          while (table.seats.length < maxSeatsPerTable && seatIndex < seats.length) {
            table.seats.push({ ...seats[seatIndex], seatNumber: table.seats.length + 1 });
            seatIndex++;
          }
        });
      } else {
        // Random allocation
        const shuffledSeats = seats.sort(() => Math.random() - 0.5);
        let seatIndex = 0;
        tables.forEach(table => {
          while (table.seats.length < maxSeatsPerTable && seatIndex < shuffledSeats.length) {
            table.seats.push({ ...shuffledSeats[seatIndex], seatNumber: table.seats.length + 1 });
            seatIndex++;
          }
        });
      }

      this.tableDatabase = this.tableDatabase.filter(d => d.tournamentId !== tournamentId);
      this.tableDatabase.push(...tables);
      this.saveTableDatabase();
      console.log('Table distribution completed:', tables);
      return tables;
    } catch (error) {
      console.error('Error distributing tables:', error);
      return [];
    }
  }

  simulateTableDistribution({ numTeams, maxTables, stacksPerTeam, maxSeatsPerTable, allocationMode = 'random' }) {
    console.log('Simulating table distribution:', { numTeams, maxTables, stacksPerTeam, maxSeatsPerTable, allocationMode });
    try {
      const totalStacks = numTeams * stacksPerTeam;
      const minTablesNeeded = Math.ceil(totalStacks / maxSeatsPerTable);
      const numTables = Math.min(minTablesNeeded, maxTables);
      console.log(`Simulation: Total stacks=${totalStacks}, Min tables needed=${minTablesNeeded}, Using ${numTables} tables`);

      if (numTables > maxTables) {
        console.warn(`Cannot simulate ${totalStacks} stacks with max ${maxTables} tables and ${maxSeatsPerTable} seats per table`);
        return [];
      }

      const tables = Array.from({ length: numTables }, (_, index) => ({
        tableId: index + 1,
        seats: []
      }));

      const seats = [];
      for (let i = 1; i <= numTeams; i++) {
        for (let j = 1; j <= stacksPerTeam; j++) {
          seats.push({ teamId: `Team${i}`, stackNumber: j });
        }
      }

      if (allocationMode.toLowerCase() === 'sequential') {
        let seatIndex = 0;
        tables.forEach(table => {
          while (table.seats.length < maxSeatsPerTable && seatIndex < seats.length) {
            table.seats.push({ ...seats[seatIndex], seatNumber: table.seats.length + 1 });
            seatIndex++;
          }
        });
      } else {
        // Random allocation
        const shuffledSeats = seats.sort(() => Math.random() - 0.5);
        let seatIndex = 0;
        tables.forEach(table => {
          while (table.seats.length < maxSeatsPerTable && seatIndex < shuffledSeats.length) {
            table.seats.push({ ...shuffledSeats[seatIndex], seatNumber: table.seats.length + 1 });
            seatIndex++;
          }
        });
      }

      console.log('Simulated table distribution completed:', tables);
      return tables;
    } catch (error) {
      console.error('Error simulating table distribution:', error);
      return [];
    }
  }

  getTableDistribution(tournamentId) {
    console.log(`Getting table distribution for tournamentId: ${tournamentId}`);
    try {
      const distribution = this.tableDatabase.filter(d => d.tournamentId === tournamentId);
      console.log('Table distribution retrieved:', distribution);
      return distribution;
    } catch (error) {
      console.error('Error getting table distribution:', error);
      return [];
    }
  }
}