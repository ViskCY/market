# market

This template autogenerated by [create-gramio](https://github.com/gramiojs/create-gramio)

### Stack
- Telegram Bot API framework - [GramIO](https://gramio.dev/)
- ORM - [Prisma](https://www.prisma.io/) ([PostgreSQL](https://www.postgresql.org/))
- Linter - [Biome](https://biomejs.dev/)

## Development

Start development services (DB, Redis etc):

```bash
docker compose -f docker-compose.dev.yml up
```

Start the bot:

```bash
bun dev
```

## Migrations

Generate new migration:

```bash
bunx prisma migrate dev
```
Apply migrations:

```bash
bunx prisma migrate deploy
```

## Production

Run project in `production` mode:

```bash
docker compose up -d
```