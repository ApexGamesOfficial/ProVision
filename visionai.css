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
   STORAGE
   ========================================================= */

const CHAT_STORAGE_KEY =
  "provisionVisionAIChats";

const CURRENT_CHAT_STORAGE_KEY =
  "provisionVisionAICurrentChatId";


/*
  This storage layer is intentionally kept separate from
  the rest of the app.

  Later, when ProVision Accounts are added, these functions
  can be replaced with Supabase calls without rebuilding
  the entire History interface.
*/

const chatStorage = {

  loadChats() {

    try {

      const stored =
        localStorage.getItem(
          CHAT_STORAGE_KEY
        );


      if (!stored) {
        return [];
      }


      const parsed =
        JSON.parse(stored);


      if (!Array.isArray(parsed)) {
        return [];
      }


      return parsed
        .filter(
          (chat) =>
            chat &&
            typeof chat === "object" &&
            typeof chat.id === "string"
        )
        .map(
          normalizeStoredChat
        );

    } catch (error) {

      console.error(
        "VisionAI could not load chat history:",
        error
      );

      return [];

    }

  },


  saveChats(chatsToSave) {

    try {

      localStorage.setItem(
        CHAT_STORAGE_KEY,
        JSON.stringify(
          chatsToSave
        )
      );

    } catch (error) {

      console.error(
        "VisionAI could not save chat history:",
        error
      );

    }

  },


  loadCurrentChatId() {

    try {

      return (
        localStorage.getItem(
          CURRENT_CHAT_STORAGE_KEY
        ) || null
      );

    } catch {

      return null;

    }

  },


  saveCurrentChatId(chatId) {

    try {

      if (chatId) {

        localStorage.setItem(
          CURRENT_CHAT_STORAGE_KEY,
          chatId
        );

      } else {

        localStorage.removeItem(
          CURRENT_CHAT_STORAGE_KEY
        );

      }

    } catch (error) {

      console.error(
        "VisionAI could not save the current chat:",
        error
      );

    }

  }

};



/* =========================================================
   ELEMENTS
   ========================================================= */

const sidebar =
  document.getElementById(
    "sidebar"
  );

const sidebarOverlay =
  document.getElementById(
    "sidebarOverlay"
  );

const mobileMenuButton =
  document.getElementById(
    "mobileMenuButton"
  );

const sidebarClose =
  document.getElementById(
    "sidebarClose"
  );

const newChatButton =
  document.getElementById(
    "newChatButton"
  );

const historyNewChatButton =
  document.getElementById(
    "historyNewChatButton"
  );

const historyEmptyButton =
  document.getElementById(
    "historyEmptyButton"
  );

const welcomeScreen =
  document.getElementById(
    "welcomeScreen"
  );

const messages =
  document.getElementById(
    "messages"
  );

const chatArea =
  document.getElementById(
    "chatArea"
  );

const chatView =
  document.getElementById(
    "chatView"
  );

const historyScreen =
  document.getElementById(
    "historyScreen"
  );

const historyList =
  document.getElementById(
    "historyList"
  );

const historyEmpty =
  document.getElementById(
    "historyEmpty"
  );

const composerArea =
  document.getElementById(
    "composerArea"
  );

const chatForm =
  document.getElementById(
    "chatForm"
  );

const messageInput =
  document.getElementById(
    "messageInput"
  );

const sendButton =
  document.getElementById(
    "sendButton"
  );

const starterCards =
  document.querySelectorAll(
    ".starter-card"
  );

const sidebarLinks =
  document.querySelectorAll(
    ".sidebar-link"
  );



/* =========================================================
   STATE
   ========================================================= */

let chats =
  chatStorage.loadChats();

let currentChatId =
  chatStorage.loadCurrentChatId();

let conversation =
  [];

let requestInProgress =
  false;



/* =========================================================
   CHAT DATA HELPERS
   ========================================================= */

