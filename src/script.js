 
const userDatabase = {
    users: JSON.parse(localStorage.getItem('users')) || {},
    userId: Object.keys(JSON.parse(localStorage.getItem('users')) || {}).length || 0,
    addUser: function(firstName, surName, userName, passWord) {
        this.userId += 1;
        this.users[userName] = {
            id: this.userId,
            firstName: firstName,
            surName: surName,
            userName: userName,
            passWord: passWord,
            initialBalance: 1500, 
            fullName: function() {
                return `${this.firstName} ${this.surName}`;
            }
        };
        localStorage.setItem('users', JSON.stringify(this.users));
    },
    getUser: function(userName) {
        return this.users[userName];
    }
};

 
document.getElementById('signupForm')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const surname = document.getElementById('surname').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
 
    if (userDatabase.getUser(username)) {
        errorMessage.textContent = 'Username already exists. Please choose a different one.';
        return;
    }

    
    userDatabase.addUser(firstName, surname, username, password);

    
    window.location.href = 'login.html';
});

 
document.getElementById('loginForm')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    const loginStatus = document.getElementById('login-status');

    console.log('Login attempt with:', username, password); 
 
    const user = userDatabase.getUser(username);
 
    if (user && user.passWord === password) {
        console.log('Login successful!');  
 
        if (loginStatus) {
            loginStatus.textContent = 'Login successful! Redirecting...';
        }

        setTimeout(() => {
            window.location.href = 'dash.html?username=' + encodeURIComponent(username);  
        }, 2000);  
    } else {
        console.log('Login failed! Invalid credentials.');  

        
        errorMessage.textContent = 'Invalid username or password. Please try again.';
    }
});

 
function showPopup(message) {
    const popup = document.getElementById('popup');
    const popupMessage = popup.querySelector('h3');
    popupMessage.textContent = message;
    popup.style.display = 'flex';   
}

function hidePopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'none';  
}

 
document.getElementById('close-popup').addEventListener('click', hidePopup);

 
if (document.getElementById('username-display')) {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');   

    const storedUsers = JSON.parse(localStorage.getItem('users'));  
    const user = storedUsers ? storedUsers[username] : null;

    if (user) {
         
        document.getElementById('username-display').textContent = `${user.firstName} ${user.surName}`;
    } else {
       
        window.location.href = 'login.html';
    }

    function BankAcc(user) {
        this.customer = user;
        this.transactionHistory = [];
    }

    BankAcc.prototype.recordTransaction = function(type, amount) {
        const date = new Date().toLocaleString();
        this.transactionHistory.push({ type, amount, date });
        this.updateTransactionHistory();
    };

    BankAcc.prototype.updateTransactionHistory = function() {
        const historyList = document.getElementById("transaction-history");
        historyList.innerHTML = "";   

        this.transactionHistory.forEach((transaction) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${transaction.date} - ${transaction.type}: ₦${transaction.amount}`;
            historyList.appendChild(listItem);
        });
    };

    // function updateDisplay(balance) {
    //     document.getElementById("balanceAmount").textContent = balance;
    // }
 
    const bankAcc = new BankAcc(user);

   
    updateDisplay(user.initialBalance);

    document.getElementById("dForm")?.addEventListener("submit", function(event) {
        event.preventDefault();
        const depositAmount = parseFloat(document.getElementById("dInput").value);
        if (depositAmount > 0) {
            const newBalance = bankAcc.customer.initialBalance += depositAmount;
            updateDisplay(newBalance);
            bankAcc.recordTransaction("Deposit", depositAmount);
 
            userDatabase.users[username].initialBalance = newBalance;
            localStorage.setItem('users', JSON.stringify(userDatabase.users));
        }
    });

    document.getElementById("wForm")?.addEventListener("submit", function(event) {
        event.preventDefault();
        const withdrawAmount = parseFloat(document.getElementById("wInput").value);
        if (withdrawAmount > 0) {
            const newBalance = bankAcc.customer.initialBalance -= withdrawAmount;
            if (newBalance >= 0) {  
                updateDisplay(newBalance);
                bankAcc.recordTransaction("Withdraw", withdrawAmount);

               
                userDatabase.users[username].initialBalance = newBalance;
                localStorage.setItem('users', JSON.stringify(userDatabase.users));
            } else {
                bankAcc.customer.initialBalance += withdrawAmount;  
                updateDisplay(bankAcc.customer.initialBalance);

                
                showPopup('Insufficient funds');
            }
        }
    });
}
