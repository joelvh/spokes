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

spokes.when('Page', 'QueryStringParsed').then(({ data }) => debug('DEMO: lifecycle loaded Page:QueryStringParsed:', data));

// Demo subscribing to pub/sub event, specifically a state change for a specific value

spokes.subscribe('StateChanged', ({ event }) => {
  if (event == 'QueryString')  {
    spokes.getState('QueryString').pairs().forEach(pair => {
      const [key, values] = pair;
      values.forEach(value => debug('DEMO: [QueryString]', key, '=>', value));
    });
  }
});

/*
    Demo output of all events published on page
*/

spokes.subscribeAll((payload) => {
  const { topic, event, data } = payload.data;
  const html = [];

  html.push('<td><strong>' + topic + '</strong></td>');
  html.push('<td><strong>' + event + '</strong></td>');
  html.push('<td>');

  if (data === undefined || data === null) {
    html.push(data + '');
  } else if (['String', 'Number', 'Array'].indexOf(data.constructor.name) != -1) {
    html.push(data);
  } else if (data.serialize) {
    html.push(JSON.stringify(data.serialize()));
  } else if (data.toString() === "[object Object]") {
    html.push(JSON.stringify(data));
  } else if (data.topic) {
    html.push('<em>' + data.constructor.name + '(topic: ' + data.topic.name + ')</em>');
  } else if (data.name) {
    html.push('<em>' + data.constructor.name + '(name: ' + data.name + ')</em>');
  } else {
    html.push('<em>[' + data.constructor.name + ']</em>');
  }

  html.push('</td>');

  const tr = document.createElement('tr');
  tr.innerHTML = html.join('');

  document.getElementById('list').appendChild(tr);
})