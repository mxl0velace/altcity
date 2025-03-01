/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4078160933")

  // add field
  collection.fields.addAt(7, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_823787363",
    "hidden": false,
    "id": "relation725025994",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "cardlink",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4078160933")

  // remove field
  collection.fields.removeById("relation725025994")

  return app.save(collection)
})
