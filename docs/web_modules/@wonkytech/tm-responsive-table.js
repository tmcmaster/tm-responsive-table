import { L as LitElement, c as css, h as html } from '../common/lit-element-54503d46.js';

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
    this.filter = {};
    this.sort = {};
    this.selected = {};
  } // noinspection JSUnusedGlobalSymbols


  firstUpdated(_changedProperties) {
    super.firstUpdated(_changedProperties);
    const slot = this.shadowRoot.getElementById('slot');
    const templates = Array.from(slot.assignedElements()).filter(element => element.tagName === 'TEMPLATE');
    const template = templates.length > 0 ? templates[0] : document.createElement('template');

    if (this.src !== undefined && this.src.length > 0) {
      fetch(this.src).then(data => data.json()).then(data => this.data = data).catch(error => console.error('There was an issue loading data', error));
    }

    this.addEventListener('tm-selection-changed', e => console.log('Selected Data', this.getSelected()));
  }

  static get styles() {
    // language=CSS
    return css`
            :host {
                display: inline-block;
                /*noinspection CssUnresolvedCustomProperty*/
                --row-odd-background: var(--tm-responsive-table-row-odd-background, #eee);
                /*noinspection CssUnresolvedCustomProperty*/
                --header-background: var(--tm-responsive-table-header-background, #333);
                /*noinspection CssUnresolvedCustomProperty*/
                --row-border: var(--tm-responsive-table-row-border, #ccc);
            }

            article {
                display: flex;
                flex-direction: column;
                justify-content: start;
                height: 100%;
                width: 100%;
            }

            header {
                flex: fit-content;
            }

            main {
                display: inline-block;
                flex: 1;
                box-sizing: border-box;
                overflow: scroll;
            }

            h2 {
                color: gray;
            }

            table {
                border-collapse: collapse;
                width: 100%;
            }

            tbody > tr:nth-of-type(odd) {
                /*noinspection CssUnresolvedCustomProperty*/
                background: var(--row-odd-background);
            }
            
            tbody > tr.selected {
                background: lightcyan;
            }

            th {
                /*noinspection CssUnresolvedCustomProperty*/
                background: var(--header-background);
                color: white;
                font-weight: bold;
            }

            td, th {
                padding: 6px;
                /*noinspection CssUnresolvedCustomProperty*/
                border: 1px solid var(--row-border);
                text-align: left;
            }

            @media only screen and (max-width: 760px), (min-device-width: 768px) and (max-device-width: 1024px) {

                table, thead, tbody, th, td, tr {
                    display: block;
                }

                tr {
                    border: 1px solid #ccc;
                }

                td {
                    border: none;
                    border-bottom: 1px solid #eee;
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
            }

            th.title {

            }

            .arrow-asc, .arrow-dsc {
                clear: both;
                float: right;
                margin-top: 5px;
                box-sizing: border-box;
                height: 10px;
                width: 10px;
                border-style: solid;
                border-color: white;
                border-width: 0px 1px 1px 0px;
                transform: rotate(45deg);
                transition: border-width 150ms ease-in-out;
            }

            .arrow-asc {
                transform: rotate(225deg);
            }

            .arrow-dsc {
                transform: rotate(45deg);
            }

            .arrow-none {
                display: none;
            }
        `;
  } // noinspection JSUnusedGlobalSymbols


  render() {
    const {
      selectable,
      selected,
      definition,
      data,
      filter,
      sort
    } = this;
    return html`
            <slot id="slot"></slot>
            
            <style>
                @media only screen and (max-width: 760px), (min-device-width: 768px) and (max-device-width: 1024px) {
                    ${definition.map((def, index) => html`
                        td:nth-of-type(${index + (selectable ? 2 : 1)}):before { content: "${def.title}"; }
                    `)}
                }
            </style>
            
            <article>
                <header>
                    <table>
                        <thead>
                            <tr>
                                ${selectable ? html`
                                    <th class="selected" width="5%" @click="${e => this.masterSelectSelected(e)}">
                                        <input type="checkbox" .checked="${Object.keys(selected).length > 0}"/>
                                    </th>
                                ` : html``}
                                ${definition.map(def => this.generateTitle(def))}
                            </tr>
                        </thead>
                    </table>
                </header>
                <main>
                    <table id="table">
                        <thead>
                            <tr>
                                ${selectable ? html`
                                    <td class="selected" width="5%"></td>
                                ` : html``}
                                ${definition.map(def => html`<td width="${def.width}"></td>`)}
                            </tr>
                        </thead>
                        <tbody>
                            ${data.filter(d => Object.keys(filter).length === 0 || Object.keys(filter).map(p => d[p].indexOf(filter[p]) > -1).filter(s => s === true).length === Object.keys(filter).length).sort((a, b) => sort.path === undefined ? 0 : (sort.direction === 'asc' ? 1 : -1) * a[sort.path].localeCompare(b[sort.path])).map(d => html`
                                    <tr @click="${e => this.rowSelected(d)}" class="${d['uid'] in selected ? 'selected' : ''}">
                                        ${selectable ? html`
                                            <td><input type="checkbox" .checked="${d['uid'] in selected}"/></td>
                                        ` : html``}
                                        ${definition.map(def => html`<td>${d[def.path]}</td>`)}
                                    </tr>
                                `)}
                        </tbody>
                    </table>
                </main>            
            </article>
        `;
  }

  generateTitle(def) {
    const {
      sort,
      filter
    } = this;
    return def.path === 'selected' ? html`
            <th class="selected" width="${def.width}"><input type="checkbox" .checked="${this.isAnyDataSelected()}"/></th>
        ` : html`
            <th class="title" width="${def.width}" @click="${() => this.sortChanged(def.path, def.sort)}">
                    ${def.filter ? html`
                        <span class="label">${def.title}</span>
                    ` : html`
                        <input style="width:${def.sort === true ? 80 : 90}%" 
                                value="${def.path in filter ? filter[def.path] : ''}"
                                placeholder="${def.title}" 
                                @click="${e => e.stopPropagation()}"
                                @keydown="${debounce(e => this.filterChanged(def.path, e), 500)}"/>
                    `}
                    ${def.sort ? html`
                        <div class="arrow-${def.path === sort.path ? sort.direction : 'none'}"></div>
                    ` : html``}
             </th>
        `;
  }

  getSelected() {
    return Object.values(this.selected);
  }

  rowSelected(d) {
    const {
      uid,
      selected
    } = this;
    const rowId = d[uid]; // TODO: need to investigate duplication of data issues

    const newSelected = { ...selected
    };

    if (rowId in selected) {
      delete newSelected[rowId];
    } else {
      newSelected[rowId] = d;
    }

    this.selected = newSelected;
    this.dispatchEvent(new CustomEvent('tm-selection-changed'));
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

    this.dispatchEvent(new CustomEvent('tm-selection-changed'));
  }

  isAnyDataSelected() {
    return this.data.map(r => r.selected).filter(s => s).length > 0;
  }

  filterChanged(path, e) {
    const {
      filter
    } = this;
    const value = e.path[0].value;
    const newFilter = { ...filter
    };

    if (value === undefined || value.length === 0) {
      delete newFilter[path];
    } else {
      newFilter[path] = value;
    }

    this.filter = newFilter;
    console.log(`NEW FILTER: Path(${path}), Value(${value})`, this.filter);
  }

  sortChanged(path, active) {
    if (!active) return;
    const {
      sort
    } = this;

    if (sort.path === undefined) {
      this.sort = {
        path: path,
        direction: 'asc'
      };
    } else if (sort.path === path) {
      if (sort.direction === 'asc') {
        this.sort = {
          path: path,
          direction: 'dsc'
        };
      } else {
        this.sort = {};
      }
    } else {
      this.sort = {
        path: path,
        direction: 'asc'
      };
    }

    console.log(`NEW SORT: Path(${path}), Active(${active})`, this.sort);
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
