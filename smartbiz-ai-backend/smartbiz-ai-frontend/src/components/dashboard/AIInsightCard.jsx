import { Sparkles, RefreshCw } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { aiApi } from '../../api/aiApi';

export default function AIInsightCard() {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchInsight = useCallback(async () => {
    setLoading(true);
    try {
      const res = await aiApi.getDailySummary();
      setInsight(res.data.data.content);
    } catch (err) {
      setInsight("I couldn't generate today's insight right now. Try refreshing.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInsight();
  }, [fetchInsight]);

  return (
    <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-white" />
          <p className="text-sm font-semibold text-white">Today's AI insight</p>
        </div>
        <button
          onClick={fetchInsight}
          disabled={loading}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-brand-100 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      {loading ? (
        <div className="space-y-2 flex-1">
          <div className="h-3 bg-white/15 rounded-full w-full animate-pulse" />
          <div className="h-3 bg-white/15 rounded-full w-4/5 animate-pulse" />
          <div className="h-3 bg-white/15 rounded-full w-3/5 animate-pulse" />
        </div>
      ) : (
        <p className="text-sm text-brand-50 leading-relaxed flex-1">{insight}</p>
      )}
    </div>
  );
}
