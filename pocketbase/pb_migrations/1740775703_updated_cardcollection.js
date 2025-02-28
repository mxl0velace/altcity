/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3794948844")

  // update collection data
  unmarshal({
    "deleteRule": " @request.auth.id = owner.id",
    "updateRule": "@request.auth.id != \"\" && (owner.id = @request.auth.id || editors.id ?= @request.auth.id) || (@request.body.addEditors:isset = false && @request.body.cards:isset = false && @request.body.owner:isset = false && @request.body.name:isset= false)"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3794948844")

  // update collection data
  unmarshal({
    "deleteRule": "@request.auth.id = owner.id",
    "updateRule": "@request.auth.id != \"\" && (owner.id = @request.auth.id || editors.id ?= @request.auth.id) || (@request.body.addEditors:isset = false && @request.body.cards:isset = false && @request.body.owner:isset = false)"
  }, collection)

  return app.save(collection)
})
