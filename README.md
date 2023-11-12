# NUS-Retimark

## About

![image](https://github.com/magiciansz/NUS-RetiMark/assets/77622894/6999c6b8-ab01-44f3-9e73-065fcae330fd)

Hi! We are a group of NUS Students working with RetiMark, harnessing AI algorithms to develop a cutting-edge solution that accurately assesses the risk of various eye diseases. Our solution comprises of three components, namely our deep learning models, a dashboard and a web application.

## Deep Learning
The deep learning models were developed using the PyTorch library. The deep learning model was trained on Kaggle datasets for [age-related macular degeneration](https://www.kaggle.com/datasets/andrewmvd/ocular-disease-recognition-odir5k), [glaucoma](https://www.kaggle.com/datasets/arnavjain1/glaucoma-datasets) and [diabetic retinopathy](https://www.kaggle.com/competitions/diabetic-retinopathy-detection/data). The deep learning model aims to provide accurate predictions of a patient's eye condition by taking retinal fundus images as inputs and producing a risk percentage as output.

### Training the Model
The model has already been trained, and predictions can be made from the web application. However, should you choose to retrain the model, you might want to take note of the following instructions.

To retrain the model with local images, please refer to [retimark-x-capstone-glaucoma-final.ipynb](deeplearning/notebooks/retimark-x-capstone-diabetic-retinopathy-final.ipynb) for how to train the model on your local machine. 
Most notably, the filepaths will likely have to be changed according to your local file structure. The end result should be that the train_df variable should be a Pandas dataframe with two columns, filepath and label. Filepath should refer to the file path of each image on your local machine, with label being their corresponding labels.

![image](https://github.com/magiciansz/NUS-RetiMark/assets/90398774/edcfc874-b1a7-457e-9059-e4157e121bd0)


### Performance Evaluation
After the model is trained, the notebook will output several graphs indicating the performance of the model, with metrics such as loss and recall score. The model's hyperparameters and architecture can then be tuned accordingly to optimize model performance.

![image](https://github.com/magiciansz/NUS-RetiMark/assets/90398774/569a8f86-29c5-43be-ab7d-d9ab1912c458)

### Model Architecture
To train our model, we used transfer learning by using a pretrained ResNet model. 
![image](https://github.com/magiciansz/NUS-RetiMark/assets/90398774/e8800fe0-df55-493f-bb44-4eba78ca7964)


You can tune the ResNet model accordingly to increase or decrease the complexity of the model by changing the following line. Some ResNet models are more commonly used, such as ResNet18, ResNet34, ResNet50, and ResNet101, but this list is not exhaustive.

![image](https://github.com/magiciansz/NUS-RetiMark/assets/90398774/1a27a60d-5a47-4fda-b0a7-aa9564878773)


While ResNet already has its own convolutional layers in the model architecture, you may choose to increase or decrease the complexity of the model by adjusting the model architecture as displayed here as well.

![image](https://github.com/magiciansz/NUS-RetiMark/assets/90398774/060f2c41-8de2-4e09-a552-9dd12ae1d46e)


### Hyperparameter Tuning
To tune model performance, you can consider tuning the following hyperparameters.

Learning rate, indicated by lr=1e-3 in the image below, affects how quickly the model is able to pick up on patterns in the data. Increasing learning rate may lead to overfitting, while decreasing learning rate may lead to underfitting and cause the model to converge more slowly.
Weight decay (weight_decay=1e-3) represents the level of L2 regularization used in training the model. Increasing this value may help to address overfitting, and decreasing it may help to address underfitting.

![image](https://github.com/magiciansz/NUS-RetiMark/assets/90398774/6b946c40-0e07-4c84-9121-2e83d6d1143a)

Dropout can also be adjusted in the model architecture shown below. Dropout controls the percentage of data that will have its weights randomly set to zero. To address overfitting, you can try increasing dropout. To address underfitting, you can try decreasing dropout. Generally, it is recommended to start training the model with an initial value of 0.3-0.5 and tune accordingly from there.

![image](https://github.com/magiciansz/NUS-RetiMark/assets/90398774/060f2c41-8de2-4e09-a552-9dd12ae1d46e)

## Dashboard

You may view a recorded walkthrough of the fundus dashboard here: [Link to demo](https://drive.google.com/file/d/1KbLMYrM_48Y2hQpifzG17TRcp9udF9a1/view)

The fundus dashboard is developed using the Streamlit library in Python. The purpose of the dashboard is to consolidate relevant patient data and medical images and to provide a comprehensive view of each patient's medical history and current condition. The fundus dashboard is a client-facing application which showcases the risk prediction from the deep learning model results.

### Login Page
The entry point for users is the login page. Here, users will be prompted to enter their credentials in order to proceed further.
![image](https://github.com/magiciansz/NUS-RetiMark/assets/77622894/04acc98c-22b3-47e5-91ea-62aea527fcf6)

### Filters
Users are able to toggle on the risk level filter to subset the data into "diseased" and "normal" patient fundus images. Additionally, users can filter for a patient, disease type and visit date to view relevant patient info.
![image](https://github.com/magiciansz/NUS-RetiMark/assets/77622894/3da567ef-7e24-482e-b7a5-049419900c3e)

### Patient Info
In the main dashboard page, users will be able to view relevant patient info, such as age, sex, doctor's notes and last visit date, accompanied by their fundus images. The risk levels of having the disease for each eye is also displayed here.
<img width="1128" alt="image" src="https://github.com/magiciansz/NUS-RetiMark/assets/77622894/f16add87-c193-4e28-b69a-e9be705318db">

### Risk Trend Line Chart
The risk trend line chart shows the historical changes of a patient’s disease risk levels, separated by the left and right eye. The line chart is responsive to scroll and zoom in the horizontal direction and can also be viewed in full screen.
![image](https://github.com/magiciansz/NUS-RetiMark/assets/77622894/d2bd32fd-d83b-4435-80a6-ae6ec55b138a)

## Web App
You may view a recorded walkthrough of the web application here: [Link to demo](https://drive.google.com/file/d/1fIn7AsVwY-3tuq9yZ6plZbJZV83U3lv1/view)

We created a web app that serves as a diagnostic evaluation platform to generate a risk probability for each of the three sight-threatening eye diseases (AMD, Glaucoma, and Diabetic Retinopathy) using our deep learning models.
### Login Page
The entry point for users is the login page. Here, users will be prompted to enter their credentials in order to proceed further. 
![image](https://github.com/magiciansz/NUS-RetiMark/assets/60168038/7b0abcf7-cd08-4de5-94e9-50172c1546d9)

### Predictor Page
After login, they will be redirected to the predictor page which is the home page. On this predictor page, users can upload two images (left eye and right eye), tag it to a new patient or an existing patient, and get the risk probabilities for each of the images. 

![image](https://github.com/magiciansz/NUS-RetiMark/assets/60168038/a3a873fe-facf-4355-816a-b545dd8bc15a)

Subsequently, a report with the risk probability for each of the three sight-threatening eye diseases will be generated. Users are able to (1) Add a doctor's note so that the user can record important observations and notes derived from the report (2) Download the report as a PDF file (3) Save the report into our database so that it can be accessed in the Past Reports tab

![image](https://github.com/magiciansz/NUS-RetiMark/assets/60168038/708e87f1-06c1-46d8-9baa-a1a437cf7663)
![image](https://github.com/magiciansz/NUS-RetiMark/assets/60168038/7e759e79-48ef-4886-b26a-b4fd229bbcd2)

### Past Reports Page
The past reports page displays all the past reports from previous visits for the searched patient. Users to sort the reports by date in either ascending or descending order. By default, the reports are sorted in descending order (‘Latest to Oldest’)

![image](https://github.com/magiciansz/NUS-RetiMark/assets/60168038/b6105e60-e591-4800-9e62-fc0436027b1a)
![image](https://github.com/magiciansz/NUS-RetiMark/assets/60168038/8b1cd704-6f7f-42eb-99a5-701eb2a9c2ce)

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
- Open the `./dashboard/.env-example` file on a text editor, and create a .env file in the ./dashboard/.venv folder (if it hasn't been created). Copy the code from .env-example and fill up the environment variables accordingly:
  - `EXPRESS_ENDPOINT_URL`: URL of Express backend
- run `streamlit run home.py`. The dashboard listens on port 8501.

## Testing (For Express Backend)

- cd into `./backend`
- Please install [localstack](https://github.com/localstack/localstack) on your endpoint, and run `localstack start -d`.
- Create a S3 bucket by running `aws s3 mb s3://{BUCKET_NAME} --endpoint-url http://localhost:4566`

To run all tests, run `npm test`. This runs the entire test suite based on the test files declared in the `./test` folder

To run a specific test file, run `npm test -- tests/integration/patient.test.js`

## Github Actions (For Express Backend)

We automate testing and deployments of our Express backend during code changes. We do not test and deploy other services as the entire pipeline would be extremely time-consuming, for each code change made.
We also introduce automated version caching, which automates release notes and archiving of version files.

### Continuous Integration

To enable Continuous Integration through Github Actions, we provide a `test_staging.yml` file in the `.github/workflows/` directory. The workflow is designed to run automatically each time a pull request is raised in develop, ensuring that the code changes do not break any API logic in our express backend.

### Continuous Deployment

To enable Continuous Deployment through Github Actions, we provide a `deploy_staging.yml` file in the `.github/workflows/` directory. The workflow is designed to run automatically each time a pull request is merged into develop. It then builds the Express backend image, pushes it to AWS ECR and initiates a re-deployment of our staging server on AWS ECR. Please remember to add in your AWS Access Key and Secret Access ID to GitHub Secrets to run this pipeline.

We also provide a `deploy_flask_staging.yml` file in the `.github/workflows/` directory. This workflow has to be run manually, and it serves to build the Flask backend image and push it to AWS ECR. As building the image takes considerable time, we did not integrate this into our CI/CD process which runs for every pull request into develop. Instead, we allow developers to run it manually.

### Automated Version Caching

![Screenshot 2023-11-12 at 4 33 29 PM](https://github.com/magiciansz/NUS-RetiMark/assets/80561550/8f22ebad-4408-4a02-bde2-96f2b48a2409)


To enable automated version caching each time the develop branch is merged into main, we provide a `release.yml` in the `.github/workflows/` directory. This workflow has to be run manually. It automatically compiles all changes made based on pull request titles:

![Screenshot 2023-11-12 at 4 15 02 PM](https://github.com/magiciansz/NUS-RetiMark/assets/80561550/9aa1abf0-ffa5-4117-8f8a-2ffa40efd5ee)

The changes are then summarised in the release notes.  The automatic capturing of release notes based on pull request titles follows the format defined in the [semantic-release](https://github.com/semantic-release/semantic-release) package.


![Screenshot 2023-11-12 at 4 16 14 PM](https://github.com/magiciansz/NUS-RetiMark/assets/80561550/b87a6ce8-2b30-4318-be47-6e98ea56d90b)

A .zip file is generated as well, which archives all source code for the release.

![image](https://github.com/magiciansz/NUS-RetiMark/assets/80561550/401bdb75-5244-4604-923b-6e4fe4739157)




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
- [Sequelize](https://sequelize.org/)
- [Jest](https://jestjs.io/)
- [Amazon Web Services](https://aws.amazon.com/)

## Authors

- Ng Xiang Han - [GitHub](https://github.com/magiciansz)
- Seah Jia Jun - [GitHub](https://github.com/jiajun-seah)
- Tan Jia Hui - [GitHub](https://github.com/jiahuitan36)
- Glenn Bjorn Chia - [GitHub](https://github.com/glennbjorn)
- Josiah Foo - [GitHub](https://github.com/josiahfoo99)
