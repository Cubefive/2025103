import { showModal } from '../utils/modalUtils.js';
import { renderTeamDropdown } from '../utils/uiUtils.js';

export default class PlayerEdit {
  constructor(store, playerContainer) {
    console.log('Constructing PlayerEdit with playerContainer:', playerContainer);
    if (!(playerContainer instanceof HTMLElement)) {
      throw new Error('playerContainer must be an HTMLElement');
    }
    this.store = store;
    this.playerContainer = playerContainer;
  }

  setupEventListeners() {
    console.log('Setting up event listeners for PlayerEdit');
    try {
      const editPlayerButtons = this.playerContainer.querySelectorAll('.edit-player-btn');
      editPlayerButtons.forEach(button => {
        button.addEventListener('click', () => {
          const playerId = button.dataset.playerId;
          console.log('Edit Player button clicked for playerId:', playerId);
          this.openEditPlayerModal(playerId);
        });
      });

      const saveEditPlayerBtn = this.playerContainer.querySelector('.save-edit-player-btn');
      if (saveEditPlayerBtn) {
        saveEditPlayerBtn.addEventListener('click', () => {
          console.log('Save Edit Player button clicked');
          this.handleEditPlayer();
        });
      } else {
        console.warn('save-edit-player-btn not found in DOM');
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
      console.error('Error setting up event listeners for PlayerEdit:', error);
    }
  }

  openEditPlayerModal(playerId) {
    console.log('Opening edit player modal for playerId:', playerId);
    try {
      const modal = this.playerContainer.querySelector('#editPlayerModal');
      if (modal) {
        const player = this.store.getPlayerDatabase().find(p => p.id === playerId);
        if (player) {
          modal.querySelector('#editFirstName').value = player.firstName;
          modal.querySelector('#editLastName').value = player.lastName;
          modal.querySelector('#editNickname').value = player.nickname;
          modal.querySelector('#editEmail').value = player.email;
          modal.querySelector('#editPhoneNumber').value = player.phoneNumber;
          modal.querySelector('#editIsCaptain').checked = player.isCaptain;
          this.populateTeamSelect(player.teamId);
          modal.dataset.playerId = playerId;
          showModal(modal);
        } else {
          console.warn('Player not found:', playerId);
        }
      } else {
        console.warn('editPlayerModal not found in DOM');
      }
    } catch (error) {
      console.error('Error opening edit player modal:', error);
    }
  }

  populateTeamSelect(selectedTeamId) {
    console.log('Populating team select dropdown');
    try {
      const editTeamSelect = this.playerContainer.querySelector('#editTeamSelect');
      if (editTeamSelect) {
        const teamDatabase = this.store.getTeamDatabase();
        const teams = teamDatabase.map(team => ({
          id: team.id,
          name: team.name
        }));
        console.log('Teams for edit team select:', teams);
        renderTeamDropdown(editTeamSelect, teams, selectedTeamId);
        console.log('editTeamSelect populated:', editTeamSelect.innerHTML);
      } else {
        console.warn('editTeamSelect not found in DOM');
      }
    } catch (error) {
      console.error('Error populating team select:', error);
    }
  }

  handleEditPlayer() {
    console.log('Handling edit player');
    try {
      const modal = this.playerContainer.querySelector('#editPlayerModal');
      if (!modal) {
        console.warn('editPlayerModal not found');
        return;
      }
      const playerId = modal.dataset.playerId;
      const player = {
        firstName: modal.querySelector('#editFirstName').value,
        lastName: modal.querySelector('#editLastName').value,
        nickname: modal.querySelector('#editNickname').value,
        email: modal.querySelector('#editEmail').value,
        phoneNumber: modal.querySelector('#editPhoneNumber').value,
        teamId: modal.querySelector('#editTeamSelect').value || null,
        isCaptain: modal.querySelector('#editIsCaptain').checked
      };
      if (!player.firstName || !player.lastName) {
        alert('Please provide first name and last name.');
        return;
      }
      console.log('Editing player:', playerId, player);
      this.store.editPlayer(playerId, player);
      this.handleCancelModal();
      if (this.store.playerManagement) {
        this.store.playerManagement.playerList.render();
        console.log('Player list refreshed after editing player');
      }
      alert('Player updated successfully.');
    } catch (error) {
      console.error('Error editing player:', error);
      alert('Failed to update player.');
    }
  }

  handleCancelModal() {
    console.log('Closing edit player modal');
    try {
      const modal = this.playerContainer.querySelector('#editPlayerModal');
      if (modal) {
        modal.style.display = 'none';
      } else {
        console.warn('editPlayerModal not found');
      }
    } catch (error) {
      console.error('Error closing edit player modal:', error);
    }
  }
}