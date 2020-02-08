import { h as html } from '../common/lit-html-9957b87e.js';
import { LitElement, css } from '../lit-element.js';

window.customElements.define('tm-table-header', class extends LitElement {
  // noinspection JSUnusedGlobalSymbols
  static get properties() {
    return {
      path: {
        type: String
      },
      title: {
        type: String
      },
      filter: {
        type: Boolean
      },
      sort: {
        type: Boolean
      },
      sortValue: {
        type: String
      },
      filterValue: {
        type: String
      }
    };
  }

  constructor() {
    super();
    this.path = undefined;
    this.title = '';
    this.filter = false;
    this.sort = false;
    this.sortValue = 'none';
    this.filterValue = '';
  } // noinspection JSUnusedGlobalSymbols


  firstUpdated(_changedProperties) {
    super.firstUpdated(_changedProperties);
    this.input = this.shadowRoot.getElementById('input');
  }

  static get styles() {
    // language=CSS
    return css`
            :host {
                display: inline-block;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                padding: 4px;
                --title-color: white;
            }

            div.main {
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
            }

            span.title, input.filter {
                flex: 1;
            }

            div.sort {
                height: 10px;
                width: 10px;
                margin-top: 5px;
                margin-left: 10px;
                box-sizing: border-box;
                border-style: solid;
                border-color: var(--title-color);
                border-width: 0px 1px 1px 0px;
                transform: rotate(45deg);
                transition: border-width 150ms ease-in-out;
            }

            div.arrow-asc {
                transform: rotate(225deg);
            }

            div.arrow-dsc {
                transform: rotate(45deg);
            }

            div.arrow-none {
                border: solid transparent 1px;
            }
        `;
  } // noinspection JSUnusedGlobalSymbols


  render() {
    const {
      title,
      filter,
      sort,
      sortValue,
      filterValue,
      path
    } = this; //console.log(`TM-TABLE-HEADING: render: path(${path}) sort(${sortValue}) filter(${filterValue})`);

    return html`
            <div class="main"  @click="${() => this.sortChanged()}">
                ${filter === true ? html`
                    <input id="input" class="filter"
                            style="width:${sort === true ? 80 : 90}%"
                            value="${filterValue}"
                            placeholder="${title}" 
                            @click="${e => e.stopPropagation()}"
                            @keydown="${debounce(e => this.filterChanged(e), 500)}"/>
                ` : html`
                    <span class="title">${title}</span>
                `}
                ${sort === true ? html`
                    <div class="sort arrow-${sortValue}"></div>
                ` : html``}
            </div>
        `;
  }

  filterChanged(e) {
    const {
      path
    } = this;
    const value = this.input.value;
    this.filterValue = value; //console.log(`NEW FILTER: Path(${path}), Value(${value})`, this.filterValue);

    this.dispatchEvent(new CustomEvent('filter-changed', {
      detail: {
        path: path,
        value: this.filterValue
      },
      bubbles: true,
      composed: true
    }));
  }

  sortChanged() {
    const {
      sort
    } = this;

    if (sort) {
      const {
        path,
        sortValue
      } = this;
      this.sortValue = sortValue === 'none' ? 'asc' : sortValue === 'asc' ? 'dsc' : 'none'; //console.log(`NEW SORT: Path(${path}), Value(${sortValue})`, this.sortValue);

      this.dispatchEvent(new CustomEvent('sort-changed', {
        detail: {
          path: path,
          value: this.sortValue
        },
        bubbles: true,
        composed: true
      }));
    }
  }

});

function debounce(func, delay) {
  let timer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(context, args), delay);
  };
}

