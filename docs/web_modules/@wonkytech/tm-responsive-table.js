import { L as LitElement, c as css, h as html } from '../common/lit-element-54503d46.js';

window.customElements.define('tm-responsive-table', class extends LitElement {
  // noinspection JSUnusedGlobalSymbols
  static get properties() {
    return {
      heading: {
        type: String
      }
    };
  }

  constructor() {
    super();
    this.heading = 'Hello World!';
  }

  static get styles() {
    // language=CSS
    return css`
            :host {
              display: inline-block;
            }
            h2 {
                color: gray;
            }
        `;
  } // noinspection JSUnusedGlobalSymbols


  render() {
    return html`
          <h2>${this.heading}</h2>
        `;
  }

});
