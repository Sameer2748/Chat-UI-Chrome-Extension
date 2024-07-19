// Check if the current URL matches the YouTube video URL pattern
if (window.location.href.match(/^https:\/\/www\.youtube\.com\/watch\?v=.*/)) {
    // Check if the Chat UI is already injected to avoid duplicate injection
    if (!document.getElementById('chat-ui')) {
        // Inject the Chat UI into the page
        const chatUI = document.createElement('div');
        chatUI.id = 'chat-ui';
        chatUI.style.position = 'fixed';
        chatUI.style.bottom = '10px';
        chatUI.style.right = '10px';
        chatUI.style.width = '350px';
        chatUI.style.height = '500px';
        chatUI.style.background = 'white';
        chatUI.style.border = '1px solid #ccc';
        chatUI.style.borderRadius = '10px';
        chatUI.style.zIndex = '10000';
        chatUI.innerHTML = `
            <div id="chat-header" style="display: flex; height: 30px; cursor: move; background: #ccc; padding: 5px; font-size: 12px;">
                <div style="display: flex; flex-direction: column;">
                    <strong style="font-size: 14px;">Chat Assistant By Sameer Rao</strong>
                    <p style="font-size: 14px;">Your YouTube Assistant</p>
                </div>
            </div>
            <div style="padding: 5px; height: 90%; gap: 2px; position: relative;">
                <div id="chat-response" style="width: 95%; height: 90%; overflow-y: scroll; border-top: 1px solid #ccc; margin-top: 5px; padding: 5px; font-size: 17px; gap: 3px;"></div>
                <div style="display: flex;">
                    <input type="text"  id="chat-input" style="width: 90%; border:0px 1px 0px; font-size:16px; height: 20px;">
                    <button id="send-query" style="width: 20%;">Send</button>
                </div>
            </div>
        `;
        document.body.appendChild(chatUI);

        // Make the chat UI draggable
        dragElement(document.getElementById("chat-ui"));

        // Event listener for sending the query
        document.getElementById('send-query').addEventListener('click', () => {
            const query = document.getElementById('chat-input').value;
            appendUserMessage(query);
            document.getElementById('chat-input').value = ''; // Clear input field
            appendLoadingMessage(); // Add loading message
            chrome.runtime.sendMessage({ type: 'userQuery', query: query });
        });
    }

    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener((message) => {
        if (message.type === 'llmResponse') {
            removeLoadingMessage(); // Remove loading message
            appendBotMessage(message.response);
        }
    });
}

function appendUserMessage(message) {
    const chatResponse = document.getElementById('chat-response');
    const messageElement = document.createElement('div');
    messageElement.className = 'message user-message';
    messageElement.innerHTML = `
        <div style="display: flex; padding-bottom: 15px;">
            <div style="flex-direction: column;">
                <h4>User 🥸</h4>
                <p>${message}</p>
            </div>
        </div>
        <hr>
    `;
    chatResponse.appendChild(messageElement);
    chatResponse.scrollTop = chatResponse.scrollHeight; // Scroll to the bottom
}

function appendLoadingMessage() {
    const chatResponse = document.getElementById('chat-response');
    const loadingElement = document.createElement('div');
    loadingElement.className = 'message loading-message';
    loadingElement.id = 'loading-message';
    loadingElement.innerHTML = `
        <div style="display: flex; padding-bottom: 15px;">
            <div style="flex-direction: column;">
                <h4>Chat UI Bot 🤖</h4>
                <p>Loading...</p>
            </div>
        </div>
    `;
    chatResponse.appendChild(loadingElement);
    chatResponse.scrollTop = chatResponse.scrollHeight; // Scroll to the bottom
}

function removeLoadingMessage() {
    const loadingElement = document.getElementById('loading-message');
    if (loadingElement) {
        loadingElement.remove();
    }
}

function appendBotMessage(message) {
    const chatResponse = document.getElementById('chat-response');
    const messageElement = document.createElement('div');
    messageElement.className = 'message bot-message';
    messageElement.innerHTML = `
        <div style="display: flex; padding-bottom: 15px;">
            <div style="flex-direction: column;">
                <h4>Chat UI Bot 🤖</h4>
                <p>${message}</p>
            </div>
        </div>
    `;
    chatResponse.appendChild(messageElement);
    chatResponse.scrollTop = chatResponse.scrollHeight; // Scroll to the bottom
}

// Function to make the chat UI draggable
function dragElement(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = document.getElementById("chat-header");
    if (header) {
        header.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
