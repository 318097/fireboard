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
- [x] Click to copy `meta tag`
- [ ] `EXTENSION` mode design
  - [x] Change close button
  - [ ] Settings to update `dot` styling (color, position, size)
- [ ] `APP` mode design
  - [ ] Particles.js
  - [x] Use react-router-dom
- [x] Todo
  - [x] Deadline
  - [x] Start/End date (Calculate total days spent)
  - [ ] Get url for item
- [x] Topic
  - [x] Toggle Visibility / Mark as done
  - [x] View/Hide
  - [x] Rename
  - [x] Delete
  - [x] Start/End date (Calculate total days spent)
- [ ] Controls
  - [ ] Search (keyword, id)
  - [ ] Sort
  - [ ] Toggle between headers - 1 row is menu & 2nd could be filters
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
- [x] Mix Panel
- [x] Add labels to identify deadline, start, end date
- [x] Switch to a UI library
- [x] Fix blocker screen design
- [x] Analyze bundle size
- [x] Add tooltip to get started
- [ ] Error handing wrapper
- [ ] Sentry
- [ ] About page, other products
- [ ] Landing page
- [ ] Test markdown data
- [ ] Resize date picker size
- [ ] Domain name
- [ ] Logo
- [ ] Marketing video/banner
- [ ] Use text editor
- [ ] Forgot Password
- [ ] Change Password
