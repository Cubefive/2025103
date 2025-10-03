export default class TeamStorage {
  constructor(storage) {
    console.log('Constructing TeamStorage');
    this.storage = storage;
    this.teamDatabase = this.loadTeamDatabase();
  }

  loadTeamDatabase() {
    console.log('Loading teamDatabase');
    try {
      const rawTeamDatabase = localStorage.getItem('teamDatabase');
      console.log('Raw teamDatabase from localStorage:', rawTeamDatabase);
      let teamDatabase = rawTeamDatabase ? JSON.parse(rawTeamDatabase) : [];
      
      if (!Array.isArray(teamDatabase)) {
        console.warn('teamDatabase is not an array, initializing as empty');
        teamDatabase = [];
      }

      // Sync with playerDatabase
      const playerDatabase = this.storage.getPlayerDatabase();
      if (playerDatabase && Array.isArray(playerDatabase)) {
        teamDatabase.forEach(team => {
          if (team.playerIds && Array.isArray(team.playerIds)) {
            team.playerIds.forEach(playerId => {
              const player = playerDatabase.find(p => p.id === playerId);
              if (player && player.teamId !== team.id) {
                player.teamId = team.id;
              }
            });
          }
        });
        this.storage.savePlayerDatabase(playerDatabase);
      } else {
        console.warn('playerStorage not initialized or empty, skipping teamDatabase sync');
      }

      console.log('Loaded teamDatabase:', teamDatabase);
      return teamDatabase;
    } catch (error) {
      console.error('Error loading teamDatabase:', error);
      return [];
    }
  }

  saveTeamDatabase() {
    console.log('Saving teamDatabase:', this.teamDatabase);
    try {
      localStorage.setItem('teamDatabase', JSON.stringify(this.teamDatabase));
      console.log('teamDatabase saved to localStorage');
    } catch (error) {
      console.error('Error saving teamDatabase:', error);
    }
  }

  addTeam(teamData) {
    console.log('Adding team:', teamData);
    try {
      const newTeam = {
        id: crypto.randomUUID(),
        name: teamData.name,
        playerIds: teamData.playerIds || [],
        captainId: teamData.captainId || null
      };

      // Update playerDatabase with teamId
      const playerDatabase = this.storage.getPlayerDatabase();
      if (playerDatabase && Array.isArray(playerDatabase)) {
        newTeam.playerIds.forEach(playerId => {
          const player = playerDatabase.find(p => p.id === playerId);
          if (player) {
            player.teamId = newTeam.id;
            if (playerId === newTeam.captainId) {
              player.isCaptain = true;
            }
          }
        });
        this.storage.savePlayerDatabase(playerDatabase);
      }

      this.teamDatabase.push(newTeam);
      this.saveTeamDatabase();
      console.log('Team added:', newTeam);
      return newTeam;
    } catch (error) {
      console.error('Error adding team:', error);
      return null;
    }
  }

  editTeam(teamId, teamData) {
    console.log('Editing team:', teamId, teamData);
    try {
      const teamIndex = this.teamDatabase.findIndex(t => t.id === teamId);
      if (teamIndex === -1) {
        console.error('Team not found:', teamId);
        return;
      }

      // Get current team
      const currentTeam = this.teamDatabase[teamIndex];
      const oldPlayerIds = currentTeam.playerIds || [];
      const newPlayerIds = teamData.playerIds || oldPlayerIds;
      const newCaptainId = teamData.captainId || currentTeam.captainId;

      // Update playerDatabase
      const playerDatabase = this.storage.getPlayerDatabase();
      if (playerDatabase && Array.isArray(playerDatabase)) {
        // Remove teamId from players no longer in the team
        oldPlayerIds.forEach(playerId => {
          if (!newPlayerIds.includes(playerId)) {
            const player = playerDatabase.find(p => p.id === playerId);
            if (player) {
              player.teamId = null;
              player.isCaptain = false;
            }
          }
        });

        // Add teamId to new players
        newPlayerIds.forEach(playerId => {
          const player = playerDatabase.find(p => p.id === playerId);
          if (player) {
            player.teamId = teamId;
            player.isCaptain = playerId === newCaptainId;
          }
        });

        this.storage.savePlayerDatabase(playerDatabase);
      }

      // Update team
      this.teamDatabase[teamIndex] = {
        ...currentTeam,
        name: teamData.name || currentTeam.name,
        playerIds: newPlayerIds,
        captainId: newCaptainId
      };

      this.saveTeamDatabase();
      console.log('Team edited:', this.teamDatabase[teamIndex]);
    } catch (error) {
      console.error('Error editing team:', error);
    }
  }

  deleteTeam(teamId) {
    console.log('Deleting team:', teamId);
    try {
      const teamIndex = this.teamDatabase.findIndex(t => t.id === teamId);
      if (teamIndex === -1) {
        console.error('Team not found:', teamId);
        return;
      }

      // Update playerDatabase
      const playerDatabase = this.storage.getPlayerDatabase();
      if (playerDatabase && Array.isArray(playerDatabase)) {
        const team = this.teamDatabase[teamIndex];
        team.playerIds.forEach(playerId => {
          const player = playerDatabase.find(p => p.id === playerId);
          if (player) {
            player.teamId = null;
            player.isCaptain = false;
          }
        });
        this.storage.savePlayerDatabase(playerDatabase);
      }

      this.teamDatabase.splice(teamIndex, 1);
      this.saveTeamDatabase();
      console.log('Team deleted:', teamId);
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  }

  getTeamDatabase() {
    console.log('Getting team database');
    return this.teamDatabase;
  }
}