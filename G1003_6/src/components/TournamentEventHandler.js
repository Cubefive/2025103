import { showModal } from '../utils/modalUtils.js';
import { generateUUIDv4 } from '../utils/uuidUtils.js';

export default class TournamentEventHandler {
  constructor(manager, renderer) {
    this.manager = manager;
    this.renderer = renderer;
  }

  setupEventListeners() {
    console.log('Setting up event listeners for TournamentEventHandler');
    document.addEventListener('tournamentDatabaseUpdated', () => this.renderer.refreshTournamentSelect());
    document.addEventListener('teamDatabaseUpdated', () => {
      if (this.renderer.tournamentSelect && this.renderer.tournamentSelect.value) {
        this.renderer.refreshCheckInList(this.renderer.tournamentSelect.value);
      }
    });
    document.addEventListener('tableDatabaseUpdated', () => {
      if (this.renderer.tournamentSelect && this.renderer.tournamentSelect.value) {
        this.renderer.renderTableDistribution(this.renderer.tournamentSelect.value, this.manager.tableDistribution);
      }
    });
    this.renderer.rootElement.addEventListener('click', (event) => {
      if (event.target.classList.contains('toggle-tournament-btn')) {
        const sectionId = event.target.dataset.section;
        if (sectionId) {
          this.manager.toggleTournamentSection(sectionId, !this.manager.sectionVisibility[sectionId]);
          event.stopPropagation();
        }
      }
      if (event.target.classList.contains('create-tournament-btn')) {
        this.handleCreateTournament();
      }
      if (event.target.classList.contains('edit-tournament-btn')) {
        this.handleEditTournament();
      }
      if (event.target.classList.contains('delete-tournament-btn')) {
        this.handleDeleteTournament();
      }
      if (event.target.classList.contains('check-in-team-btn')) {
        this.handleCheckInTeam(event.target.dataset.teamId);
      }
      if (event.target.classList.contains('generate-table-distribution-btn')) {
        this.handleGenerateTableDistribution();
      }
      if (event.target.classList.contains('simulate-table-distribution-btn')) {
        this.handleSimulateTableDistribution();
      }
      if (event.target.classList.contains('cancel-btn')) {
        this.handleCancelModal(event.target.closest('.modal').id);
      }
    });

    this.renderer.rootElement.addEventListener('change', (event) => {
      if (event.target.id === 'tournamentSelect') {
        console.log('Tournament select changed:', event.target.value);
        this.renderer.refreshCheckInList(event.target.value);
        this.renderer.refreshTournamentDetails(event.target.value);
        this.renderer.renderTableDistribution(event.target.value, this.manager.tableDistribution);
      }
    });
  }

  handleCancelModal(modalId) {
    console.log(`Closing modal: ${modalId}`);
    const modal = this.renderer.rootElement.querySelector(`#${modalId}`);
    if (modal) {
      modal.style.display = 'none';
    }
  }

  handleCreateTournament() {
    console.log('Create Tournament button clicked');
    const tournament = {
      id: generateUUIDv4(),
      name: this.renderer.rootElement.querySelector('#tournamentName')?.value || 'New Tournament',
      date: this.renderer.rootElement.querySelector('#tournamentDate')?.value || '',
      maxTeams: parseInt(this.renderer.rootElement.querySelector('#tournamentMaxTeams')?.value, 10) || 20,
      stacksPerTeam: parseInt(this.renderer.rootElement.querySelector('#tournamentStacksPerTeam')?.value, 10) || 4,
      location: this.renderer.rootElement.querySelector('#tournamentLocation')?.value || '',
      startTime: this.renderer.rootElement.querySelector('#tournamentStartTime')?.value || '',
      type: this.renderer.rootElement.querySelector('#tournamentType')?.value || '',
      maxTables: parseInt(this.renderer.rootElement.querySelector('#tournamentMaxTables')?.value, 10) || 10,
      stackSize: parseInt(this.renderer.rootElement.querySelector('#tournamentStackSize')?.value, 10) || 10000,
      status: this.renderer.rootElement.querySelector('#tournamentStatus')?.value || 'Upcoming',
      organizer: this.renderer.rootElement.querySelector('#tournamentOrganizer')?.value || ''
    };
    this.manager.tournamentStorage.saveTournament(tournament);
    this.renderer.refreshTournamentSelect();
    alert('Tournament created successfully.');
  }

  handleEditTournament() {
    console.log('Edit Tournament button clicked');
    const tournamentId = this.renderer.tournamentSelect?.value;
    if (!tournamentId) {
      alert('Please select a tournament to edit.');
      return;
    }
    const tournament = this.manager.tournamentStorage.getTournament(tournamentId);
    if (!tournament) {
      alert('Tournament not found.');
      return;
    }
    this.renderer.rootElement.querySelector('#editTournamentName').value = tournament.name;
    this.renderer.rootElement.querySelector('#editTournamentDate').value = tournament.date;
    this.renderer.rootElement.querySelector('#editTournamentMaxTeams').value = tournament.maxTeams;
    this.renderer.rootElement.querySelector('#editTournamentStacksPerTeam').value = tournament.stacksPerTeam;
    this.renderer.rootElement.querySelector('#editTournamentLocation').value = tournament.location;
    this.renderer.rootElement.querySelector('#editTournamentStartTime').value = tournament.startTime;
    this.renderer.rootElement.querySelector('#editTournamentType').value = tournament.type;
    this.renderer.rootElement.querySelector('#editTournamentMaxTables').value = tournament.maxTables;
    this.renderer.rootElement.querySelector('#editTournamentStackSize').value = tournament.stackSize;
    this.renderer.rootElement.querySelector('#editTournamentStatus').value = tournament.status;
    this.renderer.rootElement.querySelector('#editTournamentOrganizer').value = tournament.organizer;
    showModal(this.renderer.rootElement.querySelector('#editTournamentModal'));
  }

  handleDeleteTournament() {
    console.log('Delete Tournament button clicked');
    const tournamentId = this.renderer.tournamentSelect?.value;
    if (!tournamentId) {
      alert('Please select a tournament to delete.');
      return;
    }
    if (confirm('Are you sure you want to delete this tournament?')) {
      this.manager.tournamentStorage.deleteTournament(tournamentId);
      this.renderer.refreshTournamentSelect();
      alert('Tournament deleted successfully.');
    }
  }

  handleCheckInTeam(teamId) {
    console.log('Check-in Team button clicked for teamId:', teamId);
    const tournamentId = this.renderer.tournamentSelect?.value;
    if (!tournamentId) {
      alert('Please select a tournament.');
      return;
    }
    const tournament = this.manager.tournamentStorage.getTournament(tournamentId);
    if (!tournament) {
      alert('Tournament not found.');
      return;
    }
    const checkedInTeams = tournament.checkedInTeams || [];
    if (checkedInTeams.includes(teamId)) {
      tournament.checkedInTeams = checkedInTeams.filter(id => id !== teamId);
    } else {
      tournament.checkedInTeams = [...checkedIn