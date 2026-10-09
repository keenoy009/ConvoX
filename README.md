# ConvoX — Real-Time Chat Application

ConvoX is a full-stack real-time chat application built using the MERN stack. It enables users to communicate through a responsive messaging interface with real-time message delivery.

**Live Demo:** https://convo-x-phi.vercel.app/

## Features

- **Real-Time Messaging:** Send and receive messages using Socket.IO.
- **User Authentication:** Authenticate users before accessing protected functionality.
- **Conversation Management:** View users and interact through conversations.
- **Responsive Interface:** Access the application through a web-based interface.
- **Full-Stack Architecture:** Separate frontend and backend applications.

## Tech Stack

### Frontend
- React.js
- JavaScript
- HTML and CSS
- Vite

### Backend
- Node.js
- Express.js
- Socket.IO

### Development Tools
- Git and GitHub
- npm
- Vercel

> Keep only the technologies and features that are actually implemented in your version of ConvoX.

## Project Structure

```text
LIVE_CHAT_APP/
├── client/
│   ├── public/
│   ├── src/
│   ├── context/
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── controllers/
│   ├── lib/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── package.json
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Install the following before running the application:

- Node.js
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/keenoy009/ConvoX.git
cd ConvoX
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

Open another terminal from the project root:

```bash
cd server
npm install
```

### 4. Configure environment variables

Create a `.env` file in the appropriate application directory or directories.

Add the environment variables required by your implementation. For example:

```env
PORT=5000
```

Add any required authentication secrets, database connection strings, or frontend API URLs using the exact variable names expected by your code.

**Never commit real credentials or `.env` files to GitHub.**

### 5. Run the application

Start the backend using the script defined in `server/package.json`. For example, if the script is named `dev`:

```bash
cd server
npm run dev
```

Start the frontend in a separate terminal:

```bash
cd client
npm run dev
```

Open the local URL printed by Vite in your terminal.

> The commands above assume your `package.json` files contain the relevant scripts. Check those files if your scripts use different names.

## Deployment

Try the live application here:

https://convo-x-phi.vercel.app/

The frontend is deployed on Vercel. The backend must also be hosted and configured correctly for real-time messaging to work in production.

## Future Improvements

- Add automated tests for authentication and messaging.
- Improve error handling and connection recovery.
- Add message history, pagination, and delivery status if not already implemented.
- Improve security, input validation, and deployment monitoring.

## Author

**Keenoy Monteiro**

- GitHub: https://github.com/keenoy009
- LinkedIn: https://www.linkedin.com/in/keenoy-monteiro-08803b276/
- LeetCode: https://leetcode.com/u/keenoy009/

---

Built as a full-stack web development project to explore real-time communication and client-server application architecture.