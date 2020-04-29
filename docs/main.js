import {html, render} from "./web_modules/lit-html.js";

import './web_modules/@wonkytech/tm-examples.js';

import {loadTheme} from './web_modules/@wonkytech/tm-script-loader.js';

let sites = {
    'src': 'https://github.com/tmcmaster/tm-responsive-table',
    'pika': 'https://www.pika.dev/npm/@wonkytech/tm-responsive-table',
    'npm': 'https://www.npmjs.com/package/@wonkytech/tm-responsive-table',
    'docs': 'https://github.com/tmcmaster/tm-responsive-table#readme'
};

const fileDefinition = [
    {path: 'uid', title: 'UID', width: '10%', sort: false, filter: false, edit: true, default: 'user-00'},
    {path: 'firstName', title: 'First Name', width: '20%', sort: true, filter: false, edit: true},
    {path: 'lastName', title: 'Last Name', width: '20%', sort: true, filter: true},
    {path: 'age', title: 'Age', width: '10%', sort: false, filter: false, type: 'slider', min:1, max: 5, edit: true, default: 10},
    {path: 'email', title: 'Email Address', width: '30%', sort: false, filter: true}
];

const NUMBER_OF_TEST_ROWS = 50;
const TEST_FIELD_NAMES = ['uid','a','b','c','d','e','f','g','h'];

const definition = TEST_FIELD_NAMES.map(k => {
    return {path: k, title: k.toUpperCase(), width: '10%', sort: true, filter: true}
});

const data = Array(NUMBER_OF_TEST_ROWS).fill(0).map((n,i) => {
    const row = {};
    definition.map(row => row.path).forEach(p => row[p] = p + '-' + i);
    return row;
});

loadTheme('blue');

render(html`
    <style>
        body {
          padding: 0;
          margin: 0;
        } 
        
        html {
            --tm-responsive-table-header-background: var(#007cff);
        }
    </style>
    <tm-examples heading="tm-responsive-table" .sites="${sites}">
        <section title="Generated Data">
            <style>
                 tm-responsive-table.a {
                    width: 100%;
                    height: 250px;
                }
            </style>
            <tm-responsive-table class="a" .data="${data}" .definition="${definition}"></tm-responsive-table>
        </section>
        <section title="Data From File">
            <style>
                 tm-responsive-table.b {
                    width: 100%;
                }
            </style>
            <script>
                const fileDefinition = [
                    {path: 'uid', title: 'UID', width: '10%', sort: false, filter: false, edit: true},
                    {path: 'firstName', title: 'First Name', width: '20%', sort: true, filter: false, edit: true},
                    {path: 'lastName', title: 'Last Name', width: '20%', sort: true, filter: true,},
                    {path: 'email', title: 'Email Address', width: '40%', sort: false, filter: true}
                ];
            </script>
            <tm-responsive-table class="b" src="./data/test.json" .definition="${fileDefinition}" selectable editable
                    @added="${(e) => console.log('Record was added: ', e.detail)}"
                    @deleted="${(e) => console.log('Records were deleted: ', e.detail)}"
                    @value-changed="${(e) => console.log('Value Changed', e.detail)}"
                    @selection-changed="${(e) => console.log('Selection changed.', e.path[0].getSelected())}"></tm-responsive-table>
        </section>
        <section title="Fixed Container">
             <style>
                div.cc {
                    max-width: 800px;
                    max-height: 50vh;
                    display: flex;
                    flex-direction: column;
                }
                tm-responsive-table.c {
                    max-width: 100%;
                    max-height: 100%;
                }
            </style>
            <div class="cc">
                <tm-responsive-table class="c" .data="${data}" .definition="${definition}" selectable></tm-responsive-table>
            </div>
        </section>
        <section title="Expandable Container">
            <style>
                div.d {
                    width: 100%;
                    height: 100%;
                }
            </style>
            <div class="d">
                <tm-responsive-table .data="${data}" .definition="${definition}" selectable></tm-responsive-table>        
            </div>
        </section>
        <section title="No Column Headings">
            <style>
                tm-responsive-table {
                    width: 100%;
                }
            </style>
            <tm-responsive-table .data="${data}" .definition="${definition}" noHeadings></tm-responsive-table>        
        </section>
        <!--section title="Heading">
            <style>
                tm-table-header.a {
                    border: solid lightgrey 1px;
                }
            </style>
            <div>
                <tm-table-header class="a" path="firstName" title="First Name" sort filter
                    @filter-changed="${(e) => console.log('BBBB', e.detail)}"
                    @sort-changed="${(e) => console.log('AAAAAA', e.detail)}"></tm-table-header>            
            </div>
        </section-->

    </tm-examples>
`, document.querySelector('body'));