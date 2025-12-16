// HSBC UK Dashboard - JavaScript (app.js)
// Complete implementation of all interactive features

// ============================================
// DATA MODELS
// ============================================

const accountsData = [
  {
    id: 'acc_001',
    type: 'current',
    name: 'Premier Current Account',
    accountNumber: '****9456',
    sortCode: '40-47-84',
    balance: 4987543.26,
    pending: 420.00,
    icon: 'wallet'
  },
  {
    id: 'acc_002',
    type: 'savings',
    name: 'Advance Savings Account',
    accountNumber: '****3821',
    sortCode: '40-47-84',
    balance: 125680.50,
    pending: 0,
    icon: 'piggy-bank'
  },
  {
    id: 'acc_003',
    type: 'credit',
    name: 'Premier Credit Card',
    accountNumber: '****7284',
    sortCode: null,
    balance: -6456.25,
    availableCredit: 18543.75,
    totalLimit: 25000.00,
    pending: 0,
    icon: 'credit-card'
  }
];

const savingsGoalsData = [
  {
    id: 'goal_001',
    name: 'Holiday Fund',
    target: 5000.00,
    saved: 3250.00,
    icon: 'plane'
  },
  {
    id: 'goal_002',
    name: 'Emergency Fund',
    target: 10000.00,
    saved: 6800.00,
    icon: 'shield'
  },
  {
    id: 'goal_003',
    name: 'New Car',
    target: 15000.00,
    saved: 4500.00,
    icon: 'car'
  }
];

const transactionsData = [
  {
    id: 'txn_001',
    date: new Date(),
    merchant: 'Harrods',
    category: 'shopping',
    amount: -2847.50,
    status: 'completed',
    icon: 'shopping-bag',
    iconBg: 'rgba(245, 158, 11, 0.1)',
    iconColor: '#F59E0B'
  },
  {
    id: 'txn_002',
    date: new Date(),
    merchant: 'Caffè Nero',
    category: 'dining',
    amount: -4.25,
    status: 'completed',
    icon: 'coffee',
    iconBg: 'rgba(139, 92, 246, 0.1)',
    iconColor: '#8B5CF6'
  },
  {
    id: 'txn_003',
    date: new Date(Date.now() - 86400000),
    merchant: 'Thames Water',
    category: 'bills',
    amount: -127.84,
    status: 'completed',
    icon: 'droplet',
    iconBg: 'rgba(59, 130, 246, 0.1)',
    iconColor: '#3B82F6'
  },
  {
    id: 'txn_004',
    date: new Date(Date.now() - 86400000),
    merchant: 'Waitrose & Partners',
    category: 'groceries',
    amount: -156.73,
    status: 'completed',
    icon: 'shopping-cart',
    iconBg: 'rgba(16, 185, 129, 0.1)',
    iconColor: '#10B981'
  },
  {
    id: 'txn_005',
    date: new Date(Date.now() - 172800000),
    merchant: 'British Gas',
    category: 'bills',
    amount: -198.45,
    status: 'completed',
    icon: 'flame',
    iconBg: 'rgba(239, 68, 68, 0.1)',
    iconColor: '#EF4444'
  },
  {
    id: 'txn_006',
    date: new Date(Date.now() - 172800000),
    merchant: 'Selfridges',
    category: 'shopping',
    amount: -1456.99,
    status: 'completed',
    icon: 'shopping-bag',
    iconBg: 'rgba(245, 158, 11, 0.1)',
    iconColor: '#F59E0B'
  },
  {
    id: 'txn_007',
    date: new Date(Date.now() - 432000000),
    merchant: 'Salary Payment',
    category: 'income',
    amount: 12500.00,
    status: 'completed',
    icon: 'pound-sterling',
    iconBg: 'rgba(16, 185, 129, 0.1)',
    iconColor: '#10B981'
  }
];

// ============================================
// STATE MANAGEMENT
// ============================================

let appState = {
  balancesHidden: false,
  selectedAccount: null,
  modalOpen: false
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  }).format(Math.abs(amount));
}

function formatDate(date) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short'
    });
  }
}

