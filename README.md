## DOT EXTENSION

[![Netlify Status](https://api.netlify.com/api/v1/badges/b3597871-5967-40c9-9466-781bfff4b030/deploy-status)](https://app.netlify.com/sites/dot-extension/deploys)

App - [Netlify](https://dot-extension.netlify.app)

## Features

- [x] Todo - Add and `Mark complete` immediately
- [x] Logout
- [x] Logged in/Logged out states
- [x] Show only pending tasks in DOT homepage
- [x] Store project key in localStorage
- [x] Add Status Bar component
- [x] Host the application on netlify
- [ ] Forgot Password
- [x] Click to copy `meta tag`
- [ ] `EXTENSION` mode design
  - [ ] Change `dot` styling (color, position, size)
- [ ] `APP` mode design
  - [ ] Particles.js
  - [ ] Use react-router-dom
  - [ ] domain name
  - [ ] responsive
- [ ] Controls
  - [ ] Search (keyword, id)
  - [ ] Sort
  - [ ] Get url for item
- [ ] Todo
  - [x] Deadline
  - [ ] Start/End date (Calculate total days spent)
- [ ] Topic
  - [x] Toggle Visibility / Mark as done
  - [ ] View/Hide
  - [ ] Rename
  - [ ] Delete
  - [ ] Start/End date (Calculate total days spent)
- [ ] Chart
  - [ ] No of tasks done daily/monthly
- [ ] Collaborators

## Bugs/Refactor/Fixes

- [x] Increase font size
- [x] Fix font family when loaded as extension
- [x] Add html support for todo
- [x] Enable going to next line when `shift` + `enter` is pressed
- [x] Dont reset topic when a todo is added
- [x] Default value for `pending tasks` should be true
- [x] Clear data button
- [x] Update not working on `Enter`
- [x] Show created & completion date
- [x] Rewrite scripts for dev and build for `app` and `ext` type.
- [x] Extension should only be available for `localhost`
- [x] Config setting based on ENV variables
- [x] Store previous setting in memory (pending task, mark as complete, active tab, open/close state of the topic..etc)
- [ ] Fix timeline pagination

## Todo

- [x] Create input=date component
- [x] Setup ESlint
- [ ] Error handing wrapper
- [ ] Sentry
- [ ] Mix Panel
- [ ] localStorage API
- [ ] Add labels to identify deadline, start, end date
- [ ] Switch to a UI library
