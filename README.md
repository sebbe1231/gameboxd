letterboxd for games.... yea

### run
    - npm run dev

### drizzle:                                                
    - Run npm run db:start to start the docker container  
    - Run npm run db:push to update your database schema 
    - Run npm run db:studio to see database

### drizzle studio
    - npx drizzle-kit studio

### better auth
    - npm run auth:schema

### Svelte Doc
#### SvelteKit
- https://svelte.dev/docs/kit/introduction
#### Svelte
- https://svelte.dev/docs/svelte/overview

### IGDB API Doc
https://api-docs.igdb.com/

### Bootstrap Doc
https://getbootstrap.com/docs/5.3/getting-started/introduction/

### Drizzle Doc
https://orm.drizzle.team/docs/overview

### Better Auth Doc
https://better-auth.com/docs

## Stack
    - Svelte
    - Sveltekit
    - Bootstrap
    - Drizzle ORM
    - Postgresql
    - Better Auth


    Query Parameter Routing (/search?q=...):
Create a search page at src/routes/search/+page.svelte (or handle search parameters on the home page src/routes/+page.svelte). Read search queries from page.url.searchParams.