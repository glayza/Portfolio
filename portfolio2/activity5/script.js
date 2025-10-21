function addItem() {
    const input = document.getElementById('groceryInput');
    const itemText = input.value.trim();
    
    if (itemText === '') {
        alert('Please enter a grocery item!');
        return;
    }

    // Remove empty message if it exists
    const emptyMessage = document.querySelector('.empty-message');
    if (emptyMessage) {
        emptyMessage.remove();
    }

    const list = document.getElementById('groceryList');
    const listItem = document.createElement('li');
    
    listItem.innerHTML = `
        ${itemText}
        <button class="delete-btn" onclick="removeItem(this)">Delete</button>
    `;
    
    list.appendChild(listItem);
    input.value = ''; // Clear input
    input.focus(); // Focus back to input
}

function removeItem(button) {
    const listItem = button.parentElement;
    listItem.remove();
    
    // Show empty message if list is empty
    const list = document.getElementById('groceryList');
    if (list.children.length === 0) {
        list.innerHTML = '<div class="empty-message">Your grocery list is empty. Add some items!</div>';
    }
}

// Allow adding items with Enter key
document.getElementById('groceryInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addItem();
    }
});