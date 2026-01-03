const tableBody = document.querySelector('tbody');

const now = new Date();
const year = now.getFullYear();
const month = now.getMonth(); // January is 0
const monthShort = new Date(year, month, 1)
    .toLocaleDateString('en-EN', { month: 'short' })
    .toLowerCase();
const weekendList = ['sat', 'sun'];
const selectMonth = document.getElementById('selectMonth');
let bankHolidays = [];

function isWeekend(date) {
    const dayNameShort = date
        .toLocaleDateString('en-US', { weekday: 'short' })
        .toLowerCase();
    return weekendList.includes(dayNameShort);
}

function isSat(date) {
    const dayNameShort = date
        .toLocaleDateString('en-US', { weekday: 'short' })
        .toLowerCase();
    return dayNameShort === 'sat';
}

function isSun(date) {
    const dayNameShort = date
        .toLocaleDateString('en-US', { weekday: 'short' })
        .toLowerCase();
    return dayNameShort === 'sun';
}

function isBankHoliday(date) {
    const dateString = date.toLocaleDateString('en-CA');
    console.log('Checking bank holiday for date:', dateString);
    return bankHolidays.find((holiday) => holiday.date === dateString);
}

let listMonth = [];
let optionMonth = [];
for (let i = 0; i < 12; i++) {
    const dateInYear = new Date(year, i, 1);
    const month = dateInYear.toLocaleDateString('th-TH', { month: 'long' });
    const monthValue = dateInYear
        .toLocaleDateString('en-EN', { month: 'short' })
        .toLowerCase();
    optionMonth += `<option value="${monthValue}" data-index="${i}">${month}</option>`;
}

selectMonth.innerHTML = optionMonth;
selectMonth.querySelector(
    `#selectMonth [value="${monthShort}"]`
).selected = true;

selectMonth.addEventListener('change', (evt) => {
    const selectedOption = evt.target.options[evt.target.selectedIndex];
    const selectedValue = +selectedOption.dataset.index;

    console.dir(selectedOption);
    console.log('Selected value:', selectedValue);

    createTable({ myYear: year, myMonth: selectedValue });
});

function createTable(createDate) {
    if (tableBody.hasChildNodes()) {
        tableBody.innerHTML = '';
    }
    console.log(createDate);
    const { myYear, myMonth } = createDate;
    const lastDate = new Date(myYear, +myMonth + 1, 0).getDate();
    console.log(lastDate);
    for (let dateNo = 1; dateNo <= lastDate; dateNo++) {
        const date = new Date(myYear, myMonth, dateNo);
        console.log(date);
        const dayName = date.toLocaleDateString('th-TH', { weekday: 'long' });
        const row = document.createElement('tr');
        if (isWeekend(date)) {
            const className = isSat(date) ? 'weekend sat' : 'weekend sun';
            row.innerHTML = `<td>${dateNo}</td>
                      <td colspan="7" class="${className}">------------------- ${dayName} --------------------</td>
                      `;
        } else if (isBankHoliday(date)) {
            const className = 'holiday';
            row.innerHTML = `<td>${dateNo}</td>
                      <td colspan="7" class="${className}">------------------- วันหยุด --------------------</td>
                      `;
        } else {
            row.innerHTML = `<td>${dateNo}</td>
                      <td>08:30</td>
                      <td>17:30</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      `;
        }
        tableBody.appendChild(row);
    }
}

function callHoliday() {
    return fetch('http://localhost:4343/holidays-from-web', {
        method: 'GET',
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
            bankHolidays = data;
            console.log('Bank Holidays:', bankHolidays);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

async function init() {
    await callHoliday();
    createTable({ myYear: year, myMonth: month });
}

init();
