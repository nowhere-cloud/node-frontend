# node-frontend

Front-End of the Nowhere Private Cloud Solution

[![Code Climate](https://codeclimate.com/github/nowhere-cloud/node-frontend/badges/gpa.svg)](https://codeclimate.com/github/nowhere-cloud/node-frontend)

## Development / Contribute
1. `git clone`, you probably know how to do this.
2. `npm install --development && npm install sqlite3`
3. `npm run build-dev` to compile frontend JS and CSS in development mode
4. `PORT=3000 npm start`
5. http://localhost:3000/
6. __**Important**__, `npm run build` before push to git !!!

### Credentials
* Username: `foo`
* Password: `secret`
* Development mode is **STRICTLY FORBIDDEN**, and cannot be activated on Docker Platform.

## Requirements
* Node.js >= v6.10
* npm is installed

## Views Terminology
- ___partials __
  - This Template is intended for loaded as over AJAX or shown directly
- __includes__
  - Contains reusable components (Lightbox, breadcrumbs, etc.)
