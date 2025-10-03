import PlayerCreation from './PlayerCreation.js';
import PlayerList from './PlayerList.js';
import PlayerEdit from './PlayerEdit.js';
import { createInput, createDropdown } from '../utils/dropdownUtils.js';
import { renderTeamDropdown } from '../utils/uiUtils.js';

export default class PlayerManagement {
  constructor(store, rootElement) {
    console.log('Constructing PlayerManagement with rootElement:', rootElement);
    if (!(rootElement instanceof HTMLElement)) {
      throw new Error('rootElement must be an HTMLElement');
    }
    this.store = store;
    this.rootElement = rootElement;
    this.playerContainer = null;
    this.playerCreation = null;
    this.playerEdit = null;
    this.playerList = null;
  }

  init() {
    console.log('Initializing PlayerManagement');
    try {
      this.render();
    } catch (error) {
      console.error('Error initializing PlayerManagement:', error);
    }
  }

  refreshTeamSelect() {
    console.log('Refreshing team select dropdowns');
    try {
      const teamSelect = this.playerContainer.querySelector('#teamSelect');
      const editTeamSelect = this.playerContainer.querySelector('#editTeamSelect');
      const teamDatabase = this.store.getTeamDatabase() || [];
      const teams = teamDatabase.map(team => ({ id: team.id, name: team.name }));
      console.log('Teams for dropdown:', teams);
      if (teamSelect) {
        renderTeamDropdown(teamSelect, teams);
        console.log('teamSelect populated:', teamSelect.innerHTML);
      } else {
        console.warn('teamSelect not found in DOM');
      }
      if (editTeamSelect) {
        renderTeamDropdown(editTeamSelect, teams);
        console.log('editTeamSelect populated:', editTeamSelect.innerHTML);
      } else {
        console.warn('editTeamSelect not found in DOM');
      }
    } catch (error) {
      console.error('Error refreshing team select dropdowns:', error);
    }
  }

  render() {
    console.log('PlayerManagement rendering');
    try {
      this.playerContainer = this.rootElement.querySelector('#playerManagementContainer');
      if (!this.playerContainer) {
        console.warn('playerManagementContainer not found in DOM');
        return;
      }
      this.playerContainer.innerHTML = `
        <h2>Player Management</h2>
        <button class="create-player-btn btn">Create Player</button>
        <div id="createPlayerModal" class="modal">
          <div class="modal-content">
            ${createInput('firstName', 'text', 'First Name', 'Enter first name')}
            ${createInput('lastName', 'text', 'Last Name', 'Enter last name')}
            ${createInput('nickname', 'text', 'Nickname', 'Enter nickname')}
            ${createInput('email', 'email', 'Email', 'Enter email')}
            ${createInput('phoneNumber', 'text', 'Phone Number', 'Enter phone number')}
            ${createDropdown('teamSelect', [], 'Team', '')}
            ${createInput('isCaptain', 'checkbox', 'Is Captain', '')}
            <div class="modal-actions">
              <button class="save-player-btn btn">Save</button>
              <button class="cancel-btn btn">Cancel</button>
            </div>
          </div>
        </div>
        <div id="editPlayerModal" class="modal">
          <div class="modal-content">
            ${createInput('editFirstName', 'text', 'First Name', 'Enter first name')}
            ${createInput('editLastName', 'text', 'Last Name', 'Enter last name')}
            ${createInput('editNickname', 'text', 'Nickname', 'Enter nickname')}
            ${createInput('editEmail', 'email', 'Email', 'Enter email')}
            ${createInput('editPhoneNumber', 'text', 'Phone Number', 'Enter phone number')}
            ${createDropdown('editTeamSelect', [], 'Team', '')}
            ${createInput('editIsCaptain', 'checkbox', 'Is Captain', '')}
            <div class="modal-actions">
              <button class="save-edit-player-btn btn">Save</button>
              <button class="cancel-btn btn">Cancel</button>
            </div>
          </div>
        </div>
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
      console.log('PlayerManagement content rendered in playerManagementContainer:', this.playerContainer.innerHTML);
      this.playerList = new PlayerList(this.store, this.playerContainer);
      this.playerCreation = new PlayerCreation(this.store, this.playerContainer); // Use playerContainer
      this.playerEdit = new PlayerEdit(this.store, this.playerContainer); // Use playerContainer
      this.playerList.render();
      this.refreshTeamSelect();
      this.setupEventListeners();
      this.playerCreation.setupEventListeners();
      this.playerEdit.setupEventListeners();
    } catch (error) {
      console.error('Error rendering PlayerManagement:', error);
    }
  }

  setupEventListeners() {
    console.log('Setting up event listeners for PlayerManagement');
    try {
      const createPlayerBtn = this.playerContainer.querySelector('.create-player-btn');
      if (createPlayerBtn) {
        createPlayerBtn.addEventListener('click', () => {
          console.log('Create Player button clicked in PlayerManagement');
          this.playerCreation.openCreatePlayerModal();
        });
      } else {
        console.warn('create-player-btn not found in DOM');
      }
    } catch (error) {
      console.error('Error setting up PlayerManagement event listeners:', error);
    }
  }
}