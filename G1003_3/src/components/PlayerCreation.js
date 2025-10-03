import { showModal } from '../utils/modalUtils.js';
import { generateUUIDv4 } from '../utils/uuidUtils.js';
import { renderTeamDropdown } from '../utils/uiUtils.js';

export default class PlayerCreation {
  constructor(store, playerContainer) {
    console.log('Constructing PlayerCreation with playerContainer:', playerContainer);
    if (!(playerContainer instanceof HTMLElement)) {
      throw new Error('playerContainer must be an HTMLElement');
    }
    this.store = store;
    this.playerContainer = playerContainer;
  }

  setupEventListeners() {
    console.log('Setting up event listeners for PlayerCreation');
    try {
      const createPlayerBtn = this.playerContainer.querySelector('.create-player-btn');
      if (createPlayerBtn) {
        createPlayerBtn.addEventListener('click', () => {
          console.log('Create Player button clicked');
          this.openCreatePlayerModal();
        });
      } else {
        console.warn('create-player-btn not found in DOM');
      }

      const savePlayerBtn = this.playerContainer.querySelector('.save-player-btn');
      if (savePlayerBtn) {
        savePlayerBtn.addEventListener('click', () => {
          console.log('Save Player button clicked');
          this.handleCreatePlayer();
        });
      } else {
        console.warn('save-player-btn not found in DOM');
      }

      const cancelBtn = this.playerContainer.querySelector('.cancel-btn');
      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          console.log('Cancel button clicked');
          this.handleCancelModal();
        });
      } else {
        console.warn('cancel-btn not found in DOM');
      }
    } catch (error) {
      console.error('Error setting up event listeners for PlayerCreation:', error);
    }
  }

  openCreatePlayerModal() {
    console.log('Opening create player modal');
    try {
      const modal = this.playerContainer.querySelector('#createPlayerModal');
      if (modal) {
        this.populateTeamSelect();
        showModal(modal);
      } else {
        console.warn('createPlayerModal not found in DOM');
      }
    } catch (error) {
      console.error('Error opening create player modal:', error);
    }
  }

  populateTeamSelect() {
    console.log('Populating team select dropdown');
    try {
      const teamSelect = this.playerContainer.querySelector('#teamSelect');
      if (teamSelect) {
        const teamDatabase = this.store.getTeamDatabase();
        const teams = teamDatabase.map(team => ({
          id: team.id,
          name: team.name
        }));
        console.log('Teams for team select:', teams);
        renderTeamDropdown(teamSelect, teams);
        console.log('Team select populated:', teamSelect.innerHTML);
      } else {
        console.warn('teamSelect not found in DOM');
      }
    } catch (error) {
      console.error('Error populating team select:', error);
    }
  }

  handleCreatePlayer() {
    console.log('Handling create player');
    try {
      const modal = this.playerContainer.querySelector('#createPlayerModal');
      if (!modal) {
        console.warn('createPlayerModal not found');
        return;
      }
      const player = {
        id: generateUUIDv4(),
        firstName: modal.querySelector('#firstName').value,
        lastName: modal.querySelector('#lastName').value,
        nickname: modal.querySelector('#nickname').value,
        email: modal.querySelector('#email').value,
        phoneNumber: modal.querySelector('#phoneNumber').value,
        teamId: modal.querySelector('#teamSelect').value || null,
        isCaptain: modal.querySelector('#isCaptain').checked
      };
      if (!player.firstName || !player.lastName) {
        alert('Please provide first name and last name.');
        return;
      }
      console.log('Creating player:', player);
      this.store.addPlayer(player);
      this.handleCancelModal();
      if (this.store.playerManagement) {
        this.store.playerManagement.playerList.render();
        console.log('Player list refreshed after creating player');
      }
      alert('Player created successfully.');
    } catch (error) {
      console.error('Error creating player:', error);
      alert('Failed to create player.');
    }
  }

  handleCancelModal() {
    console.log('Closing create player modal');
    try {
      const modal = this.playerContainer.querySelector('#createPlayerModal');
      if (modal) {
        modal.style.display = 'none';
      } else {
        console.warn('createPlayerModal not found');
      }
    } catch (error) {
      console.error('Error closing create player modal:', error);
    }
  }
}