function formatTime(date) {
  return date.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(message, type = 'info', description = '') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const iconMap = {
    success: 'check-circle-2',
    error: 'x-circle',
    warning: 'alert-circle',
    info: 'info'
  };
  
  toast.innerHTML = `
    <i data-lucide="${iconMap[type]}" class="toast-icon"></i>
    <div class="toast-content">
      <div class="toast-message">${message}</div>
      ${description ? `<div class="toast-description">${description}</div>` : ''}
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">
      <i data-lucide="x"></i>
    </button>
  `;
  
  container.appendChild(toast);
  lucide.createIcons();
  
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ============================================
// MODAL MANAGEMENT
// ============================================

function openModal(title, content, actions) {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.add('active');
  appState.modalOpen = true;
  
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2 class="modal-title">${title}</h2>
        <button class="modal-close" onclick="closeModal()">
          <i data-lucide="x"></i>
        </button>
      </div>
      <div class="modal-body">
        ${content}
      </div>
      ${actions ? `
        <div class="modal-footer">
          ${actions}
        </div>
      ` : ''}
    </div>
  `;
  
  lucide.createIcons();
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('active');
  appState.modalOpen = false;
}

// ============================================
// RENDER FUNCTIONS
// ============================================

function renderAccounts() {
  const grid = document.getElementById('accountsGrid');
  
  grid.innerHTML = accountsData.map(account => {
    const balanceDisplay = appState.balancesHidden ? '••••••' : formatCurrency(account.balance);
    const iconClass = account.type;
    
    return `
      <div class="account-card" data-account-id="${account.id}">
        <div class="account-card-header">
          <div class="account-info">
            <div class="account-icon ${iconClass}">
              <i data-lucide="${account.icon}"></i>
            </div>
            <div class="account-details">
              <h3>${account.name}</h3>
              <span class="account-number">${account.accountNumber}</span>
            </div>
          </div>
          <button class="account-menu-btn">
            <i data-lucide="more-vertical"></i>
          </button>
        </div>
        
        <div class="account-balance-section">
          <div class="balance-label">${account.type === 'credit' ? 'Balance' : 'Available Balance'}</div>
          <div class="balance-amount ${appState.balancesHidden ? 'hidden' : ''}">
            ${balanceDisplay}
          </div>
          ${account.pending > 0 ? `
            <div class="pending-info">
              <i data-lucide="clock"></i>
              <span>Pending: ${formatCurrency(account.pending)}</span>
            </div>
          ` : ''}
          ${account.type === 'credit' ? `
            <div class="pending-info" style="color: var(--success-green);">
              <span>Available: ${formatCurrency(account.availableCredit)}</span>
            </div>
          ` : ''}
        </div>
        
        <div class="account-actions">
          <button class="primary-button" onclick="handleTransfer('${account.id}')">
            <i data-lucide="arrow-left-right"></i>
            <span>Transfer</span>
          </button>
          <button class="secondary-button" onclick="handlePay('${account.id}')">
            <i data-lucide="send"></i>
            <span>Pay</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
  
  lucide.createIcons();
}

function renderSavingsGoals() {
  const grid = document.getElementById('goalsGrid');
  
  grid.innerHTML = savingsGoalsData.map(goal => {
    const percentage = Math.round((goal.saved / goal.target) * 100);
    
    return `
      <div class="goal-card" data-goal-id="${goal.id}">
        <div class="goal-header">
          <div class="goal-icon">
            <i data-lucide="${goal.icon}"></i>
          </div>
        </div>
        <div class="goal-name">${goal.name}</div>
        <div class="goal-target">Target: ${formatCurrency(goal.target)}</div>
        
        <div class="goal-progress-bar">
          <div class="goal-progress-fill" style="width: ${percentage}%"></div>
        </div>
        
        <div class="goal-stats">
          <span class="goal-saved">${formatCurrency(goal.saved)}</span>
          <span class="goal-percentage">${percentage}%</span>
        </div>
      </div>
    `;
  }).join('');
  
  lucide.createIcons();
}

function renderTransactions() {
  const list = document.getElementById('transactionsList');
  
  const groupedTransactions = {};
  transactionsData.forEach(txn => {
    const dateKey = formatDate(txn.date);
    if (!groupedTransactions[dateKey]) {
      groupedTransactions[dateKey] = [];
    }
    groupedTransactions[dateKey].push(txn);
  });
  
  list.innerHTML = Object.entries(groupedTransactions).map(([date, txns]) => `
    <div class="transaction-date-group">
      <div class="transaction-date-label">${date}</div>
      ${txns.map(txn => `
        <div class="transaction-item" data-txn-id="${txn.id}" onclick="handleTransactionClick('${txn.id}')">
          <div class="transaction-icon" style="background: ${txn.iconBg};">
            <i data-lucide="${txn.icon}" style="color: ${txn.iconColor};"></i>
          </div>
          
          <div class="transaction-details">
            <div class="transaction-merchant">${txn.merchant}</div>
            <div class="transaction-meta">
              <span>${txn.category}</span>
              <span>•</span>
              <span>${formatTime(txn.date)}</span>
            </div>
          </div>
          
          <div class="transaction-amount-section">
            <div class="transaction-amount ${txn.amount < 0 ? 'debit' : 'credit'}">
              ${txn.amount < 0 ? '-' : '+'}${formatCurrency(txn.amount)}
            </div>
            <div class="transaction-status ${txn.status}">
              <i data-lucide="${txn.status === 'completed' ? 'check-circle-2' : 'clock'}"></i>
              <span>${txn.status}</span>
            </div>
          </div>
          
          <i data-lucide="chevron-right" class="transaction-chevron"></i>
        </div>
      `).join('')}
    </div>
  `).join('');
  
  lucide.createIcons();
}

function initializeSpendingChart() {
  const ctx = document.getElementById('spendingChart').getContext('2d');
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Groceries', 'Transport', 'Dining', 'Bills'],
      datasets: [{
        data: [345.80, 180.50, 265.00, 450.00],
        backgroundColor: [
          '#3B82F6',
          '#8B5CF6',
          '#F59E0B',
          '#10B981'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `£${context.parsed.toFixed(2)}`;
            }
          }
        }
      },
      cutout: '70%'
    }
  });
}

