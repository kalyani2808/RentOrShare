// Data Storage
let currentUser = null;
const users = JSON.parse(localStorage.getItem('sharehub_users')) || [];
const items = JSON.parse(localStorage.getItem('sharehub_items')) || [];
const rentals = JSON.parse(localStorage.getItem('sharehub_rentals')) || [];

// DOM Elements
const authSection = document.getElementById('auth');
const hiddenContent = document.querySelector('.hidden-content');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const homePage = document.getElementById('homePage');
const listingsPage = document.getElementById('listingsPage');
const myItemsPage = document.getElementById('myItemsPage');
const shareItemForm = document.getElementById('shareItemForm');
const selectedItemPage = document.getElementById('selectedItemPage');
const listingsContainer = document.getElementById('listingsContainer');
const myItemsContainer = document.getElementById('myItemsContainer');
const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  // Check if user is already logged in
  const loggedInUser = localStorage.getItem('sharehub_currentUser');
  if (loggedInUser) {
    currentUser = JSON.parse(loggedInUser);
    showAppContent();
  }

  // Setup form event listeners
  setupFormValidation();
});

// Show Register Form
function showRegisterForm() {
  loginForm.classList.add('hidden');
  registerForm.classList.remove('hidden');
}

// Show Login Form
function showLoginForm() {
  registerForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
}

// Setup form validation
function setupFormValidation() {
  // Register form validation
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateRegisterForm()) {
      registerUser();
    }
  });

  // Login form validation
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateLoginForm()) {
      loginUser();
    }
  });

  // Share item form validation
  document.getElementById('shareItemFormContent').addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateShareItemForm()) {
      shareItem();
    }
  });
}

// Validate Register Form
function validateRegisterForm() {
  let isValid = true;
  const username = document.getElementById('regUsername');
  const password = document.getElementById('regPassword');
  const phone = document.getElementById('phone');
  const rollNumber = document.getElementById('rollNumber');

  // Validate username
  if (username.value.length < 4) {
    username.classList.add('is-invalid');
    username.nextElementSibling.textContent = 'Username must be at least 4 characters';
    isValid = false;
  } else if (users.some(u => u.username === username.value)) {
    username.classList.add('is-invalid');
    username.nextElementSibling.textContent = 'Username already exists';
    isValid = false;
  } else {
    username.classList.remove('is-invalid');
  }

  // Validate password
  if (password.value.length < 6) {
    password.classList.add('is-invalid');
    password.nextElementSibling.textContent = 'Password must be at least 6 characters';
    isValid = false;
  } else {
    password.classList.remove('is-invalid');
  }

  // Validate phone
  if (!/^\d{10}$/.test(phone.value)) {
    phone.classList.add('is-invalid');
    phone.nextElementSibling.textContent = 'Please enter valid 10-digit phone number';
    isValid = false;
  } else if (users.some(u => u.phone === phone.value)) {
    phone.classList.add('is-invalid');
    phone.nextElementSibling.textContent = 'Phone number already registered';
    isValid = false;
  } else {
    phone.classList.remove('is-invalid');
  }

  // Validate roll number
  if (!rollNumber.value) {
    rollNumber.classList.add('is-invalid');
    rollNumber.nextElementSibling.textContent = 'Please enter your roll number';
    isValid = false;
  } else if (users.some(u => u.rollNumber === rollNumber.value)) {
    rollNumber.classList.add('is-invalid');
    rollNumber.nextElementSibling.textContent = 'Roll number already registered';
    isValid = false;
  } else {
    rollNumber.classList.remove('is-invalid');
  }

  return isValid;
}

// Validate Login Form
function validateLoginForm() {
  let isValid = true;
  const username = document.getElementById('username');
  const password = document.getElementById('password');

  if (!username.value) {
    username.classList.add('is-invalid');
    isValid = false;
  } else {
    username.classList.remove('is-invalid');
  }

  if (!password.value) {
    password.classList.add('is-invalid');
    isValid = false;
  } else {
    password.classList.remove('is-invalid');
  }

  return isValid;
}

