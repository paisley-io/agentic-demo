import React, { useState, useEffect } from 'react';
import { BookOpen, Wallet, Key, Send, TrendingDown, Users, Lock, Eye, EyeOff, CheckCircle, ArrowRight, Activity, Globe } from 'lucide-react';

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
  }, []);

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
      // THIS SETS THEM TO HIDDEN BY DEFAULT
      newVisibility[address] = false;
    }
    
    setWallets(newWallets);
    setShowWalletKeys(newVisibility);
    setStatus('✓ Successfully created 4 managed wallet accounts for course operations');
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
              description="Click the big button to deploy 4 autonomous wallets. Each represents a distinct business function (Marketing, Revenue, etc.) controlled by AI logic."
            />
            <InstructionStep 
              number="2"
              title="Fund the Business"
              description="Use your 'Master Controller' account (representing the CEO or Main Agent) to inject capital. Click 'Fund 500 Gold' on any wallet."
            />
            <InstructionStep 
              number="3"
              title="Execute Transactions"
              description="Use the Transfer Tool at the bottom to simulate real business activity. Move profit from 'Revenue' to 'Affiliate Payouts' or reimburse 'Marketing'."
            />
            <InstructionStep 
              number="4"
              title="Audit Security"
              description="Click the 'Show/Hide' eye icons to inspect the cryptographic private keys. In a real Agentic Economy, these keys are held securely by the AI agent."
            />
          </div>
        </div>
      </div>

      {/* --- MAIN SIMULATION DASHBOARD --- */}
      <div id="demo-section" className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
          <h2 className="text-sm font-bold tracking-widest text-gray-500 uppercase">Live Dashboard</h2>
        </div>

        {/* Dashboard Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg shadow-blue-200">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Digital Course Platform</h1>
              <p className="text-gray-500 font-medium">Wallet Management System</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FeatureCard 
              icon={TrendingDown}
              title="Course Price"
              value="497 Gold"
              colorClass="text-green-600"
              bgClass="bg-green-50"
              borderClass="border-green-100"
            />
            <FeatureCard 
              icon={Users}
              title="Students Enrolled"
              value="1,247"
              colorClass="text-blue-600"
              bgClass="bg-blue-50"
              borderClass="border-blue-100"
            />
            <FeatureCard 
              icon={Wallet}
              title="Total Revenue"
              value="619,759 Gold"
              colorClass="text-purple-600"
              bgClass="bg-purple-50"
              borderClass="border-purple-100"
            />
          </div>
        </div>

        {/* Controller Account */}
        {controller && (
          <div className="bg-slate-900 rounded-2xl shadow-xl p-6 mb-6 text-white border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <Key className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Master Controller Account</h2>
                  <p className="text-slate-400 text-sm">Root Permissions • Account #132</p>
                </div>
              </div>
              <Lock className="w-6 h-6 text-slate-600" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Public Address</p>
                <p className="font-mono font-bold text-lg text-indigo-300">{controller.address}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Available Balance</p>
                <p className="font-bold text-3xl">{balances['#132'] || 0} <span className="text-lg text-slate-500 font-normal">Gold</span></p>
              </div>
              <div className="md:col-span-2 pt-2 border-t border-slate-700/50 mt-2">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Private Key</p>
                  <button
                    onClick={() => setShowControllerKey(!showControllerKey)}
                    className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 text-xs font-medium"
                  >
                    {showControllerKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showControllerKey ? 'Hide Secret' : 'Reveal Secret'}
                  </button>
                </div>
                {showControllerKey ? (
                  <p className="font-mono text-xs break-all bg-black/30 p-3 rounded border border-indigo-500/30 text-indigo-200">
                    {controller.privateKey}
                  </p>
                ) : (
                  <div className="font-mono text-xs bg-black/30 p-3 rounded border border-slate-700 text-slate-500 flex items-center gap-2">
                    <Lock className="w-3 h-3" /> Encrypted private key hidden for security
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Generate Wallets Button */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mb-6 text-center">
          <button
            onClick={generateWallets}
            disabled={loading || wallets.length > 0}
            className={`
              w-full md:w-auto min-w-[300px] font-bold py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg
              ${wallets.length > 0 
                ? 'bg-green-100 text-green-700 cursor-default shadow-none border border-green-200' 
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.02] shadow-blue-200'
              }
            `}
          >
            {wallets.length > 0 ? (
              <>
                <CheckCircle className="w-6 h-6" />
                Network Deployed Successfully
              </>
            ) : (
              <>
                <Activity className="w-6 h-6" />
                Deploy Course Economy (Create 4 Wallets)
              </>
            )}
          </button>
          {status && (
            <div className={`mt-4 inline-block px-4 py-2 rounded-full text-sm font-medium ${
              status.includes('✓') ? 'bg-green-100 text-green-800' : 'bg-blue-50 text-blue-800'
            }`}>
              {status}
            </div>
          )}
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

        {/* Transfer Section */}
        {wallets.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Send className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Execute Transfer</h2>
                <p className="text-sm text-gray-500">Move funds between autonomous agents</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">From Account</label>
                <select
                  value={selectedWallet}
                  onChange={(e) => setSelectedWallet(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                >
                  <option value="">Select wallet...</option>
                  <option value="#132">Controller (#132)</option>
                  {wallets.map(w => (
                    <option key={w.address} value={w.address}>{w.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">To Account</label>
                <select
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                >
                  <option value="">Select wallet...</option>
                  <option value="#132">Controller (#132)</option>
                  {wallets.map(w => (
                    <option key={w.address} value={w.address}>{w.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Amount (Gold)</label>
                <input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <button
              onClick={handleTransfer}
              className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
            >
              Confirm Transaction
            </button>
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
