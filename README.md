# NUS-Retimark

## About

![image](https://logosdownload.com/logo/national-university-of-singapore--logo-1024.png)

Hi! We are a group of NUS Students working with RetiMark, harnessing AI algorithms to develop a cutting-edge solution that accurately assesses the risk of various eye diseases. Our solution comprises of three components, namely our deep learning models, a dashboard and a web application.

## Web App
We created a web app that serves as a diagnostic evaluation platform to generate a risk probability for each of the three sight-threatening eye diseases (AMD, Glaucoma, and Diabetic Retinopathy) using our deep learning models.
### Demo
#### Login Page
The entry point for users is the login page. Here, users will be prompted to enter their credentials in order to proceed further. 
![image](https://github.com/magiciansz/NUS-RetiMark/assets/60168038/7b0abcf7-cd08-4de5-94e9-50172c1546d9)

#### Predictor Page
After login, they will be redirected to the predictor page which is the home page. On this predictor page, users can upload two images (left eye and right eye), tag it to a new patient or an existing patient, and get the risk probabilities for each of the images. 

![image](https://github.com/magiciansz/NUS-RetiMark/assets/60168038/a3a873fe-facf-4355-816a-b545dd8bc15a)

Subsequently, a report with the risk probability for each of the three sight-threatening eye diseases will be generated. Users are able to (1) Add a doctor's note so that the user can record important observations and notes derived from the report (2) Download the report as a PDF file (3) Save the report into our database so that it can be accessed in the Past Reports tab

![image](https://github.com/magiciansz/NUS-RetiMark/assets/60168038/708e87f1-06c1-46d8-9baa-a1a437cf7663)
![image](https://github.com/magiciansz/NUS-RetiMark/assets/60168038/7e759e79-48ef-4886-b26a-b4fd229bbcd2)

#### Past Reports Page
The past reports page displays all the past reports from previous visits for the searched patient. Users to sort the reports by date in either ascending or descending order. By default, the reports are sorted in descending order (‘Latest to Oldest’)

![image](https://github.com/magiciansz/NUS-RetiMark/assets/60168038/b6105e60-e591-4800-9e62-fc0436027b1a)
![image](https://github.com/magiciansz/NUS-RetiMark/assets/60168038/8b1cd704-6f7f-42eb-99a5-701eb2a9c2ce)

## Dashboard
The fundus dashboard is developed using the Streamlit library in Python. The purpose of the dashboard is to consolidate relevant patient data and medical images and to provide a comprehensive view of each patient's medical history and current condition. The fundus dashboard is a client-facing application which showcases the risk prediction from the deep learning model results.

### Demo
#### Login Page
The entry point for users is the login page. Here, users will be prompted to enter their credentials in order to proceed further.
![image](https://github.com/magiciansz/NUS-RetiMark/assets/77622894/04acc98c-22b3-47e5-91ea-62aea527fcf6)

#### Filters
Users are able to toggle on the risk level filter to subset the data into "diseased" and "normal" patient fundus images. Additionally, users can filter for a patient, disease type and visit date to view relevant patient info.
![image](https://github.com/magiciansz/NUS-RetiMark/assets/77622894/3da567ef-7e24-482e-b7a5-049419900c3e)

#### Patient Info
In the main dashboard page, users will be able to view relevant patient info, such as age, sex, doctor's notes and last visit date, accompanied by their fundus images. The risk levels of having the disease for each eye is also displayed here.
<img width="1128" alt="image" src="https://github.com/magiciansz/NUS-RetiMark/assets/77622894/f16add87-c193-4e28-b69a-e9be705318db">

#### Risk Trend Line Chart
The risk trend line chart shows the historical changes of a patient’s disease risk levels, separated by the left and right eye. The line chart is responsive to scroll and zoom in the horizontal direction and can also be viewed in full screen.
![image](https://github.com/magiciansz/NUS-RetiMark/assets/77622894/d2bd32fd-d83b-4435-80a6-ae6ec55b138a)

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

### Setup and run the Dashboard frontend

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
- [Amazon Web Services](https://aws.amazon.com/)

## Authors

- Ng Xiang Han - [GitHub](https://github.com/magiciansz)
- Seah Jia Jun - [GitHub](https://github.com/jiajun-seah)
- Tan Jia Hui - [GitHub](https://github.com/jiahuitan36)
- Glenn Bjorn Chia - [GitHub](https://github.com/glennbjorn)
- Josiah Foo - [GitHub](https://github.com/josiahfoo99)
