<p align="center">
  <img src="https://raw.githubusercontent.com/waniyaro/cookiedash/main/assets/banner.gif" alt="CookieDash Header" width="100%" />
</p>

<p align="center">
  <a href="https://cookiedash-neon.vercel.app"><img src="https://img.shields.io/badge/Live%20Production-cookiedash--neon.vercel.app-ff7a1a?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" /></a>
  <a href="https://cookiescan.io"><img src="https://img.shields.io/badge/Network-Cookie%20Chain%20SVM-d4a15c?style=for-the-badge" alt="Cookie Chain" /></a>
  <a href="https://github.com/cookiechain/superteam-hackathon-submissions"><img src="https://img.shields.io/badge/Superteam%20Earn-cApp%20Bounty-863bff?style=for-the-badge" alt="Hackathon Bounty" /></a>
</p>

> **CookieDash** is an interactive Night Bakery hub, on-chain Fortune Oven inscription engine, and live SVM telemetry portal engineered specifically for **[Cookie Chain](https://www.cookiechain.wtf)**. Built for the **Superteam Earn Cookie Chain cApp Bounty**.

---

## 🌟 Overview

**CookieDash** bridges deep on-chain utility with the vibrant baking and memetic culture of **Cookie Chain**. Unlike traditional, sterile DeFi dashboards, CookieDash gamifies the developer and degen experience: monitoring real-time block metrics through an interactive **"Oven"**, offering permanent on-chain fortune inscriptions via the **Solana Memo Program**, providing asset transfer utilities, and deploying an AI-powered **Head Baker Oracle** compatible with `cookie-mcp`.

---

## 🚀 Key Features

### 1. 🔥 Oven Status & Cookie Pulse (Live SVM Telemetry)
* **Real-Time RPC Polling:** Streams telemetry directly from the community RPC (`https://rpc.cookiescan.io`).
* **Oven Heat (Live TPS):** Dynamic performance gauge calculating live throughput using `getRecentPerformanceSamples`.
* **Epoch & Slot Progress:** Visual progress bar tracking slot advancement and consensus finality.
* **Master Bakers (Validators):** Active validator count confirming sub-second block times (~0.8s).
* **SVM Native Specs:** Displaying `solana-core v4.1.2` cluster architecture.

### 2. 🥠 On-Chain Fortune Cookie (Flagship On-Chain Interaction)
* **Permanent Blockchain Inscription:** Imprints personal or AI-generated fortunes into the immutable Cookie Chain ledger using the **Solana Memo Program** (`MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr`).
* **Random Degen Fortune Generator:** Curated degen and bakery-themed prophecies.
* **Three-Stage Confirmation Pipeline:**
  1. `Confirming Signature in Nightly...` (Wallet signing)
  2. `Baking into Block at 100% Heat...` (RPC broadcast & simulation)
  3. `Freshly Baked!` with confirmed Slot number, celebratory confetti, and a direct link to **CookieScan**.

### 3. 🥐 The Baker's Vault (Portfolio & Instant Transfer)
* **Live $COOK Balance:** Real-time lamport conversion directly from the connected wallet.
* **Instant $COOK Transfers:** Seamless on-chain transfer tool equipped with:
  * Full Solana Base58 public key validation.
  * One-click `MAX` button with automatic gas buffer deduction.
  * Comprehensive error-handling for rejected signatures and insufficient gas.

### 4. 🧙‍♂️ Head Baker AI Oracle (`cookie-mcp` Ready)
* **Dynamic Context Awareness:** The Oracle evaluates live RPC telemetry (current TPS, slot height, user balance) before delivering strategic baking wisdom.
* **`cookie-mcp` Compatibility:** Architected to harmonize with the official community [cookie-mcp](https://github.com/cookiechain/cookie-mcp) server, providing AI agents with structured on-chain tool access.

### 5. 🌐 Ecosystem & Bridge Hub
* Seamless direct links and integrations with official Cookie Chain infrastructure:
  * **[Cookiebox Swap](https://cookiebox.app)** (`agg.cookiebox.app`)
  * **[Cookieswap / Candy Shop](https://cookieswap.fun)** (`swap.cookiescan.io`)
  * **[Hyperlane Warp Bridge](https://hyperlane.cookiescan.io)** (Direct Solana ↔ Cookie Chain bridge guide)
  * **[Cookie DAS API](https://api.cookiescan.io)**
  * **[CookieScan Explorer](https://cookiescan.io)**

---

## ⚙️ Network Configuration

| Parameter | Value |
| :--- | :--- |
| **Network Name** | Cookie Chain (SVM) |
| **Native Asset** | `$COOK` (9 decimals) |
| **RPC Endpoint** | `https://rpc.cookiescan.io` |
| **WebSocket Endpoint** | `wss://rpc.cookiescan.io` |
| **Genesis Hash** | `9wDaBRDgArEUpvhHxGguNkwozsZh4UpGZB9o2EoEcBB2` |
| **Block Explorer** | [cookiescan.io](https://cookiescan.io) |
| **Memo Program ID** | `MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr` |
| **Hyperlane Bridge** | [hyperlane.cookiescan.io](https://hyperlane.cookiescan.io) |

---

## 🛠️ Technical Stack

* **Frontend:** React 19, TypeScript, Vite 8
* **Styling:** Tailwind CSS (Custom dark chocolate & golden-amber neon theme)
* **Web3 Engine:**
  * `@solana/web3.js`
  * `@solana/wallet-adapter-react` & `@solana/wallet-adapter-react-ui`
  * Native support for **Nightly Wallet Standard** and Solana ecosystem wallets
* **Polyfills:** `vite-plugin-node-polyfills` for seamless in-browser Buffer & crypto execution
* **Visuals:** `lucide-react`, `canvas-confetti`

---

## 💻 Local Development & Installation

### Prerequisites
* Node.js v18+ (tested on Node v25)
* npm, pnpm, or bun
* A Solana/SVM-compatible wallet ([Nightly Wallet](https://nightly.app/) recommended)

### 1. Clone the repository
```bash
git clone https://github.com/waniyaro/cookiedash.git
cd cookiedash
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start local development server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 4. Build for production
```bash
npm run build
```

---

## 🦊 Connecting with Nightly Wallet

1. Install the [Nightly Browser Extension](https://nightly.app/).
2. Open CookieDash and click **Select Wallet** -> **Nightly**.
3. Use the integrated **Nightly Config** button in the navbar to automatically configure the Cookie Chain RPC and Genesis Hash.
4. Obtain `$COOK` via the [Hyperlane Bridge](https://hyperlane.cookiescan.io) to start baking!

---

## 📄 License

MIT License. Open source for the Cookie Chain & Superteam community.
