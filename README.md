# SocialAgent 🤖

> One prompt. An AI agent researches real trends, generates on-brand social content, and publishes it — autonomously, every week.

![MetaMask](https://img.shields.io/badge/MetaMask-Smart%20Accounts-orange?style=flat-square)
![1Shot](https://img.shields.io/badge/1Shot-Permissionless%20Relayer-blue?style=flat-square)
![Groq](https://img.shields.io/badge/Groq-AI%20Generation-purple?style=flat-square)
![Tavily](https://img.shields.io/badge/Tavily-Real%20Trends-green?style=flat-square)

---

## 🎯 Problem

Small business owners spend $500–$1500/month on social media managers, or hours every week creating content manually. Most give up and post inconsistently — losing followers and customers.

---

## 💡 Solution

SocialAgent is an autonomous AI agent that researches real trends, generates on-brand social media content, and publishes it every week — for cents per post, with zero manual effort after setup.

**User sets up once. Agent runs forever.**

---

## 🏆 Tracks Covered

| Track | How |
|---|---|
| ✅ Best x402 + ERC-7710 | Every AI API call is an x402 micropayment via delegated smart account |
| ✅ Best Agent | Fully autonomous — user sets up once, agent runs weekly forever |
| ✅ Best A2A Coordination | Agent A researches trends via Tavily, generates content, then redelegates publishing to Agent B via ERC-7710 |
| ✅ Best 1Shot Relayer | 1Shot relayer on Base — capabilities, fee quotes, USDC gas abstraction |

---

## 🏗️ How It Works

```
User connects wallet (MetaMask Flask)
        ↓ EIP-7702
Regular wallet upgraded to Smart Account
        ↓ ERC-7715
User grants Agent A permissions (2 USDC/week)
        ↓
Agent A fetches real trending topics via Tavily
        ↓ x402 + ERC-7710
Agent A calls AI API — pays per request in USDC
        ↓ Redelegation (A2A)
Agent A → Agent B with scoped permissions
        ↓ 1Shot Permissionless Relayer
Agent B publishes posts — gas abstracted on Base
        ↓
User sees live activity log — every action tracked
```

---

## 🤖 Agent Architecture

### Agent A — Brand Agent
- Holds main ERC-7710 delegation from user's smart account
- Fetches real trending topics via Tavily Search API — informs all content decisions before redelegation
- Uses trend data to call AI API for tagline + 3 social post captions
- Every AI API call is an x402 micropayment in USDC
- Only after research and generation is complete — redelegates publishing rights to Agent B with scoped permissions

### Agent B — Publisher Agent
- Receives redelegation from Agent A via ERC-7710
- Gets a fully prepared content package — Agent A already did the research
- Can only publish — cannot generate content, fetch trends, or exceed Agent A's budget
- Publishes posts across Instagram, Facebook, Twitter
- Goes to sleep after publishing — wakes up in 7 days
- Transaction relay is architected for 1Shot Permissionless Relayer on Base — current demo fetches real relayer capabilities and fee quotes via JSON-RPC

### Why Two Agents?

Agent A and Agent B have fundamentally different jobs:

| | Agent A | Agent B |
|---|---|---|
| Job | Research + Create | Publish |
| Needs | Tavily API + AI API access | Social platform access |
| Budget | 2 USDC/week | 0.5 USDC scoped from Agent A |
| Trust level | High — holds main delegation | Lower — scoped permissions only |

This is **least-privilege A2A coordination** — Agent B can only do exactly what Agent A explicitly redelegated. No over-permissioning.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Wallet | MetaMask Flask |
| Smart Account | MetaMask Smart Accounts Kit v1.6.0 |
| Permissions | ERC-7715 + ERC-7710 |
| Transaction Relay | 1Shot Permissionless Relayer (Base) — integrated for capabilities + fee quotes via JSON-RPC |
| Payments | x402 Protocol |
| AI Generation | Groq (llama-3.3-70b-versatile) |
| Trend Research | Tavily Search API |
| Blockchain | Sepolia Testnet |

---

## 📁 Project Structure

```
src/
├── App.jsx                          # Main app — full page layout
├── main.jsx                         # React entry point
├── index.css                        # Global styles
├── assets/                          # Static assets
├── components/
│   ├── ActivityLog.jsx              # Live terminal activity log
│   ├── ConnectWallet.jsx            # Wallet connection
│   ├── ContentGenerator.jsx         # Agent activation + content display
│   ├── GrantPermissions.jsx         # ERC-7715 permission grant
│   ├── OneShotRelay.jsx             # 1Shot relayer connection
│   └── SmartAccount.jsx             # EIP-7702 smart account creation
├── config/
│   ├── smartAccount.js              # Smart account creation via MetaMask Kit
│   └── wagmi.js                     # Wagmi config — MetaMask Flask connector
├── providers/
│   └── AppProvider.jsx              # Wagmi + TanStack Query providers
└── services/
    ├── generateContent.js           # Groq AI calls + x402 payments
    ├── getTrends.js                 # Tavily real trend search
    └── oneshot.js                   # 1Shot JSON-RPC calls
```

---

## 🚀 Getting Started

### Prerequisites
- MetaMask Flask — `https://metamask.io/flask/`
- Node.js v18+
- Sepolia testnet ETH — `https://cloud.google.com/application/web3/faucet/ethereum/sepolia`

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/social-media-agent
cd social-media-agent
npm install
```

### Environment Variables

Create a `.env` file:

```
VITE_AI_API_KEY=your_groq_api_key
VITE_AI_BASE_URL=https://api.groq.com/openai/v1
VITE_AI_MODEL=llama-3.3-70b-versatile
VITE_TAVILY_API_KEY=your_tavily_api_key
```

Get your free API keys:
- Groq: `https://console.groq.com`
- Tavily: `https://app.tavily.com`

### Run

```bash
npm run dev
```

Open `http://localhost:5173`

---

## 📋 Usage

1. Connect MetaMask Flask wallet
2. Create Smart Account (EIP-7702 upgrade)
3. Grant agent permissions (ERC-7715 — 2 USDC/week)
4. Connect 1Shot Relayer
5. Describe your business → agent researches trends → generates content → publishes

---

## 🔑 Key Innovations

- **Intelligent A2A** — Agent A researches with Tavily before redelegating to Agent B — not blind task passing
- **Pay-per-use AI** — x402 micropayments per API call, no subscriptions
- **True autonomy** — agent runs weekly without any user involvement
- **Least-privilege A2A** — Agent B only gets exactly what it needs
- **Live transparency** — terminal activity log shows every agent action
- **Real trend intelligence** — live Tavily search before every content run

---

## 🔗 Resources

- [MetaMask Smart Accounts Kit](https://docs.metamask.io/smart-accounts-kit)
- [1Shot API](https://1shotapi.com/docs)
- [x402 Protocol](https://docs.x402.org)
- [Tavily API](https://docs.tavily.com)
- [Groq API](https://console.groq.com/docs)

---

## 📄 License

MIT

---

Built for **MetaMask Smart Accounts × 1Shot API Hackathon**
