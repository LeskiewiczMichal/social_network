# My Social Media Website

## Overview

This is a social media website that I built using React with TypeScript for the frontend and Express with TypeScript for the backend. I also used Redux for state management and Socket.io for live features. The website is fully responsive and works well on different devices.

[Click here to see a preview of the project](<https://social-network-77vt.onrender.com>), you will propably need to wait a minute for server cold start.

## Features

- User authentication and registration
- Create, edit, and delete posts
- Like and comment on posts
- Real-time notifications
- Live chat with other users
- Make other users your friends
- Fully responsive design
- Dark mode support

## Technologies Used

- React with TypeScript
- Redux
- Express with TypeScript
- Socket.io
- MongoDB
- TailwindCSS

## Getting Started

To run this project locally, follow these steps:

1. Clone the repository to your local machine.
2. Install the dependencies by running `npm install` server directory.
3. Start the server by running `npm run dev` in the server directory.
4. Open your browser and navigate to `http://localhost:8080` to see the website.

Keep in mind that the app will still communicate with api from render so you will propably need to wait a minute for the server to cold start.
Alternatively, you can change client/.env and client/package.json: "proxy" values to "http://localhost:8080" and `run npm run build` to run from your local machine.

### Credits:
    Phoenix logo: https://www.svgrepo.com/svg/354177/phoenix
    Messages icon: https://www.svgrepo.com/svg/505433/message-square-lines?edit=true
    Notification icon: https://www.svgrepo.com/svg/487632/notification-bell?edit=true
    Post comment: https://www.svgrepo.com/svg/505999/send-1