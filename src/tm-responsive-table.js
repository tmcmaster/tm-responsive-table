import {html} from 'lit-html';
import {LitElement, css} from 'lit-element';

window.customElements.define('tm-responsive-table', class extends LitElement {

    // noinspection JSUnusedGlobalSymbols
    static get properties() {
        return {
            data: {type: Array},
            displayData: {type: Array},
            definition: {type: Array},
            selectable: {type: Boolean}
        }
    }

    constructor() {
        super();
        this.definition = [];
        this.data = [];
        this.selectable = false;
        this.displayData = this.data;
    }

    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        const slot = this.shadowRoot.getElementById('slot');
        const templates = Array.from(slot.assignedElements()).filter(element => element.tagName === 'TEMPLATE');
        const template = (templates.length > 0 ? templates[0] : document.createElement('template'));
        this.definition = this.parseDefinition(template.content, this.selectable);
        this.displayData = this.data;
    }

    parseDefinition(definitionElement, selectable) {
        console.log('DEFINITION ELEMENT: ', definitionElement);
        const definitions = [];
        if (selectable) {
            definitions.push({
                path: 'selected',
                title: 'Selected',
                width: '3%',
                sorted: false,
                filter: false
            });
        }

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
        const {selectable, definition, displayData} = this;
        const offset = (selectable ? 2 : 1);
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
                                ${this.definition.map(def => this.generateTitle(def))}
                            </tr>
                        </thead>
                    </table>
                </header>
                <main>
                    <table id="table">
                        <thead>
                            <tr>
                                ${this.definition.map(def => html`
                                    <td width="${def.width}"></td>
                                `)}
                            </tr>
                        </thead>
                        <tbody>
                            ${displayData.map(r => html`
                                <tr>
                                    ${definition.map(def => (def.path === 'selected' ? html`
                                        <td width="${def.width}"><input type="checkbox" .checked="${r.selected}"/></td>
                                    ` : html`
                                        <td>${r[def.path]}</td>
                                    `))}
                                </tr>
                            `)}
                        </tbody>
                    </table>
                </main>            
            </article>
        `;
    }

    generateTitle(def) {
        return (def.path === 'selected' ? html`
            <th class="selected" width="${def.width}"><input type="checkbox" .checked="${this.isAnyDataSelected()}"/></th>
        ` : html`
            <th class="title" 
                width="${def.width}" @click="${() => this.sortBy(def)}">
                    ${(def.filter ? html`
                        <span class="label">${def.title}</span>
                    ` : html`
                        <input style="width:${(def.sort === true ? 80 : 90)}%" placeholder="${def.title}" @click="${(e) => e.stopPropagation()}"/>
                    `)}
                    ${(def.sort ? html`
                        <div class="arrow-${def.sortDirection}"></div>
                    ` : html``)}
             </th>
        `);
    }

    isAnyDataSelected() {
        return this.data.map(r => r.selected).filter(s => s).length > 0
    }

    getCurrentData(data) {
        const sortDefinitions = this.definition.filter(d => d.sort === true && d.sortDirection !== 'none');
        const sortDef = (sortDefinitions.length > 0 ? sortDefinitions[0] : undefined);
        const filterDefinitions = this.definition.filter(d => d.filter === true && d.filterValue !== undefined && d.filterValue.length > 0);

        let result = data;
        if (filterDefinitions.length > 0) {
            result = result.filter((row) => filterDefinitions.map(def => row[def.path].indexOf(def.filterValue) > -1).filter(v => v === true).length > 0);
        }
        if (sortDef !== undefined) {
            result = result.sort((a,b) => (sortDef.sortDirection === 'asc' ? 1 : -1) * a[sortDef.path].localeCompare(b[sortDef.path]));
        }

        return result;
    }
    sortBy(def) {
        if (def.sort === true) {
            const newSortDirection = (def.sortDirection === 'asc' ? 'dsc' : (def.sortDirection === 'dsc' ? 'none' : 'asc'));

            this.definition.forEach(d => d.sortDirection = (d.path === def.path ? newSortDirection : 'none'));

            this.displayData = this.getCurrentData(this.data);

            // console.log(`Sort by ${def.path}, direction is ${def.sortDirection}`);
            // if (def.sortDirection !== 'none') {
            //     this.data = this.data.sort((a, b) => (def.sortDirection === 'asc' ? 1 : -1) * a[def.path].localeCompare(b[def.path]));
            //     console.log('SORTED DATA: ', this.data);
            // }

            this.requestUpdate().then(() => {
                console.log('Data needs to be resorted.');
            });
        }
    }
});
