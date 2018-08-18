[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)

# NumeroUno - Numbers Service
Everything that has to do with numbers

### Installation
You need to have an AWS account and have finished setting up your [Provider Credentials].

```sh
$ npm install -g serverless
$ cd numbers
$ npm i
```

### Run the app
Go to project folder and type:

```sh
$ cd numbers
$ sls deploy
```

### API
#### Create a number:

```sh
$ curl -X POST {some hostname...}/numbers 
-d '{
    "number":"44440008",
    "block":"4444",
    "country":"65"
}'
```

##### Parameters

| Name | Type | Description |
|---|---|---|
| number | String | Number to add |
| block | String | Number block code |
| country | String | The country code |

#### Read a number:

```sh
$ curl -X GET {some hostname...}/numbers/:number 
```

##### Parameters

| Name | Type | Description |
|---|---|---|
| number | String | Number to read |

#### List numbers:
List default limit is 2
```sh
$ curl -X GET {some hostname...}/numbers 
```

List limit increased to 4
```sh
$ curl -X GET {some hostname...}/numbers?limit=4 
```

List limit is set to 1 and available parameter is set to false
```sh
$ curl -X GET {some hostname...}/numbers?limit=1&available=false
```

List limit is set to 1 and block parameter is set to 7777
```sh
$ curl -X GET {some hostname...}/numbers?limit=1&block=7777
```

List limit is set to 1 and block parameter is set to 7777
```sh
$ curl -X GET {some hostname...}/numbers?limit=1&block=7777
```

##### Parameters

| Name | Type | Description |
|---|---|---|
| number | String | Number to read |

#### Update a number:

```sh
$ curl -X PUT {some hostname...}/numbers/:number 
-d '{
    "number":"44440008",
    "block":"4444",
    "country":"65"
}'

```

##### Parameters

| Name | Type | Description |
|---|---|---|
| number | String | Number to update |

#### Delete a number:

```sh
$ curl -X DELETE {some hostname...}/numbers/:number 
```

##### Parameters

| Name | Type | Description |
|---|---|---|
| number | String | Number to delete |

#### Terminate a number:
This automatically makes available parameter = false

```sh
$ curl -X POST {some hostname...}/terminate/numbers 
```

##### Parameters

| Name | Type | Description |
|---|---|---|
| number | String | Number to terminate |

### LIVE endpoints
Dev Endpoint: 
[https://v83vzzjgt3.execute-api.ap-southeast-1.amazonaws.com/dev/numbers]

Prod Endpoint: 
[https://eakqwv9ip3.execute-api.ap-southeast-1.amazonaws.com/prod/numbers]


[Provider Credentials]: <https://www.youtube.com/watch?v=HSd9uYj2LJA>
[https://v83vzzjgt3.execute-api.ap-southeast-1.amazonaws.com/dev/numbers]:<https://v83vzzjgt3.execute-api.ap-southeast-1.amazonaws.com/dev/numbers>
[https://eakqwv9ip3.execute-api.ap-southeast-1.amazonaws.com/prod/numbers]:<https://eakqwv9ip3.execute-api.ap-southeast-1.amazonaws.com/prod/numbers>