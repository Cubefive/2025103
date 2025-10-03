class TeamManagement {
    constructor({ rootElement, storage }) {
        console.log('Constructing TeamManagement with rootElement:', rootElement);
        this.rootElement = rootElement;
        this.storage = storage;
        this.teamDatabase = [];
        this.init();
    }

    init() {
        console.log('Initializing TeamManagement');
        this.render();
        this.refreshTeamTable();
        this.refreshTeamSelect();
        this.setupEventListeners();
    }

    refreshTeamTable() {
        console.log('Refreshing team table');
        if (this.storage && this.storage.getTeams && this.storage.getPlayerDatabase) {
            const teamDatabase = this.storage.getTeams();
            const playerDatabase = this.storage.getPlayerDatabase();
            console.log('Team database:', teamDatabase);
            console.log('Player database for team table:', playerDatabase);
            this.teamDatabase = teamDatabase;
            const fields = [
                { key: 'name', label: 'Team Name' },
                {
                    key: 'playerIds',
                    label: 'Players',
                    render: (playerIds) => {
                        if (playerDatabase) {
                            return playerIds
                                .map(id => {
                                    const player = playerDatabase.find(p => p.id === id);
                                    return player ? `${player.firstName} ${player.lastName}` : 'Unknown';
                                })
                                .join(', ');
                        }
                        return '';
                    }
                },
                {
                    key: 'captainId',
                    label: 'Captain',
                    render: (captainId) => {
                        if (playerDatabase) {
                            const captain = playerDatabase.find(p => p.id === captainId);
                            return captain ? `${captain.firstName} ${captain.lastName}` : 'Unknown';
                        }
                        return '';
                    }
                },
                {
                    key: 'id',
                    label: 'Actions',
                    render: (id) => `
                        <button class="edit-team-btn btn" data-team-id="${id}">Edit</button>
                        <button class="edit-captain-btn btn" data-team-id="${id}">Edit Captain</button>
                        <button class="delete-team-btn btn" data-team-id="${id}">Delete</button>
                    `
                }
            ];
            uiUtils.renderTable('team', teamDatabase, fields, 'teamTable');
            console.log('Team table rendered:', document.getElementById('teamTable').innerHTML);
            this.setupEventListeners();
        }
    }

    refreshTeamSelect() {
        console.log('Refreshing team select dropdown');
        const teamSelect = document.getElementById('teamSelect');
        const editTeamSelect = document.getElementById('editTeamSelect');
        if (this.storage && this.storage.getTeams) {
            const teams = this.storage.getTeams();
            console.log('Teams for dropdown:', teams);
            if (teamSelect) {
                uiUtils.renderTeamDropdown(teams, '', 'teamSelect', true);
                console.log('teamSelect populated:', teamSelect.innerHTML);
            } else {
                console.log('teamSelect not found in DOM');
            }
            if (editTeamSelect) {
                uiUtils.renderTeamDropdown(teams, '', 'editTeamSelect', true);
                console.log('editTeamSelect populated:', editTeamSelect.innerHTML);
            } else {
                console.log('editTeamSelect not found in DOM');
            }
        }
    }

    setupEventListeners() {
        console.log('Setting up event listeners for TeamManagement');
        const editButtons = document.querySelectorAll('.edit-team-btn');
        const editCaptainButtons = document.querySelectorAll('.edit-captain-btn');
        const deleteButtons = document.querySelectorAll('.delete-team-btn');
        console.log(`Event listeners set up for ${editButtons.length} edit buttons, ${editCaptainButtons.length} edit captain buttons, and ${deleteButtons.length} delete buttons`);
    }

    render() {
        console.log('TeamManagement rendering');
        const teamManagementContainer = document.getElementById('teamManagementContainer');
        if (teamManagementContainer) {
            teamManagementContainer.innerHTML = `
                <div>
                    <h2>Team Management</h2>
                    <button class="create-team-btn btn">Create Team</button>
                    <div id="createTeamModal" class="modal">
                        <div class="modal-content">
                            ${dropdownUtils.createInput({ id: 'teamName', type: 'text', label: 'Team Name', placeholder: 'Enter team name' })}
                            ${dropdownUtils.createDropdown({ id: 'teamSelect', label: 'Select Players', multiple: true })}
                            <div class="modal-actions">
                                <button class="save-team-btn btn">Save</button>
                                <button class="cancel-btn btn">Cancel</button>
                            </div>
                        </div>
                    </div>
                    <div id="editTeamModal" class="modal">
                        <div class="modal-content">
                            ${dropdownUtils.createInput({ id: 'editTeamName', type: 'text', label: 'Team Name', placeholder: 'Enter team name' })}
                            ${dropdownUtils.createDropdown({ id: 'editTeamSelect', label: 'Select Players', multiple: true })}
                            <div class="modal-actions">
                                <button class="save-edit-team-btn btn">Save</button>
                                <button class="cancel-btn btn">Cancel</button>
                            </div>
                        </div>
                    </div>
                    <div id="editCaptainModal" class="modal">
                        <div class="modal-content">
                            ${dropdownUtils.createDropdown({ id: 'editCaptainSelect', label: 'Select Captain' })}
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
            console.log('TeamManagement content rendered in teamManagementContainer:', teamManagementContainer.innerHTML);

            this.teamCreation = new TeamCreation({
                rootElement: this.rootElement,
                storage: this.storage,
                props: {
                    onTeamCreated: () => this.refreshTeamTable() // Skicka callback för att uppdatera tabellen
                }
            });
            this.teamEdit = new TeamEdit({ rootElement: this.rootElement, storage: this.storage });
            this.teamCaptainEdit = new TeamCaptainEdit({ rootElement: this.rootElement, storage: this.storage });
        }
    }
}