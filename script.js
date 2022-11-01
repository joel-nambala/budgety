'use strict';

// Select DOM Elements

const headerDate = document.querySelector('.header-title--date');
const totalBudget = document.querySelector('.totals');
const incomeTotal = document.querySelector('.income-total-value');
const expenseTotal = document.querySelector('.expense-total-value');

const formControl = document.querySelector('.form-control');
const budgetType = document.querySelector('.budget-type');
const budgetDescription = document.querySelector('.budget-description');
const budgetValue = document.querySelector('.budget-value');
const budgetBtn = document.querySelector('.budget-btn');

const resultsContainer = document.querySelector('.results');

const incomeList = document.querySelector('.income-list');
const expenseList = document.querySelector('.expense-list');

const overlay = document.querySelector('.overlay');
const errorModal = document.querySelector('.error');
const errorText = document.querySelector('.error-text');
const closeErrorModal = document.querySelector('.error-icon');

class Budget {
  constructor() {}

  _init() {
    console.log('Application has started!');
  }
}

class Income extends Budget {
  type = 'inc';

  constructor(id, description, value) {
    super();
    this.id = id;
    this.description = description;
    this.value = value;

    // this._init();
  }
}

class Expense extends Budget {
  type = 'exp';

  constructor(id, description, value) {
    super();
    this.id = id;
    this.description = description;
    this.value = value;

    // this._init();
  }
}

// const income = new Income('project', 5500);
// const expense = new Expense('rent', 1200);
// console.log(income, expense);

// Classes
class App {
  #budget = [];

  constructor() {
    // Sets the time according to the locale
    this.#setTime();

    // Add an event hanlder to the form
    budgetBtn.addEventListener('click', this.#newBudget.bind(this));
    budgetBtn.addEventListener('click', () => {
      this.#calculateBudget(this.#budget);
    });
    overlay.addEventListener('click', this.#removeErrorModal.bind(this));
    closeErrorModal.addEventListener(
      'click',
      this.#removeErrorModal.bind(this)
    );

    resultsContainer.addEventListener('click', this.#deleteBudget.bind(this));
  }

  #setTime() {
    // 1. Create a date object
    const date = new Date();

    // 2. Format the dat with the internationalization API
    const formatDate = new Intl.DateTimeFormat(navigator.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);

    // 3. Display the formatted date to the UI
    headerDate.textContent = formatDate;
  }

  #newBudget(e) {
    e.preventDefault();
    let incExp;

    const id = Number(`${new Date().getTime()}`.slice(-6));
    const type = budgetType.value;
    const des = budgetDescription.value;
    const value = +budgetValue.value;

    if (value <= 0) {
      this.#displayErrorModal('All inputs should be positive numbers!');
      return;
    }

    if (type === 'inc') {
      incExp = new Income(id, des, value);
    }

    if (type === 'exp') {
      incExp = new Expense(id, des, value);
    }

    this.#budget.push(incExp);
    console.log(this.#budget);
    this.#generateMarkup(this.#budget);

    budgetValue.value = '';
    budgetDescription.value = '';
    budgetDescription.focus();
  }

  #calculateBudget(budget) {
    const incomes = budget.filter(inc => inc.type === 'inc');
    const expenses = budget.filter(exp => exp.type === 'exp');

    const totalIncomes = incomes.reduce((acc, cur) => acc + cur.value, 0);
    const totalExpenses = expenses.reduce((acc, cur) => acc + cur.value, 0);

    const totals = totalIncomes - totalExpenses;

    if (totals <= 0) {
      this.#displayErrorModal(
        `You have overspent by ${Math.abs(totalIncomes - totalExpenses)}`
      );

      return;
    }

    incomeTotal.textContent = totalIncomes;
    expenseTotal.textContent = totalExpenses;
    totalBudget.textContent = totals;
  }

  #generateMarkup(budget) {
    this.#emptyContainer();

    budget.forEach(el => {
      if (el.type === 'inc') {
        const html = `
          <li class="income-item" data-id="${el.id}">
            <p class="income-tag">${el.description}</p>
            <p class="income-value">${el.value}</p>
            <button class="btn income-btn">
              <i class="fas fa-times"></i>
            </button>
          </li>
        `;

        incomeList.insertAdjacentHTML('beforeend', html);
      }

      if (el.type === 'exp') {
        const html = `
          <li class="income-item" data-id="${el.id}">
            <p class="income-tag">${el.description}</p>
            <p class="income-value">${el.value}</p>
            <button class="btn income-btn">
              <i class="fas fa-times"></i>
            </button>
          </li>
        `;

        expenseList.insertAdjacentHTML('beforeend', html);
      }
    });
  }

  #displayErrorModal(err) {
    overlay.classList.remove('hide');
    errorModal.classList.remove('hide');
    errorText.textContent = err;
  }

  #removeErrorModal() {
    overlay.classList.add('hide');
    errorModal.classList.add('hide');

    this.#emptyContainer();
  }

  #deleteBudget(e) {
    // const list = e.target.closest('.container');
    // if (null) return;
    // const listItem = list.querySelector('.list-container');
    // console.log(listItem);
  }

  #emptyContainer() {
    incomeList.innerHTML = '';
    expenseList.innerHTML = '';
  }
}

const app = new App();
