# gateway-front

frontend of stay status record system for Sakae Higashi School Festival 2022.

![version](https://img.shields.io/github/package-json/v/newt239/gateway-front?style=flat)

![home](https://user-images.githubusercontent.com/51036153/183643434-916e78bb-fabe-471b-88b8-f6d1ddfe5c5d.png)

This system was installed to  control the number of people who stay at the same exhibition room at the same time as part of measures against Covid19.

## Setup

```
npm install
```

## `.env`

```
PORT=8000
REACT_APP_API_BASE_URL=http://localhost:3000
```

## Commands

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