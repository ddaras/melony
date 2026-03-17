import React from 'react';
import { Activity, Eye, EyeOff, Terminal } from 'lucide-react';
import { JsonView, darkStyles } from 'react-json-view-lite';
import { InspectorTab } from '../types/studio';

interface InspectorPanelProps {
  events: Array<{ type: string; data: unknown }>;
  context: Record<string, unknown>;
  selectedRunId: string | null;
  selectedEvent: { type: string; data: unknown } | null;
  selectedEventIndex: number | null;
  showIntercepts: boolean;
  inspectorTab: InspectorTab;
  onShowInterceptsToggle: () => void;
  onSelectEventIndex: (index: number) => void;
  onInspectorTabChange: (tab: InspectorTab) => void;
}

const InspectorPanel: React.FC<InspectorPanelProps> = ({
  events,
  context,
  selectedRunId,
  selectedEvent,
  selectedEventIndex,
  showIntercepts,
  inspectorTab,
  onShowInterceptsToggle,
  onSelectEventIndex,
  onInspectorTabChange
}) => {
  return (
    <div className="w-[580px] 2xl:w-[820px] border-l border-zinc-800 flex flex-col h-full bg-zinc-950 shadow-sm z-20">
      <div className="flex-1 flex flex-col min-h-0 border-b border-zinc-800">
        <div className="p-3.5 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-zinc-400">
              <Activity className="w-4 h-4" />
              <h3 className="font-semibold text-[10px] uppercase tracking-widest">Waterfall</h3>
            </div>
            <button
              onClick={onShowInterceptsToggle}
              title={showIntercepts ? 'Hide intercepts' : 'Show intercepts'}
              className={`p-1 rounded transition-colors ${
                showIntercepts
                  ? 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20'
                  : 'text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              {showIntercepts ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-zinc-600 px-2 py-0.5 rounded border border-zinc-800">
              {events.length} events
            </span>
            {selectedRunId && (
              <span className="text-[9px] font-mono text-zinc-600 px-2 py-0.5 rounded border border-zinc-800">
                {selectedRunId.slice(0, 8)}
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 bg-zinc-950">
          {events.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-700 text-center space-y-3">
              <Terminal className="w-6 h-6 opacity-20" />
              <p className="text-[10px] uppercase tracking-widest opacity-30">No Events Yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {events.map((event, idx) => {
                const eventData =
                  event.data === null || event.data === undefined
                    ? ''
                    : JSON.stringify(event.data);
                const eventPreview =
                  eventData.length > 80 ? `${eventData.slice(0, 80)}...` : eventData;

                const isIntercept = event.type.toLowerCase().includes('intercept');
                const tone = isIntercept
                  ? { dot: 'bg-amber-300', badge: 'text-amber-300 bg-amber-500/10 border-amber-400/30' }
                  : { dot: 'bg-emerald-400', badge: 'text-emerald-300 bg-emerald-500/10 border-emerald-400/30' };

                return (
                  <button
                    key={`${event.type}-${idx}`}
                    onClick={() => onSelectEventIndex(idx)}
                    className={`w-full text-left px-3 py-1.5 rounded border transition-all ${
                      selectedEventIndex === idx
                        ? 'bg-zinc-900 border-zinc-700'
                        : 'bg-transparent border-transparent hover:bg-zinc-900/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <div className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${tone.dot}`} />
                          <span className="text-[10px] font-bold text-zinc-300 font-mono truncate uppercase">
                            {event.type}
                          </span>
                          <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider border ${tone.badge}`}>
                            {isIntercept ? 'intercept' : 'event'}
                          </span>
                        </div>
                        {eventPreview && (
                          <div className="mt-1 text-[10px] text-zinc-500 font-mono truncate">
                            {eventPreview}
                          </div>
                        )}
                      </div>
                      <div className="text-[9px] text-zinc-600 font-mono">#{idx + 1}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="h-[340px] flex flex-col min-h-0 bg-zinc-950">
        <div className="flex items-center border-b border-zinc-800 bg-zinc-950 px-2 pt-1">
          <button
            onClick={() => onInspectorTabChange('payload')}
            className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold border-b transition-colors ${
              inspectorTab === 'payload'
                ? 'border-zinc-300 text-zinc-200'
                : 'border-transparent text-zinc-600 hover:text-zinc-400'
            }`}
          >
            Payload
          </button>
          <button
            onClick={() => onInspectorTabChange('state')}
            className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold border-b transition-colors ${
              inspectorTab === 'state'
                ? 'border-zinc-300 text-zinc-200'
                : 'border-transparent text-zinc-600 hover:text-zinc-400'
            }`}
          >
            State
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-zinc-950">
          {!selectedEvent ? (
            <div className="h-full flex items-center justify-center text-zinc-700 text-[10px] uppercase tracking-widest opacity-30">
              Select Event
            </div>
          ) : (
            <div className="font-mono text-[11px]">
              {inspectorTab === 'payload' ? (
                <JsonView data={selectedEvent} style={darkStyles} shouldExpandNode={(level) => level < 2} />
              ) : (
                <JsonView data={context} style={darkStyles} shouldExpandNode={(level) => level < 2} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InspectorPanel;
