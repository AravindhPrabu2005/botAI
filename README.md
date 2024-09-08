Gemini Clone

Gemini Clone is a simple web-based chat interface designed to mimic the look and feel of a conversational assistant. It leverages HTML, CSS, and JavaScript to provide a user-friendly experience with features like dark/light mode switching, local storage for saving chats, and API integration for generating responses.

Table of Contents

Demo:

Check out a live demo of the project here. https://github.dev/Neeharika-Saha/GeminiClone

Features:

• User-friendly chat interface

• Dark and light mode themes

• Copy the content of chat

• Local storage to save and restore chats

• Interactive suggestions

• API integration for generating chat responses

• Responsive design for various screen sizes

Usage:

• Chat Interface

Type a prompt in the input field at the bottom of the screen and press Enter or click the send button.
Click on any of the suggestion cards to quickly input a predefined prompt.
The chat interface will show the user's message and generate a response using the API.
• Theme Switching

Toggle between dark and light mode by clicking the light/dark mode button in the typing area.
• Local Storage

The chat history is saved in local storage and will be restored on page reload.
To clear the chat history, click the delete button in the typing area and confirm the action.
Project Structure:

• Icons/: Contains the favicon for the project.

• images/: Contains images used in the chat interface.

• script.js: Contains the JavaScript code for the project.

• style.css: Contains the CSS code for the project.

• index.html: The main HTML file for the project.

API Configuration:

The project uses the Google Generative Language API to generate chat responses. To set up the API:

• Obtain your own API key from Google Cloud (Google AI for Developer).

• Create a config.json file in your local repository and replace it by 
  {
    "API_KEY": "YOUR_API_KEY_HERE",
    "API_URL": "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent"
  }
  
Customization:

• Styles: Modify the style.css file to customize the look and feel of the chat interface.

• JavaScript: Modify the script.js file to add or change functionalities, such as adding more interactive features or modifying the chat behavior.

License:

• This project is licensed under the MIT License.
