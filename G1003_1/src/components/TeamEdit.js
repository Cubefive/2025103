import { showModal, closeModal } from '../utils/modalUtils.js';
import { renderTeamDropdown } from '../utils/uiUtils.js';

export default class TeamEdit {
  constructor(store, rootElement) {
    console.log('Constructing TeamEdit with rootElement:', rootElement);
    this.store = store;
    this.rootElement = rootElement;
    this.eventListeners = [];
  }

  setupEventListeners() {
    console.log('Setting up event listeners for TeamEdit');
    try {
      // Remove previous event listeners
      this.eventListeners.forEach(({ element, type, listener }) => {
        element.removeEventListener(type, listener);
      });
      this.eventListeners = [];

      // Save Edit Team button
      const saveEditTeamBtn = this.rootElement.querySelector('.save-edit-team-btn');
      if (saveEditTeamBtn) {
        const saveListener = () => {
          console.log('Save Edit Team button clicked');
          this.handleEditTeam();
        };
        saveEditTeamBtn.addEventListener('click', saveListener);
        this.eventListeners.push({ element: saveEditTeamBtn, type: 'click', listener: saveListener });
      } else {
        console.warn('save-edit-team-btn not found in DOM');
      }

      // Cancel button
      const cancelBtn = this.rootElement.querySelector('#editTeamModal .cancel-btn');
      if (cancelBtn) {
        const cancelListener = () => {
          console.log('Cancel button clicked');
          closeModal('editTeamModal');
        };
        cancelBtn.addEventListener('click', cancelListener);
        this.eventListeners.push({ element: cancelBtn, type: 'click', listener: cancelListener });
      } else {
        console.warn('cancel-btn not found in DOM');
      }
    } catch (error) {
      console.error('Error setting up event listeners for TeamEdit:', error);
    }
  }

  openEditTeamModal(teamId) {
    console.log('Opening edit team modal for teamId:', teamId);
    try {
      const team = this.store.getTeamDatabase().find(t => t.id === teamId);
      if (!team) {
        console.error('Team not found:', teamId);
        return;
      }

      const editTeamNameInput = this.rootElement.querySelector('#editTeamName');
      const editTeamSelect = this.rootElement.querySelector('#editTeamSelect');
      if (editTeamNameInput && editTeamSelect) {
        editTeamNameInput.value = team.name || '';

        // Get all players and current team players
        const playerDatabase = this.store.getPlayerDatabase() || [];
        const teamPlayers = team.playerIds || [];
        const players = playerDatabase.map(player => ({
          id: player.id,
          name: `${player.firstName} ${player.lastName}`
        }));

        // Populate dropdown with all players, pre-selecting current team players
        renderTeamDropdown(editTeamSelect, players, teamPlayers);
        console.log('editTeamSelect populated with players:', editTeamSelect.innerHTML);

        showModal('editTeamModal');
      } else {
        console.warn('editTeamName or editTeamSelect not found in DOM');
      }
    } catch (error) {
      console.error('Error opening edit team modal:', error);
    }
  }

  handleEditTeam() {
    console.log('Handling edit team');
    try {
      const editTeamNameInput = this.rootElement.querySelector('#editTeamName');
      const editTeamSelect = this.rootElement.querySelector('#editTeamSelect');
      const teamId = editTeamSelect.dataset.teamId;

      if (!teamId) {
        console.error('No teamId found for editing');
        return;
      }

      if (editTeamNameInput && editTeamSelect) {
        const teamName = editTeamNameInput.value.trim();
        // Get all selected player IDs from the multi-select dropdown
        const selectedPlayerIds = Array.from(editTeamSelect.selectedOptions).map(option => option.value);

        if (!teamName) {
          alert('Team name is required');
          return;
        }

        if (!selectedPlayerIds.length) {
          alert('At least one player must be selected');
          return;
        }

        // Update team in storage
        this.store.editTeam(teamId, {
          name: teamName,
          playerIds: selectedPlayerIds
        });

        console.log('Editing team:', teamId, { name: teamName, playerIds: selectedPlayerIds });

        // Close modal and refresh team table
        closeModal('editTeamModal');
        this.store.teamManagement.refreshTeamTable();
      } else {
        console.warn('editTeamName or editTeamSelect not found in DOM');
      }
    } catch (error) {
      console.error('Error handling edit team:', error);
    }
  }
}