// ============================================
// EVENT HANDLERS
// ============================================

function handleTransfer(accountId) {
  const account = accountsData.find(acc => acc.id === accountId);
  
  openModal(
    'Transfer Money',
    `
      <form id="transferForm">
        <div class="form-group">
          <label class="form-label">From</label>
          <div class="form-select" style="background: #F3F4F6; cursor: not-allowed; color: #6B7280;">
            ${account.name} - ${formatCurrency(account.balance)}
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">To</label>
          <select class="form-select" id="toAccount" required>
            <option value="">Select account...</option>
            ${accountsData.filter(acc => acc.id !== accountId).map(acc => `
              <option value="${acc.id}">${acc.name}</option>
            `).join('')}
          </select>
        </div>
        
        <div class="form-group">
          <label class="form-label">Amount</label>
          <input 
            type="number" 
            class="form-input" 
            id="amount" 
            placeholder="0.00" 
            step="0.01" 
            min="0.01"
            required
          />
        </div>
        
        <div class="form-group">
          <label class="form-label">Reference (optional)</label>
          <input 
            type="text" 
            class="form-input" 
            id="reference" 
            placeholder="Enter reference"
          />
        </div>
      </form>
    `,
    `
      <button class="secondary-button" onclick="closeModal()">Cancel</button>
      <button class="primary-button" onclick="submitTransfer('${accountId}')">Continue</button>
    `
  );
}

function submitTransfer(fromAccountId) {
  const amount = document.getElementById('amount').value;
  const toAccountId = document.getElementById('toAccount').value;
  const reference = document.getElementById('reference').value;
  
  if (!amount || !toAccountId) {
    showToast('Please fill in all required fields', 'error');
    return;
  }
  
  closeModal();
  showToast(
    'Transfer successful',
    'success',
    `£${parseFloat(amount).toFixed(2)} transferred successfully`
  );
}

function handlePay(accountId) {
  const account = accountsData.find(acc => acc.id === accountId);
  
  openModal(
    'Make a Payment',
    `
      <form id="paymentForm">
        <div class="form-group">
          <label class="form-label">From</label>
          <div class="form-select" style="background: #F3F4F6; cursor: not-allowed; color: #6B7280;">
            ${account.name}
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Pay to</label>
          <select class="form-select" id="payee" required>
            <option value="">Select payee...</option>
            <option value="sarah">Sarah Thompson</option>
            <option value="michael">Michael Chen</option>
            <option value="emma">Emma Wilson</option>
            <option value="david">David Roberts</option>
            <option value="oliver">Oliver Martinez</option>
          </select>
        </div>
        
        <div class="form-group">
          <label class="form-label">Amount</label>
          <input 
            type="number" 
            class="form-input" 
            id="payAmount" 
            placeholder="0.00" 
            step="0.01" 
            min="0.01"
            required
          />
        </div>
        
        <div class="form-group">
          <label class="form-label">Reference</label>
          <input 
            type="text" 
            class="form-input" 
            id="payReference" 
            placeholder="Enter reference"
            required
          />
        </div>
      </form>
    `,
    `
      <button class="secondary-button" onclick="closeModal()">Cancel</button>
      <button class="primary-button" onclick="submitPayment()">Pay Now</button>
    `
  );
}

