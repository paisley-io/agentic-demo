import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Wallet, Key, Send, TrendingDown, Users, Lock, Eye, EyeOff, CheckCircle, ArrowRight, Activity, Globe, ShoppingCart, Zap, Terminal, Sliders, Settings } from 'lucide-react';

// --- Components ---

const InstructionStep = ({ number, title, description }) => (
  <div className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
      {number}
    </div>
    <div>
      <h4 className="font-bold text-gray-800 mb-1">{title}</h4>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  </div>
);

const FeatureCard = ({ icon: Icon, title, value, colorClass, bgClass, borderClass }) => (
  <div className={`${bgClass} p-4 rounded-xl border ${borderClass}`}>
    <div className="flex items-center gap-2 mb-1">
      <Icon className={`w-5 h-5 ${colorClass}`} />
      <span className={`text-sm font-medium ${colorClass.replace('text-', 'text-opacity-80 ')}`}>{title}</span>
    </div>
    <p className={`text-2xl font-bold ${colorClass.replace('600', '800')}`}>{value}</p>
  </div>
);

// --- Main Application ---

export default function App() {
  const [wallets, setWallets] = useState([]);
  const [controller, setController] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [balances, setBalances] = useState({});
  const [transferAmount, setTransferAmount] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('');
  const [showControllerKey, setShowControllerKey] = useState(false);
  const [showWalletKeys, setShowWalletKeys] = useState({});
  
  // NEW: CEO Governance State
  const [affiliateRate, setAffiliateRate] = useState(20);
  const [marketingRate, setMarketingRate] = useState(10);
  
  // NEW: Ledger State
  const [ledger, setLedger] = useState([]);

  // Business Stats State
  const [stats, setStats] = useState({
    price: 497,
    students: 1247,
    revenue: 619759
  });

  // Initialize with controller account
  useEffect(() => {
    const controllerAccount = {
      address: '#132',
      publicKey: 'Controller Account',
      privateKey: '0x1f8c59a0f1d523b51516eeb794d17b1485e993c80ceae01e7073b972122b4439',
      balance: 10000,
      type: 'controller'
    };
    setController(controllerAccount);
    setBalances({ '#132': 10000 });
    addToLedger("SYSTEM: Convex Network Connection Established.");
    addToLedger("SYSTEM: Controller Account #132 Loaded.");
  }, []);

  // Helper: Add to Ledger
  const addToLedger = (message) => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLedger(prev => [`[${time}] ${message}`, ...prev].slice(0, 50));
  };

  // Generate a random hex private key
  const generatePrivateKey = () => {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return '0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Generate wallet accounts
  const generateWallets = async () => {
    setLoading(true);
    setStatus('Generating 4 new student wallet accounts...');
    addToLedger("SYSTEM: Initializing Autonomous Wallet Deployment...");
    
    const walletNames = [
      'Student Enrollment Wallet',
      'Course Revenue Wallet',
      'Marketing Campaign Wallet',
      'Affiliate Payout Wallet'
    ];
    
    const newWallets = [];
    const newVisibility = {};

    for (let i = 0; i < 4; i++) {
      const privateKey = generatePrivateKey();
      const address = `#${1000 + i + 1}`;
      
      newWallets.push({
        id: i + 1,
        name: walletNames[i],
        address: address,
        privateKey: privateKey,
        publicKey: `pub_${privateKey.substring(2, 18)}...`,
        balance: 0,
        type: 'managed'
      });
      
      setBalances(prev => ({ ...prev, [address]: 0 }));
      newVisibility[address] = false;
      addToLedger(`DEPLOY: Created ${walletNames[i]} (${address})`);
    }
    
    setWallets(newWallets);
    setShowWalletKeys(newVisibility);
    setStatus('✓ Successfully created 4 managed wallet accounts for course operations');
    addToLedger("SYSTEM: Network Deployment Complete. 4 Agents Active.");
    setLoading(false);
  };

  const toggleWalletKey = (address) => {
    setShowWalletKeys(prev => ({
      ...prev,
      [address]: !prev[address]
    }));
  };

  const handleTransfer = () => {
    if (!selectedWallet || !transferTo || !transferAmount) {
      setStatus('⚠ Please fill all transfer fields');
      return;
    }

    const amount = parseFloat(transferAmount);
    const fromBalance = balances[selectedWallet] || 0;

    if (amount > fromBalance) {
      setStatus('⚠ Insufficient balance');
      return;
    }

    setBalances(prev => ({
      ...prev,
      [selectedWallet]: (prev[selectedWallet] || 0) - amount,
      [transferTo]: (prev[transferTo] || 0) + amount
    }));

    setStatus(`✓ Transferred ${amount} Gold from ${selectedWallet} to ${transferTo}`);
    addToLedger(`MANUAL_TX: Transferred ${amount}G from ${selectedWallet} to ${transferTo}`);
    setTransferAmount('');
  };

  const fundWallet = (address, amount) => {
    const controllerBalance = balances['#132'] || 0;
    if (amount > controllerBalance) {
      setStatus('⚠ Insufficient controller balance');
      return;
    }

    setBalances(prev => ({
      ...prev,
      '#132': controllerBalance - amount,
      [address]: (prev[address] || 0) + amount
    }));
    setStatus(`✓ Funded ${address} with ${amount} Gold from controller`);
    addToLedger(`FUNDING: Controller injected ${amount}G capital into ${address}`);
  };

  // --- Simulate Sale Logic (Updated with Governance) ---
  const simulateSale = async () => {
    if (wallets.length === 0) {
      setStatus('⚠ Please deploy the wallets first!');
      return;
    }

    const revenueWallet = wallets.find(w => w.name === 'Course Revenue Wallet');
    const affiliateWallet = wallets.find(w => w.name === 'Affiliate Payout Wallet');
    const marketingWallet = wallets.find(w => w.name === 'Marketing Campaign Wallet');

    if (!revenueWallet) return;

    // 1. Process Sale (Immediate)
    setStats(prev => ({
      ...prev,
      students: prev.students + 1,
      revenue: prev.revenue + prev.price
    }));

    setBalances(prev => ({
      ...prev,
      [revenueWallet.address]: (prev[revenueWallet.address] || 0) + stats.price
    }));

    setStatus('💰 New Student Enrolled! +497 Gold received. Agent analyzing splits...');
    addToLedger(`EVENT: New Student Enrollment Detected (+${stats.price} Gold)`);
    addToLedger(`AGENT: Detecting revenue in ${revenueWallet.address}...`);

    // 2. Agentic Reaction (Delayed)
    setTimeout(() => {
      addToLedger(`GOVERNANCE: Applying active rules (Affiliate: ${affiliateRate}%, Marketing: ${marketingRate}%)`);
      
      const affiliateCut = Math.floor(stats.price * (affiliateRate / 100)); 
      const marketingCut = Math.floor(stats.price * (marketingRate / 100)); 
      
      setBalances(prev => ({
        ...prev,
        [revenueWallet.address]: (prev[revenueWallet.address] || 0) - affiliateCut - marketingCut,
        [affiliateWallet.address]: (prev[affiliateWallet.address] || 0) + affiliateCut,
        [marketingWallet.address]: (prev[marketingWallet.address] || 0) + marketingCut,
      }));

      setStatus(`🤖 AUTO-AGENT: Distributed ${affiliateCut}G to Affiliate & ${marketingCut}G to Marketing.`);
      addToLedger(`TX: Smart Contract sent ${affiliateCut}G to Affiliate Wallet (${affiliateWallet.address})`);
      addToLedger(`TX: Smart Contract sent ${marketingCut}G to Marketing Wallet (${marketingWallet.address})`);
      addToLedger(`SUCCESS: Transaction settled on Convex Network.`);
    }, 1500);
  };

  const walletDescriptions = {
    'Student Enrollment Wallet': 'Handles student course purchases and enrollment fees',
    'Course Revenue Wallet': 'Collects and manages all course sales revenue',
    'Marketing Campaign Wallet': 'Funds for advertising and promotional activities',
    'Affiliate Payout Wallet': 'Manages commission payments to course affiliates'
  };

  const scrollToDemo = () => {
    document.getElementById('demo-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* --- HERO SECTION --- */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white pt-20 pb-32 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/20 rounded-full px-4 py-1.5 mb-6">
            <Globe className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-200">Running on Convex Network Testnet</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Agentic Economics <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Simulation</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience the future of autonomous business. This demo simulates a "Digital Course Platform" where AI agents independently manage wallets, collect revenue, and pay affiliates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={scrollToDemo}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2"
            >
              Launch Simulation <ArrowRight className="w-5 h-5" />
            </button>
            <a 
              href="https://mikera1337-convex-testnet.hf.space/index.html" 
              target="_blank" 
              rel="noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white font-medium py-4 px-8 rounded-xl transition-all border border-white/10 backdrop-blur-sm"
            >
              View MCP Server Info
            </a>
          </div>
        </div>
      </div>

      {/* --- INSTRUCTIONS SECTION --- */}
      <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-10 mb-20">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <Activity className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">How to Play & Test</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InstructionStep 
              number="1"
              title="Generate Operations"
              description="Click 'Deploy Course Economy' to spin up the autonomous wallets. This simulates launching your business infrastructure on the Convex network."
            />
            <InstructionStep 
              number="2"
              title="Configure Governance"
              description="Use the 'CEO Mode' sliders to set your Affiliate and Marketing percentages. The AI Agent reads these rules in real-time."
            />
            <InstructionStep 
              number="3"
              title="Simulate Sales"
              description="Click 'Simulate Sale' to have a student buy the course. Watch the 'Live Smart Contract Ledger' to see the agent automatically split the revenue."
            />
            <InstructionStep 
              number="4"
              title="Audit Security"
              description="Inspect the cryptographic keys. Notice how the agent operates independently, executing transactions without manual approval."
            />
          </div>
        </div>
      </div>

      {/* --- MAIN SIMULATION DASHBOARD --- */}
      <div id="demo-section" className="max-w-6xl mx-auto px-6 pb-20">
        
        {/* Dashboard Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg shadow-blue-200">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Digital Course Platform</h1>
                <p className="text-gray-500 font-medium">Wallet Management System</p>
              </div>
            </div>

            {/* CEO Mode / Governance Panel */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3 min-w-[300px]">
              <div className="flex items-center gap-2 mb-1">
                <Sliders className="w-4 h-4 text-slate-600" />
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">CEO Governance Mode</h3>
              </div>
              
              <div>
                 <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                   <span>Affiliate Commission</span>
                   <span className="text-blue-600">{affiliateRate}%</span>
                 </div>
                 <input 
                   type="range" 
                   min="0" max="50" 
                   value={affiliateRate} 
                   onChange={(e) => setAffiliateRate(Number(e.target.value))}
                   className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                 />
              </div>

              <div>
                 <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                   <span>Marketing Budget</span>
                   <span className="text-purple-600">{marketingRate}%</span>
                 </div>
                 <input 
                   type="range" 
                   min="0" max="50" 
                   value={marketingRate} 
                   onChange={(e) => setMarketingRate(Number(e.target.value))}
                   className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                 />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FeatureCard 
              icon={TrendingDown}
              title="Course Price"
              value={`${stats.price} Gold`}
              colorClass="text-green-600"
              bgClass="bg-green-50"
              borderClass="border-green-100"
            />
            <FeatureCard 
              icon={Users}
              title="Students Enrolled"
              value={stats.students.toLocaleString()}
              colorClass="text-blue-600"
              bgClass="bg-blue-50"
              borderClass="border-blue-100"
            />
            <FeatureCard 
              icon={Wallet}
              title="Total Revenue"
              value={`${stats.revenue.toLocaleString()} Gold`}
              colorClass="text-purple-600"
              bgClass="bg-purple-50"
              borderClass="border-purple-100"
            />
          </div>
        </div>

        {/* Action Bar: Generate & Simulate Sale */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mb-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Deploy Button */}
              <button
                onClick={generateWallets}
                disabled={loading || wallets.length > 0}
                className={`
                  w-full font-bold py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg
                  ${wallets.length > 0 
                    ? 'bg-green-100 text-green-700 cursor-default shadow-none border border-green-200' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.02] shadow-blue-200'
                  }
                `}
              >
                {wallets.length > 0 ? (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    1. Network Deployed
                  </>
                ) : (
                  <>
                    <Activity className="w-6 h-6" />
                    1. Deploy Course Economy
                  </>
                )}
              </button>

              {/* Simulate Sale Button */}
              <button
                onClick={simulateSale}
                disabled={wallets.length === 0}
                className={`
                  w-full font-bold py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg
                  ${wallets.length === 0 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-[1.02] shadow-emerald-200'
                  }
                `}
              >
                <ShoppingCart className="w-6 h-6" />
                2. Simulate Student Sale (+497G)
              </button>
           </div>

           {status && (
            <div className={`mt-6 text-center`}>
               <div className={`inline-block px-6 py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2 ${
                  status.includes('AUTO-AGENT') ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                  status.includes('✓') || status.includes('💰') ? 'bg-green-100 text-green-800 border border-green-200' : 
                  'bg-blue-50 text-blue-800 border border-blue-200'
               }`}>
                 {status.includes('AUTO-AGENT') && <Zap className="w-4 h-4" />}
                 {status}
               </div>
            </div>
          )}
        </div>

        {/* Live Ledger (Terminal) */}
        <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-700 p-4 mb-6 font-mono text-sm overflow-hidden">
          <div className="flex items-center gap-2 mb-3 border-b border-slate-700 pb-2">
            <Terminal className="w-4 h-4 text-green-400" />
            <span className="text-slate-300 font-bold">Live Smart Contract Ledger</span>
            <div className="ml-auto flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
            </div>
          </div>
          <div className="h-48 overflow-y-auto space-y-1 pr-2 custom-scrollbar flex flex-col-reverse">
             {ledger.length === 0 && <p className="text-slate-600 italic">Waiting for network events...</p>}
             {ledger.map((log, i) => (
               <div key={i} className="text-slate-300 hover:bg-slate-800/50 px-1 rounded">
                 <span className="text-slate-500 mr-2">{log.split(']')[0]}]</span>
                 <span className={
                   log.includes('EVENT') ? 'text-blue-400 font-bold' :
                   log.includes('TX') ? 'text-green-400' :
                   log.includes('AGENT') ? 'text-purple-400' :
                   log.includes('GOVERNANCE') ? 'text-yellow-400' :
                   'text-slate-300'
                 }>{log.split(']')[1]}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Wallet Accounts Grid */}
        {wallets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {wallets.map((wallet) => (
              <div key={wallet.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2.5 rounded-lg">
                      <Wallet className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">{wallet.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{walletDescriptions[wallet.name]}</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                    {balances[wallet.address] || 0}
                  </span>
                </div>
                
                <div className="space-y-3 text-sm mb-5">
                  <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-gray-400 text-xs font-semibold uppercase">Address</span>
                    <span className="font-mono font-medium text-gray-700">{wallet.address}</span>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-400 text-xs font-semibold uppercase flex items-center gap-1">
                         Private Key
                      </span>
                      <button
                        onClick={() => toggleWalletKey(wallet.address)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center gap-1"
                      >
                         {/* Added Eye Icon for clarity */}
                        {showWalletKeys[wallet.address] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        {showWalletKeys[wallet.address] ? 'Hide' : 'Reveal'}
                      </button>
                    </div>
                    {showWalletKeys[wallet.address] ? (
                      <p className="font-mono text-xs text-orange-600 break-all bg-orange-50 p-2 rounded border border-orange-100">
                        {wallet.privateKey}
                      </p>
                    ) : (
                      <p className="font-mono text-xs text-gray-400 bg-gray-50 p-2 rounded">
                        ••••••••••••••••••••••••••••••••
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => fundWallet(wallet.address, 500)}
                  className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 border border-slate-200"
                >
                  <Send className="w-4 h-4 text-slate-400" />
                  Fund 500 Gold
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Footer */}
        <div className="mt-12 text-center text-gray-400 text-sm">
           Simulated Environment • Convex Network Demo • Agentic Economics
        </div>
      </div>
    </div>
  );
};
