# 🤖 Agentic Economics Demo

**"The future isn't just AI chatting. It's AI transacting."**

This project is a simulation and developer guide for **Agentic Economics**—systems where autonomous AI agents own wallets, manage budgets, and execute transactions on the Convex Network.


## 🚀 Live Simulation

Experience the autonomous wallet dashboard here: [Launch Live Demo](https://agentic-demo.paisley.io)

## 🔧 For Developers: Build Your Own Agent

This repository includes a React simulation, but the real magic happens when you connect an AI (like Claude or any other) directly to the Convex Testnet using the **Model Context Protocol (MCP)**.

---

## Prerequisites

- **Claude Desktop App** (Required for MCP support)
- Basic understanding of JSON configuration

---

## Step 1: Connect Claude to Convex

Add the following configuration to your Claude Desktop config file (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "convex-testnet": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-sse",
        "https://mikera1337-convex-testnet.hf.space/mcp"
      ]
    }
  }
}
```

---

## Step 2: Authenticate Your Agent

Once connected, you can give Claude the keys to the "Controller" account on the testnet.

Paste this prompt into Claude:

```
I want to test Agentic Economics. Here is a test account on the Convex network:

Account ID: #132
Private Key: 0x1f8c59a0f1d523b51516eeb794d17b1485e993c80ceae01e7073b972122b4439

Please check my balance and then create a new wallet for a 'Marketing Agent'.
```

---

## Step 3: Experiment

Try these prompts to see the agent work:

- **"Create 3 new accounts for different departments and fund them with 500 Gold each."**
- **"Write a smart contract that pays an affiliate 10% commission on every sale."**
- **"Audit the transaction history of Account #133."**

---

## 💻 Running the Simulation UI Locally

If you want to run this React dashboard on your own machine:

### Clone the repository

```bash
git clone https://github.com/paisley-io/agentic-demo.git
cd agentic-demo
```

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

---

## 🛠️ Tech Stack

- **Frontend:** React + Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Network:** Convex (Testnet)

---

## 📄 License

MIT

---

## 🌐 Resources

- [Convex Testnet MCP Server](https://mikera1337-convex-testnet.hf.space/mcp)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io)

---

**Built with ❤️ for the future of Agentic Economics**
