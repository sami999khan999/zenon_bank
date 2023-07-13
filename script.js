"use strict";

//=================================================================================================================//
// data
//=================================================================================================================//

const accounts = [
  {
    owner: "Shohanur Rahman",
    movements: [2500, 500, -750, 1200, 3200, -1500, 500, 1200, -1750, 1800],
    interestRate: 1.5, // %
    password: 1234,
    movementsDates: [
      "2021-11-18T21:31:17.178Z",
      "2021-12-23T07:42:02.383Z",
      "2022-01-28T09:15:04.904Z",
      "2022-04-01T10:17:24.185Z",
      "2022-07-08T14:11:59.604Z",
      "2022-09-18T17:01:17.194Z",
      "2022-09-21T23:36:17.929Z",
      "2022-09-25T12:51:31.398Z",
      "2022-09-28T06:41:26.190Z",
      "2023-07-13T08:11:36.678Z",
    ],
    currency: "USD",
    locale: "en-US",
  },
  {
    owner: "Sunerah Binte Ayesha",
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -300, 1500, -1850],
    interestRate: 1.3, // %
    password: 5678,
    movementsDates: [
      "2021-12-11T21:31:17.671Z",
      "2021-12-27T07:42:02.184Z",
      "2022-01-05T09:15:04.805Z",
      "2022-02-14T10:17:24.687Z",
      "2022-03-12T14:11:59.203Z",
      "2022-05-19T17:01:17.392Z",
      "2022-08-22T23:36:17.522Z",
      "2022-09-25T12:51:31.491Z",
      "2022-09-28T06:41:26.394Z",
      "2023-07-29T08:11:36.276Z",
    ],
    currency: "EUR",
    locale: "en-GB",
  },
];

//=================================================================================================================//
// Elements
//=================================================================================================================//

// label/textContant
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance-value");
const labelSumIn = document.querySelector(".summary-value-in");
const labelSumOut = document.querySelector(".summary-value-out");
const labelSumInterest = document.querySelector(".summary-value-interest");
const labelTimer = document.querySelector(".timer");

//-----------------------------------------------------------------------------------------------------------------//

// cotainer
const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

//-----------------------------------------------------------------------------------------------------------------//

// btns
const btnLogin = document.querySelector(".login-btn");
const btnTransfer = document.querySelector(".form-btn-transfer");
const btnLoan = document.querySelector(".form-btn-loan");
const btnClose = document.querySelector(".form-btn-close");
const btnSort = document.querySelector(".btn-sort");

//-----------------------------------------------------------------------------------------------------------------//

// input
const inputLoginUsername = document.querySelector(".login-input-username");
const inputLoginPassword = document.querySelector(".login-input-password");
const inputTransferTo = document.querySelector(".form-input-to");
const inputTransferAmount = document.querySelector(".form-input-amount");
const inputLoanAmount = document.querySelector(".form-input-loan-amount");
const inputCloseUsername = document.querySelector(".form-input-username");
const inputClosePassword = document.querySelector(".form-input-password");

//=================================================================================================================//
//  updateUI
//=================================================================================================================//

function updateUI() {
  displayMovements(currentAccount);
  displaySummery(currentAccount);
  displayBalance(currentAccount);
}

let currentAccount;

//=================================================================================================================//
// formating currency
//=================================================================================================================//

function formatCurrency(value, local, currency) {
  return new Intl.NumberFormat(local, {
    style: "currency",
    currency: currency,
  }).format(value);
}

//=================================================================================================================//
// firmating movements date
//=================================================================================================================//

function formateMoveDate(date, local) {
  const calculateDays = (day2, day1) =>
    Math.round(Math.abs(day1 - day2) / (24 * 60 * 60 * 100));

  const daysPased = calculateDays(new Date(), date);

  if (daysPased === 0) return "Today";
  if (daysPased === 1) return "Yesterday";
  if (daysPased <= 7) return `${daysPased} days ago`;

  return new Intl.DateTimeFormat(local).format(date);
}

//=================================================================================================================//
// Movements
//=================================================================================================================//

