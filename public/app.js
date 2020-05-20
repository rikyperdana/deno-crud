const poster = (url, obj, cb) => $.post(
  url, JSON.stringify(obj), res => cb(JSON.parse(res))
)

m.mount(document.body, {view: () => m('.content',
  {oncreate: () => poster('/test', {b: 2}, console.log)},
  m('h1', 'Hello Deno')
)})
