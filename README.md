# Gateway-front

frontend of stay status record system

![version](https://img.shields.io/github/package-json/v/newt239/gateway-front?style=flat)

## setup

```
npm install
```

## `.env`

```
PORT=8000
REACT_APP_API_BASE_URL=http://localhost:3000
```

## commands

### Run in development mode

```
npm start
```

Open [http://localhost:8000](http://localhost:8000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### Make aspida type definition

```
npx openapi2aspida -i=./openapi.yaml -o=src
```

Before run, delete `src/api` directory.