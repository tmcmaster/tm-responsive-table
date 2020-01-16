import {css, LitElement} from 'lit-element';
import {html} from 'lit-html';

window.customElements.define('tm-table-data', class extends LitElement {

    // noinspection JSUnusedGlobalSymbols
    static get properties() {
        return {
            data: {type: String},
            editable: {type: Boolean},
            editing: {type: Boolean},
            changed: {type: Boolean},
            input: {type: Object}
        }
    }

    constructor() {
        super();
        this.editable = false;
        this.changed = false;
        this.editing = false;
    }

    // noinspection JSUnusedGlobalSymbols
    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
    }


    // noinspection JSUnusedGlobalSymbols
    updated(_changedProperties) {
        super.updated(_changedProperties);
    }

    // noinspection JSUnusedGlobalSymbols
    attributeChangedCallback(name, oldval, newval) {
        console.log('TM-TABLE-DATA - attribute change: ', name, oldval, newval);
        super.attributeChangedCallback(name, oldval, newval);
    }

    // noinspection JSUnusedGlobalSymbols
    connectedCallback() {
        super.connectedCallback();
    }

    // noinspection JSUnusedGlobalSymbols
    disconnectedCallback() {
        super.disconnectedCallback()
    }

    // noinspection JSUnusedGlobalSymbols
    static get styles() {
        // language=CSS
        return css`
            :host {
                width: 100%;
                height: 100%;
            }
            input,div {
                box-sizing: border-box;
                width: 100%;
                height: 100%;
            }
        `;
    }

    // noinspection JSUnusedGlobalSymbols
    render() {
        const {data, editable, editing} = this;
        return (editable && editing ? html`
            <input id="input" value="${data}" 
                @keyup="${(e) => this.keyPressed(e)}"
                @keydown="${debounce((e) => this.valueChanged(e), 500)}"
                @blur="${() => this.publishChange()}"/>
        ` : html `
            <div @click="${(e) => this.startEditing(e)}">${data}</div>
        `);
    }

    startEditing(e) {
        //console.log('TM-TABLE-DATA - startEditing');
        e.stopPropagation();
        this.editing = true;
        setTimeout(() => {
            const input = this.shadowRoot.getElementById('input');
            if (input) {
                input.focus();
                input.setSelectionRange(0,input.value.length)
            }
        }, 200);
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
            this.dispatchEvent(new CustomEvent('value-changed', {detail: this.data}));
        }
        this.editing = false;
        this.changed = false;
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