

const typingForm = window.document.querySelector(".typing-form");
const chatList = document.querySelector(".chat-list");
const suggestions = document.querySelectorAll(".suggestion-list .suggestion");
const toggleThemeButton = document.querySelector("#toggle-theme-button");
const deleteChatButton = document.querySelector("#delete-chat-button");

let userMsg = null;
let isResponseGenerating = false;


fetch('./config.json')
  .then(response => response.json())
  .then(config => {
    window.APIKEY = config.API_KEY;
    window.APIURL = config.API_URL+`?key=${window.APIKEY}`;
  })
  .catch(error => {
    console.error('Error fetching config.json:', error);
  });

const loadLocalStorageData = () => {
    const savedChats = localStorage.getItem("savedChats");
    const isLightMode = (localStorage.getItem("themeColor") === "light_mode");

    // Apply the stored theme
    document.body.classList.toggle("light_mode", isLightMode);
    toggleThemeButton.innerText = isLightMode ? "dark_mode" : "light_mode";

    // Restore saved chats
    chatList.innerHTML = savedChats || "";

    document.body.classList.toggle("hide-header",savedChats); 
    chatList.scrollTo(0, chatList.scrollHeight); // Scroll to the bottom
}

loadLocalStorageData();

// Create a new message element and return it
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
}

// Show typing effect by displaying words one by one
const showTypingEffect = (text, textElement, incomingMessageDiv) => {
    const words = text.split(' ');
    let currentWordIndex = 0;

    const typingInterval = setInterval(() => {
        // Append each word to the text element with a space
        textElement.innerText += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex++];
        incomingMessageDiv.querySelector(".icon").classList.add("hide");

        // If all words are displayed
        if (currentWordIndex === words.length) {
            clearInterval(typingInterval);
            isResponseGenerating = false;
            incomingMessageDiv.querySelector(".icon").classList.remove("hide");
            localStorage.setItem("savedChats", chatList.innerHTML); // Save chats to local storage
        }
        chatList.scrollTo(0, chatList.scrollHeight); // Scroll to the bottom 
    }, 75)
}

// Fetch response from the API based on user message
const generateAPIResponse = async (incomingMessageDiv) => {
    const textElement = incomingMessageDiv.querySelector(".text"); // Get text element
    // Send a POST request to the API with the user's message
    try {
        const response = await fetch((window.APIURL), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: userMsg }]
                }]
            })
        });

        const data = await response.json();
        if(!response.ok){
            throw new Error(data.error.message);
        }

        //console.log(data);

        // Get the API response text and remove asterisks from it
        const APIResponse = data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
        //console.log(APIResponse);
        //textElement.innerText = APIResponse;
        showTypingEffect(APIResponse, textElement, incomingMessageDiv);
    }
    catch (error) {
        isResponseGenerating = false;
        //console.log(error);
        textElement.innerText = error.message;
        textElement.classList.add("error");
    }
    finally {
        incomingMessageDiv.classList.remove("loading");
    }
}

// Show a loading animation while waiting for the API response
const showLoadingAnimation = () => {
    const html = `<div class="message-content">
                    <img src="./images/Gemini.jpg" alt="Gemini Image" class="avatar">
                    <p class="text"></p>
                    <div class="loading-indicator">
                        <div class="loading-bar"></div>
                        <div class="loading-bar"></div>
                        <div class="loading-bar"></div>
                    </div>
                </div>
                <span onclick="copyMessage(this)" class="icon material-symbols-rounded hide">content_copy</span>`;

    const incomingMessageDiv = createMessageElement(html, "incoming", "loading");
    chatList.appendChild(incomingMessageDiv);

    chatList.scrollTo(0, chatList.scrollHeight); // Scroll to the bottom
    generateAPIResponse(incomingMessageDiv);
}

// Copy message text to the clipboard
const copyMessage = (copyIcon) => {
    const messageText = copyIcon.parentElement.querySelector(".text").innerText;

    navigator.clipboard.writeText(messageText);
    copyIcon.innerText = "done"; // Show tick icon
    setTimeout(() => copyIcon.innerText = "content_copy", 1000); // Revert icon after 1 second
}

// Handle sending outgoing chat message
const handleOutgoingChat = () => {
    userMsg = typingForm.querySelector(".typing-input").value.trim() || userMsg;
    if (!userMsg || isResponseGenerating ) {
        return; // Exit if there is no message
    }
    isResponseGenerating = true;

    //console.log(userMsg);

    const html = `<div class="message-content">
                    <img src="./images/User.jpeg" alt="User Image" class="avatar">
                    <p class="text">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rem, molestias fugit. Officia reiciendis dolorem porro minima modi iure corporis eius accusamus expedita exercitationem suscipit possimus necessitatibus atque, distinctio nulla illum?</p>
                </div>`;

    const outgoingMessageDiv = createMessageElement(html, "outgoing");
    outgoingMessageDiv.querySelector(".text").innerText = userMsg;
    chatList.appendChild(outgoingMessageDiv);

    typingForm.reset(); // Clear input field
    chatList.scrollTo(0, chatList.scrollHeight); // Scroll to the bottom
    document.body.classList.add("hide-header"); // Hide the header once the chat starts
    setTimeout(showLoadingAnimation, 500); // Show loading animation after a delay 
}

// Set userMessage and handle outgoing chat when a suggestion is clicked
suggestions.forEach(suggestion =>{
    suggestion.addEventListener("click",()=>{
        userMsg = suggestion.querySelector(".text").innerText;
        handleOutgoingChat();
    })
});


// Toggle between light and dark themes
toggleThemeButton.addEventListener("click", () => {
    const isLightMode = document.body.classList.toggle("light_mode");

    // Set theme although the page is refreshed
    localStorage.setItem("themeColor", isLightMode ? "light_mode" : "dark_mode");

    toggleThemeButton.innerText = isLightMode ? "dark_mode" : "light_mode";
});

// Delete all chats from local storage when button is clicked
deleteChatButton.addEventListener("click", ()=>{
    if(confirm("Are you sure you want to delete all messages?")){
        localStorage.removeItem("savedChats");
        loadLocalStorageData();
    }
});

// Prevent default form submission and handle outgoing chat
typingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    handleOutgoingChat();
});