// Validate Share Item Form
function validateShareItemForm() {
  let isValid = true;
  const itemName = document.getElementById('itemName');
  const itemDescription = document.getElementById('itemDescription');
  const itemPrice = document.getElementById('itemPrice');
  const sharePhone = document.getElementById('sharePhone');

  if (!itemName.value) {
    itemName.classList.add('is-invalid');
    isValid = false;
  } else {
    itemName.classList.remove('is-invalid');
  }

  if (!itemDescription.value) {
    itemDescription.classList.add('is-invalid');
    isValid = false;
  } else {
    itemDescription.classList.remove('is-invalid');
  }

  if (!itemPrice.value || itemPrice.value < 1) {
    itemPrice.classList.add('is-invalid');
    isValid = false;
  } else {
    itemPrice.classList.remove('is-invalid');
  }

  if (!/^\d{10}$/.test(sharePhone.value)) {
    sharePhone.classList.add('is-invalid');
    isValid = false;
  } else {
    sharePhone.classList.remove('is-invalid');
  }

  return isValid;
}

// Register User
function registerUser() {
  const user = {
    username: document.getElementById('regUsername').value,
    password: document.getElementById('regPassword').value,
    rollNumber: document.getElementById('rollNumber').value,
    classSec: document.getElementById('classSec').value,
    phone: document.getElementById('phone').value
  };

  users.push(user);
  localStorage.setItem('sharehub_users', JSON.stringify(users));
  alert('Registration successful! You can now login.');
  showLoginForm();
}

// Login User
function loginUser() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    currentUser = user;
    localStorage.setItem('sharehub_currentUser', JSON.stringify(currentUser));
    showAppContent();
  } else {
    alert('Invalid username or password!');
  }
}

// Show main app content after login
function showAppContent() {
  authSection.style.display = 'none';
  hiddenContent.style.display = 'block';
  showHomePage();
  updateListings();
  updateMyItems();
}

// Show Home Page
function showHomePage() {
  homePage.style.display = 'block';
  listingsPage.style.display = 'none';
  myItemsPage.style.display = 'none';
  shareItemForm.style.display = 'none';
  selectedItemPage.style.display = 'none';
}

// Show Listings Page
function showListingsPage() {
  homePage.style.display = 'none';
  listingsPage.style.display = 'block';
  myItemsPage.style.display = 'none';
  shareItemForm.style.display = 'none';
  selectedItemPage.style.display = 'none';
  updateListings();
}

// Show My Items Page
function showMyItemsPage() {
  homePage.style.display = 'none';
  listingsPage.style.display = 'none';
  myItemsPage.style.display = 'block';
  shareItemForm.style.display = 'none';
  selectedItemPage.style.display = 'none';
  updateMyItems();
}

// Show Share Item Form
function showShareItemForm() {
  homePage.style.display = 'none';
  listingsPage.style.display = 'none';
  myItemsPage.style.display = 'none';
  shareItemForm.style.display = 'block';
  selectedItemPage.style.display = 'none';
  document.getElementById('sharePhone').value = currentUser.phone;
}

// Share Item
function shareItem() {
  const item = {
    id: `item-${Date.now()}`,
    name: document.getElementById('itemName').value,
    description: document.getElementById('itemDescription').value,
    price: parseFloat(document.getElementById('itemPrice').value),
    phone: document.getElementById('sharePhone').value,
    owner: currentUser.username,
    available: true
  };

  items.push(item);
  localStorage.setItem('sharehub_items', JSON.stringify(items));
  alert('Item listed successfully!');
  document.getElementById('shareItemFormContent').reset();
  showListingsPage();
  updateListings();
  updateMyItems();
}

