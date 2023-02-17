To get started using Hut first you need to run `npm install` inside this directory.

To develop you'll need a running ship to point to. To do so you first need to add a .env.local file to the ui directory. This file will not be committed. Adding `VITE_SHIP_URL={URL}` where `{URL}` is the URL of the ship you would like to point to, will allow you to run `npm run dev`. This will proxy all requests to the ship except for those powering the interface, allowing you to see live data.

Your browser may require CORS requests to be enabled for the use of @urbit/http-api. The following command will add http://localhost:3000 to the CORS registry of your ship:

```
|cors-approve ~~http~3a.~2f.~2f.localhost~3a.3000
```

Regardless of what you run to develop, Vite will hot-reload code changes as you work so you don't have to constantly refresh.

To deploy, run `npm run build`. Glob the `dist` folder navigating to `/docket/upload` where your ship is running.