function submitPayment() {
  const amount = document.getElementById('payAmount').value;
  const payee = document.getElementById('payee').value;
  
  if (!amount || !payee) {
    showToast('Please fill in all required fields', 'error');
    return;
  }
  
  closeModal();
  showToast(
    'Payment successful',
    'success',
    `£${parseFloat(amount).toFixed(2)} paid successfully`
  );
}

function handleTransactionClick(txnId) {
  const txn = transactionsData.find(t => t.id === txnId);
  
  openModal(
    'Transaction Details',
    `
      <div style="text-align: center; padding: 20px 0;">
        <div class="transaction-icon" style="background: ${txn.iconBg}; width: 64px; height: 64px; margin: 0 auto 20px;">
          <i data-lucide="${txn.icon}" style="color: ${txn.iconColor}; width: 32px; height: 32px;"></i>
        </div>
        <h3 style="font-size: 20px; margin-bottom: 8px;">${txn.merchant}</h3>
        <p style="color: var(--gray-500); margin-bottom: 24px;">${txn.category} • ${formatDate(txn.date)} at ${formatTime(txn.date)}</p>
        <div style="font-size: 36px; font-weight: 700; color: ${txn.amount < 0 ? 'var(--error-red)' : 'var(--success-green)'};">
          ${txn.amount < 0 ? '-' : '+'}${formatCurrency(txn.amount)}
        </div>
      </div>
      
      <div style="background: var(--gray-50); padding: 16px; border-radius: 12px; margin-top: 24px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
          <span style="color: var(--gray-600);">Transaction ID</span>
          <span style="font-weight: 600;">${txn.id}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
          <span style="color: var(--gray-600);">Status</span>
          <span style="font-weight: 600; color: var(--success-green); text-transform: capitalize;">${txn.status}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--gray-600);">Category</span>
          <span style="font-weight: 600; text-transform: capitalize;">${txn.category}</span>
        </div>
      </div>
    `,
    `
      <button class="secondary-button" onclick="closeModal()">Close</button>
      <button class="secondary-button" style="color: var(--hsbc-red);">Report Issue</button>
    `
  );
  
  lucide.createIcons();
}

function toggleBalances() {
  appState.balancesHidden = !appState.balancesHidden;
  const btn = document.getElementById('toggleBalancesBtn');
  const icon = btn.querySelector('i');
  const text = btn.querySelector('span');
  
  if (appState.balancesHidden) {
    icon.setAttribute('data-lucide', 'eye-off');
    text.textContent = 'Show balances';
  } else {
    icon.setAttribute('data-lucide', 'eye');
    text.textContent = 'Hide balances';
  }
  
  lucide.createIcons();
  renderAccounts();
}

// ============================================
// QUICK ACTIONS
// ============================================

document.getElementById('transferBtn')?.addEventListener('click', () => {
  if (accountsData.length > 0) {
    handleTransfer(accountsData[0].id);
  }
});

document.getElementById('payBtn')?.addEventListener('click', () => {
  if (accountsData.length > 0) {
    handlePay(accountsData[0].id);
  }
});

document.getElementById('billsBtn')?.addEventListener('click', () => {
  window.location.href = 'bills.html';
});

document.getElementById('addPayeeBtn')?.addEventListener('click', () => {
  openModal(
    'Add New Payee',
    `
      <form>
        <div class="form-group">
          <label class="form-label">Payee Name</label>
          <input type="text" class="form-input" placeholder="Enter payee name" required />
        </div>
        
        <div class="form-group">
          <label class="form-label">Account Number</label>
          <input type="text" class="form-input" placeholder="12345678" maxlength="8" required />
        </div>
        
        <div class="form-group">
          <label class="form-label">Sort Code</label>
          <input type="text" class="form-input" placeholder="12-34-56" maxlength="8" required />
        </div>
        
        <div class="form-group">
          <label class="form-label">Reference (optional)</label>
          <input type="text" class="form-input" placeholder="Enter reference" />
        </div>
      </form>
    `,
    `
      <button class="secondary-button" onclick="closeModal()">Cancel</button>
      <button class="primary-button" onclick="closeModal(); showToast('Payee added successfully', 'success');">Add Payee</button>
    `
  );
});

