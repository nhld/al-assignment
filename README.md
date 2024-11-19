#### Install dependencies:

```sh
yarn

```

#### Execute runner script:

```sh
sh runner <hotel_ids> <destination_ids>

```

`<hotel_ids>`: list of ids separate by `,`.
`<destination_ids>`: list of destination ids separate by `,`.

> [!NOTE]
> These lists do not need to be the same size.
>
> If no argument is passed, the default values `none none` will be used.

#### Passing arguments example:

#### 1. Fetch 1 hotel

Input:

```sh
sh runner iJhz 5432
```

Output: return 1 hotel with `hotel_id = iJhz` and `destination_id = 5432`.

Input:

```sh
sh runner iJhz 1122
```

Output: nothing since no hotel matches the given arguments.

#### 2. Fetch all hotels

Input:

```sh
sh runner || sh runner none none || sh runner iJhz none || sh runner none 5432
```

Output: return all hotels.

#### 3. Fetch more than 2 hotels

Input:

```sh
sh runner iJhz,f8c9 5432,1122 || sh runner iJhz,SjyX 5432
```

Output: return 2 hotels with matching `hotel_ids` and `destination_ids` respectively.

Input:

```sh
sh runner iJhz,f8c9,SjyX 5432,1122
```

Output: return 3 hotels, since `iJhz` and `SjyX` share the same `destination_id = 5432`.
