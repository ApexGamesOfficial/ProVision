/* =========================================================
   VISIONAI
   ProVision
   ========================================================= */


/* =========================================================
   BACKEND
   ========================================================= */

const VISIONAI_API_URL =
  "https://bcyxpmzrckjihgtqjqtu.supabase.co/functions/v1/visionai-chat";



/* =========================================================
   ELEMENTS
   ========================================================= */

const sidebar =
  document.getElementById("sidebar");

const sidebarOverlay =
  document.getElementById("sidebarOverlay");

const mobileMenuButton =
  document.getElementById("mobileMenuButton");

const sidebarClose =
  document.getElementById("sidebarClose");

const newChatButton =
  document.getElementById("newChatButton");

const welcomeScreen =
  document.getElementById("welcomeScreen");

const messages =
  document.getElementById("messages");

const chatArea =
  document.getElementById("chatArea");

const chatForm =
  document.getElementById("chatForm");

const messageInput =
  document.getElementById("messageInput");

const sendButton =
  document.getElementById("sendButton");

const starterCards =
  document.querySelectorAll(".starter-card");



/* =========================================================
   STATE
   ========================================================= */

let conversation = [];

let requestInProgress = false;



/* =========================================================
   SIDEBAR
   ========================================================= */

function openSidebar() {

  if (!sidebar) {
    return;
  }

  sidebar.classList.add("open");

  sidebarOverlay?.classList.add("active");

}


function closeSidebar() {

  if (!sidebar) {
    return;
  }

  sidebar.classList.remove("open");

  sidebarOverlay?.classList.remove("active");

}


mobileMenuButton?.addEventListener(
  "click",
  openSidebar
);


sidebarClose?.addEventListener(
  "click",
  closeSidebar
);


sidebarOverlay?.addEventListener(
  "click",
  closeSidebar
);



/* =========================================================
   TEXTAREA AUTO RESIZE
   ========================================================= */

function resizeTextarea() {

  if (!messageInput) {
    return;
  }

  messageInput.style.height =
    "auto";

  messageInput.style.height =
    `${Math.min(
      messageInput.scrollHeight,
      180
    )}px`;

}


messageInput?.addEventListener(
  "input",
  () => {

    resizeTextarea();

    const hasText =
      messageInput.value.trim().length > 0;

    sendButton.disabled =
      !hasText ||
      requestInProgress;

  }
);



/* =========================================================
   ENTER TO SEND
   ========================================================= */

messageInput?.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      chatForm?.requestSubmit();

    }

  }
);



/* =========================================================
   CHAT DISPLAY
   ========================================================= */

function showMessages() {

  welcomeScreen?.classList.add(
    "hidden"
  );

  messages?.classList.add(
    "active"
  );

}


function scrollToBottom() {

  if (!chatArea) {
    return;
  }

  requestAnimationFrame(
    () => {

      chatArea.scrollTop =
        chatArea.scrollHeight;

    }
  );

}



/* =========================================================
   MARKDOWN
   ========================================================= */

function renderMarkdown(text) {

  if (
    typeof window.marked === "undefined" ||
    typeof window.DOMPurify === "undefined"
  ) {

    return null;

  }


  const rendered =
    window.marked.parse(
      text,
      {
        gfm: true,
        breaks: true
      }
    );


  return window.DOMPurify.sanitize(
    rendered,
    {
      USE_PROFILES: {
        html: true
      }
    }
  );

}



/* =========================================================
   CREATE MESSAGE
   ========================================================= */

function addMessage(
  role,
  text
) {

  if (!messages) {
    return;
  }


  showMessages();


  const message =
    document.createElement(
      "article"
    );


  message.className =
    `message ${role}`;


  const avatar =
    document.createElement(
      "div"
    );


  avatar.className =
    "message-avatar";


  if (role === "assistant") {

    avatar.textContent =
      "V";

  } else if (role === "system") {

    avatar.textContent =
      "!";

  } else {

    avatar.textContent =
      "You";

  }


  const content =
    document.createElement(
      "div"
    );


  content.className =
    "message-content";


  const name =
    document.createElement(
      "span"
    );


  name.className =
    "message-name";


  if (role === "assistant") {

    name.textContent =
      "VisionAI";

  } else if (role === "system") {

    name.textContent =
      "VisionAI";

  } else {

    name.textContent =
      "You";

  }


  const messageText =
    document.createElement(
      "div"
    );


  messageText.className =
    "message-text";


  if (role === "assistant") {

    const renderedMarkdown =
      renderMarkdown(text);


    if (renderedMarkdown !== null) {

      messageText.innerHTML =
        renderedMarkdown;

    } else {

      messageText.textContent =
        text;

    }

  } else {

    messageText.textContent =
      text;

  }


  content.append(
    name,
    messageText
  );


  message.append(
    avatar,
    content
  );


  messages.appendChild(
    message
  );


  scrollToBottom();

}



