# Stockie API

> Stockie API is designed to serve articles and other data to Stockie

## Build Setup

``` bash
# Install dependencies
npm install

# Initialize database
node_modules/.bin/sequelize db:create
node_modules/.bin/sequelize db:migrate

# Pull latest articles from sources
npm run scrape

# Start the API service
npm start

# Proceed to Stockie-Frontend
```
