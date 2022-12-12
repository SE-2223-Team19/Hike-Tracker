# Hike-Tracker

Credentials:

email: test_localGuide@test.it
password: password
user type: local_guide

email: test_Hiker@test.it
password: password
user type: hiker

email: test_PlatformManager@test.it
password: password
user type: platform manager

email: test_hutWorker@test.it
password: password
user type: hut worker

email: michelemochi@test.it
password: password
user type: local_guide

email: pouya@test.it
password: password
user type: local_guide

# Docker Instructions

- Create .env file in server folder

  MONGO_HOST=mongo
  MONGO_PORT=27017
  MONGO_DB=hike-tracker
  SERVER_PORT=8080
  DEFAULT_PASSWORD = password

- Launch "docker-compose up"