window.customElements.define('tm-table-data', class extends LitElement {
  // noinspection JSUnusedGlobalSymbols
  static get properties() {
    return {
      data: {
        type: String
      },
      type: {
        type: String
      },
      min: {
        type: Number
      },
      max: {
        type: Number
      },
      editable: {
        type: Boolean
      },
      editing: {
        type: Boolean
      },
      changed: {
        type: Boolean
      },
      input: {
        type: Object
      }
    };
  }

  constructor() {
    super();
    this.editable = false;
    this.changed = false;
    this.editing = false;
    this.type = 'text';
    this.min = 1;
    this.max = 10;
  } // noinspection JSUnusedGlobalSymbols


  firstUpdated(_changedProperties) {
    super.firstUpdated(_changedProperties);
  } // noinspection JSUnusedGlobalSymbols


  updated(_changedProperties) {
    super.updated(_changedProperties);
  } // noinspection JSUnusedGlobalSymbols


  attributeChangedCallback(name, oldval, newval) {
    //console.log('TM-TABLE-DATA - attribute change: ', name, oldval, newval);
    super.attributeChangedCallback(name, oldval, newval);
  } // noinspection JSUnusedGlobalSymbols


  connectedCallback() {
    super.connectedCallback();
  } // noinspection JSUnusedGlobalSymbols


  disconnectedCallback() {
    super.disconnectedCallback();
  } // noinspection JSUnusedGlobalSymbols


  static get styles() {
    // language=CSS
    return css`
            :host {
                display: inline-block;
                width: 100%;
                height: 100%;
            }
            input, div {
                box-sizing: border-box;
                width: 100%;
                height: 100%;
                //min-height: 18px;
            }
            div.slider {
                display: inline-block;
                height: 15px;
                width: 100%;
                overflow: hidden;
            }
            paper-slider {
                height: 15px;
                width: 100%;
            }
        `;
  } // noinspection JSUnusedGlobalSymbols


  render() {
    const {
      data,
      editable,
      editing,
      type,
      min,
      max
    } = this;
    const action = editable ? type === 'slider' ? 'edit-slider' : editing ? 'edit-text' : 'text' : 'text';
    return action === 'edit-slider' ? html`
             <div class="slider">
                 <paper-slider value="${data}" min="${min}" max="${max}" step="1" snaps></paper-slider>
             </div>
        ` : action === 'edit-text' ? html`
             <input id="input" value="${data}" type="${type}" min="${min}" max="${max}"
                    @keyup="${e => this.keyPressed(e)}"
                    @keydown="${debounce$1(e => this.valueChanged(e), 500)}"
                    @blur="${() => this.publishChange()}"/>
        ` : html`
             <div @click="${e => this.dataSelected(e)}">${data.length === 0 ? '' : data}</div>
        `;
  } // noinspection JSUnusedGlobalSymbols


  renderHold() {
    const {
      data,
      editable,
      editing,
      type
    } = this;
    return editable && editing ? html`
            <input id="input" value="${data}" type="${type}"
                @keyup="${e => this.keyPressed(e)}"
                @keydown="${debounce$1(e => this.valueChanged(e), 500)}"
                @blur="${() => this.publishChange()}"/>
        ` : html`
            <div @click="${e => this.dataSelected(e)}">${data.length === 0 ? '' : data}</div>
        `;
  }

  dataSelected(e) {
    //console.log('TM-TABLE-DATA - startEditing');
    e.stopPropagation();

    if (this.editable) {
      this.editing = true;
      setTimeout(() => {
        const input = this.shadowRoot.getElementById('input');

        if (input) {
          input.focus();

          if (this.type === 'text') {
            input.setSelectionRange(0, input.value.length);
          }
        }
      }, 200);
    } else {
      this.dispatchEvent(new CustomEvent('data-selected'));
    }
  }

  valueChanged(e) {
    //console.log('TM-TABLE-DATA - valueChanged');
    if (e.key !== 'Escape' && e.key !== 'Enter') {
      this.changed = true;
      const input = this.shadowRoot.getElementById('input');

      if (input) {
        this.data = input.value;
      }
    }
  }

  keyPressed(e) {
    //console.log('TM-TABLE-DATA - keyPressed', e.key);
    const key = e.key;

    if (key === 'Escape' || e.key === 'Enter') {
      const input = this.shadowRoot.getElementById('input');

      if (input) {
        input.blur();
      }
    }
  }

  publishChange() {
    //console.log('TM-TABLE-DATA - publishChange');
    if (this.changed) {
      this.dispatchEvent(new CustomEvent('value-changed', {
        detail: this.data
      }));
    }

    this.editing = false;
    this.changed = false;
  }

});

