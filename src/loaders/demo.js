/* global window */

import './main'

const { document } = window
const { createElement, getElementById } = document
const spokes = window._spokes

/*
    Register lifecycles
*/

window.dataLayer = []

/*
    Demo subscribing to lifecycle event
*/

spokes.when('Page', 'QueryStringParsed').then(({ value }) => console.log('DEMO: lifecycle loaded Page:QueryStringParsed:', value))

// Demo subscribing to pub/sub event, specifically a state change for a specific value

spokes.subscribe('StateChanged', ({ key }) => {
  if (key === 'QueryString') {
    spokes.getState('QueryString').pairs().forEach(pair => {
      const [key, values] = pair
      values.forEach(value => console.log('DEMO: [QueryString]', key, '=>', value))
    })
  }
})

/*
    Demo output of all events published on page
*/

spokes.subscribeAll((payload) => {
  const { topic, key, value } = payload.value
  const html = []

  html.push('<td><strong>' + topic + '</strong></td>')
  html.push('<td><strong>' + key + '</strong></td>')
  html.push('<td>')

  if (value === undefined || value === null) {
    html.push(value + '')
  } else if (['String', 'Number', 'Array'].indexOf(value.constructor.name) !== -1) {
    html.push(value)
  } else if (value.serialize) {
    html.push(JSON.stringify(value.serialize()))
  } else if (value.toString() === '[object Object]') {
    html.push(JSON.stringify(value))
  } else if (value.topic) {
    html.push('<em>' + value.constructor.name + '(topic: ' + value.topic.name + ')</em>')
  } else if (value.name) {
    html.push('<em>' + value.constructor.name + '(name: ' + value.name + ')</em>')
  } else {
    html.push('<em>[' + value.constructor.name + ']</em>')
  }

  html.push('</td>')

  const tr = createElement('tr')
  tr.innerHTML = html.join('')

  getElementById('list').appendChild(tr)
})
