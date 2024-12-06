# Cupboard Mobile WebApp Frontend
This repository contains the code for the Cupboard App's React webapp front-end. It was developed as a group project for the University of Manitoba Fall 2024 COMP 4350 class by Team 2 - Teacup
<br>By running this code, you should be able to access Cupboard's webapp from your computer's browser. <br>
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

**NOTE:** If the `.env` file is not present in the main directory, the app will run as a Mock instead.

## Acceptance Tests

### Environment Setup

The team ran these tests on both the Production environment and a Mock environment. </br>
The instructions for running these tests in **Production** and **Mock** are stated below.

#### Production

- Populate `.env` based on the `SAMPLE.env`
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
- Log out. User taken to Welcome page.
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

### User Story: Ingredient lists board

**Description:** As a user, I want to have a place to view all my lists.

**Acceptance Criteria:**

- Given that I’m a logged in user
- When I click on my profile and click My Lists
- Then I should be able to see, add or remove all my lists with all the ingredients in them

#### Test Steps

- After logging in, click on `My Lists` button.
- It shows a list of all the user's lists.
- Each List is clickable and shows all the ingredients within the list.
- Next to each List is a delete button that can be used to delete the List with all the ingredients within it.
- On the top of the `My Lists` page is a `Create List` button that creates a new (uniquely named) empty List that can be populated

### User Story: Remove Ingredients from List

**Description:** As a user, i should be able to remove an ingredient from my lists.

**Acceptance Criteria:**

- Given that I am logged in and on My Lists page
- And I navigate to an ingredient on a list
- And I click on delete ingredient
- Then the ingredient should be removed from that list

#### Test Steps

- On the `My Lists` page, click on a list to open it. It shows ingredients in that list.
- Click on the delete button next on the ingredient.
- That should remove that ingredient from that list.

### User Story: Add Ingredient To List

**Description:** As a user, I want to search ingredients and add them to one of my lists.

**Acceptance Criteria:**

- Given that I’m a logged in user and on my profile
- I should be able to see a list of my own ingredients that I can open
- When I click the “add ingredients” button upon opening my list
- Then I should be presented with a list of commonly available ingredients that I can search through using a search bar.

#### Test Steps

- After logging in, click the `My Lists` button.
- Then, click on a specific List to open it.
- Once opened, lick the `+` button to add ingredient. This will show us a searchable List of all available ingredients. I should then be able to specify an amount and the unit.
- If that ingredient did not exist in that list, a new ingredient should be added.
- If the ingredient with the same name and unit existed in the list already, the amount of that ingredient should be increased.
- If the ingredient with the same name but different unit existed in the list already, a new ingredient should be added.

### User Story: Set Amount/Unit For Ingredients

**Description:** As a user, I want to be able to set the amounts/units of ingredients in a list

**Acceptance Criteria:**

- Given that I’m in a list on My Lists page
- When I click on the edit button next to an ingredient.
- Then, I should be able to edit the amount/unit of ingredient in that list.

#### Test Steps

- When on a list in `My Lists` page, click on the edit button next to an ingredient.
- Enter the amount and/or unit in the popup and click OK.
- If an ingredient with the same name and unit as the new ingredient exists, the amount entered should be added to that ingredient.
- If an ingredient with the same name and unit as the new ingredient does not exist, the ingredient should just be edited with the new values.

### User Story: Persistence User

**Description:** As a user, I want to see the ingredients I previously had in my list when I log in.

**Acceptance Criteria:**

- Given that I’m a logged-out user
- When I enter my details correctly and get logged in
- Then, the app should keep my previous ingredients list.

#### Test Steps

- Log into the application
- Click on `My Lists`
- All the lists should have the same ingredients as before the log-in.

### User Story: Move Ingredients

**Description:** As a user, when I'm on a list, I should be able to move any given ingredient to another list of mine.

**Acceptance Criteria:**

- Given that I am a logged in user on My Lists page on a list
- Then I should be able to move an ingredient to another list.

#### Test Steps

- From the Home Page, click on `My Lists` and navigate to a certain List.
- Click on the `Move` button next to an ingredient.
- Select the list to move to from the pop-up and click Move.
- The ingredient should disappear from the current list.
- If the list to move to already has an ingredient with the same name and unit, the amount of that ingredient should increase.
- If the list to move to does not have an ingredient with the same name and unit, a new ingredient should be added.

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
