# Gateway-front

frontend of Guests management system

## System Info

- react v17.0.2
- mui v5.2.4
- react-qr-reader github:JodusNodus/react-qr-reader#pull/192/head

more details, please check `package.json`.

## For developer: how to reproduce

## setup

```
npm install
```

## `.env`

```
PORT=8000
REACT_APP_API_BASE_URL=http://localhost:3000
NODE_PATH=src
```

## commands

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:8000](http://localhost:8000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npx openapi2aspida -i=./openapi.yaml -o=src`

make aspida type definition files ( before run, delete this directory )