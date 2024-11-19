#### Install deps:

```sh
yarn

```

#### Execute runner script:

```sh
sh runner <hotel_ids> <destinations_ids>

```

##### Params example:

##### 1. Fetch 1 hotel

Input:

```sh
sh runner iJhz 5432
```

Output: return 1 hotel with `hotel_id = iJhz` and `destination_id = 5432`.

Input:

```sh
sh runner iJhz 1122
```

Output: nothing since no hotel matches the given params.

##### 2. Fetch all hotels

Input:

```sh
sh runner || sh runner none none || sh runner iJhz none || sh runner none 5432
```

Output: return all hotels.

##### 3. Fetch more than 2 hotels

Input:

```sh
sh runner iJhz,f8c9 5432,1122
```

Output: return 2 hotels with matching `hotel_ids` and `destination_ids` respectively.

Input:

```sh
sh runner iJhz,f8c9,Sjyx 5432,1122 || sh runner iJhz,f8c9 5432,1122
```

Output: return 3 hotels since `iJhz` and `Sjyx` share the same `destination_id = 5432`
