const template = document.createElement("template");
template.innerHTML = /*html*/`
  <style>
    * {
      // font-size: 200%;
    }

    span {
      width: 4rem;
      display: inline-block;
      text-align: center;
    }

    td.available:hover {
      background-color: #eee;
    }

    .buttons {
      // clear: both;
      text-align: right;
      padding: 8px;
      border-top: 1px solid #ddd;
      // display: none;
      line-height: 12px;
      vertical-align: middle;
    }

    .buttons .selected {
      display: inline-block;
      font-size: 12px;
      padding-right: 8px;
    }
  </style>
  <div class="date-range-picker">
    <div class="presets"></div>
    <div class="calendar calendar-left">
      <div class="calendar-table"></div>
    </div>
    <div class="calendar calendar-right">
      <div class="calendar-table"></div>
    </div>
    <div class="buttons">
      <span class="selected"></span>
      <button class="cancel" type="button">Cancel</button>
      <button class="apply" disabled="disabled" type="button">Apply</button> 
    </div>
  </div>`;

  const DEFAULT_TIME = 12
  const NUMBER_OF_DAYS_ON_CALENDAR = 42
  const NUMBER_OF_DAYS_IN_WEEK = 7
  const HOURS_IN_DAY = 24
  const ROWS_IN_CALENDAR = 5

