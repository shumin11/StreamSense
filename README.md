# StreamWise AI: Smart Streaming Subscription Assistant

**StreamWise AI** is an AI-powered chatbot that helps users make **cost-effective** decisions about their video streaming subscriptions. With so many platforms (Netflix, Disney+, Prime Video, etc.), users often overspend on multiple subscriptions.

StreamWise AI empowers users by:
- 📅 **Tracking upcoming shows** on various platforms.
- 🎯 **Recommending the best platforms** based on personal viewing preferences.
- 💸 **Suggesting which subscriptions to pause/unsubscribe** to save money.

---

## 🎯 Project Goals

- **Save Money:** Provide personalized recommendations to help users make informed decisions about their streaming subscriptions. (stretch)
- **AI-Driven Insights:** Leverage the Azure AI Foundry API to respond to user queries, offering tailored suggestions based on personal preferences.
- **RAG (Retrieval-Augmented Generation):** Enhance responses by combining real-time data from a movie database with generative AI responses.
- **Smart Query Generation:** Dynamically generate SQL queries to fetch relevant data from a database based on user input.
- **Automated Data Updates:** Use Cron jobs to periodically fetch the latest streaming content and update the movie database.
- **User-Friendly Experience:** Ensure the chatbot interface is easy to use and visually appealing with rich media and dynamic responses.

---

## 🚀 Features

- **Chatbot with AI-Powered Responses:** Answers queries with movie recommendations and subscription advice.
- **Database Management:** Stores data on available movies, streaming platforms, and release dates for easy querying.
- **SQL Query Generation:** AI generates SQL queries based on user input for efficient data retrieval.
- **Rich Media Responses:** Provides movie details, release dates, streaming platforms, and clickable resource links.
- **Automated Data Updates:** Periodically fetches and updates movie data using Cron jobs.
- **Subscription Cost Analysis:** Track, compare, and optimize subscription costs.
- **RAG for Enhanced Responses:** Retrieve real-time movie/show data from the database and augment it with AI-generated context.

---

## 📖 Architecture Overview

### **System Diagram**

```plaintext
+------------------+        +-----------------------+
|  Frontend (React) | <----> |  Backend (Node.js)    |
+------------------+        +-----------------------+
          |                            |
          v                            v
+-------------------+         +----------------------+
|  Azure AI API  | <---->  |   SQLite Database    |
+-------------------+         +----------------------+
          |                            |
          v                            v
  +----------------+         +--------------------+
  |  Web Scraper    | <---->  |  Cron Job Service  |
  +----------------+         +--------------------+
          |
          v
  +----------------+
  | RAG Pipeline    |
  +----------------+
```

## ⚙️ Tech Stack

- **Frontend:** React, TailwindCSS/Bootstrap
- **Backend:** Node.js, Express.js
- **AI Model:** Azure AI Foundry (GPT-4 / GPT-3.5/ Deepseek)
- **Database:** SQLite
- **Scraper:** Cheerio / Puppeteer
- **Scheduler:** Node-cron or CronTab
- **RAG Framework:** Custom Retrieval Pipeline to augment responses

---

## 🔥 Core Features

- **Chatbot with AI-powered responses.**
- **SQL Query Generation:** Dynamically generate and execute SQL queries.
- **Movie & Show Discovery:** List upcoming movies and shows across multiple platforms.
- **RAG-Enhanced Recommendations:** Retrieve relevant real-time data and enrich responses with AI-generated suggestions.
- **Rich Media Display:** Responses with images, resource links, and clean UI.
- **Subscription Cost Management:** Add, update, and analyze subscription costs.
- **Automated Data Updates:** Cron job for periodic database updates.

---

## 🧠 What is RAG (Retrieval-Augmented Generation)?

**Retrieval-Augmented Generation (RAG)** combines the power of real-time data retrieval with the flexibility of generative models to produce highly accurate and context-rich responses.

### **How StreamWise AI Uses RAG:**

1. **User Query:**  
   A user asks, “What shows are coming to Netflix next month?”
   
2. **Query Generation:**  
   The system generates a SQL query to retrieve relevant shows from the movie database.

3. **Data Retrieval:**  
   The query fetches up-to-date information from the SQLite database.

4. **AI Augmentation:**  
   The retrieved data is passed to the AI model, which enhances the response by adding insights, descriptions, and recommendations.

5. **Rich Response:**  
   The AI generates a user-friendly response with clickable links, images, and subscription advice.

---

## 🗂️ Database Schema

```sql
CREATE TABLE shows (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  release_date TEXT,
  platform TEXT,
  image_url TEXT,
  resource_link TEXT
);
```

```sql
CREATE TABLE subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  platform TEXT,
  plan_type TEXT,
  monthly_cost REAL,
  renewal_date TEXT,
  auto_renew BOOLEAN
);
```

## 🗂️ API Endpoints

| Method | Endpoint         | Description                       |
|--------|------------------|-----------------------------------|
| GET    | /api/movies       | Get list of all movies           |
| GET    | /api/movies/:id   | Get details of a specific movie  |
| POST   | /api/query        | Run SQL query based on user input |
| POST   | /api/chat         | Send user input to AI model       |
| POST   | /api/scrape       | Trigger web scraper manually     |

---

## ⏱️ Cron Job & Scraper

- **Purpose:** Fetch and update streaming data automatically.
- **Schedule:** Run every 1 month.
- **Scraper Logic:** Extract show data (title, release date, image, platform).
- **Data Persistence:** Store the extracted data in the SQLite database for querying.

---

## 🤖 Query Generation Logic

### **User Input**
"What shows are coming to Netflix next month?"

### **Generated Prompt**
myPrompt = "User input is {user_input}, my table schema is {title, release_date, platform},\n\n can you write a SQLite script to get what the user wants in executable query format?"

### **Generated SQL Query**

```sql
SELECT title, release_date, platform
FROM movies
WHERE platform = 'Netflix'
  AND release_date >= '2025-04-01'
  AND release_date <= '2025-04-30';
```

## 🎁 Deliverables

-  Fully functional chatbot integrated with Azure AI.
-  Accurate and dynamic movie/show data with regular updates.
-  API to query and fetch movie information.
-  Scraper with Cron job for data updates. (stretch)

---

## 🏆 Why StreamWise AI?

- 💡 **Money-Saving Insights:** Prioritize subscriptions that matter and cut out excess.
- ⚡ **Effortless Subscription Management:** AI handles the decision-making.
- 🎬 **Smart and Informed Viewing Choices:** Never miss must-watch content while keeping costs low.

---

## 🎥 Future Enhancements

- 📊 **Advanced Analytics:** Analyze user preferences to refine recommendations.
- 🔔 **Personalized Alerts:** Notify users about upcoming shows of interest.
- 🌐 **API Expansion:** Support additional streaming platforms.

---

## 🔗 Conclusion

**StreamWise AI** aims to revolutionize how users manage streaming subscriptions by offering cost-saving insights while keeping them entertained. By combining the power of **AI**, automation, and smart data analysis, StreamWise AI makes it easier than ever to stay entertained without breaking the bank.
