## DOT EXTENSION 
[![Netlify Status](https://api.netlify.com/api/v1/badges/b3597871-5967-40c9-9466-781bfff4b030/deploy-status)](https://app.netlify.com/sites/dot-extension/deploys)

App - [Netlify](https://dot-extension.netlify.app)

## Features
- [ ] Topic - Edit, Delete, Toggle Visibility
- [x] Todo - Add and `Mark complete` immediately
- [x] Logout
- [ ] Sync after 30 mins
- [ ] Forgot Password
- [x] Logged in/Logged out states
- [x] Show only pending tasks in DOT homepage
- [x] Store project key in localStorage
- [ ] Click to copy `meta tag`
- [x] Host the application on netlify
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
- [ ] Store previous setting in memory (pending task, mark as complete, active tab, open/close state of the topic..etc)
- [x] Rewrite scripts for dev and build for `app` and `ext` type. 
- [x] Extension should only be available for `localhost`
- [x] Config setting based on ENV variables