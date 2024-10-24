# first step (to install all the dependencies)
npm install

# Run the application
npm run start 
npm start

# Build Docker image using
docker build -t logging-frontend:1.0.0 .

# Run the Image using
docker run -d --name logging-frontend -p 3000:3000 logging-frontend:1.0.0
