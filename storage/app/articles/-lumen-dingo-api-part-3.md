---
title: Building APIs with dingo & lumen\: Database & Transformers - PART 2
tags: tag1, tag2
author: Lukas Oppermann
description: Learn how to build a php API with dingo & lumen: database & transformers.
---
# Building APIs with dingo & lumen: Transformers &
{$meta}

```php
return [
    'id' => $collection->id,
    'type' => $collection->type,
    'attributes' => [
        'page_id' => $collection->page_id,
        'position' => (int) $collection->position,
    ]
];
```
