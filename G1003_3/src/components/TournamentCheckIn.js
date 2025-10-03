import { createInput, createDropdown } from '../utils/dropdownUtils.js';
import { showModal } from '../utils/modalUtils.js';
import TableDistribution from '../utils/TableDistribution.js';
import { generateUUIDv4 } from '../utils/uuidUtils.js';

export default class TournamentCheckIn {
  constructor(store, rootElement, tournamentStorage) {
    console.log('Constructing TournamentCheckIn with rootElement:', rootElement);
    if (!(rootElement instanceof HTMLElement)) {
      throw new Error('rootElement must be an HTMLElement');
    }
    this.store = store;
    this.rootElement = rootElement;
    this.tournamentStorage = tournamentStorage;
    this.tableDistribution = new TableDistribution(tournamentStorage, this.store.teamStorage);
    this.sectionVisibility = {};
    this.selectedTournamentId = '';
    this.eventListeners = [];
    this.init();
  }

  init() {
    console.log('Initializing TournamentCheckIn');
    try {
      this.loadTournamentSectionVisibility();
      this.render();
    } catch (error) {
      console.error('Error initializing TournamentCheckIn:', error);
    }
  }

  loadTournamentSectionVisibility() {
    console.log('Loading tournament section visibility from localStorage');
    try {
      const visibilityData = localStorage.getItem('tournamentSectionVisibility');
      if (visibilityData) {
        this.sectionVisibility = JSON.parse(visibilityData);
        console.log('Tournament section visibility loaded:', this.sectionVisibility);
      } else {
        this.sectionVisibility = {
          checkInTeamsContainer: false,
          tableDistributionContainer: false
        };
        console.log('No tournament section visibility found, using defaults:', this.sectionVisibility);
      }
    } catch (error) {
      console.error('Error loading tournament section visibility:', error);
      this.sectionVisibility = {
        checkInTeamsContainer: false,
        tableDistributionContainer: false
      };
    }
  }

  saveTournamentSectionVisibility() {
    console.log('Saving tournament section visibility to localStorage:', this.sectionVisibility);
    try {
      localStorage.setItem('tournamentSectionVisibility', JSON.stringify(this.sectionVisibility));
      console.log('Tournament section visibility saved');
    } catch (error) {
      console.error('Error saving tournament section visibility:', error);
    }
  }

  toggleTournamentSection(sectionId, visible) {
    console.log(`Toggling tournament section ${sectionId} to ${visible}`);
    try {
      this.sectionVisibility[sectionId] = visible;
      this.saveTournamentSectionVisibility();
      this.updateTournamentSectionVisibility(sectionId, visible);
    } catch (error) {
      console.error(`Error toggling tournament section ${sectionId}:`, error);
    }
  }

  updateTournamentSectionVisibility(sectionId, visible) {
    console.log(`Updating visibility for ${sectionId} to ${visible}`);
    try {
      const section = this.rootElement.querySelector(`#${sectionId}`);
      if (section) {
        section.style.display = visible ? 'block' : 'none';
        console.log(`Setting display for ${sectionId}: ${visible ? 'block' : 'none'}`);
      } else {
        console.warn(`Section ${sectionId} not found in DOM`);
      }
      const toggleButton = this.rootElement.querySelector(`[data-section="${sectionId}"]`);
      if (toggleButton) {
        toggleButton.textContent = visible ? `Hide ${sectionId.replace('Container', '')}` : `Show ${sectionId.replace('Container', '')}`;
      } else {
        console.warn(`Toggle button for ${sectionId} not found`);
      }
    } catch (error) {
      console.error(`Error updating visibility for ${sectionId}:`, error);
    }
  }

  setupEventListeners() {
    console.log('Setting up event listeners for TournamentCheckIn');
    try {
      // Ta bort tidigare event listeners
      this.eventListeners.forEach(({ element, type, listener }) => {
        element.removeEventListener(type, listener);
      });
      this.eventListeners = [];

      // Debounce-funktion för att begränsa multipla anrop
      const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
          clearTimeout(timeout);
          timeout = setTimeout(() => func.apply(this, args), wait);
        };
      };

