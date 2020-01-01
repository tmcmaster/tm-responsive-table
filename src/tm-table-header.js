import {css, LitElement} from 'lit-element';
import {html} from 'lit-html';

window.customElements.define('tm-table-header', class extends LitElement {

    // noinspection JSUnusedGlobalSymbols
    static get properties() {
        return {
            path: {type: String},
            title: {type: String},
            filter: {type: Boolean},
            sort: {type: Boolean},
            sortValue: {type: String},
            filterValue: {type: String}
        }
    }

    constructor() {
        super();
        this.path = undefined;
        this.title = '';
        this.filter = false;
        this.sort = false;
        this.sortValue = 'none';
        this.filterValue = '';
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
    }

    // noinspection JSUnusedGlobalSymbols
    render() {
        const {title, filter, sort, sortValue, filterValue, path} = this;
        console.log(`TM-TABLE-HEADING: render: path(${path}) sort(${sortValue}) filter(${filterValue})`);
        return html`
            <div class="main"  @click="${() => this.sortChanged()}">
                ${(filter === true ? html`
                    <input class="filter"
                            style="width:${(sort === true ? 80 : 90)}%"
                            value="${filterValue}"
                            placeholder="${title}" 
                            @click="${(e) => e.stopPropagation()}"
                            @keydown="${debounce((e) => this.filterChanged(e), 500)}"/>
                ` : html`
                    <span class="title">${title}</span>
                `)}
                ${(sort === true ? html`
                    <div class="sort arrow-${sortValue}"></div>
                ` : html``)}
            </div>
        `;
    }

    filterChanged(e) {
        const {path} = this;
        const value = e.path[0].value;
        this.filterValue = value;
        console.log(`NEW FILTER: Path(${path}), Value(${value})`, this.filterValue);
        this.dispatchEvent(new CustomEvent('filter-changed', {
            detail: {path: path, value: this.filterValue},
            bubbles: true, composed: true
        }));
    }

    sortChanged() {
        const {sort} = this;
        if (sort) {
            const {path, sortValue} = this;
            this.sortValue = (sortValue === 'none' ? 'asc' : (sortValue === 'asc' ? 'dsc' : 'none'));
            console.log(`NEW SORT: Path(${path}), Value(${sortValue})`, this.sortValue);
            this.dispatchEvent(new CustomEvent('sort-changed', {
                detail: {path: path, value: this.sortValue},
                bubbles: true, composed: true
            }));
        }
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
