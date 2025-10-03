import { createDropdown, createInput } from '../utils/dropdownUtils.js';
import { createModal } from '../utils/modalUtils.js';

export default class TournamentRenderer {
  constructor(rootElement, tournamentStorage, teamStorage) {
    this.rootElement = rootElement;
    this.tournamentStorage = tournamentStorage;
    this.teamStorage = teamStorage;
    this.tournamentSelect = null;
  }

  async render(sectionVisibility) {
    console.log('TournamentRenderer rendering');
    const createTournamentVisible = sectionVisibility?.createTournamentContainer || false;
    const editTournamentVisible = sectionVisibility?.editTournamentContainer || false;
    const checkInTeamsVisible = sectionVisibility?.checkInTeamsContainer || false;
    const tableDistributionVisible = sectionVisibility?.tableDistributionContainer || false;
    this.rootElement.innerHTML = `
      <h2>Tournament Management</h2>
      <button class="toggle-tournament-btn btn" data-section="createTournamentContainer">
        ${createTournamentVisible ? 'Hide' : 'Show'} Create Tournament
      </button>
      <div id="createTournamentContainer" style="display: ${createTournamentVisible ? 'block' : 'none'};">
        <h3>Create Tournament</h3>
        ${createModal('createTournamentModal', [
          createInput('tournamentName', 'text', 'Tournament Name', 'Enter tournament name'),
          createInput('tournamentDate', 'date', 'Date', ''),
          createInput('tournamentMaxTeams', 'number', 'Max Teams', 'Enter max teams'),
          createInput('tournamentStacksPerTeam', 'number', 'Stacks per Team', 'Enter stacks per team'),
          createInput('tournamentLocation', 'text', 'Location', 'Enter location'),
          createInput('tournamentStartTime', 'time', 'Start Time', ''),
          createInput('tournamentType', 'text', 'Type', 'Enter tournament type'),
          createInput('tournamentMaxTables', 'number', 'Max Tables', 'Enter max tables'),
          createInput('tournamentStackSize', 'number', 'Stack Size', 'Enter stack size'),
          createInput('tournamentStatus', 'text', 'Status', 'Enter status'),
          createInput('tournamentOrganizer', 'text', 'Organizer', 'Enter organizer')
        ], 'create-tournament-btn', 'Create Tournament')}
      </div>
      <button class="toggle-tournament-btn btn" data-section="editTournamentContainer">
        ${editTournamentVisible ? 'Hide' : 'Show'} Edit Tournament
      </button>
      <div id="editTournamentContainer" style="display: ${editTournamentVisible ? 'block' : 'none'};">
        <h3>Edit Tournament</h3>
        ${createModal('editTournamentModal', [
          createInput('editTournamentName', 'text', 'Tournament Name', 'Enter tournament name'),
          createInput('editTournamentDate', 'date', 'Date', ''),
          createInput('editTournamentMaxTeams', 'number', 'Max Teams', 'Enter max teams'),
          createInput('editTournamentStacksPerTeam', 'number', 'Stacks per Team', 'Enter stacks per team'),
          createInput('editTournamentLocation', 'text', 'Location', 'Enter location'),
          createInput('editTournamentStartTime', 'time', 'Start Time', ''),
          createInput('tournamentType', 'text', 'Type', 'Enter tournament type'),
          createInput('editTournamentMaxTables', 'number', 'Max Tables', 'Enter max tables'),
          createInput('editTournamentStackSize', 'number', 'Stack Size', 'Enter stack size'),
          createInput('editTournamentStatus', 'text', 'Status', 'Enter status'),
          createInput('editTournamentOrganizer', 'text', 'Organizer', 'Enter organizer')
        ], 'edit-tournament-btn', 'Edit Tournament')}
        <button class="delete-tournament-btn btn">Delete Tournament</button>
      </div>
      <button class="toggle-tournament-btn btn" data-section="checkInTeamsContainer">
        ${checkInTeamsVisible ? 'Hide' : 'Show'} Check-in Teams
      </button>
      <div id="checkInTeamsContainer" style="display: ${checkInTeamsVisible ? 'block' : 'none'};">
        <h3>Check-in Teams</h3>
        <ul id="checkInTeamsList"></ul>
      </div>
      <button class="toggle-tournament-btn btn" data-section="tableDistributionContainer">
        ${tableDistributionVisible ? 'Hide' : 'Show'} Table Distribution
      </button>
      <div id="tableDistributionContainer" style="display: ${tableDistributionVisible ? 'block' : 'none'};">
        <h3>Table Distribution</h3>
        <button class="generate-table-distribution-btn btn">Generate Table Distribution</button>
        <button class="simulate-table-distribution-btn btn">Simulate Table Distribution</button>
        ${createModal('simulateTableDistributionModal', [
          createInput('simulateNumTeams', 'number', 'Number of Teams', 'Enter number of teams'),
          createInput('simulateMaxTables', 'number', 'Max Tables', 'Enter max tables'),
          createInput('simulateStacksPerTeam', 'number', 'Stacks per Team', 'Enter stacks per team')
        ], 'simulate-table-distribution-btn', 'Simulate')}
        <div id="tableDistributionList"></div>
      </div>
      <div id="tournamentSelectContainer"><select id="tournamentSelect"></select></div>
      <div id="tournamentDetails"></div>
    `;
    this.tournamentSelect = this.rootElement.querySelector('#tournamentSelect');
    if (!this.tournamentSelect) {
      const selectContainer = this.rootElement.querySelector('#tournamentSelectContainer');
      selectContainer.innerHTML = '<select id="tournamentSelect"></select>';
      this.tournamentSelect = selectContainer.querySelector('#tournamentSelect');
    }
    return this.rootElement;
  }

