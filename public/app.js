var state = {},
poster = (url, obj, cb) => $.post(
  url, JSON.stringify(obj), res => cb(JSON.parse(res))
),

randomId = () =>
  [1, 1].map(() =>
    Math.random().toString(36).slice(2)
  ).join(''),

makeModal = name => m('.modal',
  {class: state[name] && 'is-active'},
  m('.modal-background'),
  m('.modal-content', state[name]),
  m('.modal-close.is-large', {onclick: () =>
    [state[name] = null, m.redraw()]
  })
)

m.mount(document.body, {view: () => m('.container', m('.content',
  m('h1', 'Deno CRUD'),
  m('.buttons',
    m('.button.is-primary', {
      onclick: () => state.modalGetCollection = m('.box',
        m(autoForm({
          id: 'getCollection',
          schema: {
            dbName: {type: String, label: 'Database Name'},
            collName: {type: String, label: 'Collection Name'},
            project: {
              type: String, optional: true, label: 'Projection',
              autoform: {placeholder: 'Ex: {"age": {"$gte": 20, "$lte": 35}}'}
            }
          },
          doc: state.target,
          action: doc => [
            poster('dbCall', {
              method: 'get', ...doc
            }, res => [
              state.target = doc,
              state.collData = res.data,
              state.modalGetCollection = null,
              m.redraw()
            ])
          ]
        }))
      )
    }, 'Get Collection'),
    state.collData && m('.button.is-success', {
      onclick: () => poster('dbCall', {
        method: 'get', ...state.target
      }, res => [
        state.collData = res.data,
        m.redraw()
      ]),
    }, 'Refresh'),
    state.collData && m('.button.is-info', {
      onclick: () => state.modalAdd = m('.box',
        m(autoForm({
          id: 'addItem',
          schema: {content: {
            type: String, autoform: {type: 'textarea', rows: 18}
          }},
          action: doc => [
            poster('dbCall', {
              method: 'add', ...state.target,
              doc: _.merge(JSON.parse(doc.content), {_id: randomId()})
            }, console.log),
            state.modalAdd = null, m.redraw()
          ]
        }))
      )
    }, 'Add')
  ),
  state.collData && m('.control.is-expanded',
    m('input.input.is-fullwidth', {
      type: 'text', placeholder: 'Search by query, Ex: {"_id": "abc123"}',
      onkeypress: e => [
        e.redraw = false,
        e.key === 'Enter' && [
          state.searchResults = state.collData.filter(
            sift.default(JSON.parse(e.target.value))
          )
        ],
        m.redraw()
      ]
    })
  ),
  makeModal('modalGetCollection'),
  makeModal('modalItem'),
  makeModal('modalAdd'),
  state.collData && m('table.table.is-striped',
    m('thead', m('tr', m('th', '#'), m('th', 'Document'))),
    m('tbody', (state.searchResults || state.collData || []).map((i, j) => m('tr',
      {
        ondblclick: () => state.modalItem = m('.box',
          m(autoForm({
            id: 'updateItem',
            schema:{ content: {
              type: String, autoform: {type: 'textarea', rows: 18}
            }},
            doc: {content: JSON.stringify(i, null, 4)},
            action: doc => [
              poster('dbCall', {
                method: 'update', ...state.target,
                doc: JSON.parse(doc.content)
              }, console.log),
              state.modalItem = null, m.redraw()
            ],
            submit: {value: 'Update', class: 'is-warning'}
          })),
          m('.button.is-danger', {
            ondblclick: () => [
              poster('dbCall', {
                method: 'remove', _id: i._id,
                ...state.target
              }, console.log),
              state.modalItem = null, m.redraw()
            ]
          }, 'Delete')
        )
      },
      m('td', j+1),
      m('td', JSON.stringify(i).substring(0, 150)+' ...')
    )))
  )
))})
