import TeamCreation from './TeamCreation.js';
import TeamEdit from './TeamEdit.js';
import TeamCaptainEdit from './TeamCaptainEdit.js';
import { createInput, createDropdown } from '../utils/dropdownUtils.js';
import { renderTable, renderTeamDropdown } from '../utils/uiUtils.js';

export default class TeamManagement {
  constructor(store, rootElement) {
    console.log('Constructing TeamManagement with rootElement:', rootElement);
    if (!(rootElement instanceof HTMLElement)) {
      throw new Error('rootElement must be an HTMLElement');
    }
    this.store = store;
    this.rootElement = rootElement;
    this.teamContainer = null;
    this.teamCreation = new TeamCreation(this.store, this.rootElement);
    this.teamEdit = new TeamEdit(this.store, this.rootElement);
    this.teamCaptainEdit = new TeamCaptainEdit(this.store, this.rootElement);
    this.eventListeners = [];
  }

  init() {
    console.log('Initializing TeamManagement');
    try {
      this.render();
    } catch (error) {
      console.error('Error initializing TeamManagement:', error);
    }
  }

  refreshTeamTable() {
    console.log('Refreshing team table');
    try {
      const teamTableBody = this.teamContainer.querySelector('#teamTable tbody');
      if (teamTableBody) {
        teamTableBody.innerHTML = '';
        const teamDatabase = this.store.getTeamDatabase() || [];
        const playerDatabase = this.store.getPlayerDatabase() || [];
        console.log('Team database:', teamDatabase);
        console.log('Player database for team table:', playerDatabase);
        
        renderTable(teamTableBody, teamDatabase, [
          { key: 'name', label: 'Team Name' },
          { 
            key: 'playerIds', 
            label: 'Players', 
            format: (playerIds) => {
              if (!playerIds || !Array.isArray(playerIds)) return 'None';
              return playerIds.map(id => {
                const player = playerDatabase.find(p => p.id === id);
                return player ? `${player.firstName} ${player.lastName}` : 'Unknown';
              }).join(', ') || 'None';
            }
          },
          { 
            key: 'captainId', 
            label: 'Captain', 
            format: (captainId) => {
              const captain = playerDatabase.find(p => p.id === captainId);
              return captain ? `${captain.firstName} ${captain.lastName}` : 'None';
            }
          },
          { 
            key: 'actions', 
            label: 'Actions', 
            format: (teamId) => `
              <button class="edit-team-btn btn" data-team-id="${teamId}">Edit</button>
              <button class="edit-captain-btn btn" data-team-id="${teamId}">Edit Captain</button>
              <button class="delete-team-btn btn" data-team-id="${teamId}">Delete</button>
            `
          }
        ], 'team');
        console.log('Team table rendered:', teamTableBody.innerHTML);
        this.setupEventListeners();
      } else {
        console.warn('teamTable tbody not found in DOM');
      }
    } catch (error) {
      console.error('Error refreshing team table:', error);
    }
  }

  refreshTeamSelect() {
    console.log('Refreshing team select dropdown');
    try {
      const teamSelect = this.teamContainer.querySelector('#teamSelect');
      const editTeamSelect = this.teamContainer.querySelector('#editTeamSelect');
      const teamDatabase = this.store.getTeamDatabase() || [];
      const teams = teamDatabase.map(team => ({
        id: team.id,
        name: team.name
      }));
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
      console.error('Error refreshing team select dropdown:', error);
    }
  }

