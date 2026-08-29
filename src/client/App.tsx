import React, { useState } from 'react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads' | 'deals' | 'tickets' | 'workflows'>('dashboard');

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'grid', placeItems: 'center', fontWeight: 'bold' }}>⚡</div>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>OmniCRM</h3>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Enterprise v1.0</span>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('dashboard')}
            style={{ justifyContent: 'flex-start' }}
          >
            📊 Executive Dashboard
          </button>
          <button 
            className={`btn ${activeTab === 'leads' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('leads')}
            style={{ justifyContent: 'flex-start' }}
          >
            🎯 Leads & Prospects
          </button>
          <button 
            className={`btn ${activeTab === 'deals' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('deals')}
            style={{ justifyContent: 'flex-start' }}
          >
            💼 Sales Pipeline Kanban
          </button>
          <button 
            className={`btn ${activeTab === 'tickets' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('tickets')}
            style={{ justifyContent: 'flex-start' }}
          >
            🎧 Support SLA Queue
          </button>
          <button 
            className={`btn ${activeTab === 'workflows' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('workflows')}
            style={{ justifyContent: 'flex-start' }}
          >
            ⚙️ Workflow Engine
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="main-content">
        <header className="navbar">
          <div>
            <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Organization: </span>
            <strong>Acme Enterprise Corp</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="badge badge-success">ADMIN ROLE</span>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#6366f1', display: 'grid', placeItems: 'center', fontWeight: 'bold' }}>SA</div>
          </div>
        </header>

        <main className="content-body">
          {activeTab === 'dashboard' && (
            <div>
              <h1 className="title-lg">Executive Performance Dashboard</h1>
              <p className="subtitle">Real-time revenue forecast, funnel breakdown, and SLA metrics.</p>
              
              <div className="metrics-grid" style={{ marginTop: '1.5rem' }}>
                <div className="glass-card">
                  <span className="subtitle">Total Active Pipeline</span>
                  <div className="metric-value">$4,850,000</div>
                  <span className="badge badge-success">+14.2% MoM</span>
                </div>
                <div className="glass-card">
                  <span className="subtitle">Weighted Sales Forecast</span>
                  <div className="metric-value">$2,410,000</div>
                  <span className="badge badge-cold">60% Probability</span>
                </div>
                <div className="glass-card">
                  <span className="subtitle">Win Rate</span>
                  <div className="metric-value">68.4%</div>
                  <span className="badge badge-hot">Top Tier</span>
                </div>
                <div className="glass-card">
                  <span className="subtitle">Active Leads</span>
                  <div className="metric-value">1,248</div>
                  <span className="badge badge-warm">342 Hot Rating</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'leads' && (
            <div>
              <h1 className="title-lg">Lead Intelligence & Prospecting</h1>
              <p className="subtitle">AI-assisted lead scoring, assignment rules, and firmographics.</p>
              
              <div className="glass-card" style={{ marginTop: '1.5rem' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Lead Name</th>
                      <th>Company</th>
                      <th>Title</th>
                      <th>Source</th>
                      <th>Score</th>
                      <th>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Sarah Jenkins</td>
                      <td>Global Tech Solutions</td>
                      <td>VP of Infrastructure</td>
                      <td>WEBSITE</td>
                      <td>85</td>
                      <td><span className="badge badge-hot">HOT</span></td>
                    </tr>
                    <tr>
                      <td>Michael Chang</td>
                      <td>Apex Financial Group</td>
                      <td>Director of IT</td>
                      <td>PAID_CAMPAIGN</td>
                      <td>62</td>
                      <td><span className="badge badge-warm">WARM</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'deals' && (
            <div>
              <h1 className="title-lg">Sales Pipeline Kanban</h1>
              <p className="subtitle">Visual stage progression, deal velocity, and weighted forecast.</p>
              
              <div className="kanban-board" style={{ marginTop: '1.5rem' }}>
                <div className="kanban-column">
                  <div className="kanban-header">
                    <span>DISCOVERY (10%)</span>
                    <span>$450,000</span>
                  </div>
                  <div className="kanban-card">
                    <h4>Cloud Migration Expansion</h4>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0.4rem 0' }}>Acme Corp - $150,000</p>
                    <span className="badge badge-cold">Discovery Stage</span>
                  </div>
                </div>

                <div className="kanban-column">
                  <div className="kanban-header">
                    <span>PROPOSAL (60%)</span>
                    <span>$1,200,000</span>
                  </div>
                  <div className="kanban-card">
                    <h4>Enterprise CRM Rollout</h4>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0.4rem 0' }}>Nexus Financial - $350,000</p>
                    <span className="badge badge-warm">Proposal Stage</span>
                  </div>
                </div>

                <div className="kanban-column">
                  <div className="kanban-header">
                    <span>CLOSED WON (100%)</span>
                    <span>$3,200,000</span>
                  </div>
                  <div className="kanban-card">
                    <h4>Global License Renewal</h4>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0.4rem 0' }}>Apex Global - $800,000</p>
                    <span className="badge badge-success">CLOSED WON</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tickets' && (
            <div>
              <h1 className="title-lg">Support Queue & SLA Monitoring</h1>
              <p className="subtitle">Real-time SLA response alarms and customer satisfaction ratings.</p>
            </div>
          )}

          {activeTab === 'workflows' && (
            <div>
              <h1 className="title-lg">Event Automation & Workflow Engine</h1>
              <p className="subtitle">Trigger-action rule evaluators and webhook dispatchers.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
export default App;
