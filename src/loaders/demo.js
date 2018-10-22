import window from '../dom/window';
import document from '../dom/document';
import debug from '../dom/debug';
import './main';

const spokes = window._spokes;

/*
    Register lifecycles
*/

window.dataLayer = [];

/*
    Demo subscribing to lifecycle event
*/

spokes.lifecycle('Page:QueryStringParsed').then(qs => debug('DEMO: lifecycle loaded Page:QueryStringParsed:', qs));

// Demo subscribing to pub/sub event, specifically a state change for a specific value

spokes.subscribe('StateChanged:QueryString', () => {
    spokes.getState('QueryString').pairs().forEach(pair => {
        const [key, values] = pair;
        values.forEach(value => debug('DEMO: [QueryString]', key, '=>', value));
    });
});

/*
    Demo output of all events published on page
*/

spokes.subscribeAll((eventName, ...payload) => {
    // remove subscription, which is passed to unsubscribe
    const subscription = payload.pop();
    const html = [];

    html.push('<td><strong>'+eventName+'</strong></td>');
    html.push('<td>');
    html.push(payload.map(value => {
        if (['String', 'Number', 'Array'].indexOf(value.constructor.name) != -1) {
            return value;
        } else if (value.serialize) {
            return  JSON.stringify(value.serialize());
        } else if (value.toString() === "[object Object]") {
            return JSON.stringify(value);
        } else if (value.topic) {
            return '<em>'+value.constructor.name + '(topic: ' + value.topic.name + ')</em>';
        } else if (value.name) {
            return '<em>'+value.constructor.name + '(name: ' + value.name + ')</em>';
        } else {
            return '<em>['+value.constructor.name + ']</em>';
        }
    }).join(', '));
    html.push('</td>');

    const tr = document.createElement('tr');
    tr.innerHTML = html.join('');

    document.getElementById('list').appendChild(tr);
})