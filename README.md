# Northcoders House of Games API

This repository is for a RESTful api built with Javascript in Node.js, and uses PostGreSQL as a database. The API is built using Express.js framework and was developed using **Test Driven Development (TDD)**, using both Jest and Supertest packages to test it.

The database includes the following tables:

- Reviews
- Categories
- Comments
- Users

This API is hosted on Render and uses ElephantSQL to host the database. To view the hosted API along with all the available endpoints and their descriptions, [click here](https://sg-nc-games.onrender.com/api).

## Packages Required

For this repository, please ensure that you have **node v19.1.0** and **PSQL v14.5** installed as the minimum required versions.

If you don't have PostGreSQL (PSQL) installed on your machiene, please [click here](https://www.postgresql.org/download/) to find the correct package for your machiene and follow the instructions to install it and get it running.

If your verison of node is outdated then please [click here](https://www.freecodecamp.org/news/how-to-update-node-and-npm-to-the-latest-version/) and follow the instructions to update it to a later version.

## Instructions

Inorder to use the repository, please ensure that you follow the instructions below:

1. Fork and clone this repository to your local machiene

2. Connect to the **two local databases** by creating the following files:

- **.env.test** and add the following code to it: 
  \ `PGDATABASE=nc_games_test`

- **.env.development** and add the following code to it: 
  \ `PGDATABASE=nc_games`

4. Ensure that these files are git ignored by adding `.env.*` into the **.gitignore** file.

5. Run `npm install` to install all the relevant packages.

## Seed Local Database

Once you have followed all the steps above, and PSQL is successfully running, you need to setup the database and seed with data. In order to do this, please ensure you run the following scripts in your terminal: \
\
`npm run setup-dbs`\
`npm run seed`


## Testing

To test all endpoints, run the following script in your terminal:\
`npm test`
