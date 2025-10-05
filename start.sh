#!/bin/bash
# Start backend server
node server/index.js &

# Wait for backend to start
sleep 2

# Start frontend
cd client && PORT=5000 HOST=0.0.0.0 DANGEROUSLY_DISABLE_HOST_CHECK=true WDS_SOCKET_PORT=0 npm start
