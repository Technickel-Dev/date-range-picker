const template = document.createElement("template");
template.innerHTML = /*html*/`
  <style>
    * {
      font-size: 200%;
    }

    span {
      width: 4rem;
      display: inline-block;
      text-align: center;
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
    <div class="calendar left">
      <div class="calendar-table"></div>
    </div>
    <div class="calendar right">
      <div class="calendar-table"></div>
    </div>
    <div class="buttons">
      <span class="selected"></span>
      <button class="cancel" type="button">Cancel</button>
      <button class="apply" disabled="disabled" type="button">Apply</button> 
    </div>
  </div>`;

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
        this.startDate = newValue
        this.updateSelected()
        break;
      case 'end-date':
        this.endDate = newValue
        this.updateSelected()
        break;
    }
  }

  updateSelected() {
    // Get the selected div
    const selected = this.shadowRoot.querySelector('.selected');
    // Set the text to the selected values
    selected.innerText = `${this.startDate} - ${this.endDate}`;
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

window.customElements.define('date-range-picker', DateRangePicker);