function debounce$1(func, delay) {
  let timer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(context, args), delay);
  };
}

window.customElements.define('tm-responsive-table', class extends LitElement {
  // noinspection JSUnusedGlobalSymbols
  static get properties() {
    return {
      data: {
        type: Array
      },
      uid: {
        type: String
      },
      src: {
        type: String
      },
      definition: {
        type: Array
      },
      selectable: {
        type: Boolean
      },
      noHeadings: {
        type: Boolean
      },
      editable: {
        type: Boolean
      },
      filter: {
        type: Object
      },
      sort: {
        type: Object
      },
      selected: {
        type: Object
      }
    };
  }

  constructor() {
    super();
    this.definition = [];
    this.data = [];
    this.src = undefined;
    this.uid = 'uid';
    this.selectable = false;
    this.noHeadings = false;
    this.editable = false;
    this.filter = {};
    this.sort = {};
    this.selected = {};
  } // noinspection JSUnusedGlobalSymbols


  firstUpdated(_changedProperties) {
    super.firstUpdated(_changedProperties);

    if (this.src !== undefined && this.src.length > 0) {
      this.getDataFromFile(this.src);
    }
  }

  getDataFromFile(src) {
    fetch(src).then(data => data.json()).then(data => this.data = data).catch(error => console.error('There was an issue loading data', error));
  } // noinspection JSUnusedGlobalSymbols


  static get styles() {
    // language=CSS
    return css`
            :host {
                display: inline-block;
                --row-odd-background: var(--tm-responsive-table-row-odd-background, #eee);
                --header-background: var(--tm-responsive-table-header-background, #333);
                --header-color: var(--tm-responsive-table-header-color, white);
                --row-border: var(--tm-responsive-table-row-border, #ccc);
                --max-device-width: var(--tm-responsive-table-max-device-width, 1024px);
                --row-height: var(--tm-responsive-table-row-height, 18px);
            }

            article {
                display: flex;
                flex-direction: column;
                justify-content: start;
                height: 100%;
                width: 100%;
                max-width: 100%;
            }

            header {
                width:100%;
                flex: fit-content;
            }

            main {
                width:100%;
                display: inline-block;
                flex: 1;
                box-sizing: border-box;
                overflow-y: scroll;
            }

            table {
                border-collapse: collapse;
                width: 100%;
            }

            tbody > tr:nth-of-type(odd) {
                background: var(--row-odd-background);
            }
            
            tbody > tr.selected {
                background: lightcyan;
            }

            th {
                background: var(--header-background);
                color: var(--header-color);
                font-weight: bold;
            }

            td, th {
                padding: 6px;
                border: 1px solid var(--row-border);
                text-align: left;
                height: var(--row-height);
            }

            thead.thin > tr > td {
                height: 0px;
                padding: 0px;
            }

            heading {
                width: 100%;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                margin-bottom: 5px;
            }

            heading > button {
                //border: solid lightgrey 1px;
            }
            
            button, input {
                border: solid lightgrey 1px;
            }
            
            @media only screen and (max-width: 600px) {

                thead, tbody, th, td, tr {
                    display: block;
                }

                tr {
                    border: 1px solid var(--row-border);
                }

                td {
                    border: none;
                    border-bottom: 1px solid var(--row-odd-background);
                    position: relative;
                    padding-left: 50%;
                }

                td:before {
                    position: absolute;
                    top: 6px;
                    left: 6px;
                    width: 45%;
                    padding-right: 10px;
                    white-space: nowrap;
                }

                header > table > thead > tr {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-around;
                    flex-wrap: wrap;
                    background: var(--header-background);
                }
                header > table > thead > tr > th {
                    margin:2px;
                }
                main > table > thead {
                    display: none;
                }

                .filterOrSort-false {
                    display: none;
                }
            }
        `;
  } // noinspection JSUnusedGlobalSymbols


  render() {
    const {
      selectable,
      selected,
      noHeadings,
      editable,
      definition,
      data,
      filter,
      sort,
      uid
    } = this; //console.log(`TM-RESPONSIVE-TABLE: render: filter, sort`, filter, sort);

    return html`

            <style>
                @media only screen and (max-width: 600px) {
                    ${definition.map((def, index) => html`
                        td:nth-of-type(${index + (selectable ? 2 : 1)}):before { content: "${def.title}"; }
                    `)}
                }
            </style>
            ${editable ? html`
                <heading>
                    <div>
                        <button @click="${e => this._addNewRecord()}">ADD</button>    
                        ${definition.filter(def => def.path === uid).map(def => html`
                            <input id="newUID" placeholder="${def.title}"/>
                        `)}                
                    </div>
                    <button @click="${e => this._deleteSelectedRecord()}">DELETE</button>
                </heading>
            ` : html``}
            <article>
                ${noHeadings ? html`` : html`
                    <header>
                        <table>
                            <thead>
                                <tr>
                                    ${selectable ? html`
                                        <th class="selected" width="5%" @click="${e => this.masterSelectSelected(e)}">
                                            <input type="checkbox" .checked="${Object.keys(selected).length > 0}"/>
                                        </th>
                                    ` : html``}
                                    
                                    ${definition.map(def => html`
                                        <th class="title filterOrSort-${def.filter === true || def.sort === true}" width="${def.width}">
                                            <tm-table-header class="a" path="${def.path}" title="${def.title}"  
                                                            ?sort="${def.sort ? def.sort : false}" 
                                                            ?filter="${def.filter ? def.filter : false}"
                                                sortValue="${def.path === sort.path ? sort.direction : 'none'}"
                                                filterValue="${def.path in filter ? filter[def.path] : ''}"
                                                @filter-changed="${e => this.filterChanged(e.detail.path, e.detail.value)}"
                                                @sort-changed="${e => this.sortChanged(e.detail.path, e.detail.value)}"></tm-table-header> 
                                        </th>
                                    `)}
                                </tr>
                            </thead>
                        </table>
                    </header>
                `}
                <main>
                    <table id="table">
                        <thead class="thin">
                            <tr>
                                ${selectable ? html`
                                    <td class="selected" width="5%"></td>
                                ` : html``}
                                ${definition.map(def => html`<td width="${def.width}"></td>`)}
                            </tr>
                        </thead>
                        <tbody>
                            ${data.filter(d => applyFilter(d, filter)).sort((a, b) => applySort(a, b, sort)).map(d => html`
                                    <tr class="${d[uid] in selected ? 'selected' : ''}">
                                        ${selectable ? html`
                                            <td @click="${e => this.rowSelected(d)}">
                                                <input type="checkbox" .checked="${d[uid] in selected}" />
                                            </td>
                                        ` : html``}
                                        ${definition.map(def => html`
                                            <td class="data">
                                                <tm-table-data data="${def.path in d ? d[def.path] : ''}" 
                                                               type="${def.type ? def.type : 'text'}"
                                                               min="${def.min ? def.min : 1}"
                                                               max="${def.max ? def.max : 10}"
                                                               ?editable="${def.edit}"
                                                               @value-changed="${e => this.publishChange(d[uid], def.path, e, d)}"
                                                               @data-selected="${e => this.rowSelected(d)}"></tm-table-data>
                                            </td>           
                                        `)}
                                    </tr>
                                `)}
                        </tbody>
                    </table>
                </main>            
            </article>
        `;
  }

  _addNewRecord() {
    console.log('TM-RESPONSIVE-TABLE - addNewRecord');
    const newRecord = {};
    this.definition.forEach(def => newRecord[def.path] = def.default ? def.default : '');
    const inputNewUID = this.shadowRoot.getElementById('newUID');

    if (inputNewUID) {
      const newUID = inputNewUID.value;

      if (newUID.length > 0) {
        const duplicates = this.data.filter(d => d[this.uid] === newUID);

        if (duplicates.length === 0) {
          newRecord[this.uid] = inputNewUID.value;
          this.data = [...this.data, newRecord];
          inputNewUID.value = '';
          this.dispatchEvent(new CustomEvent('added', {
            detail: newRecord
          }));
        } else {
          console.log('Cannot create record with existing UID: ' + newUID);
        }
      } else {
        console.log('Can not add new record without a given UID');
      }
    }
  }

  _deleteSelectedRecord() {
    console.log('TM-RESPONSIVE-TABLE - deleteSelectedRecord: ', this.getSelected());
    const selectedRows = this.getSelected(); //this.data = this.data.filter(r => !selectedRows.includes(r));

    this.data = this.data.filter(r => !(r[this.uid] in this.selected));
    const deletedUIDs = Object.keys(this.selected);
    this.selected = {};
    this.dispatchEvent(new CustomEvent('deleted', {
      detail: deletedUIDs
    }));
  }

  getSelected() {
    return Object.values(this.selected);
  }

  publishChange(uid, path, e, d) {
    console.log('TM-RESPONSIVE-TABLE: publish change: ', uid, path, e.detail);
    this.editing = undefined;
    d[path] = e.detail;
    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: {
        uid: uid,
        path: path,
        value: d[path]
      }
    })); //this.requestUpdate('data', undefined);
  }

  rowSelected(d) {
    const {
      uid,
      selected,
      selectable
    } = this;

    if (selectable) {
      const rowId = d[uid]; // TODO: need to investigate duplication of data issues

      const newSelected = { ...selected
      };

      if (rowId in selected) {
        delete newSelected[rowId];
      } else {
        newSelected[rowId] = d;
      }

      this.selected = newSelected;
      this.dispatchEvent(new CustomEvent('selection-changed'));
    }
  }

  masterSelectSelected(e) {
    const {
      uid,
      selected,
      data
    } = this;

    if (Object.keys(selected).length > 0) {
      this.selected = {};
    } else {
      const newSelected = {};
      data.forEach(d => newSelected[d[uid]] = d);
      this.selected = newSelected;
    }

    this.dispatchEvent(new CustomEvent('selection-changed'));
  }

  sortChanged(path, value) {
    this.sort = value === 'none' ? {} : {
      path: path,
      direction: value
    }; //console.log(`TM-RESPONSIVE-TABLE: NEW SORT: Path(${path}), Value(${value})`, this.sort);
  }

  filterChanged(path, value) {
    const {
      filter
    } = this;
    const newFilter = { ...filter
    };

    if (value === undefined || value.length === 0) {
      delete newFilter[path];
    } else {
      newFilter[path] = value;
    }

    this.filter = newFilter; //console.log(`TM-RESPONSIVE-TABLE: NEW FILTER: Path(${path}), Value(${value})`, this.filter);
  }

});

function applySort(a, b, sort) {
  const {
    path,
    direction
  } = sort;
  return path === undefined || direction === 'none' ? 0 : (direction === 'asc' ? 1 : -1) * a[path].localeCompare(b[path]);
}

function applyFilter(d, filter) {
  return Object.keys(filter).length === 0 || Object.keys(filter).map(p => p in d && d[p].indexOf(filter[p]) > -1).filter(s => s === true).length === Object.keys(filter).length;
}
