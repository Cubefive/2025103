class TeamCreation {
    constructor({ rootElement, storage, props = {} }) {
        console.log('Constructing TeamCreation with rootElement:', rootElement);
        this.rootElement = rootElement;
        this.storage = storage;
        this.props = props;
        this.setupEventListeners();
    }

    setupEventListeners() {
        console.log('Setting up event listeners for TeamCreation');
        const createTeamBtn = document.querySelector('.create-team-btn');
        if (createTeamBtn) {
            createTeamBtn.addEventListener('click', () => {
                console.log('Create Team button clicked');
                this.openCreateTeamModal();
            });
        } else {
            console.log('create-team-btn not found in DOM');
        }

        const saveTeamBtn = document.querySelector('.save-team-btn');
        if (saveTeamBtn) {
            saveTeamBtn.addEventListener('click', (e) => {
                console.log('Save Team button clicked');
                this.handleCreateTeam(e);
            });
        } else {
            console.log('save-team-btn not found in DOM');
        }

        const cancelBtn = document.querySelector('#createTeamModal .cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                console.log('Cancel button clicked');
                this.closeCreateTeamModal();
            });
        } else {
            console.log('cancel-btn not found in DOM');
        }
    }

    openCreateTeamModal() {
        console.log('Opening create team modal');
        const modal = document.getElementById('createTeamModal');
        if (modal) {
            this.populateTeamSelect();
            modalUtils.showModal('createTeamModal');
        }
    }

    populateTeamSelect() {
        console.log('Populating team select dropdown');
        const teamSelect = document.getElementById('teamSelect');
        if (teamSelect && this.storage && this.storage.getPlayerDatabase) {
            const players = this.storage.getPlayerDatabase();
            console.log('Players for team select:', players);
            uiUtils.renderTeamDropdown(players, '', 'teamSelect', true);
            console.log('Team select populated:', teamSelect.innerHTML);
        }
    }

    handleCreateTeam(e) {
        e.preventDefault();
        const teamNameInput = document.getElementById('teamName');
        const teamSelect = document.getElementById('teamSelect');
        const teamName = teamNameInput.value.trim();
        const selectedPlayers = Array.from(teamSelect.selectedOptions).map(option => option.value);
        if (teamName && selectedPlayers.length > 0) {
            const team = {
                id: crypto.randomUUID(),
                name: teamName,
                playerIds: selectedPlayers,
                captainId: selectedPlayers[0],
                checkedInTournaments: []
            };
            console.log('Creating team:', team);
            this.storage.addTeam(team);
            this.closeCreateTeamModal();
            console.log('Team table refreshed after creating team');
            if (this.props.onTeamCreated) {
                this.props.onTeamCreated();
            }
        }
    }

    closeCreateTeamModal() {
        console.log('Closing create team modal');
        modalUtils.hideModal('createTeamModal');
        document.getElementById('teamName').value = '';
        const teamSelect = document.getElementById('teamSelect');
        if (teamSelect) {
            teamSelect.selectedIndex = -1;
        }
    }
}

export default TeamCreation;