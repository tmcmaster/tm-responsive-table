import {html, render} from "./web_modules/lit-html.js";

let sites = {
    'src': 'https://github.com/tmcmaster/tm-responsive-table',
    'pika': 'https://www.pika.dev/npm/@wonkytech/tm-responsive-table',
    'npm': 'https://www.npmjs.com/package/@wonkytech/tm-responsive-table',
    'docs': 'https://github.com/tmcmaster/tm-responsive-table#readme'
};

const data1 = [
    {uid: 'user-001', firstName: 'Mrs', lastName: 'One', email: 'one@test.com'},
    {uid: 'user-002', firstName: 'Mr', lastName: 'Two', email: 'two@test.com', selected: true},
    {uid: 'user-003', firstName: 'Mrs', lastName: 'Three', email: 'three@test.com', selected: true},
    {uid: 'user-004', firstName: 'Mr', lastName: 'Four', email: 'four@test.com', selected: true},
    {uid: 'user-005', firstName: 'Miss', lastName: 'Five', email: 'five@test.com'},
    {uid: 'user-006', firstName: 'Miss', lastName: 'Six', email: 'six@test.com'},
    {uid: 'user-007', firstName: 'Mrs', lastName: 'Seven', email: 'seven@test.com'},
    {uid: 'user-008', firstName: 'Mr', lastName: 'Eight', email: 'eight@test.com'}
];

const definition1 = [
    {path: 'uid', title: 'UID', width: '10%', sort: false, filter: false},
    {path: 'firstName', title: 'First Name', width: '20%', sort: true, filter: false},
    {path: 'lastName', title: 'Last Name', width: '20%', sort: true, filter: true,},
    {path: 'email', title: 'Email Address', width: '40%', sort: false, filter: true}
];

const definition2 = [
    {path: 'uid', title: 'UID', width: '10%', sort: false, filter: false},
    {path: 'firstName', title: 'First Name', width: '20%', sort: true, filter: false},
    {path: 'lastName', title: 'Last Name', width: '20%', sort: true, filter: true,},
    {path: 'email', title: 'Email Address', width: '40%', sort: false, filter: true}
];


render(html`
    <style>
        body {
          padding: 0;
          margin: 0;
        } 
    </style>
    <tm-examples heading="tm-responsive-table" .sites="${sites}">
        <section title="Pass in Data">
            <script>
                const data1 = [
                    {uid: 'user-001', firstName: 'Mrs', lastName: 'One', email: 'one@test.com'},
                    {uid: 'user-002', firstName: 'Mr', lastName: 'Two', email: 'two@test.com'},
                    {uid: 'user-003', firstName: 'Mrs', lastName: 'Three', email: 'three@test.com'},
                    {uid: 'user-004', firstName: 'Mr', lastName: 'Four', email: 'four@test.com'},
                    {uid: 'user-005', firstName: 'Miss', lastName: 'Five', email: 'five@test.com'},
                    {uid: 'user-006', firstName: 'Miss', lastName: 'Six', email: 'six@test.com'},
                    {uid: 'user-007', firstName: 'Mrs', lastName: 'Seven', email: 'seven@test.com'},
                    {uid: 'user-008', firstName: 'Mr', lastName: 'Eight', email: 'eight@test.com'}
                ];
                const definition1 = [
                    {path: 'uid', title: 'UID', width: '10%', sort: false, filter: false},
                    {path: 'firstName', title: 'First Name', width: '20%', sort: true, filter: false},
                    {path: 'lastName', title: 'Last Name', width: '20%', sort: true, filter: true,},
                    {path: 'email', title: 'Email Address', width: '40%', sort: false, filter: true}
                ];
            </script>
            <tm-responsive-table  .data="${data1}" .definition="${definition1}" selectable></tm-responsive-table>
        </section>
        <section title="Data From File">
            <script>
                const definition2 = [
                    {path: 'uid', title: 'UID', width: '10%', sort: false, filter: false},
                    {path: 'firstName', title: 'First Name', width: '20%', sort: true, filter: false},
                    {path: 'lastName', title: 'Last Name', width: '20%', sort: true, filter: true,},
                    {path: 'email', title: 'Email Address', width: '40%', sort: false, filter: true}
                ];
            </script>
            <tm-responsive-table src="./data/test.json" .definition="${definition2}" selectable></tm-responsive-table>
        </section>
    </tm-examples>
`, document.querySelector('body'));