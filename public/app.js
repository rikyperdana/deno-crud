var state = {},
poster = (url, obj, cb) => $.post(
  url, JSON.stringify(obj), res => cb(JSON.parse(res))
),

makeModal = name => m('.modal',
  {class: state[name] && 'is-active'},
  m('.modal-background'),
  m('.modal-content', state[name]),
  m('.modal-close.is-large', {onclick: () =>
    [state[name] = null, m.redraw()]
  })
)

m.mount(document.body, {view: () => m('.container', m('.content',
  m('h1', 'Hello Deno'),
  m('.buttons',
    m('.button.is-primary', {
      onclick: () => state.modalGetCollection = m('.box',
        m(autoForm({
          id: 'getCollection',
          schema: {
            dbName: {type: String, label: 'Database Name'},
            collName: {type: String, label: 'Collection Name'}
          },
          doc: state.target,
          action: doc => [
            poster('dbCall', doc, res => [
              state.target = doc,
              state.collData = res.data,
              m.redraw()
            ]),
            state.modalGetCollection = null
          ]
        }))
      )
    }, 'Get Collection'),
    state.collData && m('.button.is-success', {
      onclick: () => console.log(state.target)
    }, 'Refresh')
  ),
  makeModal('modalGetCollection'),
  makeModal('modalItem'),
  m('table.table',
    m('thead', m('tr', m('th', '_id'), m('th', 'Preview'))),
    m('tbody', (state.collData || []).map(i => m('tr',
      {
        onclick: () => console.log(i),
        ondblclick: () => state.modalItem = m('.box',
          m(autoForm({
            id: 'updateItem',
            schema:{content: {type: String, autoform: {type: 'textarea'}}},
            doc: {content: JSON.stringify(i)},
            action: doc => [
              console.log(JSON.parse(doc.content)),
              state.modalItem = null, m.redraw()
            ],
            submit: {value: 'Update', class: 'is-warning'}
          }))
        )
      },
      m('td', i._id), m('td', JSON.stringify(i).substring(0, 100)+' ...')
    )))
  )
))})
