import PlayerManagement from './PlayerManagement.js';
import TeamManagement from './TeamManagement.js';
import TournamentCheckIn from './TournamentCheckIn.js';
import Storage from '../utils/storage.js';
import PlayerStorage from '../utils/PlayerStorage.js';
import TeamStorage from '../utils/TeamStorage.js';
import TournamentStorage from '../utils/TournamentStorage.js';

export default class App {
  constructor(rootElement) {
    console.log('Constructing App with rootElement:', rootElement);
    if (!(rootElement instanceof HTMLElement)) {
      throw new Error('rootElement must be an HTMLElement');
    }
    this.rootElement = rootElement;
    this.sectionVisibility = {};
    this.playerManagement = null;
    this.teamManagement = null;
    this.tournamentCheckIn = null;
    this.storage = null;
  }

  init() {
    console.log('Initializing App');
    try {
      this.render();
      this.loadSectionVisibility();
      this.setupToggleListeners();
      this.initializeComponents();
    } catch (error) {
      console.error('Error initializing App:', error);
    }
  }

  initializeComponents() {
    console.log('Initializing components');
    try {
      const playerStorage = new PlayerStorage();
      const teamStorage = new TeamStorage();
      const tournamentStorage = new TournamentStorage();
      this.storage = new Storage(playerStorage, teamStorage, tournamentStorage);

      this.storage.playerManagement = this.playerManagement = new PlayerManagement(this.storage, this.rootElement);
      this.storage.teamManagement = this.teamManagement = new TeamManagement(this.storage, this.rootElement);
      this.storage.tournamentCheckIn = this.tournamentCheckIn = new TournamentCheckIn(this.storage, this.rootElement, tournamentStorage);

      this.playerManagement.init();
      this.teamManagement.init();
      this.tournamentCheckIn.init();
    } catch (error) {
      console.error('Error initializing components:', error);
    }
  }

  loadSectionVisibility() {
    console.log('Loading section visibility from localStorage');
    try {
      const visibilityData = localStorage.getItem('sectionVisibility');
      if (visibilityData) {
        this.sectionVisibility = JSON.parse(visibilityData);
        console.log('Section visibility loaded:', this.sectionVisibility);
      } else {
        this.sectionVisibility = {
          playerManagementContainer: false,
          teamManagementContainer: false,
          tournamentManagementContainer: false
        };
        console.log('No section visibility found, using defaults:', this.sectionVisibility);
      }
    } catch (error) {
      console.error('Error loading section visibility:', error);
      this.sectionVisibility = {
        playerManagementContainer: false,
        teamManagementContainer: false,
        tournamentManagementContainer: false
      };
    }
  }

  saveSectionVisibility() {
    console.log('Saving section visibility to localStorage:', this.sectionVisibility);
    try {
      localStorage.setItem('sectionVisibility', JSON.stringify(this.sectionVisibility));
      console.log('Section visibility saved');
    } catch (error) {
      console.error('Error saving section visibility:', error);
    }
  }

  toggleSection(sectionId, visible) {
    console.log(`Toggling section ${sectionId} to ${visible}`);
    try {
      this.sectionVisibility[sectionId] = visible;
      this.saveSectionVisibility();
      this.updateSectionVisibility(sectionId, visible);
    } catch (error) {
      console.error(`Error toggling section ${sectionId}:`, error);
    }
  }

  updateSectionVisibility(sectionId, visible) {
    console.log(`Updating visibility for ${sectionId} to ${visible}`);
    try {
      const section = this.rootElement.querySelector(`#${sectionId}`);
      if (section) {
        section.style.display = visible ? 'block' : 'none';
        console.log(`Setting display for ${sectionId}: ${visible ? 'block' : 'none'}`);
        if (visible) {
          if (sectionId === 'playerManagementContainer') {
            console.log('Rendering Player Management');
            this.playerManagement.render();
          } else if (sectionId === 'teamManagementContainer') {
            console.log('Rendering Team Management');
            this.teamManagement.render();
          } else if (sectionId === 'tournamentManagementContainer') {
            console.log('Rendering Tournament Management');
            this.tournamentCheckIn.render();
          }
        }
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

  setupToggleListeners() {
    console.log('Setting up toggle listeners for App');
    try {
      this.rootElement.addEventListener('click', (event) => {
        if (event.target.classList.contains('toggle-section-btn')) {
          const sectionId = event.target.dataset.section;
          console.log(`Toggle button clicked for section: ${sectionId}`);
          this.toggleSection(sectionId, !this.sectionVisibility[sectionId]);
        }
      });
    } catch (error) {
      console.error('Error setting up toggle listeners:', error);
    }
  }

  render() {
    console.log('Rendering App');
    try {
      this.rootElement.innerHTML = `
        <h1>Poker Team Tournament Manager</h1>
        <button class="toggle-section-btn btn" data-section="playerManagementContainer">
          ${this.sectionVisibility['playerManagementContainer'] ? 'Hide' : 'Show'} Player Management
        </button>
        <div id="playerManagementContainer" style="display: ${this.sectionVisibility['playerManagementContainer'] ? 'block' : 'none'};"></div>
        <button class="toggle-section-btn btn" data-section="teamManagementContainer">
          ${this.sectionVisibility['teamManagementContainer'] ? 'Hide' : 'Show'} Team Management
        </button>
        <div id="teamManagementContainer" style="display: ${this.sectionVisibility['teamManagementContainer'] ? 'block' : 'none'};"></div>
        <button class="toggle-section-btn btn" data-section="tournamentManagementContainer">
          ${this.sectionVisibility['tournamentManagementContainer'] ? 'Hide' : 'Show'} Tournament Management
        </button>
        <div id="tournamentManagementContainer" style="display: ${this.sectionVisibility['tournamentManagementContainer'] ? 'block' : 'none'};"></div>
      `;
      console.log('App render complete, rootElement content:', this.rootElement.innerHTML);
    } catch (error) {
      console.error('Error rendering App:', error);
    }
  }
}