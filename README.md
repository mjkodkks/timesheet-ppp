# TimeSheet PPP

## Development

1) Create ```.env``` from this template get url [bot holiday website](https://www.bot.or.th/th/financial-institutions-holiday.html)
   
   ```
   API_URL_FROM_WEB=<paste here>
   API_URL=https://gateway.api.bot.or.th
   ACCESS_TOKEN_BOT=<paste here>
   ```
2) Run

```
bun install

bun run dev
```




## Production

use docker-compose

```
docker-compose up --build
```

Create By [Elysia](https://elysiajs.com/) with Bun runtime ❤️