  refreshCheckInList(tournamentId) {
    console.log('Refreshing check-in list for tournamentId:', tournamentId);
    const list = this.rootElement.querySelector('#checkInTeamsList');
    if (!tournamentId) {
      list.innerHTML = '<li>Please select a tournament.</li>';
      return;
    }
    const tournament = this.tournamentStorage.getTournament(tournamentId);
    if (!tournament) {
      list.innerHTML = '<li>Tournament not found.</li>';
      return;
    }
    const teams = this.teamStorage.getTeams();
    const checkedInTeams = tournament.checkedInTeams || [];
    list.innerHTML = teams.map(team => `
      <li>
        ${team.name}
        <button class="check-in-team-btn btn" data-team-id="${team.id}">
          ${checkedInTeams.includes(team.id) ? 'Undo Check-in' : 'Check-in'}
        </button>
      </li>
    `).join('');
  }

  refreshTournamentSelect() {
    console.log('Refreshing tournament select');
    const tournaments = this.tournamentStorage.getTournaments();
    this.tournamentSelect.innerHTML = '<option value="">Select a tournament</option>' + 
      tournaments.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
  }

  refreshTournamentDetails(tournamentId) {
    console.log('Refreshing tournament details for tournamentId:', tournamentId);
    const details = this.rootElement.querySelector('#tournamentDetails');
    if (!tournamentId) {
      details.innerHTML = '<p>Please select a tournament.</p>';
      return;
    }
    const tournament = this.tournamentStorage.getTournament(tournamentId);
    if (!tournament) {
      details.innerHTML = '<p>Tournament not found.</p>';
      return;
    }
    details.innerHTML = `
      <h3>${tournament.name}</h3>
      <p>Date: ${tournament.date}</p>
      <p>Location: ${tournament.location}</p>
      <p>Max Teams: ${tournament.maxTeams}</p>
      <p>Stacks per Team: ${tournament.stacksPerTeam}</p>
      <p>Start Time: ${tournament.startTime}</p>
      <p>Type: ${tournament.type}</p>
      <p>Max Tables: ${tournament.maxTables}</p>
      <p>Stack Size: ${tournament.stackSize}</p>
      <p>Status: ${tournament.status}</p>
      <p>Organizer: ${tournament.organizer}</p>
    `;
  }

  renderTableDistribution(tournamentId, tableDistribution) {
    console.log('Rendering table distribution for tournamentId:', tournamentId);
    const list = this.rootElement.querySelector('#tableDistributionList');
    if (!tournamentId) {
      list.innerHTML = '<p>Please select a tournament.</p>';
      return;
    }
    const distribution = tableDistribution.getDistribution(tournamentId);
    if (!distribution || distribution.length === 0) {
      list.innerHTML = '<p>No table distribution available.</p>';
      return;
    }
    list.innerHTML = distribution.map(table => `
      <div>
        <h4>Table ${table.tableId}</h4>
        <ul>
          ${table.teams.map(teamId => {
            const team = this.teamStorage.getTeamById(teamId);
            return `<li>${team ? team.name : 'Unknown Team'}</li>`;
          }).join('')}
        </ul>
      </div>
    `).join('');
  }
}