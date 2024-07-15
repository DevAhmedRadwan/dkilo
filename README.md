# dkilo

# API docs will work only when NODE_ENV=development on /api/docs

# Overview of the system architecture

- The system uses Express.js for handling HTTP requests.
- Dependency injection is implemented using InversifyJS.
- TypeORM is used for Object-Relational Mapping (ORM) to interact with the database.
- GeoJSON data is read from files for geographical operations (so i don't use a third party api).
- There are services like QRCodeService, ScanService, ConversionService, and ReportService for handling business logic.
- Entities like QRCode, Scan, Conversion, and Campaign are defined to represent database tables.
- Environment variables are managed using nodejs, joi and EnvManager to provide configuration settings.
- Various DTOs are used for data validation and transfer.
- Redis is used for caching.
- mysql is used as main database.
- Swagger is integrated for API documentation.

# component and their interactions

- the campaign componenet is used for creating and managing campaigns.
- qr component is used for creating and managing QR codes and generating qr codes.
- scan component is used for manageing scan data and collecting data from and redirected the device that made the scan. it also serve a simple page to get concent for the location data.
- the conversion component is used for managing conversion data. it maily used by the advertiser to send the conversion data using the scan id send with the redirect
- the report component is used to generate a report using a campsaign id.

# Flow of the application

- Create a campaign
- Create QR code
- Use the generate qrcode endpoint to fetch an image qr code to use at any device you want as an advertiser
- when the user scan the qr code it will take him to a page to get concent for the location data then redirect him to the qr code redirect url with special query parameter called scanId={number}
- the advertizer will use this number to track the scan conversion
- the advertizer will use the conversion endpoint to set the conversion data for the scan
- the report component will be used to generate a report using the campaign id when the advertizer ask for the report

# Assumptions

- the advertizer will trak the user conversion using the query paramter and report it to the service
- assumed the advertizer will set the conversion data for the scan by the count of action he considered to be a conversion
- i created the conversion table because it's mentioned by name in the task but if it will llok like this it should be a column in the scan table
- the nodejs in task description meant using expressjs
- the use of ward table in the task description meant using sql database
- the omission of autherization, authentication, gurds, request limiting, testing, diagrams, logging, ...etc to limit the scope of the task
- the geographical distribution in report meant the country or state (used country to use a smaller file since i don't intend on using a third party api in this task)
- the task is asking for backend code only so i didn't create a frontend unless i needed it and i used nodejs templates for the frontend

# NOTE

- i attempted to inquire via email for additional details regarding the task, but unfortunately did not receive a response. Therefore, I proceeded with what I deemed to be the most logical approach.

- currently the project work only on mysql because the migration file is generated using typeorm if you want to use any other database, you will have to generate a new migration file according to your database. this project is tested only with sqlserver and mysql

- if the user set the project so he can access the server his phone it can be tested using mobile phone. this project tested on linux and android

# Installation

- local

  - after installing nodejs version 20, mysql, redis
  - create the database on mysql
  - create development.env (npm run start:dev) or create production.env (npm run build && npm run start) from the example.env
  - npm install
  - npm run start:dev or npm tun build && npm run start
  - important links will be logged when the project start

- docker
  - after installing docker
  - create docker.env there example-docker.env for refrance
  - docker compose up --build

# NOTE

the existing docker setup is intended to be used as a demo not in production (not secure and no volume) or as development (no volume and no hot reload) environment