export class DateRangePicker extends HTMLElement {
  static get observedAttributes() {
    return ['start-date', 'end-date'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    console.log("Connected");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log("Attribute changed: ", name);
    switch(name) {
      case 'start-date':
        // this.startDate = newValue;
        this.updateSelected()
        this.renderCalendar("left")
        this.renderCalendar("right")
        break;
      case 'end-date':
        // this.endDate = newValue;
        this.updateSelected()
        this.renderCalendar("left")
        this.renderCalendar("right")
        break;
    }
  }

  updateSelected() {
    // Get the selected div
    const selected = this.shadowRoot.querySelector('.selected');
    // Set the text to the selected values
    selected.innerText = `${this.startDate} - ${this.endDate}`;
  }

  renderCalendar(side) {
    let date = new Date(this.startDate)
    let month = date.getMonth()
    let year = date.getFullYear();

    // Make a date with the current year and month, changing the day to the first one
    let firstDayInMonth = new Date(year, month, 1);
    // Make a date with the current year and next month, using the 0th day which is actually the last day of the pervious month
    let lastDayInMonth = new Date(year, month + 1, 0);
    // Use the last day in the month to tell us how many days there are
    let daysInMonth = lastDayInMonth.getDate();
    // Use the first day of last month to get the month
    let lastMonth = new Date(year, month - 1, 1).getMonth()
    // Use the first day of last month to get the year
    let lastMonthYear = new Date(year, month - 1, 1).getFullYear()
    // Use the last day in the last month to tell us how many days there are
    let daysInLastMonth = new Date(year, month, 0).getDate();
    let firstDayOfWeek = firstDayInMonth.getDay();

    // TODO: Figure out what these should be
    let minute = 0
    let second = 0

    // Initialize a 5 rows x 7 columns array for the calendar
    let calendar = {};
    calendar.firstDayInMonth = firstDayInMonth;
    calendar.lastDayInMonth = lastDayInMonth;

    calendar.days = []
    for (let i = 0; i <= ROWS_IN_CALENDAR; i++) {
      calendar.days[i] = [];
    }

    let startDay = daysInLastMonth - firstDayOfWeek + 1//+ this.locale.firstDay;
    if (startDay > daysInLastMonth) startDay -= NUMBER_OF_DAYS_IN_WEEK;

    let currentDate = new Date(lastMonthYear, lastMonth, startDay, DEFAULT_TIME, minute, second);
    let col = 0;
    let row = 0;
    // TODO: Can we remove i in favour of row? / nested for loop?
    for (let i = 0; i < NUMBER_OF_DAYS_ON_CALENDAR; i++) {
      if (i > 0 && col % NUMBER_OF_DAYS_IN_WEEK === 0) {
        col = 0;
        row++;
      }
      // Clone date into calendar
      calendar.days[row][col] = new Date(currentDate.getTime());

      // Move forward to next day
      currentDate.setHours(currentDate.getHours() + HOURS_IN_DAY)
      col++
    }

    // TODO: Change this to programically generate elements? ex. .createElement('table')

    let tableHTML = `
      <table class="table-condensed">
        <thead>
          <tr>
    `;

    if (true) tableHTML += '<th></th>';

    // add week number label
    if (this.showWeekNumbers || this.showISOWeekNumbers) tableHTML += '<th class="week">' + "Week?" + '</th>';

    // $.each(this.locale.daysOfWeek, function(index, dayOfWeek) {
      // tableHTML += '<th>' + "MON?" + '</th>';
    // });

    tableHTML += `
          </tr>
        </thead>
        <tbody>
    `;

    for (let row = 0; row <= ROWS_IN_CALENDAR; row++) {
      tableHTML += '<tr>';

      // add week number
      // if (this.showWeekNumbers)
      //   tableHTML += '<td class="week">' + calendar[row][0].week() + '</td>';
      // else if (this.showISOWeekNumbers)
      //   tableHTML += '<td class="week">' + calendar[row][0].isoWeek() + '</td>';

      for (let col = 0; col < NUMBER_OF_DAYS_IN_WEEK; col++) {

        let classes = [];

        // Highlight today's date
        // if (areDatesEqual(new Date(), calendar[row][col])) classes.push('today');

        // Highlight weekends
        // if (calendar[row][col].isoWeekday() > 5) classes.push('weekend');

        // Grey out the dates in other months displayed at beginning and end of this calendar
        // if (calendar[row][col].month() != calendar[1][1].month())
            // classes.push('off', 'ends');

        //don't allow selection of dates before the minimum date
        // if (this.minDate && calendar[row][col].isBefore(this.minDate, 'day'))
            // classes.push('off', 'disabled');

        //don't allow selection of dates after the maximum date
        // if (maxDate && calendar[row][col].isAfter(maxDate, 'day'))
        //     classes.push('off', 'disabled');

        //don't allow selection of date if a custom function decides it's invalid
        // if (this.isInvalidDate(calendar[row][col]))
        //     classes.push('off', 'disabled');

        // Highlight the currently selected start date
        // if (areDatesEqual(calendar[row][col], new Date(this.startDate))) classes.push('active', 'start-date');

        // Highlight the currently selected end date
        // if (this.endDate != null && areDatesEqual(calendar[row][col], new Date(this.endDate))) classes.push('active', 'end-date');

        // Highlight dates in-between the selected dates
        // if (this.endDate != null && calendar[row][col] > this.startDate && calendar[row][col] < this.endDate) classes.push('in-range');

        //apply custom classes for this date
        // var isCustom = this.isCustomDate(calendar[row][col]);
        // if (isCustom !== false) {
        //     if (typeof isCustom === 'string')
        //         classes.push(isCustom);
        //     else
        //         Array.prototype.push.apply(classes, isCustom);
        // }

        let className = '';
        let disabled = false;
        // for (var i = 0; i < classes.length; i++) {
        //   className += classes[i] + ' ';
        //   if (classes[i] == 'disabled') disabled = true;
        // }
        if (!disabled) className += 'available';

        tableHTML += `<td class="${className.replace(/^\s+|\s+$/g, '')}" data-row="${row}" data-col="${col}">${calendar.days[row][col].getDate()}</td>`;
      }
      tableHTML += '</tr>';
    }

    tableHTML += `
        </tbody>
      </table>
    `;

    this.shadowRoot.querySelector(`.calendar-${side} .calendar-table`).innerHTML = tableHTML;
  }

  onHoverDate(ev) {
    let hoveredDateEl = this.shadowRoot.querySelector(ev.target)
    // Ignore dates that can't be selected
    if (!hoveredDateEl.hasClass('available')) return;

    let row = hoveredDateEl.dataset('row');
    let col = hoveredDateEl.dataset('col');
    let currentCalendar = hoveredDateEl.parents('.calendar');
    let hoveredDate = currentCalendar.classList.contains('calendar-left') ? this.leftCalendar.calendar.days[row][col] : this.rightCalendar.calendar.days[row][col];

    // Highlight the dates between the start date and the date being hovered as a potential end date
    if (!this.endDate) {
      this.container.find('.calendar tbody td').each((_, el) => {
        let inBetweenEl = this.shadowRoot.querySelector(el)
        // Skip week numbers, only look at dates
        if (inBetweenEl.classList.contains('week')) return;

        let row = inBetweenEl.dataset('row');
        let col = inBetweenEl.dataset('col');
        let currentCalendar = inBetweenEl.parents('.calendar');
        let inBetweenDate = currentCalendar.classList.contains('calendar-left') ? this.leftCalendar.calendar.days[row][col] : this.rightCalendar.calendar.days[row][col];

        if ((isDateAfter(inBetweenDate, new Date(this.startDate)) && isDateBefore(inBetweenDate, hoveredDate)) || areDatesEqual(hoveredDate, inBetweenDate)) {
          inBetweenEl.classList.add('in-range');
        } else {
          inBetweenEl.classList.remove('in-range');
        }
      });
    }
  }

  // Getters and Setters

  get startDate() {
    return this.getAttribute('start-date');
  }
  
  set startDate(val) {
    this.setAttribute('start-date', val);
  }

  get endDate() {
    return this.getAttribute('end-date');
  }
  
  set endDate(val) {
    this.setAttribute('end-date', val);
  }

  // End Getters and Setters
}

const areDatesEqual = (date, otherDate) => {
  // TODO: Make time zone resistant
  // Copy dates to avoid mutating them when we reset time to compare
  let copiedDate = new Date(date.getTime());
  let copiedOtherDate = new Date(otherDate.getTime());

  copiedDate.setHours(0,0,0,0)
  copiedOtherDate.setHours(0,0,0,0)
  return copiedDate.getTime() === copiedOtherDate.getTime()
}

const isDateBefore = (date, otherDate) => {
  // TODO: look at removing time for equation like itn areDatesEqual ?
  return date.getTime() < otherDate.getTime()
}

const isDateAfter = (date, otherDate) => {
  // TODO: look at removing time for equation like itn areDatesEqual ?
  return date.getTime() > otherDate.getTime()
}

window.customElements.define('date-range-picker', DateRangePicker);