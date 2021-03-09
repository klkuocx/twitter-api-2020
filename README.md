# simple-twitter-api
A clone web app of Twitter.

![simple-twitter-app](https://i.imgur.com/EyQD789.png)

### Demo
[GitHub Page App](https://russelllin7789.github.io/twitter-front-end-vue/)

- Admin: `@root`
- Users: `@user1`, `@user2`, ... , `@user5`
- password: `12345678`

### Review
[Blog](https://medium.com/infinitegamer/soft-skills-of-software-engineer-c7f64cabfc58)

### API Doc
[API Doc on HackMD](https://hackmd.io/9GUKdrftR56pX0WX85K_xQ)

## Features
- Authentication
- Tweet
- Reply
- Like/Unlike
- Follow/Unfollow
- User data
- Admin

## Environment SetUp
1. [Node.js](https://nodejs.org/en/) 12.20.0
2. [Express](https://expressjs.com/en/starter/installing.html) 4.16.4
3. [nodemon](https://nodemon.io/) 2.0.4
4. [MySQL](https://www.mongodb.com/try/download/community) 8.0.22

## Installation and Execution
### Setup MongoDB
1. Turn on the DB
```
[~] $ cd ~/mongodb/bin/
[~/mongodb/bin] $ ./mongod --dbpath ~/mongodb-data
```
2. Create a database named "expense-tracker"
```
add expense-tracker
```

### Activate Project
1. Clone this git to local
```
[~] $ git clone https://github.com/klkuocx/twitter-api-2020.git
```

2. Get into the directory
```
[~] $ cd twitter-api-2020
```

3. Install packages
```
[~/twitter-api-2020] $ npm install
```

4. Setup MySQL, db model and seeds
```
drop database if exists ac_twitter_workspace;
create database ac_twitter_workspace;
drop database if exists ac_twitter_workspace_test;
create database ac_twitter_workspace_test;
```
```
[~/twitter-api-2020] $ npx sequelize db:migrate
[~/twitter-api-2020] $ npx sequelize db:seed:all
```

5. Run the project
```
[~/twitter-api-2020] $ npm run start
```