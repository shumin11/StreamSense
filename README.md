# StreamWise AI: Smart Streaming Subscription Assistant

**StreamWise AI** is an AI-powered subscription recommendation system that helps users make **cost-effective** decisions about which streaming platforms to subscribe to based on upcoming content and their personal preferences. 

Instead of being a typical chatbot, **StreamWise AI** leverages the same backend technologies (AI models, SQL query generation, and RAG pipelines) to analyze user preferences and recommend the most relevant platforms for the next subscription cycle.

---
## 🎥 Demo Video


---

## 🎯 Project Goals

- **Save Money:** Provide personalized recommendations to help users make informed decisions about their streaming subscriptions. (stretch)
- **AI-Driven Insights:** Leverage the Azure AI Foundry API to respond to user queries, offering tailored suggestions based on personal preferences.
- **RAG (Retrieval-Augmented Generation):** Enhance responses by combining real-time data from a movie database with generative AI responses.
- **Smart Query Generation:** Dynamically generate SQL queries to fetch relevant data from a database based on user input.
- **Automated Data Updates:** Use Cron jobs to periodically fetch the latest streaming content and update the movie database.
- **User-Friendly Experience:** Ensure the chatbot interface is easy to use and visually appealing with rich media and dynamic responses.

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

- ✅ **Platform Recommendations for Next Month:**  
   Suggests the best platform(s) to subscribe to next month based on upcoming content and user preferences.  

- ✅ **SQL Query Generation:**  
   Dynamically generates and executes SQL queries to filter and fetch relevant shows and platform data.  

- ✅ **Movie & Show Discovery:**  
   Lists upcoming movies and shows across multiple platforms to help users decide.  

- ✅ **RAG-Enhanced Recommendations:**  
   Retrieves relevant real-time data from the database and enriches responses with AI-generated insights.  

- ✅ **Rich Media Display:**  
   Presents subscription recommendations with clickable resource links and detailed information about upcoming shows.  

- ❗ **Subscription Cost Management:**  
   Planned for future updates to analyze and optimize subscription costs.  

- ❗ **Automated Data Updates & Web Scraping:**  
   Considered but not yet implemented.
   
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


## 🏆 Why StreamWise AI?

- 💡 **Money-Saving Insights:** Prioritize subscriptions that matter and cut out excess.
- ⚡ **Effortless Subscription Management:** AI handles the decision-making.
- 🎬 **Smart and Informed Viewing Choices:** Never miss must-watch content while keeping costs low.

---

## 🎥 Future Enhancements

- 🔁 **Automated Data Updates & Scraping**: Enable real-time updates with web scraping and Cron jobs.
- 📊 **Advanced Analytics:** Analyze user preferences to refine recommendations.
- 🔔 **Personalized Alerts:** Notify users about upcoming shows of interest.
- 🌐 **API Expansion:** Support additional streaming platforms.

---

## 🔗 Conclusion

**StreamWise AI** aims to revolutionize how users manage streaming subscriptions by offering cost-saving insights while keeping them entertained. By combining the power of **AI**, automation, and smart data analysis, StreamWise AI makes it easier than ever to stay entertained without breaking the bank.