function normalizeStoredChat(chat) {

  const now =
    new Date().toISOString();


  const normalizedMessages =
    Array.isArray(chat.messages)
      ? chat.messages
          .filter(
            (message) =>
              message &&
              typeof message === "object" &&
              typeof message.content === "string" &&
              [
                "user",
                "assistant",
                "system"
              ].includes(
                message.role
              )
          )
          .map(
            (message) => ({
              role: message.role,
              content:
                message.content,
              createdAt:
                message.createdAt ||
                now
            })
          )
      : [];


  return {
    id:
      String(chat.id),

    title:
      typeof chat.title === "string" &&
      chat.title.trim()
        ? chat.title.trim()
        : "New conversation",

    createdAt:
      chat.createdAt ||
      now,

    updatedAt:
      chat.updatedAt ||
      chat.createdAt ||
      now,

    messages:
      normalizedMessages
  };

}



function createId() {

  if (
    window.crypto &&
    typeof window.crypto.randomUUID ===
      "function"
  ) {

    return window.crypto.randomUUID();

  }


  return (
    "chat-" +
    Date.now().toString(36) +
    "-" +
    Math.random()
      .toString(36)
      .slice(2, 10)
  );

}



function createChat(
  firstMessage = ""
) {

  const now =
    new Date().toISOString();


  const chat = {

    id:
      createId(),

    title:
      createChatTitle(
        firstMessage
      ),

    createdAt:
      now,

    updatedAt:
      now,

    messages:
      []

  };


  chats.unshift(
    chat
  );


  currentChatId =
    chat.id;


  saveChats();


  return chat;

}



function createChatTitle(text) {

  const cleanText =
    text
      .replace(/\s+/g, " ")
      .trim();


  if (!cleanText) {

    return "New conversation";

  }


  const maximumLength =
    52;


  if (
    cleanText.length <=
    maximumLength
  ) {

    return cleanText;

  }


  return (
    cleanText
      .slice(
        0,
        maximumLength
      )
      .trimEnd() +
    "…"
  );

}



function getChatById(
  chatId
) {

  return (
    chats.find(
      (chat) =>
        chat.id === chatId
    ) || null
  );

}



function getCurrentChat() {

  if (!currentChatId) {

    return null;

  }


  return getChatById(
    currentChatId
  );

}



function ensureCurrentChat(
  firstMessage = ""
) {

  let chat =
    getCurrentChat();


  if (!chat) {

    chat =
      createChat(
        firstMessage
      );

  }


  return chat;

}



function saveChats() {

  chats.sort(
    (a, b) =>
      new Date(
        b.updatedAt
      ).getTime() -
      new Date(
        a.updatedAt
      ).getTime()
  );


  chatStorage.saveChats(
    chats
  );


  chatStorage.saveCurrentChatId(
    currentChatId
  );

}



function addStoredMessage(
  role,
  content
) {

  const chat =
    ensureCurrentChat(
      role === "user"
        ? content
        : ""
    );


  const now =
    new Date().toISOString();


  chat.messages.push({

    role,

    content,

    createdAt:
      now

  });


  if (
    role === "user" &&
    (
      !chat.title ||
      chat.title ===
        "New conversation"
    )
  ) {

    chat.title =
      createChatTitle(
        content
      );

  }


  chat.updatedAt =
    now;


  currentChatId =
    chat.id;


  saveChats();


  return chat;

}



function syncConversationFromChat(
  chat
) {

  if (!chat) {

    conversation =
      [];

    return;

  }


  conversation =
    chat.messages
      .filter(
        (message) =>
          message.role === "user" ||
          message.role === "assistant"
      )
      .map(
        (message) => ({
          role:
            message.role,

          content:
            message.content
        })
      );

}



