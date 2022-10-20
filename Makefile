setup: prepare install db-migrate

prepare:
	cp -n .env.example .env || true
	
db-migrate:
	npx knex migrate:latest

install:
	npm install

start:
	heroku local -f Procfile.dev

start-backend:
	npm start -- --watch --verbose-watch --ignore-watch='node_modules .git .sqlite'

start-frontend:
	npx webpack --watch --progress

lint:
	npx eslint .