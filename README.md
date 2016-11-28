Experiments in React | GIT Issues Tracker
============================================

View the app here: 'public > index.html'


This project is for a new issues viewer for Github built using React.js (built as a means to play around with React, Relay and Flux)

File contains:
- Running the App
- Running the Tests
- App Structure
- Time Log



Running the App
---------------------
1. Download .zip file and extract to folder (folder structure below)
2. In your command line interface type (to run the latest version from scripts/):
>> npm install -g react-tools
>> jsx --watch scripts/ build/
3. Open index.html in your browser
Allows you to play with the project file as you view / test it (changed are auto-generated to build)

For development mode:
To load the git viewer please follow the instructions below:
1. Download .zip file and extract to folder (folder structure below)
2. In your command line interface type:
	> npm install
	> node server.js (or any other simple server in py / php / node etc.)
3. In your browser type in: http://localhost:3000/ to view the app


Running the Tests
---------------------
Testing performed using Jest (https://facebook.github.io/jest/). All test files are in unit-test.js
> npm install jest-cli --save-dev
> Run npm test
NOTE: React components were not tested using Jest as I was running on time, naturally this would not be the case for Production functions


App Structure
---------------------
public/
	assets/
		issuexpress.jpg
	build/
		gitviewer-react.js
		utils.js
	css/
		custom.css
	dev_server/
		node_modules /
			body-parser/
			express/
		server.js
	scripts/
		gitviewer-react.js
		utils.js
	tests/
		unit-tests.js
	index.html
	package.json
README.md


Time Log (total time spent: 9-12 hrs)
