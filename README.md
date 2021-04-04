# Getting Started with Book Highlights

### First time setup

1. If this is your first time cloning the repository, you'll need to first install the projects dependencies.\
Do this by running: `npm install`

2. Next you'll need to have the MongoDB Community Edition installed locally. \
Visit the [MongoDB Community Edition Installation Page](https://docs.mongodb.com/manual/administration/install-community/) to install this for your OS.
3. Ensure the MongoDB server is running locally and start the [mongo shell](https://docs.mongodb.com/manual/mongo/).\
Do this by opening a terminal to the mongo shell installation directory and running the command: `mongo`\
This will connect to a MongoDB instance running on **localhost** with the **default port** `27017`

### Running Book Highlights
1. Start the server by running `npm run start`\
This will start the server on **localhost** and on port `8080`

### Testing Book Highlights
The unit tests for book highlights are performed using Jest.\
To run the tests, run the command: `npm run test`