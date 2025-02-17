# NTU FYP Chatbot Frontend

This repository contains the frontend implementation for the NTU Final Year Project (FYP) Chatbot. The frontend is built using React (TypeScript) for handling user interactions and displaying chatbot responses.

## Features

The key features of the frontend include:

1. **Chat Interface**: Provides a user-friendly chat interface for interacting with the chatbot.

2. **Message Display**: Displays chatbot responses and user messages in a conversational format.

   - **Message Formatting**: Supports different message formats, such as text, files, codes, and images.
   - **Text-to-speech**: Converts chatbot responses to speech for users with visual impairments, or if you just lazy to read.

3. **User Input**: Allows users to input text messages, which include text, files and images.

   - **File Upload**: Supports file uploads for sharing documents, images, and other files.
   - **Image Upload**: Supports image uploads for sharing screenshots, photos, and other images.
   - **Speech-to-text**: Converts user voice input to text for users who are too lazy to type.

4. **Login and Registration**: Provides user authentication for securing chatbot data and profiles.

   - **User Authentication**: Supports user authentication for securing chatbot data and profiles.
   - **JSON Web Tokens (JWT)**: Uses JWT for generating and verifying tokens. This ensures that only authenticated users can access certain endpoints.

5. **Dashboards**: Displays dashboards for administrators, educators and students.

   - **Admin Dashboard**: Provides a user management platform.
   - **Educator Dashboard**: Allows educators to view and manage chatbot profiles.
   - **Student Dashboard**: Enables students to interact and access chatbot profiles.

6. **Settings**: Allows users to customize chatbot, or manage their account settings.

## Setup and Installation

The frontend code is already built (see `dist` folder), so you can simply run the [backend server](https://github.com/bryanluwz/NTU-FYP-Chatbot-backend).

However, the both the frontend and backend repositories are required to run the full chatbot system. Or if you want to save the mere megabytes of space, you can just save only the `dist` folder from the frontend repository. This way requires extra steps for the backend server to serve the frontend code (see [backend repository](https://github.com/bryanluwz/NTU-FYP-Chatbot-backend) for more details).

1. Clone this repository:

   ```bash
   git clone https://github.com/bryanluwz/NTU-FYP-Chatbot-frontend.git
   ```

2. Install the dependencies

   Only proceed with the following steps if you want to build / develop the frontend from source.

   An alternate way of developing the frontend is to build the frontend code such that the `dist` folder is updated with the latest changes, and then refresh the backend server. This way, you can develop the frontend without running the frontend server (see step 4 for how to build the frontend code).

   `yarn` is used for package management, but you can use `npm`or whatever if you prefer

   ```bash
   yarn install
   ```

3. Start the development server:
   (Since the frontend client and backend server might be on different ports, you might need to enable HTTPS, and specify the backend server URL in the `.env` file)

   ```bash
    yarn start
   ```

4. Build the frontend code:

   ```bash
   yarn build
   ```

   This will update the `dist` folder with the latest changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

1. [ME](https://github.com/bryanluwz) for building this awesome chatbot frontend, alone, with no help from humans. 🤖
