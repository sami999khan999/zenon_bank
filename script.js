"use strict";

// ================================================================================================== //
// Data
// ================================================================================================== //

const accounts = [
  {
    owner: "Shohanur Rahman",
    movements: [2500, 500, -750, 1200, 3200, -1500, 500, 1200, -1750, 1800],
    interestRate: 1.5, // %
    password: 1234,
    // movementsDates: [
    //   "2021-11-18T21:31:17.178Z",
    //   "2021-12-23T07:42:02.383Z",
    //   "2022-01-28T09:15:04.904Z",
    //   "2022-04-01T10:17:24.185Z",
    //   "2022-07-08T14:11:59.604Z",
    //   "2022-09-18T17:01:17.194Z",
    //   "2022-09-21T23:36:17.929Z",
    //   "2022-09-25T12:51:31.398Z",
    //   "2022-09-28T06:41:26.190Z",
    //   "2022-09-29T08:11:36.678Z",
    // ],
    // currency: "USD",
    // locale: "en-US",
  },
  {
    owner: "Sunerah Binte Ayesha",
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -300, 1500, -1850],
    interestRate: 1.3, // %
    password: 5678,
    // movementsDates: [
    //   "2021-12-11T21:31:17.671Z",
    //   "2021-12-27T07:42:02.184Z",
    //   "2022-01-05T09:15:04.805Z",
    //   "2022-02-14T10:17:24.687Z",
    //   "2022-03-12T14:11:59.203Z",
    //   "2022-05-19T17:01:17.392Z",
    //   "2022-08-22T23:36:17.522Z",
    //   "2022-09-25T12:51:31.491Z",
    //   "2022-09-28T06:41:26.394Z",
    //   "2022-09-29T08:11:36.276Z",
    // ],
    // currency: "EUR",
    // locale: "en-GB",
  },
];

// ================================================================================================== //
// Elements
// ================================================================================================== //

// label/textContant
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance-value");
const labelSumIn = document.querySelector(".summary-value-in");
const labelSumOut = document.querySelector(".summary-value-out");
const labelSumInterest = document.querySelector(".summary-value-interest");
const labelTimer = document.querySelector(".timer");
// -------------------------------------------------------------------------------------------------- //
// cotainer
const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");
// -------------------------------------------------------------------------------------------------- //
// btns
const btnLogin = document.querySelector(".login-btn");
const btnTransfer = document.querySelector(".form-btn-transfer");
const btnLoan = document.querySelector(".form-btn-loan");
const btnClose = document.querySelector(".form-btn-close");
const btnSort = document.querySelector(".btn-sort");
// -------------------------------------------------------------------------------------------------- //
// input
const inputLoginUsername = document.querySelector(".login-input-username");
const inputLoginPassword = document.querySelector(".login-input-password");
const inputTransferTo = document.querySelector(".form-input-to");
const inputTransferAmount = document.querySelector(".form-input-amount");
const inputLoanAmount = document.querySelector(".form-input-loan-amount");
const inputCloseUsername = document.querySelector(".form-input-username");
const inputClosePassword = document.querySelector(".form-input-password");

let currentAccount;
// ================================================================================================== //
// update UI
// ================================================================================================== //
function updateUI(account) {
  displayMovements(currentAccount);
  displaySummary(currentAccount);
  displayBalance(currentAccount);
}
// ================================================================================================== //
// movements
// ================================================================================================== //

function displayMovements(account, sort = false) {
  containerMovements.innerHTML = "";

  const moves = sort
    ? account.movements.slice(0).sort((a, b) => a - b)
    : account.movements;

  moves.forEach((move, i) => {
    const type = move > 0 ? "deposit" : "withdrawal";

    const html = `
    <div class="movements-row">
      <div class="movements-type movements-type-${type}">${i + 1} ${type}</div>
      <div class="movements-date">5 days ago</div>
      <div class="movements-value">${move}$</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}

// ================================================================================================== //
// summary
// ================================================================================================== //

function displaySummary(account) {
  // income
  const incomes = account.movements
    .filter((move) => move > 0)
    .reduce((acc, deposit) => acc + deposit, 0);

  labelSumIn.textContent = `${incomes}$`;

  // outcome
  const outcomes = account.movements
    .filter((move) => move < 0)
    .reduce((acc, withdrawal) => acc + withdrawal, 0);

  labelSumOut.textContent = `${Math.abs(outcomes)}$`;

  // interest
  const interest = account.movements
    .filter((move) => move > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((interest) => interest >= 1)
    .reduce((acc, interest) => acc + interest, 0);

  labelSumInterest.textContent = `${interest}$`;
}

// ================================================================================================== //
// balance
// ================================================================================================== //

function displayBalance(account) {
  account.balance = account.movements.reduce((acc, move) => acc + move, 0);

  labelBalance.textContent = `${account.balance}$`;
}

// ================================================================================================== //
// username
// ================================================================================================== //

function createUsername(accounts) {
  accounts.forEach((account) => {
    account.username = account.owner
      .toLowerCase()
      .split(" ")
      .map((word) => word.at(0))
      .join("");
  });
}
createUsername(accounts);

// ================================================================================================== //
// loging
// ================================================================================================== //

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    (account) => account.username === inputLoginUsername.value
  );

  if (currentAccount.password === Number(inputLoginPassword.value)) {
    // display UI and wellcome
    labelWelcome.textContent = `Wellcome back, ${currentAccount.owner
      .split(" ")
      .at(0)}`;
    containerApp.style.opacity = 1;

    // update UI
    updateUI(currentAccount);
  } else {
    // hide UI and warning
    labelWelcome.textContent = "Login Failed!";
    containerApp.style.opacity = 0;
    labelWelcome.style.color = "red";
  }

  // clear fields
  inputLoginUsername.value = inputLoginPassword.value = "";
  inputLoginPassword.blur();
});

// ================================================================================================== //
// Transfer
// ================================================================================================== //

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const receiverAccount = accounts.find(
    (account) => account.username === inputTransferTo.value
  );

  const amount = Number(inputTransferAmount.value);

  // clear fields
  inputTransferTo.value = inputTransferAmount.value = "";
  inputLoanAmount.blur();

  if (
    amount > 0 &&
    amount <= currentAccount.balance &&
    currentAccount.username !== receiverAccount.username &&
    receiverAccount
  ) {
    // transfer money
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);
    // update ui
    updateUI(currentAccount);
    // show message
    labelWelcome.textContent = "Transaction scuuessful";
  } else {
    labelWelcome.textContent = "Transaction failed";
  }
});

// ================================================================================================== //
// loan
// ================================================================================================== //

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((move) => move >= amount * 0.1)
  ) {
    // add positve amount
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
    // massage
    labelWelcome.textContent = "loan successful";
  } else {
    labelWelcome.textContent = "Loan not successful";
  }

  // clear
  inputLoanAmount.value = "";
  inputLoanAmount.blur();
});

// ================================================================================================== //
// close access
// ================================================================================================== //

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.password === Number(inputClosePassword.value)
  ) {
    const index = accounts.findIndex(
      (account) => account.username === currentAccount.username
    );

    // delete
    accounts.splice(index, 1);

    // hide ui
    containerApp.style.opacity = 0;

    // message
    labelWelcome.textContent = "Account deleted";
  } else {
    labelWelcome.textContent = "Delete can not be done!";
  }

  // clear fileds
  inputCloseUsername.value = inputClosePassword.value = "";
  inputClosePassword.blure();
});

// ================================================================================================== //
//sort
// ================================================================================================== //

let sortedMove = false;

btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sortedMove);
  sortedMove = !sortedMove;
});
