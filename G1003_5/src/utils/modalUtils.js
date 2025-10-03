export function openEditPlayerModal(container, playerId, store) {
  console.log('Opening edit player modal for ID:', playerId);
  try {
    const player = store.getPlayerDatabase().find(p => p.id === playerId);
    if (!player) {
      console.warn('Player not found for ID:', playerId);
      alert('Player not found');
      return;
    }
    store.currentEditingPlayerId = playerId;
    const firstNameInput = container.querySelector('#editFirstName');
    const lastNameInput = container.querySelector('#editLastName');
    const nicknameInput = container.querySelector('#editNickname');
    const emailInput = container.querySelector('#editEmail');
    const phoneInput = container.querySelector('#editPhoneNumber');
    const editTeamSelect = container.querySelector('#editTeamSelect');

    if (!firstNameInput || !lastNameInput || !nicknameInput || !emailInput || !phoneInput || !editTeamSelect) {
      console.error('One or more modal inputs not found:', {
        firstNameInput, lastNameInput, nicknameInput, emailInput, phoneInput, editTeamSelect
      });
      return;
    }

    firstNameInput.value = player.firstName;
    lastNameInput.value = player.lastName;
    nicknameInput.value = player.nickname || '';
    emailInput.value = player.email || '';
    phoneInput.value = player.phoneNumber || '';

    const teamDatabase = store.getTeamDatabase() || [];
    editTeamSelect.innerHTML = `
      <option value="">No Team</option>
      ${teamDatabase.map(team => `
        <option value="${team.id}" ${team.id === player.teamId ? 'selected' : ''}>
          ${team.name}
        </option>
      `).join('')}
    `;
    showModal(container.querySelector('#editPlayerModal'));
  } catch (error) {
    console.error('Error opening edit player modal:', error);
  }
}

export function closeEditPlayerModal(container) {
  console.log('Closing edit player modal');
  try {
    const modal = container.querySelector('#editPlayerModal');
    if (modal) {
      modal.style.display = 'none';
    } else {
      console.warn('editPlayerModal not found in container');
    }
  } catch (error) {
    console.error('Error closing edit player modal:', error);
  }
}

export function createModal(modalId, inputs, buttonClass, buttonText) {
  try {
    return `
      <div id="${modalId}" class="modal">
        <div class="modal-content">
          ${inputs.join('')}
          <div class="modal-actions">
            <button class="${buttonClass} btn">${buttonText}</button>
            <button class="cancel-btn btn">Cancel</button>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Error creating modal:', error);
    return '';
  }
}

export function showModal(modal) {
  console.log('Showing modal:', modal.id);
  try {
    if (modal) {
      modal.style.display = 'block';
    } else {
      console.warn('Modal not found');
    }
  } catch (error) {
    console.error('Error showing modal:', error);
  }
}

export function closeModal(modalId) {
  console.log(`Closing modal: ${modalId}`);
  try {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';
    } else {
      console.warn(`Modal with ID ${modalId} not found in DOM`);
    }
  } catch (error) {
    console.error(`Error closing modal ${modalId}:`, error);
  }
}