// Update Listings
function updateListings() {
  listingsContainer.innerHTML = '';
  
  const availableItems = items.filter(item => item.available);
  
  if (availableItems.length === 0) {
    listingsContainer.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="fas fa-box-open fa-3x mb-3 text-muted"></i>
        <h4>No items available right now</h4>
        <p>Be the first to share an item!</p>
        <button class="btn btn-primary" onclick="showShareItemForm()">
          <i class="fas fa-share-alt me-2"></i>Share an Item
        </button>
      </div>
    `;
    return;
  }

  availableItems.forEach(item => {
    const itemCard = document.createElement('div');
    itemCard.className = 'col-md-4 mb-4';
    itemCard.innerHTML = `
      <div class="card h-100 item-card">
        <div class="card-body">
          <h5 class="card-title">${item.name}</h5>
          <p class="card-text">${item.description}</p>
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="badge bg-primary">₹${item.price}/day</span>
            <small class="text-muted">Shared by ${item.owner}</small>
          </div>
          <p class="card-text"><small><i class="fas fa-phone me-1"></i>${item.phone}</small></p>
        </div>
        <div class="card-footer bg-transparent">
          <button class="btn btn-primary w-100" onclick="selectItem('${item.id}')">
            <i class="fas fa-cart-plus me-2"></i>Rent
          </button>
        </div>
      </div>
    `;
    listingsContainer.appendChild(itemCard);
  });
}

// Update My Items
function updateMyItems() {
  myItemsContainer.innerHTML = '';
  
  const myItems = items.filter(item => item.owner === currentUser.username);
  
  if (myItems.length === 0) {
    myItemsContainer.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="fas fa-box fa-3x mb-3 text-muted"></i>
        <h4>You haven't shared any items yet</h4>
        <button class="btn btn-primary" onclick="showShareItemForm()">
          <i class="fas fa-share-alt me-2"></i>Share an Item
        </button>
      </div>
    `;
    return;
  }

  myItems.forEach(item => {
    const itemCard = document.createElement('div');
    itemCard.className = 'col-md-4 mb-4';
    
    const rentalStatus = rentals.find(r => r.itemId === item.id && !r.returned);
    const statusBadge = rentalStatus 
      ? `<span class="badge bg-danger">Rented Out</span>` 
      : `<span class="badge bg-success">Available</span>`;
    
    itemCard.innerHTML = `
      <div class="card h-100 item-card">
        <div class="card-body">
          <div class="d-flex justify-content-between">
            <h5 class="card-title">${item.name}</h5>
            ${statusBadge}
          </div>
          <p class="card-text">${item.description}</p>
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="badge bg-primary">₹${item.price}/day</span>
            <small class="text-muted">${item.available ? 'Available' : 'Rented'}</small>
          </div>
        </div>
        <div class="card-footer bg-transparent">
          ${!rentalStatus ? `
            <button class="btn btn-outline-secondary w-100 mb-2" onclick="editItem('${item.id}')">
              <i class="fas fa-edit me-2"></i>Edit
            </button>
            <button class="btn btn-outline-danger w-100" onclick="removeItem('${item.id}')">
              <i class="fas fa-trash me-2"></i>Remove
            </button>
          ` : `
            <button class="btn btn-outline-info w-100" onclick="viewRentalDetails('${item.id}')">
              <i class="fas fa-info-circle me-2"></i>Rental Details
            </button>
          `}
        </div>
      </div>
    `;
    myItemsContainer.appendChild(itemCard);
  });
}

// Select Item for Rental
function selectItem(itemId) {
  const item = items.find(i => i.id === itemId);
  if (!item) return;

  document.getElementById('selectedItemName').textContent = item.name;
  document.getElementById('price').value = item.price;
  document.getElementById('duration').value = 1;
  calculateTotalCost();
  selectedItemPage.dataset.itemId = itemId;

  homePage.style.display = 'none';
  listingsPage.style.display = 'none';
  myItemsPage.style.display = 'none';
  shareItemForm.style.display = 'none';
  selectedItemPage.style.display = 'block';
}

// Calculate Total Cost
function calculateTotalCost() {
  const price = parseFloat(document.getElementById('price').value);
  const days = parseInt(document.getElementById('duration').value);
  document.getElementById('total-cost').textContent = (price * days).toFixed(2);
}

// Confirm Rental
function confirmRental() {
  const itemId = selectedItemPage.dataset.itemId;
  const item = items.find(i => i.id === itemId);
  if (!item) return;

  document.getElementById('modalItemName').textContent = item.name;
  document.getElementById('modalDuration').textContent = document.getElementById('duration').value;
  document.getElementById('modalTotalCost').textContent = document.getElementById('total-cost').textContent;
  
  confirmationModal.show();
}

