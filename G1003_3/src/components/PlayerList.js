import { renderTable } from '../utils/uiUtils.js';
import { renderTeamFilterDropdown } from '../utils/dropdownUtils.js';

export default class PlayerList {
  constructor(store, container, onUpdate = () => {}) {
    console.log('Constructing PlayerList with container:', container);
    if (!(container instanceof HTMLElement)) {
      console.warn('Container is not an HTMLElement, skipping initialization');
      return;
    }
    this.store = store;
    this.container = container;
    this.onUpdate = onUpdate;
    this.playerSearchTerm = '';
    this.selectedTeamId = '';
  }

  async render() {
    console.log('PlayerList rendering');
    if (!this.container) {
      console.warn('No valid container for PlayerList rendering');
      return;
    }
    try {
      this.container.innerHTML = `
        <div class="form-group">
          <label for="playerSearchInput">Search Players:</label>
          <div class="search-container">
            <span class="search-icon">🔍</span>
            <input type="text" id="playerSearchInput" placeholder="Search players...">
            <span class="clear-icon player-clear-icon" style="display: none;">X</span>
          </div>
        </div>
        <div class="form-group">
          <label for="teamFilterInput">Filter by Team:</label>
          <div class="search-container">
            <span class="search-icon">🔍</span>
            <input type="text" id="teamFilterInput" placeholder="To be added" disabled>
          </div>
          <select id="teamFilterSelect" class="team-select">
            <option value="">All Teams</option>
          </select>
        </div>
        <table id="playerDatabaseTable" border="1" style="width:100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Nickname</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Team</th>
              <th>Captain</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      `;
      console.log('PlayerList content rendered:', this.container.innerHTML);
      this.setupEventListeners();
      await this.refreshTable();
      setTimeout(() => this.refreshTeamFilterSelect(), 0); // Fördröj för att säkerställa DOM-uppdatering
      return this.container;
    } catch (error) {
      console.error('Error rendering PlayerList:', error);
    }
  }

  setupEventListeners() {
    console.log('Setting up event listeners for PlayerList');
    if (!this.container) {
      console.warn('No valid container for setting up event listeners');
      return;
    }
    try {
      this.container.addEventListener('click', (e) => {
        if (e.target.classList.contains('player-clear-icon')) {
          console.log('Clear player search clicked');
          this.playerSearchTerm = '';
          const searchInput = this.container.querySelector('#playerSearchInput');
          if (searchInput) {
            searchInput.value = '';
          }
          const clearIcon = this.container.querySelector('.player-clear-icon');
          if (clearIcon) {
            clearIcon.style.display = 'none';
          }
          this.refreshTable();
        }
      });

      const searchInput = this.container.querySelector('#playerSearchInput');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          console.log('Player search input changed:', e.target.value);
          this.playerSearchTerm = e.target.value.toLowerCase();
          const clearIcon = this.container.querySelector('.player-clear-icon');
          if (clearIcon) {
            clearIcon.style.display = this.playerSearchTerm ? 'block' : 'none';
          }
          this.refreshTable();
        });
      } else {
        console.warn('playerSearchInput not found in DOM');
      }

      const teamFilterSelect = this.container.querySelector('#teamFilterSelect');
      if (teamFilterSelect) {
        teamFilterSelect.addEventListener('change', (e) => {
          console.log('Team filter select changed:', e.target.value);
          this.selectedTeamId = e.target.value;
          this.refreshTable();
        });
      } else {
        console.warn('teamFilterSelect not found in DOM');
      }
    } catch (error) {
      console.error('Error setting up event listeners for PlayerList:', error);
    }
  }

  async refreshTable() {
    console.log('Refreshing player table');
    if (!this.container) {
      console.warn('No valid container for refreshing player table');
      return;
    }
    try {
      const playerDatabase = this.store.getPlayerDatabase() || [];
      const teamDatabase = this.store.getTeamDatabase() || [];
      console.log('Player database:', playerDatabase);
      const filteredPlayers = playerDatabase.filter(p => {
        const matchesSearch = !this.playerSearchTerm || 
          `${p.firstName} ${p.lastName}`.toLowerCase().includes(this.playerSearchTerm);
        const matchesTeam = this.selectedTeamId === '' || p.teamId === this.selectedTeamId || p.teamId === null;
        return matchesSearch && matchesTeam;
      });
      console.log('Filtered players:', filteredPlayers);
      const tbody = this.container.querySelector('#playerDatabaseTable tbody');
      if (!tbody) {
        console.warn('playerDatabaseTable tbody not found in DOM');
        return;
      }
      if (filteredPlayers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8">No players found. Add a player to get started.</td></tr>';
        console.log('Player table rendered (no players):', tbody.innerHTML);
        return;
      }
      const fields = [
        { key: 'firstName', label: 'First Name' },
        { key: 'lastName', label: 'Last Name' },
        { key: 'nickname', label: 'Nickname', transform: (value) => value || '' },
        { key: 'email', label: 'Email', transform: (value) => value || '' },
        { key: 'phoneNumber', label: 'Phone Number', transform: (value) => value || '' },
        { key: 'teamName', label: 'Team', transform: (value, player) => {
          const team = teamDatabase.find(t => t.id === player.teamId);
          return team ? team.name : 'No Team';
        }},
        { key: 'isCaptain', label: 'Captain', transform: (value, player) => {
          const team = teamDatabase.find(t => t.captainId === player.id);
          return team ? 'Yes' : 'No';
        }},
        { key: 'actions', label: 'Action', transform: (value, player) => `
          <button class="edit-player-btn btn" data-player-id="${player.id}">Edit</button>
          <button class="delete-player-btn btn" data-player-id="${player.id}">Delete</button>
        `}
      ];
      console.log('Fields for table:', fields);
      renderTable(tbody, filteredPlayers, fields, 'player');
      console.log('Player table rendered:', tbody.innerHTML);
    } catch (error) {
      console.error('Error refreshing player table:', error);
    }
  }

  async refreshTeamFilterSelect() {
    console.log('Refreshing team filter select');
    if (!this.container) {
      console.warn('No valid container for refreshing team filter select');
      return;
    }
    try {
      const teamFilterSelect = this.container.querySelector('#teamFilterSelect');
      if (teamFilterSelect) {
        const teamDatabase = this.store.getTeamDatabase() || [];
        console.log('Team database for filter:', teamDatabase);
        renderTeamFilterDropdown(teamFilterSelect, teamDatabase, this.selectedTeamId, 'teamFilterSelect');
        console.log('Team filter select refreshed:', teamFilterSelect.innerHTML);
      } else {
        console.warn('teamFilterSelect not found in DOM');
      }
    } catch (error) {
      console.error('Error refreshing team filter select:', error);
    }
  }
}