/* =========================================================
   LOADING MESSAGE
   ========================================================= */

function addLoadingMessage() {

  if (!messages) {
    return null;
  }


  showMessages();


  const message =
    document.createElement(
      "article"
    );


  message.className =
    "message assistant";


  message.dataset.loading =
    "true";


  message.innerHTML = `
    <div class="message-avatar">
      V
    </div>

    <div class="message-content">

      <span class="message-name">
        VisionAI
      </span>

      <div class="message-text">
        Thinking…
      </div>

    </div>
  `;


  messages.appendChild(
    message
  );


  scrollToBottom();


  return message;

}



/* =========================================================
   SEND MESSAGE
   ========================================================= */

async function sendMessage(
  text
) {

  const trimmedText =
    text.trim();


  if (
    !trimmedText ||
    requestInProgress
  ) {
    return;
  }


  requestInProgress =
    true;


  sendButton.disabled =
    true;


  addMessage(
    "user",
    trimmedText
  );


  conversation.push({
    role: "user",
    content: trimmedText
  });


  messageInput.value =
    "";


  resizeTextarea();


  const loadingMessage =
    addLoadingMessage();


  try {

    const response =
      await fetch(
        VISIONAI_API_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify({
              messages:
                conversation
            })
        }
      );


    let data;


    try {

      data =
        await response.json();

    } catch {

      throw new Error(
        `VisionAI backend returned an invalid response. HTTP ${response.status}`
      );

    }


    if (!response.ok) {

      console.error(
        "VisionAI backend error:",
        data
      );


      throw new Error(
        data?.error ||
        data?.message ||
        `Request failed with HTTP ${response.status}`
      );

    }


    const assistantText =
      data?.reply ||
      data?.message ||
      data?.text;


    if (!assistantText) {

      throw new Error(
        "VisionAI returned an empty response."
      );

    }


    loadingMessage?.remove();


    addMessage(
      "assistant",
      assistantText
    );


    conversation.push({
      role: "assistant",
      content: assistantText
    });

  } catch (error) {

    console.error(
      "VisionAI error:",
      error
    );


    loadingMessage?.remove();


    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error";


    addMessage(
      "system",
      `VisionAI couldn't complete that request. ${errorMessage}`
    );

  } finally {

    requestInProgress =
      false;


    sendButton.disabled =
      messageInput.value.trim().length === 0;

  }

}



/* =========================================================
   FORM SUBMIT
   ========================================================= */

chatForm?.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();


    sendMessage(
      messageInput.value
    );

  }
);



/* =========================================================
   STARTER CARDS
   ========================================================= */

starterCards.forEach(
  (card) => {

    card.addEventListener(
      "click",
      () => {

        const prompt =
          card.dataset.prompt ||
          "";


        messageInput.value =
          prompt;


        resizeTextarea();


        sendButton.disabled =
          prompt.trim().length === 0;


        messageInput.focus();

      }
    );

  }
);



/* =========================================================
   NEW CHAT
   ========================================================= */

function startNewChat() {

  conversation =
    [];


  messages.innerHTML =
    "";


  messages.classList.remove(
    "active"
  );


  welcomeScreen.classList.remove(
    "hidden"
  );


  messageInput.value =
    "";


  resizeTextarea();


  sendButton.disabled =
    true;


  closeSidebar();


  chatArea.scrollTop =
    0;


  messageInput.focus();

}


newChatButton?.addEventListener(
  "click",
  startNewChat
);



/* =========================================================
   SIDEBAR NAVIGATION
   ========================================================= */

document
  .querySelectorAll(
    ".sidebar-link"
  )
  .forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              ".sidebar-link"
            )
            .forEach(
              (link) => {

                link.classList.remove(
                  "active"
                );

              }
            );


          button.classList.add(
            "active"
          );


          const section =
            button.dataset.section;


          if (
            section !== "chat"
          ) {

            console.log(
              `${section} is planned for a future VisionAI update.`
            );

          }


          closeSidebar();

        }
      );

    }
  );



/* =========================================================
   INITIAL STATE
   ========================================================= */

resizeTextarea();

messageInput?.focus();