      const clickHandler = (event) => {
        try {
          if (event.target.classList.contains('create-tournament-open-btn')) {
            console.log('Create Tournament button clicked');
            this.openCreateTournamentModal();
          }
          if (event.target.classList.contains('edit-tournament-open-btn')) {
            console.log('Edit Tournament button clicked');
            this.openEditTournamentModal();
          }
          if (event.target.classList.contains('delete-tournament-btn')) {
            console.log('Delete Tournament button clicked');
            this.deleteTournament();
          }
          if (event.target.classList.contains('create-tournament-btn')) {
            console.log('Save Tournament button clicked');
            this.handleCreateTournament();
          }
          if (event.target.classList.contains('edit-tournament-btn')) {
            console.log('Save Edit Tournament button clicked');
            this.handleEditTournament();
          }
          if (event.target.classList.contains('save-as-tournament-btn')) {
            console.log('Save As Tournament button clicked');
            this.handleSaveAsTournament();
          }
          if (event.target.classList.contains('cancel-btn')) {
            console.log('Cancel button clicked');
            this.handleCancelModal(event.target.closest('.modal').id);
          }
          if (event.target.classList.contains('toggle-tournament-btn')) {
            const sectionId = event.target.dataset.section;
            if (sectionId) {
              console.log(`Toggle tournament section button clicked for: ${sectionId}`);
              this.toggleTournamentSection(sectionId, !this.sectionVisibility[sectionId]);
            }
          }
          if (event.target.classList.contains('generate-table-distribution-btn')) {
            console.log('Generate Table Distribution button clicked');
            this.generateTableDistribution();
          }
          if (event.target.classList.contains('simulate-table-distribution-btn')) {
            console.log('Simulate Table Distribution button clicked');
            this.openSimulateTableDistributionModal();
          }
        } catch (error) {
          console.error('Error in TournamentCheckIn click handler:', error);
        }
      };

      const debouncedClickHandler = debounce(clickHandler, 300);
      this.rootElement.addEventListener('click', debouncedClickHandler);
      this.eventListeners.push({ element: this.rootElement, type: 'click', listener: debouncedClickHandler });

