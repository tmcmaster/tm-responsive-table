import {css, LitElement} from 'lit-element';
import {html} from 'lit-html';

window.customElements.define('tm-table-data', class extends LitElement {

    // noinspection JSUnusedGlobalSymbols
    static get properties() {
        return {
            data: {type: String},
            type: {type: String},
            min: {type: Number},
            max: {type: Number},
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
        this.type = 'text';
        this.min = 1;
        this.max = 10;
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
        //console.log('TM-TABLE-DATA - attribute change: ', name, oldval, newval);
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
    }

    // noinspection JSUnusedGlobalSymbols
    render() {
        const {data, editable, editing, type, min, max} = this;
        const action = (editable ? (type === 'slider' ? 'edit-slider' : (editing ? 'edit-text' : 'text')) : 'text');
        return (action === 'edit-slider' ? html`
             <div class="slider">
                 <paper-slider id="input" value="${data}" min="${min}" max="${max}" step="1" snaps
                    @value-change="${debounce(() => this.sliderChanged(), 500)}"
                    @blur="${() => this.publishChange()}"></paper-slider>
             </div>
        ` : (action === 'edit-text' ? html`
             <input id="input" value="${data}" type="${type}" min="${min}" max="${max}"
                    @keyup="${e => this.keyPressed(e)}"
                    @keydown="${debounce(e => this.valueChanged(e), 500)}"
                    @blur="${() => this.publishChange()}"/>
        ` : html`
             <div @click="${e => this.dataSelected(e)}">${data.length === 0 ? '' : data}</div>
        `));
    }
    // noinspection JSUnusedGlobalSymbols
    renderHold() {
        const {data, editable, editing, type} = this;
        return (editable && editing ? html`
            <input id="input" value="${data}" type="${type}"
                @keyup="${(e) => this.keyPressed(e)}"
                @keydown="${debounce((e) => this.valueChanged(e), 500)}"
                @blur="${() => this.publishChange()}"/>
        ` : html `
            <div @click="${(e) => this.dataSelected(e)}">${(data.length === 0 ? '' : data)}</div>
        `);
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
                        input.setSelectionRange(0,input.value.length)
                    }
                }
            }, 200);
        } else {
            this.dispatchEvent(new CustomEvent('data-selected'));
        }

    }

    sliderChanged() {
        //console.log('TM-TABLE-DATA - sliderChanged');
        const input = this.shadowRoot.getElementById('input');
        if (input) {
            this.changed = true;
            this.data = input.value;
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
            const input = this.shadowRoot.getElementById('input');
            if (input && this.data !== input.value) {
                this.data = input.value;
            }
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