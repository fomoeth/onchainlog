import express from "express";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const PORT = 3000;

  // Mock On-Chain Event Emitter
  const categories = ["trade", "alert", "social"];
  const messages = [
    "Whale Alert: 10,000 BTC moved to Coinbase.",
    "Gas spike detected: 150 Gwei.",
    "New NFT collection minted: 'CryptoPunks V2'.",
    "Smart Contract deployment detected on Base.",
    "Flash loan attack mitigated on Aave.",
    "Protocol governance proposal #42 passed.",
    "Staking reward distribution complete.",
    "New pair created on Uniswap: PEPE/WETH.",
    "Cross-chain bridge activity high for Solana.",
    "Liquidity added to WBTC/USDC pool."
  ];

  const generateLog = () => {
    const hasTx = Math.random() > 0.3;
    const isContract = Math.random() > 0.7;
    
    return {
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16).replace(/-/g, '/'),
      category: categories[Math.floor(Math.random() * categories.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      txHash: hasTx ? `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}` : undefined,
      blockNumber: hasTx ? Math.floor(19283745 + Math.random() * 1000) : undefined,
      gasUsed: hasTx ? Math.floor(21000 + Math.random() * 500000) : undefined,
      contractAddress: isContract ? `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}` : undefined
    };
  };

  // Emit a log every 3-10 seconds
  const emitRandomLog = () => {
    const log = generateLog();
    io.emit("new-log", log);
    setTimeout(emitRandomLog, Math.random() * 7000 + 3000);
  };
  emitRandomLog();

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    // Send 3 initial logs immediately
    for (let i = 0; i < 3; i++) {
        socket.emit("new-log", generateLog());
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
