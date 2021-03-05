# MOVIE API

Movie API that interacts with MongoDB. This API:

- uses an auth service for authentication
- uses OMDB API to gather specific information of a movie based on a title:
  - released
  - genre
  - director

---

## ENDPOINTS

- GET /movies
- POST /movies
- DELETE /movies
- GET /movie
- POST /auth/login

> All detailed information about the endpoints, payload and responses are in the `api-docs > swagger.yml`

---

## INSTALLATION

### Prerequisites

- docker
- docker-compose

### Run locally

1. clone this repository
2. configure the environmental variables in the .env file (`following the .env.example`)
3. make sure the auth service is running locally in your machine (`0.0.0.0:3080/auth`)
4. make sure the JWT_SECRET token provided in the environmental variable is the same used in the auth service
5. run the docker compose file

```
docker-compose up
```

The API is configured to run in the port 8080

### Rules

1. An authorization token is needed for GET, POST and DELETE endpoints
2. The token must be provided in each call as an Authorization Header

```
Bearer <token>
```

3. To get the token, you must use the /auth/login endpoint

```
basic user:
 username: 'basic-thomas'
 password: 'sR-_pcoow-27-6PAwCD8'

premium user:
 username: 'premium-jim'
 password: 'GBLtTyq3E_UNjFnpo9m6'

```

4. A basic user have a limit to create a total of 5 movies per month

### Others

- a github workflow actions is configured in a .yml file. This runs the unit and integration tests on each commit
