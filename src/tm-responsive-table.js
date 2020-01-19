import {html} from 'lit-html';
import {LitElement, css} from 'lit-element';

import './tm-table-header.js';
import './tm-table-data.js';

window.customElements.define('tm-responsive-table', class extends LitElement {

    // noinspection JSUnusedGlobalSymbols
    static get properties() {
        return {
            data: {type: Array},
            uid: {type: String},
            src: {type: String},
            definition: {type: Array},
            selectable: {type: Boolean},
            filter: {type: Object},
            sort: {type: Object},
            selected: {type: Object}
        }
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
    }

    // noinspection JSUnusedGlobalSymbols
    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        if (this.src !== undefined && this.src.length > 0) {
            this.getDataFromFile(this.src);
        }
    }

    getDataFromFile(src) {
        fetch(src)
            .then((data) => data.json())
            .then((data) => this.data = data)
            .catch((error) => console.error('There was an issue loading data', error));
    }

    // noinspection JSUnusedGlobalSymbols
    static get styles() {
        // language=CSS
        return css `
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
            }
        `;
    }

    // noinspection JSUnusedGlobalSymbols
    render() {
        const {selectable, selected, definition, data, filter, sort, uid} = this;
        //console.log(`TM-RESPONSIVE-TABLE: render: filter, sort`, filter, sort);

        return html`

            <style>
                @media only screen and (max-width: 600px) {
                    ${definition.map((def,index) => html`
                        td:nth-of-type(${index + (selectable ? 2 : 1)}):before { content: "${def.title}"; }
                    `)}
                }
            </style>
            
            <article>
                <header>
                    <table>
                        <thead>
                            <tr>
                                ${(selectable ? html`
                                    <th class="selected" width="5%" @click="${(e) => this.masterSelectSelected(e)}">
                                        <input type="checkbox" .checked="${Object.keys(selected).length > 0}"/>
                                    </th>
                                ` : html``)}
                                
                                ${definition.map(def => html`
                                    <th class="title" width="${def.width}">
                                        <tm-table-header class="a" path="${def.path}" title="${def.title}"  
                                                        ?sort="${(def.sort ? def.sort : false)}" 
                                                        ?filter="${(def.filter ? def.filter : false)}"
                                            sortValue="${(def.path === sort.path ? sort.direction : 'none')}"
                                            filterValue="${(def.path in filter ? filter[def.path] : '')}"
                                            @filter-changed="${(e) => this.filterChanged(e.detail.path, e.detail.value)}"
                                            @sort-changed="${(e) => this.sortChanged(e.detail.path, e.detail.value)}"></tm-table-header> 
                                    </th>
                                `)}
                            </tr>
                        </thead>
                    </table>
                </header>
                <main>
                    <table id="table">
                        <thead class="thin">
                            <tr>
                                ${(selectable ? html`
                                    <td class="selected" width="5%"></td>
                                ` : html``)}
                                ${definition.map(def => html`<td width="${def.width}"></td>`)}
                            </tr>
                        </thead>
                        <tbody>
                            ${data
                                .filter((d) => applyFilter(d, filter))
                                .sort((a,b) => applySort(a,b,sort))
                                .map(d => html`
                                    <tr class="${(d[uid] in selected ? 'selected' : '')}">
                                        ${(selectable ? html`
                                            <td @click="${(e) => this.rowSelected(d)}">
                                                <input type="checkbox" .checked="${d[uid] in selected}" />
                                            </td>
                                        ` : html``)}
                                        ${definition.map(def => html`
                                            <td class="data">
                                                <tm-table-data data="${(def.path in d ? d[def.path] : '')}" 
                                                               ?editable="${def.edit}"
                                                               @value-changed="${(e) => this.publishChange(d[uid], def.path, e, d)}"
                                                               @data-selected="${(e) => this.rowSelected(d)}"></tm-table-data>
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

    getSelected() {
        return Object.values(this.selected);
    }


    publishChange(uid, path, e, d) {
        console.log('TM-RESPONSIVE-TABLE: publish change: ', uid, path, e.detail);
        this.editing = undefined;
        d[path] = e.detail;
        this.dispatchEvent(new CustomEvent('value-changed', {detail: {uid: uid, path: path, value: d[path]}}));
        //this.requestUpdate('data', undefined);
    }

    rowSelected(d) {
        const {uid, selected, selectable} = this;
        if (selectable) {
            const rowId = d[uid];
            // TODO: need to investigate duplication of data issues
            const newSelected = {...selected};
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
        const {uid, selected, data} = this;
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
        this.sort = (value === 'none' ? {} : {path:path, direction: value});
        //console.log(`TM-RESPONSIVE-TABLE: NEW SORT: Path(${path}), Value(${value})`, this.sort);
    }

    filterChanged(path, value) {
        const {filter} = this;
        const newFilter = {...filter};
        if (value === undefined || value.length === 0) {
            delete newFilter[path];
        } else {
            newFilter[path] = value;
        }
        this.filter = newFilter;
        //console.log(`TM-RESPONSIVE-TABLE: NEW FILTER: Path(${path}), Value(${value})`, this.filter);
    }
});

function applySort(a,b,sort) {
    const {path,direction} = sort;
    return (path === undefined || direction === 'none' ? 0 : (direction === 'asc' ? 1 : -1) * a[path].localeCompare(b[path]))
}

function applyFilter(d, filter) {
    return Object.keys(filter).length === 0
        || Object.keys(filter)
            .map((p) => (p in d) && d[p].indexOf(filter[p]) > -1)
            .filter(s => s === true).length === Object.keys(filter).length;
}

function debounce(func, delay) {
    let timer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timer);
        timer=setTimeout(() => func.apply(context, args), delay);
    }
}