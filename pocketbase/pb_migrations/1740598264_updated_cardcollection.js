/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3794948844")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "bool3928423259",
    "name": "addEditors",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3794948844")

  // remove field
  collection.fields.removeById("bool3928423259")

  return app.save(collection)
})
