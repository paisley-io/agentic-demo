🤖 Agentic Economics Demo"The future isn't just AI chatting. It's AI transacting."This project is a simulation and developer guide for Agentic Economics—systems where autonomous AI agents own wallets, manage budgets, and execute transactions on the Convex Network.(Replace this with a screenshot of your dashboard if you like!)🚀 Live SimulationExperience the autonomous wallet dashboard here:Launch Live Demo (or your Vercel URL)🛠 For Developers: Build Your Own AgentThis repository includes a React simulation, but the real magic happens when you connect an AI (like Claude) directly to the Convex Testnet using the Model Context Protocol (MCP).PrerequisitesClaude Desktop App (Required for MCP support)Basic understanding of JSON configuration.Step 1: Connect Claude to ConvexAdd the following configuration to your Claude Desktop config file (claude_desktop_config.json):{
  "mcpServers": {
    "convex-testnet": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-sse",
        "[https://mikera1337-convex-testnet.hf.space/mcp](https://mikera1337-convex-testnet.hf.space/mcp)"
      ]
    }
  }
}
Step 2: Authenticate Your AgentOnce connected, you can give Claude the keys to the "Controller" account on the testnet.Paste this prompt into Claude:"I want to test Agentic Economics. Here is a test account on the Convex network:Account ID: #132Private Key: 0x1f8c59a0f1d523b51516eeb794d17b1485e993c80ceae01e7073b972122b4439Please check my balance and then create a new wallet for a 'Marketing Agent'."Step 3: ExperimentTry these prompts to see the agent work:"Create 3 new accounts for different departments and fund them with 500 Gold each.""Write a smart contract that pays an affiliate 10% commission on every sale.""Audit the transaction history of Account #133."💻 Running the Simulation UI LocallyIf you want to run this React dashboard on your own machine:Clone the repogit clone [https://github.com/paisley-io/agentic-demo.git](https://github.com/paisley-io/agentic-demo.git)
cd agentic-demo
Install dependenciesnpm install
Run the development servernpm run dev
🏗 Tech StackFrontend: React + ViteStyling: Tailwind CSSIcons: Lucide ReactNetwork: Convex (Testnet)📄 LicenseMIT