document.getElementById('statementsBtn')?.addEventListener('click', () => {
  window.location.href = 'statements.html';
});

document.getElementById('cardsBtn')?.addEventListener('click', () => {
  window.location.href = 'cards.html';
});

document.getElementById('toggleBalancesBtn')?.addEventListener('click', toggleBalances);

document.getElementById('notificationBtn')?.addEventListener('click', () => {
  window.location.href = 'notifications.html';
});

document.getElementById('chatBtn')?.addEventListener('click', () => {
  showToast('Chat Support', 'info', 'Connecting to support agent...');
});

document.getElementById('userMenuBtn')?.addEventListener('click', (e) => {
  e.stopPropagation();
  const existingMenu = document.getElementById('userDropdownMenu');
  if (existingMenu) {
    existingMenu.remove();
    return;
  }
  
  const dropdown = document.createElement('div');
  dropdown.id = 'userDropdownMenu';
  
  // Position dropdown relative to the user menu button
  const isMobile = window.innerWidth <= 768;
  dropdown.style.cssText = `
    position: fixed;
    top: 60px;
    right: ${isMobile ? '10px' : '20px'};
    background: white;
    border: 1px solid #E5E7EB;
    border-radius: 12px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    min-width: 200px;
    z-index: 1000;
    overflow: hidden;
  `;
  dropdown.innerHTML = `
    <div style="padding: 16px; border-bottom: 1px solid #E5E7EB;">
      <div style="font-weight: 600;">Julie Bailey</div>
      <div style="font-size: 13px; color: #6B7280;">Premier Banking</div>
    </div>
    <button onclick="window.location.href='login.html'" style="
      width: 100%;
      padding: 12px 16px;
      background: none;
      border: none;
      text-align: left;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      transition: background 0.2s;
    " onmouseover="this.style.background='#F9FAFB'" onmouseout="this.style.background='none'">
      <i data-lucide="log-out" style="width: 18px; height: 18px;"></i>
      Log out
    </button>
  `;
  document.body.appendChild(dropdown);
  lucide.createIcons();
  
  setTimeout(() => {
    document.addEventListener('click', function closeMenu() {
      dropdown.remove();
      document.removeEventListener('click', closeMenu);
    });
  }, 0);
});

document.getElementById('addGoalBtn')?.addEventListener('click', () => {
  openModal(
    'Create Savings Goal',
    `
      <form>
        <div class="form-group">
          <label class="form-label">Goal Name</label>
          <input type="text" class="form-input" placeholder="e.g., Holiday Fund" required />
        </div>
        
        <div class="form-group">
          <label class="form-label">Target Amount</label>
          <input type="number" class="form-input" placeholder="0.00" step="0.01" min="0.01" required />
        </div>
        
        <div class="form-group">
          <label class="form-label">Icon</label>
          <select class="form-select">
            <option value="plane">Holiday</option>
            <option value="home">House</option>
            <option value="car">Car</option>
            <option value="graduation-cap">Education</option>
            <option value="heart">Wedding</option>
          </select>
        </div>
      </form>
    `,
    `
      <button class="secondary-button" onclick="closeModal()">Cancel</button>
      <button class="primary-button" onclick="closeModal(); showToast('Savings goal created', 'success');">Create Goal</button>
    `
  );
});

// ============================================
// INITIALIZATION
// ============================================

function updateGreeting() {
  const hour = new Date().getHours();
  let greeting;
  
  if (hour < 12) {
    greeting = 'Good morning';
  } else if (hour < 18) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }
  
  const greetingElement = document.getElementById('greetingText');
  if (greetingElement) {
    greetingElement.textContent = `${greeting}, Julie`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateGreeting();
  renderAccounts();
  renderSavingsGoals();
  renderTransactions();
  initializeSpendingChart();
  lucide.createIcons();
  
  console.log('✅ HSBC Dashboard initialized successfully');
});
