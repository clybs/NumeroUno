[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)

# NumeroUno - Numbers Service
Everything that has to do with numbers

### Architecture
![NumeroUno - Numbers](https://user-images.githubusercontent.com/4023187/44296159-367d5d80-a2eb-11e8-9519-3e6078044109.png)

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
$ curl -X POST {some hostname...}/numbers/terminate/:number
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

### Dev Notes
- Went with serverless because it manages my code as well as my infrastructure
- Deployed in Singapore as this is the closest to client (ap-southeast-1)
- Auto scaling is enabled but minimal. See serverless.yml file for reference.
- Authentication is left to another service
- Available and Blocked properties are indexed for faster retrieval
- Blocks and numbers are string because a number can start in 0; i.e. 0918
- Limited features due to time constraints i.e. CI/CD, automated tests, code coverage, etc.

[Provider Credentials]: <https://www.youtube.com/watch?v=HSd9uYj2LJA>
[https://v83vzzjgt3.execute-api.ap-southeast-1.amazonaws.com/dev/numbers]:<https://v83vzzjgt3.execute-api.ap-southeast-1.amazonaws.com/dev/numbers>
[https://eakqwv9ip3.execute-api.ap-southeast-1.amazonaws.com/prod/numbers]:<https://eakqwv9ip3.execute-api.ap-southeast-1.amazonaws.com/prod/numbers>