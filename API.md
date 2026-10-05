# API overlook

---
## Collection
Request Path:
`/api/collection/[endpoint]` 

#### add
Type: **POST**
Add a game to the collection of a user. The user is the current session user.

Each user can only add a game once.
| Name | Type | Required | Description |
|------|:------:|:----------:|:-------------:|
|gameId|int|True|The IGDB ID of the game|

#### get
Type: **POST**
Query games in collection. If column not defined, it will query everything in that column.
| Name | Type | Required | Description |
|------|:------:|:----------:|:-------------:|
|userId|string|False|The ID of a user|
|gameId|int|False|The IGDB ID of the game|

#### remove
Type: **POST**
Remove game from collection. User session must be active.
| Name | Type | Required | Description |
|------|:------:|:----------:|:-------------:|
|gameId|int|True|The IGDB ID of the game|

---
## User
Request path:
`/api/user/[endpoint]`

#### get
Type: **POST**
Get user. If column not defined, it will query everything in that column.

Returned data is very restricted.
| Name | Type | Required | Description |
|------|------|----------|-------------|
|userId|string|true|The user ID|

#### getCurrent
Type: **GET**
Get current user.