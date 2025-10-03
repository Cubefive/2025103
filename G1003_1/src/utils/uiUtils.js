export function renderTable(container, data, fields, type) {
  console.log(`Rendering table for type: ${type}, with data:`, data);
  console.log('Fields for rendering:', fields);
  try {
    container.innerHTML = '';
    data.forEach(item => {
      const row = document.createElement('tr');
      if (type === 'team') {
        row.dataset.teamId = item.id;
      } else if (type === 'player') {
        row.dataset.playerId = item.id;
      }
      fields.forEach(field => {
        const cell = document.createElement('td');
        if (field.key === 'actions' && field.format && typeof field.format === 'function') {
          cell.innerHTML = field.format(item.id);
        } else if (field.format && typeof field.format === 'function') {
          cell.innerHTML = field.format(item[field.key], item.id);
        } else {
          cell.textContent = item[field.key] || '';
        }
        row.appendChild(cell);
      });
      container.appendChild(row);
    });
    console.log(`Table rendered for ${type} in container:`, container.innerHTML);
  } catch (error) {
    console.error(`Error rendering table for ${type}:`, error);
  }
}

export function renderTeamDropdown(selectElement, items, selectedIds = []) {
  console.log('Rendering team dropdown with items:', items);
  try {
    selectElement.innerHTML = selectElement.multiple ? '<option value="">Select multiple</option>' : '<option value="">Select a team</option>';
    items.forEach(item => {
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = item.name;
      if (selectedIds.includes(item.id)) {
        option.selected = true;
      }
      selectElement.appendChild(option);
    });
    console.log('Team dropdown rendered:', selectElement.innerHTML);
  } catch (error) {
    console.error('Error rendering team dropdown:', error);
  }
}