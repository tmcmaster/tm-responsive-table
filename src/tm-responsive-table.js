import {html} from 'lit-html';
import {LitElement, css} from 'lit-element';

window.customElements.define('tm-responsive-table', class extends LitElement {

    // noinspection JSUnusedGlobalSymbols
    static get properties() {
        return {
            data: {type: Array},
            uid: {type: String},
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
        this.uid = 'uid';
        this.selectable = false;
        this.filter = {
            'firstName': 'Mrs'
        };
        this.sort = {
            path: 'lastName',
            direction: 'dsc'
        };
        this.selected = {
            'user-001': true,
            'user-005': true
        };
    }

    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        const slot = this.shadowRoot.getElementById('slot');
        const templates = Array.from(slot.assignedElements()).filter(element => element.tagName === 'TEMPLATE');
        const template = (templates.length > 0 ? templates[0] : document.createElement('template'));
        this.definition = this.parseDefinition(template.content, this.selectable);
    }

    parseDefinition(definitionElement, selectable) {
        console.log('DEFINITION ELEMENT: ', definitionElement);
        const definitions = [];
        // if (selectable) {
        //     definitions.push({
        //         path: 'selected',
        //         title: 'Selected',
        //         width: '3%',
        //         sorted: false,
        //         filter: false
        //     });
        // }

        [
            {path: 'uid', title: 'UID', width: '10%', sort: false, filter: false},
            {path: 'firstName', title: 'First Name', width: '20%', sort: true, filter: false, sortDirection: 'asc'},
            {path: 'lastName', title: 'Last Name', width: '20%', sort: true, filter: true, sortDirection: 'none', filterValue: ''},
            {path: 'email', title: 'Email Address', width: '40%', sort: false, filter: true, sortDirection: 'none', filterValue: ''}
        ].forEach(item => definitions.push(item));

        return definitions;
    }

    static get styles() {
        // language=CSS
        return css `
            :host {
                display: inline-block;
                width: 800px;
                height: 200px;
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
                background: #eee;
            }
            th {
                background: #333;
                color: white;
                font-weight: bold;
            }
            td, th {
                padding: 6px;
                border: 1px solid #ccc;
                text-align: left;
            }

            @media
            only screen and (max-width: 760px),
            (min-device-width: 768px) and (max-device-width: 1024px) {
                
                table, thead, tbody, th, td, tr {
                    display: block;
                }

                thead tr {
                    position: absolute;
                    top: -9999px;
                    left: -9999px;
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
            }
            
            /** Tricky use of checkbox **/
            /* Toggled State */
            /*input[type=checkbox]:checked ~ div {*/
            /*    background: red;*/
            /*}*/

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
    }

    // noinspection JSUnusedGlobalSymbols
    render() {
        const {selectable, definition, data, filter, sort} = this;
        const offset = (selectable ? 2 : 1);
        const sortBy = (Object.keys(sort).length === 0 ? undefined : Object.keys(sort)[0]);
        const sortDirection = (sortBy === undefined ? undefined : sort[sortBy]);
        console.log('SORT - ', sortBy, sortDirection);
        return html`
            <slot id="slot"></slot>
            
            <style>
                @media only screen and (max-width: 760px), (min-device-width: 768px) and (max-device-width: 1024px) {
                    ${definition.map((def,index) => html`
                        td:nth-of-type(${index + offset}):before { content: "${def.title}"; }
                    `)}
                }
            </style>
            
            <article>
                <header>
                    <table>
                        <thead>
                            <tr>
                                ${(this.selectable ? html`
                                    <th class="selected" width="5%"><input type="checkbox" .checked="${Object.keys(this.selected).length > 0}"/></th>
                                ` : html``)}
                                ${this.definition.map(def => this.generateTitle(def))}
                            </tr>
                        </thead>
                    </table>
                </header>
                <main>
                    <table id="table">
                        <thead>
                            <tr>
                                ${(this.selectable ? html`
                                    <td class="selected" width="5%"></td>
                                ` : html``)}
                                ${this.definition.map(def => html`<td width="${def.width}"></td>`)}
                            </tr>
                        </thead>
                        <tbody>
                            ${data
                                .filter((d) => Object.keys(filter).length === 0 || Object.keys(filter).filter(p => filter[p].length > 0).map((p) => d[p].indexOf(filter[p]) > -1).filter(s => s === true).length > 0)
                                .sort((a,b) => (sort.path === undefined ? 0 : (sort.direction === 'asc' ? 1 : -1) * a[sort.path].localeCompare(b[sort.path])))
                                .map(d => html`
                                    <tr>
                                        ${(this.selectable ? html`
                                            <td><input type="checkbox" .checked="${d['uid'] in this.selected}"/></td>
                                        ` : html``)}
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
        const {sort, filter} = this;

        return (def.path === 'selected' ? html`
            <th class="selected" width="${def.width}"><input type="checkbox" .checked="${this.isAnyDataSelected()}"/></th>
        ` : html`
            <th class="title" width="${def.width}" @click="${() => this.sortChanged(def.path, def.sort)}">
                    ${(def.filter ? html`
                        <span class="label">${def.title}</span>
                    ` : html`
                        <input style="width:${(def.sort === true ? 80 : 90)}%" 
                                value="${def.path in filter ? filter[def.path] : ''}"
                                placeholder="${def.title}" 
                                @click="${(e) => e.stopPropagation()}"
                                @keydown="${debounce((e) => this.filterChanged(def.path, e), 500)}"/>
                    `)}
                    ${(def.sort ? html`
                        <div class="arrow-${(def.path === sort.path ? sort.direction : 'none')}"></div>
                    ` : html``)}
             </th>
        `);
    }

    isAnyDataSelected() {
        return this.data.map(r => r.selected).filter(s => s).length > 0
    }

    filterChanged(path, e) {
        const {filter} = this;
        const value = e.path[0].value;
        const newFilter = {...filter};
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
        const {sort} = this;

        if (sort.path === undefined) {
            this.sort = {path:path,direction: 'asc'}
        } else if (sort.path === path) {
            if (sort.direction === 'asc') {
                this.sort = {path:path,direction: 'dsc'}
            } else {
                this.sort = {}
            }
        } else {
            this.sort = {path:path,direction: 'asc'}
        }

        console.log(`NEW SORT: Path(${path}), Active(${active})`, this.sort);
    }
});

function debounce(func, delay) {
    let timer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timer);
        timer=setTimeout(() => func.apply(context, args), delay);
    }
}