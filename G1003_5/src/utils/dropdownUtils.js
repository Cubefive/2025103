export function createInput(id, type, label, placeholder, defaultValue = '') {
  console.log(`Creating input with id: ${id}, type: ${type}, label: ${label}, placeholder: ${placeholder}, defaultValue: ${defaultValue}`);
  const input = `
    <label for="${id}">${label}:</label>
    <input type="${type}" id="${id}" placeholder="${placeholder}" value="${defaultValue}">
  `;
  console.log('Input created:', input);
  return input;
}

export function createDropdown(id, options, label, defaultValue = '', multiple = false) {
  console.log(`Creating dropdown with id: ${id}, options:`, options, `label: ${label}, defaultValue: ${defaultValue}, multiple: ${multiple}`);
  const multipleAttr = multiple ? 'multiple' : '';
  const select = `
    <label for="${id}">${label}:</label>
    <select id="${id}" ${multipleAttr}>
      <option value="">Select ${multiple ? 'multiple' : 'one'}</option>
      ${options.map(option => `<option value="${option}" ${option === defaultValue ? 'selected' : ''}>${option}</option>`).join('')}
    </select>
  `;
  console.log('Dropdown created:', select);
  return select;
}

export function renderTeamFilterDropdown(selectElement, teams, selectedTeamId = '', selectorId = '') {
  console.log(`Rendering team filter dropdown with teams:`, teams, `selectedTeamId: ${selectedTeamId}, selectorId: ${selectorId}`);
  try {
    if (!(selectElement instanceof HTMLElement)) {
      console.error(`Select element with id ${selectorId} not found in DOM`);
      return;
    }
    selectElement.innerHTML = '<option value="">All Teams</option>';
    teams.forEach(team => {
      const option = document.createElement('option');
      option.value = team.id;
      option.textContent = team.name;
      if (team.id === selectedTeamId) {
        option.selected = true;
      }
      selectElement.appendChild(option);
    });
    console.log('Team filter dropdown rendered:', selectElement.innerHTML);
  } catch (error) {
    console.error('Error rendering team filter dropdown:', error);
  }
}