# Cupboard Mobile WebApp Frontend
This repository contains the code for the Cupboard App's React webapp front-end. It was developed as a group project for the University of Manitoba Fall 2024 COMP 4350 class by Team 2 - Teacup.
<br>By running this code, you should be able to access Cupboard's webapp from your computer's browser (on localhost - see below). <br>
The deployed website can also be accessed at https://teacup-cupboard.vercel.app/
<br>The link to our other repositories can be found below:
- [Link to Desktop NativeApp](https://github.com/COMP4350-Team2/Desktop-WebApp) <br/>
- [Link to Backend](https://github.com/COMP4350-Team2/Backend)

## Table of Contents
- [Background](#background)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Acceptance Tests](#acceptance-tests)
- [Docker Commands](#docker-commands)
- [Contributors](#contributors)
- [License](#license)

## Background
The Cupboard App was developed to be the ultimate kitchen companian that takes the hassle out of meal planning and grocery management.

## Technologies Used

- **Languages:** TypeScript/CSS
- **Library:** REACT

## Getting Started

### Requirements
In order to successfully run this webapp locally, the following requirements must be fulfilled.
### NVM (Node Version Manager)

- Please download the file called `nvm-setup.exe` found on [here](https://github.com/coreybutler/nvm-windows/releases)
- Once downloaded, run the following commands<br><br>
  ```
  nvm install latest
  ```
  <br>
  
  ```
  nvm use latest
  ```


### Node.js
Once `nvm` has been installed, install `node` by running the following command
```
nvm install node
```


### NPM (Node Package Manager)

Ensure you are in the repo's directory and run the following command to install all the project's packages<br>
```
npm install
```

## Environment Variables

- Download `SAMPLE.env` and rename it to `.env`.
- Enter the required details.
- Please contact the team if you'd like the `.env` file for this component.

## Run

- This code for this repository will provide the user with the ability to run the website locally (while still communicating with the hosted Backend).
- Once the .env files have been placed inside the repository, run the app using the following command
 ```
    npm start
```

- This should run the webapp locally on `http://localhost:8080` 
- **NOTE:** If the `.env` file is not present in the main directory, the app will run as a Mock instead on `http://localhost:3000`.

## Acceptance Tests
The acceptance tests for the user stories covered can be found in the following document <br>
[Acceptance Tests](ACCEPTANCE_TESTS.md)

## Docker Commands

build docker image
`docker build -t hienng/cupboard_mobile_webapp .`

push to dockerhub using default tag (latest)
`docker push hienng/cupboard_mobile_webapp`

pull to dockerhub using default tag (latest)
`docker pull hienng/cupboard_mobile_webapp`

start the app using the pulled image
`docker compose up`

The application will be available at http://localhost:8080.

## Contributors
<a href="https://github.com/COMP4350-Team2/Mobile-Webapp/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=COMP4350-Team2/Mobile-Webapp" />
</a>

Image made with [contrib.rocks](https://contrib.rocks).

## License
[GNU GENERAL PUBLIC LICENSE](LICENSE) © Teacup (COMP4350-Team2)