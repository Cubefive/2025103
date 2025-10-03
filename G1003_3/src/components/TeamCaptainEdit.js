import { showModal, closeModal } from '../utils/modalUtils.js';
import { renderTeamDropdown } from '../utils/uiUtils.js';

export default class TeamCaptainEdit {
  constructor(store, rootElement) {
    console.log('Constructing TeamCaptainEdit with rootElement:', rootElement);
    this.store = store;
    this.rootElement = rootElement;
    this.eventListeners = [];
  }

  setupEventListeners() {
    console.log('Setting up event listeners for TeamCaptainEdit');
    try {
      // Remove previous event listeners
      this.eventListeners.forEach(({ element, type, listener }) => {
        element.removeEventListener(type, listener);
      });
      this.eventListeners = [];

      // Save Captain button
      const saveCaptainBtn = this.rootElement.querySelector('.save-captain-btn');
      if (saveCaptainBtn) {
        const saveListener = () => {
          console.log('Save Captain button clicked');
          this.handleEditCaptain();
        };
        saveCaptainBtn.addEventListener('click', saveListener);
        this.eventListeners.push({ element: saveCaptainBtn, type: 'click', listener: saveListener });
      } else {
        console.warn('save-captain-btn not found in DOM');
      }

      // Cancel button
      const cancelBtn = this.rootElement.querySelector('#editCaptainModal .cancel-btn');
      if (cancelBtn) {
        const cancelListener = () => {
          console.log('Cancel button clicked');
          closeModal('editCaptainModal');
        };
        cancelBtn.addEventListener('click', cancelListener);
        this.eventListeners.push({ element: cancelBtn, type: 'click', listener: cancelListener });
      } else {
        console.warn('cancel-btn not found in DOM');
      }
    } catch (error) {
      console.error('Error setting up event listeners for TeamCaptainEdit:', error);
    }
  }

  openEditCaptainModal(teamId) {
    console.log('Opening edit captain modal for teamId:', teamId);
    try {
      const team = this.store.getTeamDatabase().find(t => t.id === teamId);
      if (!team) {
        console.error('Team not found:', teamId);
        return;
      }

      const editCaptainSelect = this.rootElement.querySelector('#editCaptainSelect');
      if (editCaptainSelect) {
        // Get players in the team
        const playerDatabase = this.store.getPlayerDatabase() || [];
        const teamPlayers = team.playerIds.map(playerId => {
          const player = playerDatabase.find(p => p.id === playerId);
          return {
            id: playerId,
            name: player ? `${player.firstName} ${player.lastName}` : 'Unknown'
          };
        });

        // Populate dropdown with team players, pre-selecting current captain
        renderTeamDropdown(editCaptainSelect, teamPlayers, [team.captainId]);
        console.log('editCaptainSelect populated with players:', editCaptainSelect.innerHTML);

        // Store teamId for saving
        editCaptainSelect.dataset.teamId = teamId;

        showModal('editCaptainModal');
      } else {
        console.warn('editCaptainSelect not found in DOM');
      }
    } catch (error) {
      console.error('Error opening edit captain modal:', error);
    }
  }

  handleEditCaptain() {
    console.log('Handling edit captain');
    try {
      const editCaptainSelect = this.rootElement.querySelector('#editCaptainSelect');
      if (editCaptainSelect) {
        const teamId = editCaptainSelect.dataset.teamId;
        const captainId = editCaptainSelect.value;

        if (!teamId || !captainId) {
          alert('Please select a captain');
          return;
        }

        // Update team captain in storage
        this.store.editTeam(teamId, { captainId });
        console.log('Editing captain for team:', teamId, 'new captainId:', captainId);

        // Close modal and refresh team table
        closeModal('editCaptainModal');
        this.store.teamManagement.refreshTeamTable();
      } else {
        console.warn('editCaptainSelect not found in DOM');
      }
    } catch (error) {
      console.error('Error handling edit captain:', error);
    }
  }
}