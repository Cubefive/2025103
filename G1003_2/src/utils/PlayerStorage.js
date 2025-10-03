export default class PlayerStorage {
  constructor() {
    this.playerDatabase = null;
    this.loadPlayerDatabase();
  }

  loadPlayerDatabase() {
    console.log('Loading playerDatabase');
    const playerData = localStorage.getItem('playerDatabase');
    console.log('Raw playerDatabase from localStorage:', playerData);
    try {
      this.playerDatabase = playerData ? JSON.parse(playerData) : [
        { id: '1', firstName: 'Alice', lastName: 'Adams', nickname: 'Ace', email: 'alice@team1.com', phoneNumber: '1111', teamId: '1', teamName: 'Team Alpha', isCaptain: true },
        { id: '2', firstName: 'Adam', lastName: 'Allen', nickname: 'Ace2', email: 'adam@team1.com', phoneNumber: '1112', teamId: '1', teamName: 'Team Alpha', isCaptain: false },
        { id: '3', firstName: 'Amelia', lastName: 'Anderson', nickname: 'Ace3', email: 'amelia@team1.com', phoneNumber: '1113', teamId: '1', teamName: 'Team Alpha', isCaptain: false },
        { id: '4', firstName: 'Arthur', lastName: 'Andrews', nickname: 'Ace4', email: 'arthur@team1.com', phoneNumber: '1114', teamId: '1', teamName: 'Team Alpha', isCaptain: false },
        { id: '5', firstName: 'Bob', lastName: 'Baker', nickname: 'Bluff', email: 'bob@team2.com', phoneNumber: '2221', teamId: '2', teamName: 'Team Beta', isCaptain: true },
        { id: '6', firstName: 'Beth', lastName: 'Barnes', nickname: 'Bluff2', email: 'beth@team2.com', phoneNumber: '2222', teamId: '2', teamName: 'Team Beta', isCaptain: false },
        { id: '7', firstName: 'Bella', lastName: 'Bennett', nickname: 'Bluff3', email: 'bella@team2.com', phoneNumber: '2223', teamId: '2', teamName: 'Team Beta', isCaptain: false },
        { id: '8', firstName: 'Ben', lastName: 'Brooks', nickname: 'Bluff4', email: 'ben@team2.com', phoneNumber: '2224', teamId: '2', teamName: 'Team Beta', isCaptain: false },
        { id: '9', firstName: 'Charlie', lastName: 'Carter', nickname: 'Chip', email: 'charlie@team3.com', phoneNumber: '3331', teamId: '3', teamName: 'Team Gamma', isCaptain: true },
        { id: '10', firstName: 'Chloe', lastName: 'Clark', nickname: 'Chip2', email: 'chloe@team3.com', phoneNumber: '3332', teamId: '3', teamName: 'Team Gamma', isCaptain: false },
        { id: '11', firstName: 'Caleb', lastName: 'Collins', nickname: 'Chip3', email: 'caleb@team3.com', phoneNumber: '3333', teamId: '3', teamName: 'Team Gamma', isCaptain: false },
        { id: '12', firstName: 'Clara', lastName: 'Cooper', nickname: 'Chip4', email: 'clara@team3.com', phoneNumber: '3334', teamId: '3', teamName: 'Team Gamma', isCaptain: false },
        { id: '13', firstName: 'David', lastName: 'Davis', nickname: 'Deal', email: 'david@team4.com', phoneNumber: '4441', teamId: '4', teamName: 'Team Delta', isCaptain: true },
        { id: '14', firstName: 'Daisy', lastName: 'Dean', nickname: 'Deal2', email: 'daisy@team4.com', phoneNumber: '4442', teamId: '4', teamName: 'Team Delta', isCaptain: false },
        { id: '15', firstName: 'Daniel', lastName: 'Dixon', nickname: 'Deal3', email: 'daniel@team4.com', phoneNumber: '4443', teamId: '4', teamName: 'Team Delta', isCaptain: false },
        { id: '16', firstName: 'Diana', lastName: 'Dunn', nickname: 'Deal4', email: 'diana@team4.com', phoneNumber: '4444', teamId: '4', teamName: 'Team Delta', isCaptain: false },
        { id: '17', firstName: 'Emma', lastName: 'Edwards', nickname: 'Edge', email: 'emma@team5.com', phoneNumber: '5551', teamId: '5', teamName: 'Team Epsilon', isCaptain: true },
        { id: '18', firstName: 'Ethan', lastName: 'Ellis', nickname: 'Edge2', email: 'ethan@team5.com', phoneNumber: '5552', teamId: '5', teamName: 'Team Epsilon', isCaptain: false },
        { id: '19', firstName: 'Ella', lastName: 'Evans', nickname: 'Edge3', email: 'ella@team5.com', phoneNumber: '5553', teamId: '5', teamName: 'Team Epsilon', isCaptain: false },
        { id: '20', firstName: 'Evan', lastName: 'Emerson', nickname: 'Edge4', email: 'evan@team5.com', phoneNumber: '5554', teamId: '5', teamName: 'Team Epsilon', isCaptain: false },
        { id: '21', firstName: 'Fiona', lastName: 'Fisher', nickname: 'Flush', email: 'fiona@team6.com', phoneNumber: '6661', teamId: '6', teamName: 'Team Zeta', isCaptain: true },
        { id: '22', firstName: 'Finn', lastName: 'Ford', nickname: 'Flush2', email: 'finn@team6.com', phoneNumber: '6662', teamId: '6', teamName: 'Team Zeta', isCaptain: false },
        { id: '23', firstName: 'Faith', lastName: 'Foster', nickname: 'Flush3', email: 'faith@team6.com', phoneNumber: '6663', teamId: '6', teamName: 'Team Zeta', isCaptain: false },
        { id: '24', firstName: 'Felix', lastName: 'Fox', nickname: 'Flush4', email: 'felix@team6.com', phoneNumber: '6664', teamId: '6', teamName: 'Team Zeta', isCaptain: false },
        { id: '25', firstName: 'Grace', lastName: 'Gibson', nickname: 'Gamble', email: 'grace@team7.com', phoneNumber: '7771', teamId: '7', teamName: 'Team Eta', isCaptain: true },
        { id: '26', firstName: 'Gavin', lastName: 'Gordon', nickname: 'Gamble2', email: 'gavin@team7.com', phoneNumber: '7772', teamId: '7', teamName: 'Team Eta', isCaptain: false },
        { id: '27', firstName: 'Gemma', lastName: 'Grant', nickname: 'Gamble3', email: 'gemma@team7.com', phoneNumber: '7773', teamId: '7', teamName: 'Team Eta', isCaptain: false },
        { id: '28', firstName: 'George', lastName: 'Gray', nickname: 'Gamble4', email: 'george@team7.com', phoneNumber: '7774', teamId: '7', teamName: 'Team Eta', isCaptain: false },
        { id: '29', firstName: 'Hannah', lastName: 'Harris', nickname: 'Hold', email: 'hannah@team8.com', phoneNumber: '8881', teamId: '8', teamName: 'Team Theta', isCaptain: true },
        { id: '30', firstName: 'Henry', lastName: 'Hayes', nickname: 'Hold2', email: 'henry@team8.com', phoneNumber: '8882', teamId: '8', teamName: 'Team Theta', isCaptain: false },
        { id: '31', firstName: 'Hazel', lastName: 'Hill', nickname: 'Hold3', email: 'hazel@team8.com', phoneNumber: '8883', teamId: '8', teamName: 'Team Theta', isCaptain: false },
        { id: '32', firstName: 'Hugo', lastName: 'Howard', nickname: 'Hold4', email: 'hugo@team8.com', phoneNumber: '8884', teamId: '8', teamName: 'Team Theta', isCaptain: false },
        { id: '33', firstName: 'Isabella', lastName: 'Ingram', nickname: 'Ivy', email: 'isabella@team9.com', phoneNumber: '9991', teamId: '9', teamName: 'Team Iota', isCaptain: true },
        { id: '34', firstName: 'Isaac', lastName: 'Irwin', nickname: 'Ivy2', email: 'isaac@team9.com', phoneNumber: '9992', teamId: '9', teamName: 'Team Iota', isCaptain: false },
        { id: '35', firstName: 'Isla', lastName: 'Irving', nickname: 'Ivy3', email: 'isla@team9.com', phoneNumber: '9993', teamId: '9', teamName: 'Team Iota', isCaptain: false },
        { id: '36', firstName: 'Ian', lastName: 'Innes', nickname: 'Ivy4', email: 'ian@team9.com', phoneNumber: '9994', teamId: '9', teamName: 'Team Iota', isCaptain: false },
        { id: '37', firstName: 'Jack', lastName: 'Jackson', nickname: 'Joker', email: 'jack@team10.com', phoneNumber: '10101', teamId: '10', teamName: 'Team Kappa', isCaptain: true },
        { id: '38', firstName: 'Jade', lastName: 'James', nickname: 'Joker2', email: 'jade@team10.com', phoneNumber: '10102', teamId: '10', teamName: 'Team Kappa', isCaptain: false },
        { id: '39', firstName: 'Jake', lastName: 'Jenkins', nickname: 'Joker3', email: 'jake@team10.com', phoneNumber: '10103', teamId: '10', teamName: 'Team Kappa', isCaptain: false },
        { id: '40', firstName: 'Jasmine', lastName: 'Jones', nickname: 'Joker4', email: 'jasmine@team10.com', phoneNumber: '10104', teamId: '10', teamName: 'Team Kappa', isCaptain: false },
        { id: '41', firstName: 'Kate', lastName: 'Kelly', nickname: 'King', email: 'kate@team11.com', phoneNumber: '11111', teamId: '11', teamName: 'Team Lambda', isCaptain: true },
        { id: '42', firstName: 'Kevin', lastName: 'King', nickname: 'King2', email: 'kevin@team11.com', phoneNumber: '11112', teamId: '11', teamName: 'Team Lambda', isCaptain: false },
        { id: '43', firstName: 'Kylie', lastName: 'Knight', nickname: 'King3', email: 'kylie@team11.com', phoneNumber: '11113', teamId: '11', teamName: 'Team Lambda', isCaptain: false },
        { id: '44', firstName: 'Kyle', lastName: 'Kerr', nickname: 'King4', email: 'kyle@team11.com', phoneNumber: '11114', teamId: '11', teamName: 'Team Lambda', isCaptain: false },
        { id: '45', firstName: 'Lily', lastName: 'Lewis', nickname: 'Luck', email: 'lily@team12.com', phoneNumber: '12121', teamId: '12', teamName: 'Team Mu', isCaptain: true },
        { id: '46', firstName: 'Liam', lastName: 'Lloyd', nickname: 'Luck2', email: 'liam@team12.com', phoneNumber: '12122', teamId: '12', teamName: 'Team Mu', isCaptain: false },
        { id: '47', firstName: 'Lucas', lastName: 'Lane', nickname: 'Luck3', email: 'lucas@team12.com', phoneNumber: '12123', teamId: '12', teamName: 'Team Mu', isCaptain: false },
        { id: '48', firstName: 'Luna', lastName: 'Lawrence', nickname: 'Luck4', email: 'luna@team12.com', phoneNumber: '12124', teamId: '12', teamName: 'Team Mu', isCaptain: false },
        { id: '49', firstName: 'Mason', lastName: 'Mason', nickname: 'Maverick', email: 'mason@team13.com', phoneNumber: '13131', teamId: '13', teamName: 'Team Nu', isCaptain: true },
        { id: '50', firstName: 'Mia', lastName: 'Matthews', nickname: 'Maverick2', email: 'mia@team13.com', phoneNumber: '13132', teamId: '13', teamName: 'Team Nu', isCaptain: false },
        { id: '51', firstName: 'Max', lastName: 'Mills', nickname: 'Maverick3', email: 'max@team13.com', phoneNumber: '13133', teamId: '13', teamName: 'Team Nu', isCaptain: false },
        { id: '52', firstName: 'Molly', lastName: 'Mitchell', nickname: 'Maverick4', email: 'molly@team13.com', phoneNumber: '13134', teamId: '13', teamName: 'Team Nu', isCaptain: false },
        { id: '53', firstName: 'Noah', lastName: 'Nelson', nickname: 'Nerve', email: 'noah@team14.com', phoneNumber: '14141', teamId: '14', teamName: 'Team Xi', isCaptain: true },
        { id: '54', firstName: 'Nora', lastName: 'Nichols', nickname: 'Nerve2', email: 'nora@team14.com', phoneNumber: '14142', teamId: '14', teamName: 'Team Xi', isCaptain: false },
        { id: '55', firstName: 'Nathan', lastName: 'Norris', nickname: 'Nerve3', email: 'nathan@team14.com', phoneNumber: '14143', teamId: '14', teamName: 'Team Xi', isCaptain: false },
        { id: '56', firstName: 'Naomi', lastName: 'Newman', nickname: 'Nerve4', email: 'naomi@team14.com', phoneNumber: '14144', teamId: '14', teamName: 'Team Xi', isCaptain: false },
        { id: '57', firstName: 'Olivia', lastName: 'Owens', nickname: 'Odds', email: 'olivia@team15.com', phoneNumber: '15151', teamId: '15', teamName: 'Team Omicron', isCaptain: true },
        { id: '58', firstName: 'Oscar', lastName: 'Oliver', nickname: 'Odds2', email: 'oscar@team15.com', phoneNumber: '15152', teamId: '15', teamName: 'Team Omicron', isCaptain: false },
        { id: '59', firstName: 'Owen', lastName: 'Ortega', nickname: 'Odds3', email: 'owen@team15.com', phoneNumber: '15153', teamId: '15', teamName: 'Team Omicron', isCaptain: false },
        { id: '60', firstName: 'Olive', lastName: 'Osborne', nickname: 'Odds4', email: 'olive@team15.com', phoneNumber: '15154', teamId: '15', teamName: 'Team Omicron', isCaptain: false }
      ];
      console.log('Loaded playerDatabase:', this.playerDatabase);
    } catch (error) {
      console.error('Error loading playerDatabase:', error);
      this.playerDatabase = [];
      this.savePlayerDatabase();
    }
  }

  savePlayerDatabase() {
    console.log('Saving playerDatabase:', this.playerDatabase);
    try {
      if (Array.isArray(this.playerDatabase)) {
        localStorage.setItem('playerDatabase', JSON.stringify(this.playerDatabase));
        console.log('playerDatabase saved to localStorage');
        document.dispatchEvent(new CustomEvent('playerDatabaseUpdated'));
      } else {
        console.error('playerDatabase is not an array:', this.playerDatabase);
      }
    } catch (error) {
      console.error('Error saving playerDatabase to localStorage:', error);
    }
  }

  addPlayer(player) {
    console.log('Adding player:', player);
    if (player && player.id) {
      this.playerDatabase.push(player);
      this.savePlayerDatabase();
    } else {
      console.error('Invalid player data:', player);
    }
  }

  editPlayer(updatedPlayer) {
    console.log('Editing player:', updatedPlayer);
    const playerIndex = this.playerDatabase.findIndex(p => p.id === updatedPlayer.id);
    if (playerIndex !== -1) {
      this.playerDatabase[playerIndex] = { ...updatedPlayer };
      this.savePlayerDatabase();
    } else {
      console.error('Player not found for ID:', updatedPlayer.id);
    }
  }

  deletePlayer(playerId) {
    console.log('Deleting player:', playerId);
    this.playerDatabase = this.playerDatabase.filter(p => p.id !== playerId);
    this.savePlayerDatabase();
  }

  getPlayerDatabase() {
    return this.playerDatabase || [];
  }
}