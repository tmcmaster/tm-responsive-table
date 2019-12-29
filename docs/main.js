import {html, render} from "./web_modules/lit-html.js";

let sites = {
    'src': 'https://github.com/tmcmaster/tm-responsive-table',
    'pika': 'https://www.pika.dev/npm/@wonkytech/tm-responsive-table',
    'npm': 'https://www.npmjs.com/package/@wonkytech/tm-responsive-table',
    'docs': 'https://github.com/tmcmaster/tm-responsive-table#readme'
};

render(html`
    <style>
        body {
          padding: 0;
          margin: 0;
        } 
    </style>
    <tm-examples heading="tm-responsive-table" .sites="${sites}">
        <section title="Example">
            <tm-responsive-table></tm-responsive-table>
        </section>
    </tm-examples>
`, document.querySelector('body'));