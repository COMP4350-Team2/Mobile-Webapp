# This is the README for the Mobile-WebApp

## Technologies To Be Used
- **Language:** TypeScript
- **Library:** REACT, Tailwind


## Links To Other Repos
[Link to Desktop Webapp](https://github.com/COMP4350-Team2/Desktop-WebApp) <br/>
[Link to Backend](https://github.com/COMP4350-Team2/Backend)

## Prerequisites
### NVM (Node Version Manager)
- Please download the file called `nvm-setup.exe` found on [here](https://github.com/coreybutler/nvm-windows/releases)
- Once downloaded, run the following commands<br><br>
`nvm install latest` <br> `nvm use latest`<br>

### Node.js 
`nvm install node`

### NPM (Node Package Manager)
Ensure you are in the repo's directory and run the following command<br>
`npm install`


## Environment Variables Instructions
- Download `SAMPLE.env` and rename it to `.env`. 
- Enter the required details. 
- Please contact the team if you'd like the `.env` file for this component.

## Run
This app will, for now, be running locally. Therefore, ensure that you navigate to the [Backend](https://github.com/COMP4350-Team2/Backend) repository and follow the instructions to have the backend running in terminal. <br/><br>
Once the environment variables (`.env` file) are placed in the `./mobile-webapp` and the Backend is running in a separate terminal, run the app using the following command:

 - `npm start` <br/><br>

This will run the app on the PORT specified in the `.env` file. <br/><br>
**NOTE:** If the `.env` file is not present in the main directory, the app will run as a Mock instead.

## Acceptance Tests
### Environment Setup
The team ran these tests on both the Production environment and a Mock environment. </br>
The instructions for running these tests in **Production** and **Mock** are stated below.

#### Production
- Populated `.env` based on the `SAMPLE.env`
- Run [Backend](https://github.com/COMP4350-Team2/Backend) locally.
- Run the app as above.

#### Mock
- Remove `.env` from the main directory.
- Run the app as above.

### User Story: Login/Registration
**Description:** As a user, I want to be a able to log in using an existing account or register a new account.

**Acceptance Criteria:** 
- Given that I am on the log in/registration page
- I should be able log in with a previous account or register a new account.

#### Test Steps
- On the main page, click on log in button. Mock users log in immediately. Bypasses login, single user.
- Production environment users are taken to an `Auth0` log in and registration page.
- Register a new account with an email. It will sign you in.
- Log out. User taken to home page.
- Log in with the registered credientials.
- User taken to logged in page.


### User Story: Common Ingredients
**Description:** As a user, I want to have a list of commonly available ingredients I can choose from.

**Acceptance Criteria:** 
- Given that I’m a logged in user and on my profile
- When I am on my profile, I should be able to see my list of ingredients available
- Upon clicking on my list, I should be able to click the “add ingredient” button
- Then, I should be presented with a list of commonly available ingredients that I can add to my own list.

#### Test Steps
- After logging in, the user is given two button options. Click on `All Ingredients`.
- All ingredients are shown on the page. Each ingredient has a `+` button next to it. 
- Click the `+` button to add ingredient. This gives the user the option to add a certain amount of an Ingredient to one of their specified lists. <br>
    - However, please note that the functionality to create a list and adding these ingredients to your list is planned for the next sprint.<br>
    - Therefore, the "Add" option, while still functional, does not do anything at the moment.
