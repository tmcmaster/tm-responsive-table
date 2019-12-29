import {html, render} from "./web_modules/lit-html.js";

let sites = {
    'src': 'https://github.com/tmcmaster/tm-responsive-table',
    'pika': 'https://www.pika.dev/npm/@wonkytech/tm-responsive-table',
    'npm': 'https://www.npmjs.com/package/@wonkytech/tm-responsive-table',
    'docs': 'https://github.com/tmcmaster/tm-responsive-table#readme'
};

const data = [
    {uid: 'user-001', firstName: 'Mrs', lastName: 'One', email: 'one@test.com'},
    {uid: 'user-002', firstName: 'Mr', lastName: 'Two', email: 'two@test.com', selected: true},
    {uid: 'user-003', firstName: 'Mrs', lastName: 'Three', email: 'three@test.com', selected: true},
    {uid: 'user-004', firstName: 'Mr', lastName: 'Four', email: 'four@test.com', selected: true},
    {uid: 'user-005', firstName: 'Miss', lastName: 'Five', email: 'five@test.com'},
    {uid: 'user-006', firstName: 'Miss', lastName: 'Six', email: 'six@test.com'},
    {uid: 'user-007', firstName: 'Mrs', lastName: 'Seven', email: 'seven@test.com'},
    {uid: 'user-008', firstName: 'Mr', lastName: 'Eight', email: 'eight@test.com'}
];

render(html`
    <style>
        body {
          padding: 0;
          margin: 0;
        } 
    </style>
    <tm-examples heading="tm-responsive-table" .sites="${sites}">
        <section title="Example">
            <script>
                const data = [
                    {uid: 'user-001', firstName: 'Mrs', lastName: 'One', email: 'one@test.com'},
                    {uid: 'user-002', firstName: 'Mr', lastName: 'Two', email: 'two@test.com', selected: true},
                    {uid: 'user-003', firstName: 'Mrs', lastName: 'Three', email: 'three@test.com', selected: true},
                    {uid: 'user-004', firstName: 'Mr', lastName: 'Four', email: 'four@test.com', selected: true},
                    {uid: 'user-005', firstName: 'Miss', lastName: 'Five', email: 'five@test.com'},
                    {uid: 'user-006', firstName: 'Miss', lastName: 'Six', email: 'six@test.com'},
                    {uid: 'user-007', firstName: 'Mrs', lastName: 'Seven', email: 'seven@test.com'},
                    {uid: 'user-008', firstName: 'Mr', lastName: 'Eight', email: 'eight@test.com'}
                ];
            </script>
            <tm-responsive-table src="./data/test.json" selectable .data="${data}">
                <template>
                    <th name="uid">UID</th>
                    <th name="firstName" sort="asc">First Name</th>
                    <th name="lastName" sort filter>Last Name</th>
                    <th name="email" sort filter>Email Address</th>
                </template>
            </tm-responsive-table>
        </section>
    </tm-examples>
`, document.querySelector('body'));