// Complete Rental
function completeRental() {
  const renterName = document.getElementById('renterName').value;
  const renterPhone = document.getElementById('renterPhone').value;
  
  if (!renterName || !renterPhone) {
    alert('Please enter your name and phone number');
    return;
  }

  const itemId = selectedItemPage.dataset.itemId;
  const item = items.find(i => i.id === itemId);
  if (!item) return;

  const duration = parseInt(document.getElementById('duration').value);
  const totalCost = parseFloat(document.getElementById('total-cost').textContent);

  // Create rental record
  const rental = {
    id: `rental-${Date.now()}`,
    itemId: item.id,
    itemName: item.name,
    owner: item.owner,
    renter: currentUser.username,
    renterName: renterName,
    renterPhone: renterPhone,
    pricePerDay: item.price,
    duration: duration,
    totalCost: totalCost,
    date: new Date().toISOString(),
    returned: false
  };

  rentals.push(rental);
  localStorage.setItem('sharehub_rentals', JSON.stringify(rentals));

  // Mark item as rented
  item.available = false;
  localStorage.setItem('sharehub_items', JSON.stringify(items));

  confirmationModal.hide();
  alert('Rental confirmed successfully!');
  showListingsPage();
  updateListings();
  updateMyItems();
}

// Edit Item
function editItem(itemId) {
  const item = items.find(i => i.id === itemId);
  if (!item) return;

  showShareItemForm();
  document.getElementById('itemName').value = item.name;
  document.getElementById('itemDescription').value = item.description;
  document.getElementById('itemPrice').value = item.price;
  document.getElementById('sharePhone').value = item.phone;

  // Store item ID for update
  document.getElementById('shareItemForm').dataset.itemId = itemId;
}

// Remove Item
function removeItem(itemId) {
  if (!confirm('Are you sure you want to remove this item?')) return;

  const index = items.findIndex(i => i.id === itemId);
  if (index !== -1) {
    items.splice(index, 1);
    localStorage.setItem('sharehub_items', JSON.stringify(items));
    updateMyItems();
    updateListings();
  }
}

// View Rental Details
function viewRentalDetails(itemId) {
  const rental = rentals.find(r => r.itemId === itemId && !r.returned);
  if (!rental) return;

  alert(`
    Rental Details:
    Item: ${rental.itemName}
    Rented To: ${rental.renterName}
    Contact: ${rental.renterPhone}
    Duration: ${rental.duration} days
    Total Cost: ₹${rental.totalCost}
    Date: ${new Date(rental.date).toLocaleDateString()}
  `);
}

// Search Items (case-insensitive)
function searchItems() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const filteredItems = items.filter(item => 
    item.available && 
    (item.name.toLowerCase().includes(searchTerm) || 
    item.description.toLowerCase().includes(searchTerm))
  );

  listingsContainer.innerHTML = '';
  
  if (filteredItems.length === 0) {
    listingsContainer.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="fas fa-search fa-3x mb-3 text-muted"></i>
        <h4>No items match your search</h4>
      </div>
    `;
    return;
  }

  filteredItems.forEach(item => {
    const itemCard = document.createElement('div');
    itemCard.className = 'col-md-4 mb-4';
    itemCard.innerHTML = `
      <div class="card h-100 item-card">
        <div class="card-body">
          <h5 class="card-title">${item.name}</h5>
          <p class="card-text">${item.description}</p>
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="badge bg-primary">₹${item.price}/day</span>
            <small class="text-muted">Shared by ${item.owner}</small>
          </div>
          <p class="card-text"><small><i class="fas fa-phone me-1"></i>${item.phone}</small></p>
        </div>
        <div class="card-footer bg-transparent">
          <button class="btn btn-primary w-100" onclick="selectItem('${item.id}')">
            <i class="fas fa-cart-plus me-2"></i>Rent
          </button>
        </div>
      </div>
    `;
    listingsContainer.appendChild(itemCard);
  });
}

// Go Back to Listings
function goBackToListings() {
  showListingsPage();
}

// Logout
function logout() {
  currentUser = null;
  localStorage.removeItem('sharehub_currentUser');
  location.reload();
}