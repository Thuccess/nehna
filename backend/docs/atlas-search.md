# MongoDB Atlas Search Indexes

Create in Atlas UI → Search → Create Search Index → JSON Editor.

## `businesses_search` on `businesses`

```json
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "name": { "type": "string", "analyzer": "lucene.english" },
      "description": { "type": "string", "analyzer": "lucene.english" },
      "category": { "type": "string" },
      "neighborhood": { "type": "string" },
      "address": { "type": "string" },
      "status": { "type": "token" }
    }
  }
}
```

## `products_search` on `products`

```json
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "name": { "type": "string", "analyzer": "lucene.english" },
      "description": { "type": "string", "analyzer": "lucene.english" },
      "category": { "type": "string" }
    }
  }
}
```

If indexes are missing, `/search` falls back to regex queries automatically.