      const tournamentSelect = this.rootElement.querySelector('#tournamentSelect');
      if (tournamentSelect) {
        const selectHandler = (event) => {
          console.log('Tournament select changed:', event.target.value);
          this.selectedTournamentId = event.target.value;
          this.refreshTournamentDetails();
          this.refreshCheckInTeamsList();
          this.refreshTableDistribution();
        };
        tournamentSelect.addEventListener('change', selectHandler);
        this.eventListeners.push({ element: tournamentSelect, type: 'change', listener: selectHandler });
      } else {
        console.warn('tournamentSelect not found in DOM');
      }
    } catch (error) {
      console.error('Error setting up event listeners for TournamentCheckIn:', error);
    }
  }

  openCreateTournamentModal() {
    console.log('Opening create tournament modal');
    try {
      const modal = this.rootElement.querySelector('#createTournamentModal');
      if (modal) {
        showModal(modal);
      } else {
        console.warn('createTournamentModal not found in DOM');
      }
    } catch (error) {
      console.error('Error opening create tournament modal:', error);
    }
  }

  openEditTournamentModal() {
    console.log('Opening edit tournament modal');
    try {
      if (!this.selectedTournamentId) {
        alert('Please select a tournament to edit.');
        console.warn('No tournament selected for editing');
        return;
      }
      const modal = this.rootElement.querySelector('#editTournamentModal');
      if (modal) {
        const tournament = this.store.getTournamentDatabase().find(t => t.id === this.selectedTournamentId);
        if (tournament) {
          modal.querySelector('#editTournamentName').value = tournament.name;
          modal.querySelector('#editTournamentDate').value = tournament.date;
          modal.querySelector('#editTournamentMaxTeams').value = tournament.maxTeams;
          modal.querySelector('#editTournamentStacksPerTeam').value = tournament.stacksPerTeam;
          modal.querySelector('#editTournamentLocation').value = tournament.location;
          modal.querySelector('#editTournamentStartTime').value = tournament.startTime;
          modal.querySelector('#editTournamentType').value = tournament.type;
          modal.querySelector('#editTournamentMaxTables').value = tournament.maxTables;
          modal.querySelector('#editTournamentStackSize').value = tournament.stackSize;
          modal.querySelector('#editTournamentStatus').value = tournament.status;
          modal.querySelector('#editTournamentOrganizer').value = tournament.organizer;
          modal.querySelector('#editTournamentMaxSeatsPerTable').value = tournament.maxSeatsPerTable;
          modal.querySelector('#editTournamentAllocationMode').value = tournament.allocationMode;
          showModal(modal);
        } else {
          console.warn('Selected tournament not found:', this.selectedTournamentId);
        }
      } else {
        console.warn('editTournamentModal not found in DOM');
      }
    } catch (error) {
      console.error('Error opening edit tournament modal:', error);
    }
  }

  handleCreateTournament() {
    console.log('Handling create tournament');
    try {
      const modal = this.rootElement.querySelector('#createTournamentModal');
      if (!modal) {
        console.warn('createTournamentModal not found');
        return;
      }
      const tournament = {
        id: generateUUIDv4(),
        name: modal.querySelector('#tournamentName').value,
        date: modal.querySelector('#tournamentDate').value,
        maxTeams: parseInt(modal.querySelector('#tournamentMaxTeams').value) || 0,
        stacksPerTeam: parseInt(modal.querySelector('#tournamentStacksPerTeam').value) || 0,
        location: modal.querySelector('#tournamentLocation').value,
        startTime: modal.querySelector('#tournamentStartTime').value,
        type: modal.querySelector('#tournamentType').value,
        maxTables: parseInt(modal.querySelector('#tournamentMaxTables').value) || 0,
        stackSize: parseInt(modal.querySelector('#tournamentStackSize').value) || 0,
        status: modal.querySelector('#tournamentStatus').value,
        organizer: modal.querySelector('#tournamentOrganizer').value,
        maxSeatsPerTable: parseInt(modal.querySelector('#tournamentMaxSeatsPerTable').value) || 9,
        allocationMode: modal.querySelector('#tournamentAllocationMode').value || 'random',
        checkedInTeams: [],
        startTimestamp: null
      };
      console.log('Creating tournament:', tournament);
      this.store.addTournament(tournament);
      this.handleCancelModal('createTournamentModal');
      this.refreshTournamentSelect();
      alert('Tournament created successfully.');
    } catch (error) {
      console.error('Error creating tournament:', error);
      alert('Failed to create tournament.');
    }
  }

  handleEditTournament() {
    console.log('Handling edit tournament');
    try {
      const modal = this.rootElement.querySelector('#editTournamentModal');
      if (!modal || !this.selectedTournamentId) {
        console.warn('editTournamentModal or selectedTournamentId not found');
        return;
      }
      const tournament = {
        name: modal.querySelector('#editTournamentName').value,
        date: modal.querySelector('#editTournamentDate').value,
        maxTeams: parseInt(modal.querySelector('#editTournamentMaxTeams').value) || 0,
        stacksPerTeam: parseInt(modal.querySelector('#editTournamentStacksPerTeam').value) || 0,
        location: modal.querySelector('#editTournamentLocation').value,
        startTime: modal.querySelector('#editTournamentStartTime').value,
        type: modal.querySelector('#editTournamentType').value,
        maxTables: parseInt(modal.querySelector('#editTournamentMaxTables').value) || 0,
        stackSize: parseInt(modal.querySelector('#editTournamentStackSize').value) || 0,
        status: modal.querySelector('#editTournamentStatus').value,
        organizer: modal.querySelector('#editTournamentOrganizer').value,
        maxSeatsPerTable: parseInt(modal.querySelector('#editTournamentMaxSeatsPerTable').value) || 9,
        allocationMode: modal.querySelector('#editTournamentAllocationMode').value || 'random'
      };
      console.log('Editing tournament:', this.selectedTournamentId, tournament);
      this.store.editTournament(this.selectedTournamentId, tournament);
      this.handleCancelModal('editTournamentModal');
      this.refreshTournamentSelect();
      alert('Tournament updated successfully.');
    } catch (error) {
      console.error('Error editing tournament:', error);
      alert('Failed to update tournament.');
    }
  }

  handleSaveAsTournament() {
    console.log('Handling save as tournament');
    try {
      const modal = this.rootElement.querySelector('#editTournamentModal');
      if (!modal) {
        console.warn('editTournamentModal not found');
        return;
      }
      const tournament = {
        id: generateUUIDv4(),
        name: modal.querySelector('#editTournamentName').value,
        date: modal.querySelector('#editTournamentDate').value,
        maxTeams: parseInt(modal.querySelector('#editTournamentMaxTeams').value) || 0,
        stacksPerTeam: parseInt(modal.querySelector('#editTournamentStacksPerTeam').value) || 0,
        location: modal.querySelector('#editTournamentLocation').value,
        startTime: modal.querySelector('#editTournamentStartTime').value,
        type: modal.querySelector('#editTournamentType').value,
        maxTables: parseInt(modal.querySelector('#editTournamentMaxTables').value) || 0,
        stackSize: parseInt(modal.querySelector('#editTournamentStackSize').value) || 0,
        status: modal.querySelector('#editTournamentStatus').value,
        organizer: modal.querySelector('#editTournamentOrganizer').value,
        maxSeatsPerTable: parseInt(modal.querySelector('#editTournamentMaxSeatsPerTable').value) || 9,
        allocationMode: modal.querySelector('#editTournamentAllocationMode').value || 'random',
        checkedInTeams: [],
        startTimestamp: null
      };
      console.log('Saving as new tournament:', tournament);
      this.store.addTournament(tournament);
      this.handleCancelModal('editTournamentModal');
      this.refreshTournamentSelect();
      alert('Tournament saved as new successfully.');
    } catch (error) {
      console.error('Error saving as new tournament:', error);
      alert('Failed to save as new tournament.');
    }
  }

  deleteTournament() {
    console.log('Deleting tournament:', this.selectedTournamentId);
    try {
      if (!this.selectedTournamentId) {
        alert('Please select a tournament to delete.');
        console.warn('No tournament selected for deletion');
        return;
      }
      if (confirm('Are you sure you want to delete this tournament?')) {
        this.store.deleteTournament(this.selectedTournamentId);
        this.selectedTournamentId = '';
        this.refreshTournamentSelect();
        this.refreshTournamentDetails();
        this.refreshCheckInTeamsList();
        this.refreshTableDistribution();
        alert('Tournament deleted successfully.');
      }
    } catch (error) {
      console.error('Error deleting tournament:', error);
      alert('Failed to delete tournament.');
    }
  }

  handleCancelModal(modalId) {
    console.log(`Closing modal: ${modalId}`);
    try {
      const modal = this.rootElement.querySelector(`#${modalId}`);
      if (modal) {
        modal.style.display = 'none';
      } else {
        console.warn(`Modal ${modalId} not found`);
      }
    } catch (error) {
      console.error(`Error closing modal ${modalId}:`, error);
    }
  }

  openSimulateTableDistributionModal() {
    console.log('Opening simulate table distribution modal');
    try {
      const modal = this.rootElement.querySelector('#simulateTableDistributionModal');
      if (modal) {
        showModal(modal);
      } else {
        console.warn('simulateTableDistributionModal not found in DOM');
      }
    } catch (error) {
      console.error('Error opening simulate table distribution modal:', error);
    }
  }

  generateTableDistribution() {
    console.log('Generating table distribution for tournament:', this.selectedTournamentId);
    try {
      if (!this.selectedTournamentId) {
        alert('Please select a tournament to generate table distribution.');
        console.warn('No tournament selected for table distribution');
        return;
      }
      const tournament = this.store.getTournamentDatabase().find(t => t.id === this.selectedTournamentId);
      if (tournament) {
        this.tableDistribution.distributeTables(this.selectedTournamentId, tournament.allocationMode);
        this.refreshTableDistribution();
        alert('Table distribution generated successfully.');
      } else {
        console.warn('Selected tournament not found:', this.selectedTournamentId);
      }
    } catch (error) {
      console.error('Error generating table distribution:', error);
      alert('Failed to generate table distribution.');
    }
  }

  refreshTournamentSelect() {
    console.log('Refreshing tournament select');
    try {
      const tournamentSelect = this.rootElement.querySelector('#tournamentSelect');
      if (tournamentSelect) {
        const tournaments = this.store.getTournamentDatabase();
        console.log('Tournaments in select:', tournaments);
        tournamentSelect.innerHTML = '<option value="">Select a tournament</option>';
        tournaments.forEach(tournament => {
          const option = document.createElement('option');
          option.value = tournament.id;
          option.textContent = `${tournament.name} (${tournament.date})`;
          tournamentSelect.appendChild(option);
        });
        tournamentSelect.value = this.selectedTournamentId || '';
        console.log('Tournament select updated:', tournamentSelect.innerHTML);
      } else {
        console.warn('tournamentSelect not found in DOM');
      }
    } catch (error) {
      console.error('Error refreshing tournament select:', error);
    }
  }

  refreshTournamentDetails() {
    console.log('Refreshing tournament details');
    try {
      const detailsContainer = this.rootElement.querySelector('#tournamentDetails');
      if (detailsContainer) {
        if (this.selectedTournamentId) {
          const tournament = this.store.getTournamentDatabase().find(t => t.id === this.selectedTournamentId);
          if (tournament) {
            detailsContainer.innerHTML = `
              <h3>${tournament.name}</h3>
              <p>Date: ${tournament.date}</p>
              <p>Max Teams: ${tournament.maxTeams}</p>
              <p>Stacks per Team: ${tournament.stacksPerTeam}</p>
              <p>Location: ${tournament.location}</p>
              <p>Start Time: ${tournament.startTime}</p>
              <p>Type: ${tournament.type}</p>
              <p>Max Tables: ${tournament.maxTables}</p>
              <p>Stack Size: ${tournament.stackSize}</p>
              <p>Status: ${tournament.status}</p>
              <p>Organizer: ${tournament.organizer}</p>
              <p>Max Seats per Table: ${tournament.maxSeatsPerTable}</p>
              <p>Allocation Mode: ${tournament.allocationMode}</p>
            `;
            console.log('Tournament details rendered:', detailsContainer.innerHTML);
          } else {
            detailsContainer.innerHTML = '<p>No tournament selected.</p>';
            console.log('No tournament selected for details');
          }
        } else {
          detailsContainer.innerHTML = '<p>No tournament selected.</p>';
          console.log('No tournament selected for details');
        }
      } else {
        console.warn('tournamentDetails not found in DOM');
      }
    } catch (error) {
      console.error('Error refreshing tournament details:', error);
    }
  }

  refreshCheckInTeamsList() {
    console.log('Refreshing check-in teams list');
    try {
      const checkInTeamsList = this.rootElement.querySelector('#checkInTeamsList');
      if (checkInTeamsList) {
        if (this.selectedTournamentId) {
          const tournament = this.store.getTournamentDatabase().find(t => t.id === this.selectedTournamentId);
          const teamDatabase = this.store.getTeamDatabase();
          if (tournament && tournament.checkedInTeams) {
            checkInTeamsList.innerHTML = '';
            tournament.checkedInTeams.forEach(teamId => {
              const team = teamDatabase.find(t => t.id === teamId);
              if (team) {
                const li = document.createElement('li');
                li.textContent = team.name;
                checkInTeamsList.appendChild(li);
              }
            });
            console.log('Check-in teams list rendered:', checkInTeamsList.innerHTML);
          } else {
            checkInTeamsList.innerHTML = '<li>No teams checked in.</li>';
            console.log('No teams checked in for tournament:', this.selectedTournamentId);
          }
        } else {
          checkInTeamsList.innerHTML = '<li>No tournament selected.</li>';
          console.log('No tournament selected for check-in teams');
        }
      } else {
        console.warn('checkInTeamsList not found in DOM');
      }
    } catch (error) {
      console.error('Error refreshing check-in teams list:', error);
    }
  }

  refreshTableDistribution() {
    console.log('Refreshing table distribution');
    try {
      const tableDistributionList = this.rootElement.querySelector('#tableDistributionList');
      if (tableDistributionList) {
        if (this.selectedTournamentId) {
          const tables = this.tableDistribution.getTableDistribution(this.selectedTournamentId);
          tableDistributionList.innerHTML = '';
          if (tables.length > 0) {
            tables.forEach(table => {
              const div = document.createElement('div');
              div.innerHTML = `
                <h4>Table ${table.tableId}</h4>
                <ul>
                  ${table.seats.map(seat => `<li>Team ${seat.teamId}, Stack ${seat.stackNumber}, Seat ${seat.seatNumber}</li>`).join('')}
                </ul>
              `;
              tableDistributionList.appendChild(div);
            });
            console.log('Table distribution rendered:', tableDistributionList.innerHTML);
          } else {
            tableDistributionList.innerHTML = '<p>No table distribution available.</p>';
            console.log('No table distribution for tournament:', this.selectedTournamentId);
          }
        } else {
          tableDistributionList.innerHTML = '<p>No tournament selected.</p>';
          console.log('No tournament selected for table distribution');
        }
      } else {
        console.warn('tableDistributionList not found in DOM');
      }
    } catch (error) {
      console.error('Error refreshing table distribution:', error);
    }
  }

  render() {
    console.log('TournamentCheckIn rendering');
    try {
      const tournamentContainer = this.rootElement.querySelector('#tournamentManagementContainer');
      if (!tournamentContainer) {
        console.warn('tournamentManagementContainer not found in DOM');
        return;
      }
      tournamentContainer.innerHTML = `
        <div>
          <h2>Tournament Management</h2>
          <div id="tournamentSelectContainer">
            <select id="tournamentSelect">
              <option value="">Select a tournament</option>
            </select>
          </div>
          <div id="tournamentDetails"></div>
          <button class="create-tournament-open-btn btn">Create Tournament</button>
          <button class="edit-tournament-open-btn btn">Edit Tournament</button>
          <button class="delete-tournament-btn btn">Delete Tournament</button>
          <div id="createTournamentModal" class="modal">
            <div class="modal-content">
              ${createInput('tournamentName', 'text', 'Tournament Name', 'Enter tournament name')}
              ${createInput('tournamentDate', 'date', 'Date', '')}
              ${createInput('tournamentMaxTeams', 'number', 'Max Teams', 'Enter max teams')}
              ${createInput('tournamentStacksPerTeam', 'number', 'Stacks per Team', 'Enter stacks per team')}
              ${createInput('tournamentLocation', 'text', 'Location', 'Enter location')}
              ${createInput('tournamentStartTime', 'time', 'Start Time', '')}
              ${createInput('tournamentType', 'text', 'Type', 'Enter tournament type')}
              ${createInput('tournamentMaxTables', 'number', 'Max Tables', 'Enter max tables')}
              ${createInput('tournamentStackSize', 'number', 'Stack Size', 'Enter stack size')}
              ${createInput('tournamentStatus', 'text', 'Status', 'Enter status')}
              ${createInput('tournamentOrganizer', 'text', 'Organizer', 'Enter organizer')}
              ${createInput('tournamentMaxSeatsPerTable', 'number', 'Max Seats per Table', 'Enter max seats per table', '9')}
              ${createDropdown('tournamentAllocationMode', ['Sequential', 'Random'], 'Allocation Mode', 'random')}
              <div class="modal-actions">
                <button class="create-tournament-btn btn">Save</button>
                <button class="cancel-btn btn">Cancel</button>
              </div>
            </div>
          </div>
          <div id="editTournamentModal" class="modal">
            <div class="modal-content">
              ${createInput('editTournamentName', 'text', 'Tournament Name', 'Enter tournament name')}
              ${createInput('editTournamentDate', 'date', 'Date', '')}
              ${createInput('editTournamentMaxTeams', 'number', 'Max Teams', 'Enter max teams')}
              ${createInput('editTournamentStacksPerTeam', 'number', 'Stacks per Team', 'Enter stacks per team')}
              ${createInput('editTournamentLocation', 'text', 'Location', 'Enter location')}
              ${createInput('editTournamentStartTime', 'time', 'Start Time', '')}
              ${createInput('editTournamentType', 'text', 'Type', 'Enter tournament type')}
              ${createInput('editTournamentMaxTables', 'number', 'Max Tables', 'Enter max tables')}
              ${createInput('editTournamentStackSize', 'number', 'Stack Size', 'Enter stack size')}
              ${createInput('editTournamentStatus', 'text', 'Status', 'Enter status')}
              ${createInput('editTournamentOrganizer', 'text', 'Organizer', 'Enter organizer')}
              ${createInput('editTournamentMaxSeatsPerTable', 'number', 'Max Seats per Table', 'Enter max seats per table', '9')}
              ${createDropdown('editTournamentAllocationMode', ['Sequential', 'Random'], 'Allocation Mode', 'random')}
              <div class="modal-actions">
                <button class="edit-tournament-btn btn">Save</button>
                <button class="save-as-tournament-btn btn">Save As</button>
                <button class="cancel-btn btn">Cancel</button>
              </div>
            </div>
          </div>
          <button class="toggle-tournament-btn btn" data-section="checkInTeamsContainer">
            ${this.sectionVisibility['checkInTeamsContainer'] ? 'Hide' : 'Show'} Check-in Teams
          </button>
          <div id="checkInTeamsContainer" style="display: ${this.sectionVisibility['checkInTeamsContainer'] ? 'block' : 'none'};">
            <h3>Check-in Teams</h3>
            <ul id="checkInTeamsList"></ul>
          </div>
          <button class="toggle-tournament-btn btn" data-section="tableDistributionContainer">
            ${this.sectionVisibility['tableDistributionContainer'] ? 'Hide' : 'Show'} Table Distribution
          </button>
          <div id="tableDistributionContainer" style="display: ${this.sectionVisibility['tableDistributionContainer'] ? 'block' : 'none'};">
            <h3>Table Distribution</h3>
            <button class="generate-table-distribution-btn btn">Generate Table Distribution</button>
            <button class="simulate-table-distribution-btn btn">Simulate Table Distribution</button>
            <div id="simulateTableDistributionModal" class="modal">
              <div class="modal-content">
                ${createInput('simulateNumTeams', 'number', 'Number of Teams', 'Enter number of teams')}
                ${createInput('simulateMaxTables', 'number', 'Max Tables', 'Enter max tables')}
                ${createInput('simulateStacksPerTeam', 'number', 'Stacks per Team', 'Enter stacks per team')}
                ${createInput('simulateMaxSeatsPerTable', 'number', 'Max Seats per Table', 'Enter max seats per table', '9')}
                ${createDropdown('simulateAllocationMode', ['Sequential', 'Random'], 'Allocation Mode', 'random')}
                <div class="modal-actions">
                  <button class="simulate-table-distribution-btn btn">Simulate</button>
                  <button class="cancel-btn btn">Cancel</button>
                </div>
              </div>
            </div>
            <div id="tableDistributionList"></div>
          </div>
        </div>
      `;
      console.log('TournamentCheckIn content rendered in tournamentManagementContainer:', tournamentContainer.innerHTML);
      this.refreshTournamentSelect();
      this.setupEventListeners();
    } catch (error) {
      console.error('Error rendering TournamentCheckIn:', error);
    }
  }
}