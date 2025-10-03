class TeamStorage {
    constructor(storage) {
        console.log('Constructing TeamStorage');
        this.storage = storage;
        this.teamDatabase = this.loadTeamDatabase();
    }

    loadTeamDatabase() {
        console.log('Loading teamDatabase');
        const teamDatabase = JSON.parse(localStorage.getItem('teamDatabase')) || [];
        console.log('Raw teamDatabase from localStorage:', localStorage.getItem('teamDatabase'));
        if (this.storage && this.storage.getPlayerDatabase) {
            const playerDatabase = this.storage.getPlayerDatabase();
            if (playerDatabase) {
                // Synkronisera: Rensa teamId och isCaptain om teamDatabase är tom
                if (teamDatabase.length === 0) {
                    playerDatabase.forEach(player => {
                        if (player.teamId) {
                            player.teamId = null;
                            player.isCaptain = false;
                        }
                    });
                    localStorage.setItem('playerDatabase', JSON.stringify(playerDatabase));
                }
            } else {
                console.log('playerStorage not available, skipping teamDatabase sync');
            }
        }
        console.log('Loaded teamDatabase:', teamDatabase);
        return teamDatabase;
    }

    getTeams() {
        console.log('Getting team database');
        return this.teamDatabase;
    }

    addTeam(team) {
        console.log('Adding team:', team);
        const teamDatabase = this.getTeams();
        teamDatabase.push(team);
        localStorage.setItem('teamDatabase', JSON.stringify(teamDatabase));
        if (this.storage && this.storage.getPlayerDatabase) {
            const playerDatabase = this.storage.getPlayerDatabase();
            if (playerDatabase) {
                team.playerIds.forEach(playerId => {
                    const player = playerDatabase.find(p => p.id === playerId);
                    if (player) {
                        player.teamId = team.id;
                        player.isCaptain = playerId === team.captainId;
                    }
                });
                // Byt ut this.storage.savePlayerDatabase mot direkt localStorage-anrop
                localStorage.setItem('playerDatabase', JSON.stringify(playerDatabase));
            }
        }
    }

    updateTeam(teamId, updatedTeam) {
        const teamDatabase = this.getTeams();
        const teamIndex = teamDatabase.findIndex(t => t.id === teamId);
        if (teamIndex !== -1) {
            const oldTeam = teamDatabase[teamIndex];
            teamDatabase[teamIndex] = { ...oldTeam, ...updatedTeam };
            localStorage.setItem('teamDatabase', JSON.stringify(teamDatabase));
            if (this.storage && this.storage.getPlayerDatabase) {
                const playerDatabase = this.storage.getPlayerDatabase();
                if (playerDatabase) {
                    // Reset teamId and isCaptain for players no longer in the team
                    oldTeam.playerIds.forEach(playerId => {
                        const player = playerDatabase.find(p => p.id === playerId);
                        if (player && !updatedTeam.playerIds.includes(playerId)) {
                            player.teamId = null;
                            player.isCaptain = false;
                        }
                    });
                    // Update teamId and isCaptain for new players
                    updatedTeam.playerIds.forEach(playerId => {
                        const player = playerDatabase.find(p => p.id === playerId);
                        if (player) {
                            player.teamId = teamId;
                            player.isCaptain = playerId === updatedTeam.captainId;
                        }
                    });
                    localStorage.setItem('playerDatabase', JSON.stringify(playerDatabase));
                }
            }
        }
    }

    updateTeamCaptain(teamId, newCaptainId) {
        const teamDatabase = this.getTeams();
        const team = teamDatabase.find(t => t.id === teamId);
        if (team) {
            team.captainId = newCaptainId;
            localStorage.setItem('teamDatabase', JSON.stringify(teamDatabase));
            if (this.storage && this.storage.getPlayerDatabase) {
                const playerDatabase = this.storage.getPlayerDatabase();
                if (playerDatabase) {
                    team.playerIds.forEach(playerId => {
                        const player = playerDatabase.find(p => p.id === playerId);
                        if (player) {
                            player.isCaptain = playerId === newCaptainId;
                        }
                    });
                    localStorage.setItem('playerDatabase', JSON.stringify(playerDatabase));
                }
            }
        }
    }

    deleteTeam(teamId) {
        const teamDatabase = this.getTeams();
        const teamIndex = teamDatabase.findIndex(t => t.id === teamId);
        if (teamIndex !== -1) {
            const team = teamDatabase[teamIndex];
            teamDatabase.splice(teamIndex, 1);
            localStorage.setItem('teamDatabase', JSON.stringify(teamDatabase));
            if (this.storage && this.storage.getPlayerDatabase) {
                const playerDatabase = this.storage.getPlayerDatabase();
                if (playerDatabase) {
                    team.playerIds.forEach(playerId => {
                        const player = playerDatabase.find(p => p.id === playerId);
                        if (player) {
                            player.teamId = null;
                            player.isCaptain = false;
                        }
                    });
                    localStorage.setItem('playerDatabase', JSON.stringify(playerDatabase));
                }
            }
        }
    }

    getTeam(teamId) {
        return this.getTeams().find(t => t.id === teamId);
    }
}
