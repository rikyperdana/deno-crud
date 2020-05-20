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
  m('.button.is-primary', {
    onclick: () => state.modalGetCollection = m('.box',
      m(autoForm({
        id: 'getCollection', schema: {
          dbName: {type: String, label: 'Database Name'},
          collName: {type: String, label: 'Collection Name'}
        }, action: doc => [
          poster('dbCall', doc, res => [
            state.collData = res.data,
            m.redraw()
          ]),
          state.modalGetCollection = null
        ]
      }))
    )
  }, 'Get Collection'),
  makeModal('modalGetCollection'),
  m('table.table',
    m('thead', m('tr', m('th', '_id'))),
    m('tbody', (state.collData || []).map(i => m('tr',
      m('td', i._id)
    )))
  )
))})
