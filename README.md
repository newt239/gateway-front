# gateway-front

![version](https://img.shields.io/github/package-json/v/newt239/gateway-front?style=flat)

frontend of stay status record system for Sakae Higashi School Festival 2022.

- [backend](https://github.com/newt239/gateway-back)
- [digital wristband](https://github.com/newt239/digital-wristband)

![hero image](https://user-images.githubusercontent.com/51036153/189526004-7832f1ab-f079-4600-938b-91e3826aa6ab.png)

This system was installed to control the number of people who stay at the same exhibition room at the same time as part of measures against Covid19.

## Screenshot

<img src="https://user-images.githubusercontent.com/51036153/189522314-30a2e4c3-a41b-4a99-b633-dd626143ec98.png" alt="home" width="300px" height="auto" />
<img src="https://user-images.githubusercontent.com/51036153/189522538-a66d8f41-7e04-4d45-9566-c06668d98ae6.png" alt="enter scan" width="300px" height="auto" />
<img src="https://user-images.githubusercontent.com/51036153/189522561-f201c104-c4c4-4a63-b252-9806ce14d653.png" alt="exhibit analytics" width="300px" height="auto" />
<img src="https://user-images.githubusercontent.com/51036153/189522578-0ba7f1b3-0191-442e-838d-12bbdeef89d4.png" alt="all exhibit summary" width="300px" height="auto" />

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