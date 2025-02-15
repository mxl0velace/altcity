/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3034698781")

  // add field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_4078160933",
    "hidden": false,
    "id": "relation2830673147",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "valueCard",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3794948844",
    "hidden": false,
    "id": "relation3139355209",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "valueCollection",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_910879689",
    "hidden": false,
    "id": "relation1936456198",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "valueArtist",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3034698781")

  // remove field
  collection.fields.removeById("relation2830673147")

  // remove field
  collection.fields.removeById("relation3139355209")

  // remove field
  collection.fields.removeById("relation1936456198")

  return app.save(collection)
})
