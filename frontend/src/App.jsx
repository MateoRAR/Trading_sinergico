import { useState, useEffect } from 'react'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import Chart from './components/Chart'
import TimeframeSelector from './components/TimeframeSelector'
import IndicatorPanel from './components/IndicatorPanel'
import QuotePanel from './components/QuotePanel'
import { searchSymbols, getQuote } from './services/api'

function App() {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [timeframe, setTimeframe] = useState('1d');
  const [quote, setQuote] = useState(null);
  const [activeIndicators, setActiveIndicators] = useState({
    sma20: true,
    sma50: true,
    ema12: false,
    ema26: false,
    rsi: true,
    macd: true
  });

  useEffect(() => {
    loadQuote();
  }, [selectedSymbol]);

  const loadQuote = async () => {
    try {
      const data = await getQuote(selectedSymbol);
      setQuote(data);
    } catch (error) {
      console.error('Error loading quote:', error);
    }
  };

  const toggleIndicator = (indicator) => {
    setActiveIndicators(prev => ({
      ...prev,
      [indicator]: !prev[indicator]
    }));
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Top Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar 
              onSymbolSelect={setSelectedSymbol}
              currentSymbol={selectedSymbol}
            />
          </div>
          <TimeframeSelector 
            selected={timeframe}
            onSelect={setTimeframe}
          />
        </div>

        {/* Quote Info */}
        {quote && <QuotePanel quote={quote} />}

        {/* Main Chart Area */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mt-6">
          <div className="xl:col-span-3">
            <Chart 
              symbol={selectedSymbol}
              timeframe={timeframe}
              activeIndicators={activeIndicators}
            />
          </div>
          
          <div className="xl:col-span-1">
            <IndicatorPanel 
              activeIndicators={activeIndicators}
              onToggle={toggleIndicator}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App