  setupEventListeners() {
    console.log('Setting up event listeners for TeamManagement');
    try {
      // Remove previous event listeners
      this.eventListeners.forEach(({ element, type, listener }) => {
        element.removeEventListener(type, listener);
      });
      this.eventListeners = [];

      // Create Team button
      const createTeamBtn = this.teamContainer.querySelector('.create-team-btn');
      if (createTeamBtn) {
        const createListener = () => {
          console.log('Create Team button clicked');
          this.teamCreation.openCreateTeamModal();
        };
        createTeamBtn.addEventListener('click', createListener);
        this.eventListeners.push({ element: createTeamBtn, type: 'click', listener: createListener });
      } else {
        console.warn('create-team-btn not found in DOM');
      }

      // Edit Team buttons
      const editTeamButtons = this.teamContainer.querySelectorAll('.edit-team-btn');
      editTeamButtons.forEach(button => {
        const teamId = button.dataset.teamId;
        const listener = () => {
          console.log('Edit Team button clicked for teamId:', teamId);
          this.teamEdit.openEditTeamModal(teamId);
        };
        button.addEventListener('click', listener);
        this.eventListeners.push({ element: button, type: 'click', listener });
      });

      // Edit Captain buttons
      const editCaptainButtons = this.teamContainer.querySelectorAll('.edit-captain-btn');
      editCaptainButtons.forEach(button => {
        const teamId = button.dataset.teamId;
        const listener = () => {
          console.log('Edit Captain button clicked for teamId:', teamId);
          this.teamCaptainEdit.openEditCaptainModal(teamId);
        };
        button.addEventListener('click', listener);
        this.eventListeners.push({ element: button, type: 'click', listener });
      });

      // Delete Team buttons
      const deleteTeamButtons = this.teamContainer.querySelectorAll('.delete-team-btn');
      deleteTeamButtons.forEach(button => {
        const teamId = button.dataset.teamId;
        const listener = () => {
          console.log('Delete Team button clicked for teamId:', teamId);
          if (confirm('Are you sure you want to delete this team?')) {
            this.store.deleteTeam(teamId);
            this.refreshTeamTable();
            if (this.store.playerManagement && this.store.playerManagement.playerList) {
              this.store.playerManagement.playerList.render();
              console.log('Player list refreshed after deleting team');
            }
          }
        };
        button.addEventListener('click', listener);
        this.eventListeners.push({ element: button, type: 'click', listener });
      });

      console.log('Event listeners set up for', editTeamButtons.length, 'edit buttons,', editCaptainButtons.length, 'edit captain buttons, and', deleteTeamButtons.length, 'delete buttons');
    } catch (error) {
      console.error('Error setting up event listeners for TeamManagement:', error);
    }
  }

  render() {
    console.log('TeamManagement rendering');
    try {
      this.teamContainer = this.rootElement.querySelector('#teamManagementContainer');
      if (!this.teamContainer) {
        console.warn('teamManagementContainer not found in DOM');
        return;
      }
      this.teamContainer.innerHTML = `
        <div>
          <h2>Team Management</h2>
          <button class="create-team-btn btn">Create Team</button>
          <div id="createTeamModal" class="modal">
            <div class="modal-content">
              ${createInput('teamName', 'text', 'Team Name', 'Enter team name')}
              ${createDropdown('teamSelect', [], 'Select Players', '', true)}
              <div class="modal-actions">
                <button class="save-team-btn btn">Save</button>
                <button class="cancel-btn btn">Cancel</button>
              </div>
            </div>
          </div>
          <div id="editTeamModal" class="modal">
            <div class="modal-content">
              ${createInput('editTeamName', 'text', 'Team Name', 'Enter team name')}
              ${createDropdown('editTeamSelect', [], 'Select Players', '', true)}
              <div class="modal-actions">
                <button class="save-edit-team-btn btn">Save</button>
                <button class="cancel-btn btn">Cancel</button>
              </div>
            </div>
          </div>
          <div id="editCaptainModal" class="modal">
            <div class="modal-content">
              ${createDropdown('editCaptainSelect', [], 'Select Captain', '')}
              <div class="modal-actions">
                <button class="save-captain-btn btn">Save</button>
                <button class="cancel-btn btn">Cancel</button>
              </div>
            </div>
          </div>
          <table id="teamTable">
            <thead>
              <tr>
                <th>Team Name</th>
                <th>Players</th>
                <th>Captain</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      `;
      console.log('TeamManagement content rendered in teamManagementContainer:', this.teamContainer.innerHTML);
      this.refreshTeamTable();
      this.refreshTeamSelect();
      this.teamCreation.setupEventListeners();
      this.teamEdit.setupEventListeners();
      this.teamCaptainEdit.setupEventListeners();
      this.setupEventListeners();
    } catch (error) {
      console.error('Error rendering TeamManagement:', error);
    }
  }
}