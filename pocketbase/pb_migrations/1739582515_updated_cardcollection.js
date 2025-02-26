/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3794948844")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id = @request.body.owner.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3794948844")

  // update collection data
  unmarshal({
    "createRule": null
  }, collection)

  return app.save(collection)
})
