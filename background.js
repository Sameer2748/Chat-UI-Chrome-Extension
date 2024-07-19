const API_KEY = 'AIzaSyA_BvkBqvhZpFMHF8kgJDK_FYR4KzLdOac';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'userQuery') {
    const userQuery = message.query;

    const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

    fetch(geminiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "system_instruction": {
          "parts": [
            { "text": "Answer the user's question as a chat assistant." }
          ]
        },
        "contents": [
          {
            "parts": [
              { "text": userQuery }
            ]
          }
        ]
      })
    })
    .then(response => response.json())
    .then(data => {
      const responseMessage = data.candidates[0].content.parts[0].text;

      if (sender.tab && sender.tab.id) {
        chrome.tabs.sendMessage(sender.tab.id, { type: 'llmResponse', response: responseMessage });
      } else {
        console.error('sender.tab is undefined. Cannot send response back to content script.');
      }

      sendResponse({ success: true });
    })
    .catch(error => {
      console.error('Error:', error);
      sendResponse({ success: false, error: error.message });
    });

    return true;
  }
});
