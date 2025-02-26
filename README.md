# Email Aggregator

[![GitHub repo](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/Dark-VenomX/Email-Aggregator)

## 📧 Project Overview

**Email Aggregator** is a feature-rich application for managing and interacting with emails in real time. Built using **TypeScript** and **Node.js**, the project comes with powerful capabilities like:

- 📩 **Real-time Email Sync**  
- 🔍 **Elasticsearch Integration for Fast Search**  
- 🧠 **AI-based Email Categorization**  
- 🔔 **Slack/Webhook Notifications**  
- 🖥️ **Frontend UI with TailwindCSS and Vite**  
- ✍️ **AI-powered Reply Suggestions**  

## 📂 Directory Structure

```
.
├── .env                      # Environment variables  
├── .gitignore                # Git ignore file  
├── docker-compose.yml        # Docker Compose configuration  
├── index.html                # HTML entry point  
├── package.json              # Project dependencies  
├── tsconfig.json             # TypeScript config  
├── vite.config.ts            # Vite config  
├── server/                   # Backend server  
├── src/                      # Frontend source code  
│   ├── components/           # Reusable components  
│   ├── services/             # API and backend services  
│   ├── utils/                # Helper functions  
│   ├── App.tsx              # Main app component  
│   ├── main.tsx             # Frontend entry point  
│   ├── mockData.ts          # Mock data for testing  
│   ├── store.ts             # State management  
│   └── types.ts             # Type definitions  
└── README.md                # Project documentation
```

## 🚀 Installation & Setup

1. **Clone the repository:**
```bash
git clone https://github.com/Dark-VenomX/Email-Aggregator.git
cd Email-Aggregator
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**  
Create a `.env` file in the root directory and add necessary variables like API keys, database URLs, etc.

4. **Run the development server:**
```bash
npm run dev
```

5. **Docker (optional):**  
If you prefer using Docker, spin up the containers with:
```bash
docker-compose up --build
```

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Happy coding! 🚀
