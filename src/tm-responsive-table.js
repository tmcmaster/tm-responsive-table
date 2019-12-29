import {html} from 'lit-html';
import {LitElement, css} from 'lit-element';

window.customElements.define('tm-responsive-table', class extends LitElement {

    // noinspection JSUnusedGlobalSymbols
    static get properties() {
        return {
            data: {type: Array},
            definition: {type: Array},
            selectable: {type: Boolean}
        }
    }

    constructor() {
        super();
        this.definition = [];
        this.data = [];
        this.selectable = false;
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
            {path: 'firstName', title: 'First Name', width: '20%', sort: false, filter: false},
            {path: 'lastName', title: 'Last Name', width: '20%', sort: false, filter: false},
            {path: 'email', title: 'Email Address', width: '40%', sort: false, filter: false}
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
        `;
    }

    // noinspection JSUnusedGlobalSymbols
    render() {
        const {selectable, definition, data} = this;
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
                                ${this.definition.map(def => (def.path === 'selected' ? html`
                                    <td width="${def.width}"><input type="checkbox" .checked="${data.map(r => r.selected).filter(s => s).length > 0}"/></td>
                                ` : html`
                                    <td width="${def.width}">${def.title}</td>
                                `))}
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
                            ${data.map(r => html`
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
});