function getChatPreview(
  chat
) {

  if (
    !chat ||
    !Array.isArray(
      chat.messages
    ) ||
    chat.messages.length === 0
  ) {

    return "No messages yet.";

  }


  const lastUsefulMessage =
    [...chat.messages]
      .reverse()
      .find(
        (message) =>
          message.role === "user" ||
          message.role === "assistant"
      );


  if (!lastUsefulMessage) {

    return "No messages yet.";

  }


  const cleanText =
    lastUsefulMessage.content
      .replace(/[#>*_`~\-]/g, "")
      .replace(/\s+/g, " ")
      .trim();


  if (
    cleanText.length <= 110
  ) {

    return cleanText;

  }


  return (
    cleanText
      .slice(
        0,
        110
      )
      .trimEnd() +
    "…"
  );

}



function formatHistoryDate(
  dateString
) {

  const date =
    new Date(
      dateString
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return "";

  }


  const now =
    new Date();


  const today =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );


  const messageDay =
    new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );


  const difference =
    today.getTime() -
    messageDay.getTime();


  const oneDay =
    24 *
    60 *
    60 *
    1000;


  const time =
    date.toLocaleTimeString(
      [],
      {
        hour:
          "numeric",

        minute:
          "2-digit"
      }
    );


  if (
    difference === 0
  ) {

    return `Today · ${time}`;

  }


  if (
    difference === oneDay
  ) {

    return `Yesterday · ${time}`;

  }


  return date.toLocaleDateString(
    [],
    {
      month:
        "short",

      day:
        "numeric",

      year:
        date.getFullYear() !==
        now.getFullYear()
          ? "numeric"
          : undefined
    }
  );

}



/* =========================================================
   SIDEBAR
   ========================================================= */

function openSidebar() {

  if (!sidebar) {
    return;
  }


  sidebar.classList.add(
    "open"
  );


  sidebarOverlay?.classList.add(
    "active"
  );

}



