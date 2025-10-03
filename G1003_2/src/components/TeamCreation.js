import { showModal } from '../utils/modalUtils.js';
import { generateUUIDv4 } from '../utils/uuidUtils.js';
import { renderTeamDropdown } from '../utils/uiUtils.js';

export default class TeamCreation {
  constructor(store, rootElement) {
    console.log('Constructing TeamCreation with rootElement:', rootElement);
    if (!(rootElement instanceof HTMLElement)) {
      throw new Error('rootElement must be an HTMLElement');
    }
    this.store = store;
    this.rootElement = rootElement;
  }

  setupEventListeners() {
    console.log('Setting up event listeners for TeamCreation');
    try {
      const createTeamBtn = this.rootElement.querySelector('.create-team-btn');
      if (createTeamBtn) {
        createTeamBtn.addEventListener('click', () => {
          console.log('Create Team button clicked');
          this.openCreateTeamModal();
        });
      } else {
        console.warn('create-team-btn not found in DOM');
      }

      const saveTeamBtn = this.rootElement.querySelector('.save-team-btn');
      if (saveTeamBtn) {
        saveTeamBtn.addEventListener('click', () => {
          console.log('Save Team button clicked');
          this.handleCreateTeam();
        });
      } else {
        console.warn('save-team-btn not found in DOM');
      }

      const cancelBtn = this.rootElement.querySelector('.cancel-btn');
      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          console.log('Cancel button clicked');
          this.handleCancelModal();
        });
      } else {
        console.warn('cancel-btn not found in DOM');
      }
    } catch (error) {
      console.error('Error setting up event listeners for TeamCreation:', error);
    }
  }

  openCreateTeamModal() {
    console.log('Opening create team modal');
    try {
      const modal = this.rootElement.querySelector('#createTeamModal');
      if (modal) {
        this.populateTeamSelect();
        showModal(modal);
      } else {
        console.warn('createTeamModal not found in DOM');
      }
    } catch (error) {
      console.error('Error opening create team modal:', error);
    }
  }

  populateTeamSelect() {
    console.log('Populating team select dropdown');
    try {
      const teamSelect = this.rootElement.querySelector('#teamSelect');
      if (teamSelect) {
        const playerDatabase = this.store.getPlayerDatabase();
        const players = playerDatabase.map(player => ({
          id: player.id,
          name: `${player.firstName} ${player.lastName}`
        }));
        console.log('Players for team select:', players);
        renderTeamDropdown(teamSelect, players);
        console.log('Team select populated:', teamSelect.innerHTML);
      } else {
        console.warn('teamSelect not found in DOM');
      }
    } catch (error) {
      console.error('Error populating team select:', error);
    }
  }

  handleCreateTeam() {
    console.log('Handling create team');
    try {
      const modal = this.rootElement.querySelector('#createTeamModal');
      if (!modal) {
        console.warn('createTeamModal not found');
        return;
      }
      const teamName = modal.querySelector('#teamName').value;
      const teamSelect = modal.querySelector('#teamSelect');
      const selectedPlayerIds = Array.from(teamSelect.selectedOptions).map(option => option.value);
      if (!teamName || selectedPlayerIds.length === 0) {
        alert('Please provide a team name and select at least one player.');
        return;
      }
      const captainId = selectedPlayerIds[0];
      const team = {
        id: generateUUIDv4(),
        name: teamName,
        playerIds: selectedPlayerIds,
        captainId: captainId,
        checkedInTournaments: []
      };
      console.log('Creating team:', team);
      this.store.addTeam(team);
      this.handleCancelModal();
      const teamManagement = this.rootElement.querySelector('#teamManagementContainer');
      if (teamManagement && this.store.teamManagement) {
        this.store.teamManagement.refreshTeamTable();
        console.log('Team table refreshed after creating team');
      } else {
        console.warn('teamManagementContainer or teamManagement not found');
      }
      alert('Team created successfully.');
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Failed to create team.');
    }
  }

  handleCancelModal() {
    console.log('Closing create team modal');
    try {
      const modal = this.rootElement.querySelector('#createTeamModal');
      if (modal) {
        modal.style.display = 'none';
      } else {
        console.warn('createTeamModal not found');
      }
    } catch (error) {
      console.error('Error closing create team modal:', error);
    }
  }
}