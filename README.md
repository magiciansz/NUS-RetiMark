# NUS-Retimark

## About

![image](https://logosdownload.com/logo/national-university-of-singapore--logo-1024.png)

Hi! We are a group of NUS Students working with RetiMark, harnessing AI algorithms to develop a cutting-edge solution that accurately assesses the risk of various eye diseases. Our solution comprises of three components, namely our deep learning models, a dashboard and a web application.

## Web App

We created a web app that serves as a diagnostic evaluation platform to generate a risk probability for each of the three sight-threatening eye diseases using the deep learning models.
The entry point for users is the login page. Here, users will be prompted to enter their credentials in order to proceed further. After login, they will be redirected to the predictor page which is the home page. They can click on start, and select if they are uploading an image for a new patient or an existing patient.
![image](https://i.ibb.co/xHtygny/Screenshot-2023-11-08-at-12-04-31-PM.png)

## Dashboard

We created a patient fundus dashboard that consolidates relevant patient data and medical images, which provides a comprehensive view of each patient's medical history and current condition.
The entry point for users is the login page. Here, users will be prompted to enter their credentials in order to proceed further. Upon successful login, he will be redirected to the main dashboard page, which contains a holistic view of patient fundus data.
![image](https://i.ibb.co/dJb7MxR/Screenshot-2023-11-08-at-11-56-28-AM.png)
Firstly, the filters at the top of the page allow users to filter for the patient of interest, disease type as well as date of visit. Each filter can be set by selecting from a series of drop down values, or directly searching for the values. Each filter comes with a helpful tooltip to guide users towards entering the correct input value.
Once the filters are set, the patient’s clinical data will be shown below. The data is retrieved from the AWS database, which includes fields like the patient’s age, sex and doctor’s notes. More importantly, his fundus images are displayed here as well, alongside the risk value generated by the machine learning model.

Below, a risk trend line chart shows the historical changes of a patient’s disease risk levels. Separated by the left and right eye. The line chart is responsive to scroll and zoom in the horizontal direction and can also be viewed in full screen.
![image](https://i.ibb.co/FqLrT6X/Screenshot-2023-11-08-at-11-59-22-AM.png)

## Deep Learning

## Setup

### Prerequisites

You will need the following things properly installed on your computer.

- MySQL Workbench

### If you are using Docker:

- In the main project directory, duplicate the `.env-example` file into `.env` and fill up the environment variables accordingly:
  - `TOKEN_SECRET`: secret used for verifying / signing JWTs
  - `TOKEN_ACCESS_EXPIRATION_MINUTES`: Validity of Access Tokens (in minutes)
  - `TOKEN_REFRESH_EXPIRATION_HOURS`: Validity of Refresh Tokens (in hours)
  - `MYSQLDB_USERNAME`: Username used to log in to database (root)
  - `MYSQLDB_ROOT_PASSWORD`: Password used to log in to database
  - `MYSQLDB_DATABASE`: Name of database
  - `AWS_ACCESS_KEY_ID`: Access Key ID for AWS Account (for AWS interactions)
  - `AWS_SECRET_ACCESS_KEY`: Secret Access key for AWS Account (for AWS interactions)
  - `AWS_BUCKET`: Name of Bucket used to store patient images
  - `EXPRESS_NODE_ENV`: Development environment of Express backend Note: using TEST causes the express server to use localstack to store images (since we mock AWS interactions during testing). This variable also affects the directory where patient images are stored on S3.
- Open a new command line window and go to the project's directory
- In docker-compose.yml, replace docker.host.internal under the web-app service with your own local IP. Query it using `ipconfig getifaddr en0`
- Run the project:
  `docker-compose --project-name "[project-name]" --env-file .env up -d`
- Access `http://localhost:3000` for the web app, and `http://localhost:8501` for the dashboard.
  - When you run `docker-compose --project-name "[project-name]" --env-file .env up -d`, some containers are spinned up (frontend, backend, database, etc) and each one will be running on a different port
- To stop the project, run `docker-compose stop`, or delete the containers in your Docker console.

### If you are not using Docker:

### Database Setup

- When running the express backend server, Sequelize automatically creates tables in MySQL based on the tables defined.
- For manual creation, locate the following folder `./backend/database` and execute the sql scripts `retimark_db.sql`.

### Setup and run the Express backend

- cd into `./backend`, and run `npm install`.
- Open the `./backend/.env-example` file on a text editor, and create a .env file in the same directory (if it hasn't been created). Copy the code from .env-example and fill up the environment variables accordingly:

  - `PORT`: port to expose the express backend server
  - `TOKEN_SECRET`: secret used for verifying / signing JWTs
  - `TOKEN_ACCESS_EXPIRATION_MINUTES`: Validity of Access Tokens (in minutes)
  - `TOKEN_REFRESH_EXPIRATION_HOURS`: Validity of Refresh Tokens (in hours)
  - `DB_HOST`: IP Address of endpoint hosting the database (127.0.0.1 if running locally)
  - `DB_PORT`: Port of database that is exposed for incoming TCP connections
  - `DB_USERNAME`: Username used to log in to database
  - `DB_PASSWORD`: Password used to log in to database
  - `AWS_ACCESS_KEY_ID`: Access Key ID for AWS Account (for AWS interactions)
  - `AWS_SECRET_ACCESS_KEY`: Secret Access key for AWS Account (for AWS interactions)
  - `AWS_BUCKET`: Name of Bucket used to store patient images
  - `NODE_ENV`: Development environment of Express backend Note: using TEST causes the express server to use localstack to store images (since we mock AWS interactions during testing). This variable also affects the directory where patient images are stored on S3.

- run `npm start`

### Setup and run the Flask backend

- cd into `./deeplearning`, and run `pip install -r requirements.txt`.
- run `flask run --port 8000`

### Setup and run the Web App frontend

- cd into `./frontend`, and run `npm install`.
- Open the `./frontend/.env-example` file on a text editor, and create a .env file in the same directory (if it hasn't been created). Copy the code from .env-example and fill up the environment variables accordingly:
  - `REACT_APP_EXPRESS_ENDPOINT_URL`: URL of Express backend
  - `REACT_APP_FLASK_ENDPOINT_URL`: URL of Flask backend
- run `npm run start`. The web app listens on port 3000.

### Setup and run the dashboard frontend

- cd into `./dashboard/.venv`, and run `pip install -r requirements.txt`.
- run `streamlit run home.py`. The dashboard listens on port 8501.

## Testing (For Express Backend)

- cd into `./backend`
- Please install [localstack](https://github.com/localstack/localstack) on your endpoint, and run `localstack start -d`.

To run all tests, run `npm test`. This runs the entire test suite based on the test files declared in the `./test` folder

To run a specific test file, run `npm test -- tests/integration/patient.test.js`

## Github Actions (For Express Backend)

We automate testing and deployments of our express backend during code changes. We do not test and deploy other services as the entire pipeline would be extremely time-consuming, for each code change made.

### Continuous Integration

To enable Continuous Integration through Github Actions, we provide a `test_staging.yml` file in the `.github/workflows/` directory. The workflow is designed to run automatically each time a pull request is raised in develop, ensuring that the code changes do not break any API logic in our express backend.

### Continuous Deployment

To enable Continuous Deployment through Github Actions, we provide a `deploy_staging.yml` file in the `.github/workflows/` directory. The workflow is designed to run automatically each time a pull request is merged into develop. It then builds the express backend image, pushes it to AWS ECR and initiates a re-deployment of our staging server on AWS ECR.

### API Documentation

This project comes with an `apidoc.yml` file, which contains documentation for all our APIs. Copy the yml file contents into [Swagger](https://editor.swagger.io/) to view it.

## Built With

- [Streamlit](https://streamlit.io/)
- [React](https://react.dev/)
- [Express](https://expressjs.com/)
- [Flask](https://flask.palletsprojects.com/en/3.0.x/)
- [MySQL](https://www.mysql.com/)
- [PyTorch](https://pytorch.org/)
- [Docker](https://www.docker.com/)
- [AWS](https://aws.amazon.com/)

## Authors

- Ng Xiang Han - [GitHub](https://github.com/magiciansz)
- Seah Jia Jun - [GitHub](https://github.com/jiajun-seah)
- Tan Jia Hui - [GitHub](https://github.com/jiahuitan36)
- Glenn Bjorn Chia - [GitHub](https://github.com/glennbjorn)
- Josiah Foo - [GitHub](https://github.com/josiahfoo99)
