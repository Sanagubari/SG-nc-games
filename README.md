# Northcoders House of Games API
## Instructions

1. Fork and clone the repository 
2. Connect to the local databases (explained below)
3. Run `npm install` to install all the relevant packages.

## How to succesfully connect to local databases

You will need to create **two** .env files: 
.env.test and .env.development. 

Within these files you will need to add:

```
PGDATABASE=<database_name_here>
```
Make sure that the correct database name for the environment is in there. (Names will stored in the sql files stored in the db folder.)

Make sure that these files are git ignored by adding .env.* into the .gitignore file. 



