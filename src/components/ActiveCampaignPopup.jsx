import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { campaignImpacts } from '../data/campaigns.js';

export default function ActiveCampaignPopup() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Do not show popup inside admin console or dashboard routes
    if (
      location.pathname.startsWith('/admin') ||
      location.pathname.startsWith('/collector') ||
      location.pathname.startsWith('/dashboard')
    ) {
      setIsOpen(false);
      return;
    }

    const checkActiveCampaign = () => {
      try {
        let campaigns = [];
        const saved = localStorage.getItem('sv_campaigns_data');
        if (saved) {
          campaigns = JSON.parse(saved);
        } else {
          campaigns = campaignImpacts.map((c, idx) => ({
            ...c,
            destinationUrl: c.id === 'campus-drive-2025' ? '/#school-campaign' : '/book-pickup',
            bannerImage: '/assets/images/milestone-campaign.jpg',
            durationDays: idx === 0 ? 7 : 5,
            status: 'Active',
            expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
          }));
        }

        // Find first active campaign that has not expired
        const running = campaigns.find(
          (c) => c.status === 'Active' && (!c.expiresAt || c.expiresAt > Date.now())
        );

        if (running) {
          const dismissedId = sessionStorage.getItem(`sv_dismissed_campaign_${running.id}`);
          if (!dismissedId) {
            setActiveCampaign(running);
            // Brief entrance delay
            const timer = setTimeout(() => setIsOpen(true), 600);
            return () => clearTimeout(timer);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    checkActiveCampaign();

    const handleSync = () => checkActiveCampaign();
    window.addEventListener('sv_campaigns_sync', handleSync);
    return () => window.removeEventListener('sv_campaigns_sync', handleSync);
  }, [location.pathname]);

  const handleDismiss = () => {
    if (activeCampaign) {
      sessionStorage.setItem(`sv_dismissed_campaign_${activeCampaign.id}`, 'true');
    }
    setIsOpen(false);
  };

  const handleNavigate = () => {
    if (!activeCampaign) return;
    const dest = activeCampaign.destinationUrl || '/book-pickup';
    handleDismiss();
    if (dest.startsWith('http')) {
      window.open(dest, '_blank');
    } else {
      navigate(dest);
    }
  };

  if (!isOpen || !activeCampaign) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '16px',
        animation: 'fadeIn 0.25s ease-out',
      }}
      onClick={handleDismiss}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '18px',
          maxWidth: '520px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)',
          position: 'relative',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Interactive Close (X) button with hover effect */}
        <button
          type="button"
          onClick={handleDismiss}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.92)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 800,
            color: '#334155',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#fee2e2';
            e.currentTarget.style.color = '#dc2626';
            e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.92)';
            e.currentTarget.style.color = '#334155';
            e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
          }}
          title="Close campaign popup"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Campaign Banner Image (Clickable to Destination URL) */}
        <div
          onClick={handleNavigate}
          style={{
            position: 'relative',
            width: '100%',
            height: '220px',
            cursor: 'pointer',
            overflow: 'hidden',
            background: '#0f172a',
          }}
          title="Click to explore campaign"
        >
          <img
            src={activeCampaign.bannerImage || '/assets/images/milestone-campaign.jpg'}
            alt={activeCampaign.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '14px',
              background: '#ea580c',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: '20px',
              letterSpacing: '0.4px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            }}
          >
            🔥 {activeCampaign.badge || 'Active Eco Drive'}
          </div>
        </div>

        {/* Campaign Content */}
        <div style={{ padding: '22px 24px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#15803d',
                background: '#dcfce7',
                padding: '2px 8px',
                borderRadius: '6px',
              }}
            >
              Active Campaign · {activeCampaign.durationDays || 7} Days
            </span>
            {activeCampaign.location && (
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                📍 {activeCampaign.location}
              </span>
            )}
          </div>

          <h3
            onClick={handleNavigate}
            style={{
              fontSize: '18px',
              fontWeight: 800,
              color: '#0f172a',
              margin: '0 0 10px',
              cursor: 'pointer',
              lineHeight: 1.35,
            }}
          >
            {activeCampaign.title}
          </h3>

          <p
            style={{
              fontSize: '13.5px',
              color: '#475569',
              lineHeight: '1.55',
              margin: '0 0 20px',
            }}
          >
            {activeCampaign.summary ||
              'Mobilizing citizens to divert bulk recyclable scrap into certified circular recovery streams.'}
          </p>

          {/* Action Row */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={handleNavigate}
              style={{
                flex: 1,
                background: '#ea580c',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '11px 18px',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(234, 88, 12, 0.35)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#c2410c';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ea580c';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>Explore Campaign & Join</span>
              <span>➔</span>
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              style={{
                background: '#f1f5f9',
                color: '#475569',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '11px 16px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e2e8f0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
              }}
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

