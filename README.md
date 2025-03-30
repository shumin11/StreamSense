# StreamWise AI: Smart Streaming Subscription Assistant

**StreamWise AI** is an AI-powered subscription recommendation system that helps users make **cost-effective** decisions about which streaming platforms to subscribe to based on upcoming content and their personal preferences. 

Instead of being a typical chatbot, **StreamWise AI** leverages the same backend technologies (AI models, SQL query generation, and automated data pipelines) to analyze user preferences and recommend the most relevant platforms for the next subscription cycle.

---
## 🎥 Demo Video


---

## 🎯 Project Goals

- **Save Money:** Provide personalized recommendations to help users make informed decisions about their streaming subscriptions. (stretch)
- **AI-Driven Insights:** Leverage the Azure AI Foundry API to respond to user queries, offering tailored suggestions based on personal preferences.
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
  
```

## ⚙️ Tech Stack

- **Frontend:** React, TailwindCSS/Bootstrap
- **Backend:** Node.js, Express.js
- **AI Model:** Azure AI Foundry (GPT-4 / GPT-3.5/ Deepseek)
- **Database:** SQLite
- **Scraper:** Cheerio / Puppeteer
- **Scheduler:** Node-cron or CronTab

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
