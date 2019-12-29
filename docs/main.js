import {html, render} from "./web_modules/lit-html.js";

let sites = {
    'src': 'https://github.com/tmcmaster/template-web-component',
    'pika': 'https://www.pika.dev/npm/@wonkytech/template-web-component',
    'npm': 'https://www.npmjs.com/package/@wonkytech/template-web-component',
    'docs': 'https://github.com/tmcmaster/template-web-component#readme'
};

render(html`
    <style>
        body {
          padding: 0;
          margin: 0;
        } 
    </style>
    <tm-examples heading="template-web-component" .sites="${sites}">
        <section title="Example">
            <template-web-component></template-web-component>
        </section>
    </tm-examples>
`, document.querySelector('body'));