function closeSidebar() {

  if (!sidebar) {
    return;
  }


  sidebar.classList.remove(
    "open"
  );


  sidebarOverlay?.classList.remove(
    "active"
  );

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
   ACTIVE NAVIGATION
   ========================================================= */

function setActiveSection(
  section
) {

  sidebarLinks.forEach(
    (link) => {

      link.classList.toggle(
        "active",
        link.dataset.section ===
          section
      );

    }
  );

}



/* =========================================================
   VIEW SWITCHING
   ========================================================= */

function showChatView(
  focusInput = true
) {

  if (chatView) {

    chatView.hidden =
      false;

  }


  if (historyScreen) {

    historyScreen.hidden =
      true;

  }


  if (composerArea) {

    composerArea.hidden =
      false;

  }


  setActiveSection(
    "chat"
  );


  if (
    focusInput &&
    messageInput
  ) {

    requestAnimationFrame(
      () => {
        messageInput.focus();
      }
    );

  }

}



function showHistoryView() {

  renderHistory();


  if (chatView) {

    chatView.hidden =
      true;

  }


  if (historyScreen) {

    historyScreen.hidden =
      false;

  }


  if (composerArea) {

    composerArea.hidden =
      true;

  }


  if (chatArea) {

    chatArea.scrollTop =
      0;

  }


  setActiveSection(
    "history"
  );

}



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
      messageInput.value
        .trim()
        .length > 0;


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



function showWelcomeScreen() {

  messages?.classList.remove(
    "active"
  );


  welcomeScreen?.classList.remove(
    "hidden"
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
    typeof window.marked ===
      "undefined" ||
    typeof window.DOMPurify ===
      "undefined"
  ) {

    return null;

  }


  const rendered =
    window.marked.parse(
      text,
      {
        gfm:
          true,

        breaks:
          true
      }
    );


  return window.DOMPurify.sanitize(
    rendered,
    {
      USE_PROFILES: {
        html:
          true
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


  if (
    role === "assistant"
  ) {

    avatar.textContent =
      "V";

  } else if (
    role === "system"
  ) {

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


  if (
    role === "assistant"
  ) {

    name.textContent =
      "VisionAI";

  } else if (
    role === "system"
  ) {

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


  if (
    role === "assistant"
  ) {

    const renderedMarkdown =
      renderMarkdown(
        text
      );


    if (
      renderedMarkdown !==
      null
    ) {

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
   RENDER CURRENT CHAT
   ========================================================= */

function renderChat(
  chat
) {

  if (!messages) {
    return;
  }


  messages.innerHTML =
    "";


  if (
    !chat ||
    !Array.isArray(
      chat.messages
    ) ||
    chat.messages.length === 0
  ) {

    conversation =
      [];


    showWelcomeScreen();


    return;

  }


  chat.messages.forEach(
    (message) => {

      addMessage(
        message.role,
        message.content
      );

    }
  );


  syncConversationFromChat(
    chat
  );

}



/* =========================================================
   OPEN CHAT
   ========================================================= */

function openChat(
  chatId
) {

  const chat =
    getChatById(
      chatId
    );


  if (!chat) {
    return;
  }


  currentChatId =
    chat.id;


  chatStorage.saveCurrentChatId(
    currentChatId
  );


  syncConversationFromChat(
    chat
  );


  renderChat(
    chat
  );


  showChatView();


  closeSidebar();


  if (chatArea) {

    requestAnimationFrame(
      () => {

        chatArea.scrollTop =
          chatArea.scrollHeight;

      }
    );

  }

}



/* =========================================================
   HISTORY
   ========================================================= */

function renderHistory() {

  if (
    !historyList ||
    !historyEmpty
  ) {

    return;

  }


  historyList.innerHTML =
    "";


  const sortedChats =
    [...chats].sort(
      (a, b) =>
        new Date(
          b.updatedAt
        ).getTime() -
        new Date(
          a.updatedAt
        ).getTime()
    );


  if (
    sortedChats.length === 0
  ) {

    historyList.hidden =
      true;


    historyEmpty.hidden =
      false;


    return;

  }


  historyList.hidden =
    false;


  historyEmpty.hidden =
    true;


  sortedChats.forEach(
    (chat) => {

      const item =
        document.createElement(
          "article"
        );


      item.className =
        "history-item";


      item.dataset.chatId =
        chat.id;


      if (
        chat.id ===
        currentChatId
      ) {

        item.classList.add(
          "current"
        );

      }


      const openButton =
        document.createElement(
          "button"
        );


      openButton.className =
        "history-item-main";


      openButton.type =
        "button";


      openButton.setAttribute(
        "aria-label",
        `Open conversation: ${chat.title}`
      );


      const textWrap =
        document.createElement(
          "div"
        );


      textWrap.className =
        "history-item-text";


      const title =
        document.createElement(
          "h2"
        );


      title.textContent =
        chat.title;


      const preview =
        document.createElement(
          "p"
        );


      preview.textContent =
        getChatPreview(
          chat
        );


      textWrap.append(
        title,
        preview
      );


      const meta =
        document.createElement(
          "div"
        );


      meta.className =
        "history-item-meta";


      const date =
        document.createElement(
          "span"
        );


      date.className =
        "history-date";


      date.textContent =
        formatHistoryDate(
          chat.updatedAt
        );


      meta.appendChild(
        date
      );


      openButton.append(
        textWrap,
        meta
      );


      const deleteButton =
        document.createElement(
          "button"
        );


      deleteButton.className =
        "history-delete-button";


      deleteButton.type =
        "button";


      deleteButton.setAttribute(
        "aria-label",
        `Delete conversation: ${chat.title}`
      );


      deleteButton.title =
        "Delete conversation";


      deleteButton.textContent =
        "×";


      openButton.addEventListener(
        "click",
        () => {

          openChat(
            chat.id
          );

        }
      );


      deleteButton.addEventListener(
        "click",
        (event) => {

          event.stopPropagation();


          deleteChat(
            chat.id
          );

        }
      );


      item.append(
        openButton,
        deleteButton
      );


      historyList.appendChild(
        item
      );

    }
  );

}



/* =========================================================
   DELETE CHAT
   ========================================================= */

function deleteChat(
  chatId
) {

  const chat =
    getChatById(
      chatId
    );


  if (!chat) {
    return;
  }


  const shouldDelete =
    window.confirm(
      `Delete "${chat.title}"? This conversation will be removed from this browser.`
    );


  if (!shouldDelete) {
    return;
  }


  chats =
    chats.filter(
      (item) =>
        item.id !== chatId
    );


  if (
    currentChatId ===
    chatId
  ) {

    currentChatId =
      null;


    conversation =
      [];


    if (messages) {

      messages.innerHTML =
        "";

    }


    showWelcomeScreen();

  }


  saveChats();


  renderHistory();

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


  showChatView(
    false
  );


  requestInProgress =
    true;


  sendButton.disabled =
    true;


  /*
    Create the chat only when the first real message
    is sent. This prevents empty conversations from
    filling History every time New Chat is clicked.
  */

  ensureCurrentChat(
    trimmedText
  );


  addMessage(
    "user",
    trimmedText
  );


  addStoredMessage(
    "user",
    trimmedText
  );


  syncConversationFromChat(
    getCurrentChat()
  );


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
          method:
            "POST",

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


    addStoredMessage(
      "assistant",
      assistantText
    );


    syncConversationFromChat(
      getCurrentChat()
    );


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


    const visibleError =
      `VisionAI couldn't complete that request. ${errorMessage}`;


    addMessage(
      "system",
      visibleError
    );


    /*
      Store the visible error so History restores the
      conversation exactly as the user saw it.

      System errors are filtered out before future AI
      requests are sent.
    */

    addStoredMessage(
      "system",
      visibleError
    );


    syncConversationFromChat(
      getCurrentChat()
    );


  } finally {

    requestInProgress =
      false;


    sendButton.disabled =
      messageInput.value
        .trim()
        .length === 0;

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
          prompt.trim().length ===
          0;


        messageInput.focus();

      }
    );

  }
);



/* =========================================================
   NEW CHAT
   ========================================================= */

function startNewChat() {

  currentChatId =
    null;


  conversation =
    [];


  chatStorage.saveCurrentChatId(
    null
  );


  if (messages) {

    messages.innerHTML =
      "";

  }


  showWelcomeScreen();


  if (messageInput) {

    messageInput.value =
      "";

  }


  resizeTextarea();


  if (sendButton) {

    sendButton.disabled =
      true;

  }


  showChatView();


  closeSidebar();


  if (chatArea) {

    chatArea.scrollTop =
      0;

  }

}



newChatButton?.addEventListener(
  "click",
  startNewChat
);



historyNewChatButton?.addEventListener(
  "click",
  startNewChat
);



historyEmptyButton?.addEventListener(
  "click",
  startNewChat
);



/* =========================================================
   SIDEBAR NAVIGATION
   ========================================================= */

sidebarLinks.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        const section =
          button.dataset.section;


        if (
          section === "chat"
        ) {

          showChatView();

        } else if (
          section === "history"
        ) {

          showHistoryView();

        } else {

          /*
            Saved and Files are still planned.

            Keep the current VisionAI view visible until
            their real interfaces are built.
          */

          console.log(
            `${section} is planned for a future VisionAI update.`
          );

          setActiveSection(
            section
          );

        }


        closeSidebar();

      }
    );

  }
);



/* =========================================================
   RESTORE LAST CHAT
   ========================================================= */

function restoreLastChat() {

  if (!currentChatId) {

    showWelcomeScreen();

    return;

  }


  const chat =
    getChatById(
      currentChatId
    );


  if (!chat) {

    currentChatId =
      null;


    chatStorage.saveCurrentChatId(
      null
    );


    showWelcomeScreen();


    return;

  }


  syncConversationFromChat(
    chat
  );


  renderChat(
    chat
  );

}



/* =========================================================
   INITIAL STATE
   ========================================================= */

restoreLastChat();

renderHistory();

resizeTextarea();

setActiveSection(
  "chat"
);

messageInput?.focus();
