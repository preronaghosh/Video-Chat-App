
# Video Chat App

This is an implementation of a Video Chat webapp with direct, group calls within rooms and text based messenger features.

Users can directly call other active users or create rooms that other users can join.

WebRTC Implementation covers the following stages:
- Custom pre-offer and answer
- SDP offer and answer 
- ICE candidate exchanges
- Signalling server implementation using Socket IO



## Tech Stack

**Client:** React, Redux, CSS, WebRTC API, SocketIO Client

**Server:** Node, Express, PeerJS, SocketIO


## Run Locally

Clone the project

```bash
  git clone git@github.com:preronaghosh/Video-Chat-App.git
```

Change to backend directory, install dependencies and start server on http://localhost:5000/

```bash
  cd server/
  npm install
  npm start
```

Change to client directory, install dependencies and start the client on http://localhost:3000/

```bash
  cd app/
  npm install
  npm start
```