function displayMovements(account, sort = false) {
  containerMovements.innerHTML = "";

  const moves = sort
    ? account.movements.slice(0).sort((a, b) => a - b)
    : account.movements;

  moves.forEach((move, i, arr) => {
    const type = move > 0 ? "deposit" : "withdrawal";

    // formate movement date
    const date = new Date(account.movementsDates[i]);
    const formateDate = formateMoveDate(date, account.local);

    const html = `
        <div class="movements-row">
          <div class="movements-type movements-type-${type}">${
      i + 1
    } ${type}</div>
          <div class="movements-date">${formateDate}</div>
          <div class="movements-value">${formatCurrency(
            move,
            account.locale,
            account.currency
          )}</div>
        </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}
//=================================================================================================================//
//  summery
//=================================================================================================================//

function displaySummery(account) {
  // income
  const income = account.movements
    .filter((move) => move > 0)
    .reduce((acc, deposit) => acc + deposit);

  labelSumIn.textContent = formatCurrency(
    income,
    account.local,
    account.currency
  );

  //---------------------------------------------------------------------------------------------------------------//

  // outcome
  const outcome = account.movements
    .filter((move) => move < 0)
    .reduce((acc, withdrawl) => acc + withdrawl);

  labelSumOut.textContent = formatCurrency(
    Math.abs(outcome),
    account.local,
    account.currency
  );

  //---------------------------------------------------------------------------------------------------------------//

  // interest
  const interest = account.movements
    .filter((move) => move > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((interest) => interest > 1)
    .reduce((acc, interest) => acc + interest);

  labelSumInterest.textContent = formatCurrency(
    interest,
    account.local,
    account.currency
  );
}

//=================================================================================================================//
// balance
//=================================================================================================================//

function displayBalance(account) {
  account.balance = account.movements.reduce((acc, move) => acc + move, 0);
  labelBalance.textContent = formatCurrency(
    account.balance,
    account.local,
    account.currency
  );
}

//=================================================================================================================//
// username
//=================================================================================================================//

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

//=================================================================================================================//
// login
//=================================================================================================================//

btnLogin.addEventListener("click", function (event) {
  event.preventDefault();
  // // In JavaScript, the preventDefault() method is used to prevent the default action of an event from occurring. It is typically used in event handlers to stop the default behavior associated with an event, such as submitting a form, following a link, or refreshing a page. //

  currentAccount = accounts.find(
    (account) => account.username === inputLoginUsername.value
  );

  // (if) the username is wrong, (else if) the username and password is right and (else) the password is wrong.
  if (!currentAccount) {
    setTimeout(() => {
      labelWelcome.textContent = "Account Does Not Exists";
      labelWelcome.style.color = "red";

      // uiUpdate
      containerApp.style.opacity = 0;
    }, 3000);
  } else if (currentAccount.password === Number(inputLoginPassword.value)) {
    setTimeout(() => {
      // wellcome massage
      labelWelcome.textContent = `Wellcome Back, ${currentAccount.owner
        .split(" ")
        .at(0)}`;
      labelWelcome.style.color = "green";

      // display date and time
      const now = new Date();

      labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      }).format(now);

      // uiUpdate
      containerApp.style.opacity = 1;
      updateUI();
    }, 3000);
  } else {
    setTimeout(() => {
      // wellcome massage
      labelWelcome.textContent = "Login failed";
      labelWelcome.style.color = "red";
      containerApp.style.opacity = 0;
    }, 3000);
  }
  // clear fields
  inputLoginUsername.value = inputLoginPassword.value = "";
  inputLoginPassword.blur();
});

//=================================================================================================================//
// transfer
//=================================================================================================================//

btnTransfer.addEventListener("click", function (event) {
  event.preventDefault();

  const receinverAccount = accounts.find(
    (account) => account.username === inputTransferTo.value
  );

  const amount = Number(inputTransferAmount.value);

  // (if) the username is wroug, (else if) the username and amount is right, (else) the amount is wroung
  if (!receinverAccount) {
    setTimeout(() => {
      // massage
      labelWelcome.textContent = "Account Does Not Exists";
      labelWelcome.style.color = "red";
    }, 3000);
  } else if (
    amount > 0 &&
    amount <= currentAccount.balance &&
    currentAccount.username !== receinverAccount.username
  ) {
    setTimeout(() => {
      // transper money
      currentAccount.movements.push(-amount);
      receinverAccount.movements.push(amount);

      // date and time
      currentAccount.movementsDates.push(new Date().toISOString());
      receinverAccount.movementsDates.push(new Date().toISOString());

      // uiUpdate
      updateUI();

      // massage
      labelWelcome.textContent = "Transfer Successful";
      labelWelcome.style.color = "green";
    }, 3000);
  } else {
    setTimeout(() => {
      // massage
      labelWelcome.textContent = "Transfer Failed";
      labelWelcome.style.color = "red";
    }, 3000);
  }

  // clear field
  inputTransferAmount.value = inputTransferTo.value = "";
  inputTransferAmount.blur();
});

//=================================================================================================================//
// lone
//=================================================================================================================//

btnLoan.addEventListener("click", function (event) {
  event.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((move) => move > amount * 0.1)
  ) {
    setTimeout(() => {
      // adding lone amount
      currentAccount.movements.push(amount);

      // date and time
      currentAccount.movementsDates.push(new Date().toISOString());

      // UI Update
      updateUI();

      // massage
      labelWelcome.textContent = "Lone Successful";
      labelWelcome.style.color = "green";
    }, 3000);
  } else {
    setTimeout(() => {
      labelWelcome.textContent = "Lone Not Successful";
      labelWelcome.style.color = "red";
    }, 3000);
  }

  // clear firld
  inputLoanAmount.value = "";
  inputLoanAmount.blur();
});

//=================================================================================================================//
// deleat account
//=================================================================================================================//

btnClose.addEventListener("click", function (event) {
  event.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.password === Number(inputClosePassword.value)
  ) {
    setTimeout(() => {
      const deleatIndex = accounts.findIndex(
        (account) => account.username === currentAccount.username
      );
      // deleat
      accounts.splice(deleatIndex, 1);

      // Update UI
      containerApp.style.opacity = 0;

      // massage
      labelWelcome.textContent = "Accout Successfuly Deleated";
      labelWelcome.style.color = "green";
    }, 3000);
  } else {
    setTimeout(() => {
      labelWelcome.textContent = "Accout Can Not Be Deleated";
      labelWelcome.style.color = "red";
    }, 3000);
  }
  // clear filds
  inputClosePassword.value = inputCloseUsername.value = "";
  inputClosePassword.blur();
});

//=================================================================================================================//
// sort
//=================================================================================================================//

let sortedMove = false;

btnSort.addEventListener("click", function (event) {
  event.preventDefault();

  displayMovements(currentAccount, !sortedMove);
  sortedMove = !sortedMove;
});

//=================================================================================================================//
// timer logOut
//=================================================================================================================//

function logOut() {}
labelTimer.textContent = "";

let time = 120;
const clock = () => {
  const min = String(Math.trunc(time / 60)).padStart(2, 0);
  console.log(min);
};
