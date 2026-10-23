import { useState, useEffect } from 'react';
import SiteLayout from '../components/SiteLayout.jsx';
import Reveal from '../components/Reveal.jsx';
import { leadersAndAdvisors, innovatorsAndCreators } from '../data/team.js';
import {
  FacebookIcon,
  TwitterIcon,
  LinkedInIcon,
  GithubIcon,
  GlobeIcon,
} from '../components/icons.jsx';

function TeamSocialDock({ socials = {}, side = 'right' }) {
  const items = [
    { key: 'facebook', label: 'Facebook', Icon: FacebookIcon, cls: 'team-social-btn--fb' },
    { key: 'twitter', label: 'Twitter', Icon: TwitterIcon, cls: 'team-social-btn--tw' },
    { key: 'linkedin', label: 'LinkedIn', Icon: LinkedInIcon, cls: 'team-social-btn--li' },
    { key: 'github', label: 'GitHub', Icon: GithubIcon, cls: 'team-social-btn--gh' },
    { key: 'portfolio', label: 'Portfolio', Icon: GlobeIcon, cls: 'team-social-btn--web' },
  ];

  return (
    <div
      className={`team-social-dock team-social-dock--${side}`}
      role="group"
      aria-label="Social & Portfolio links"
    >
      {items.map(({ key, label, Icon, cls }) => {
        const url = socials[key] || '#';
        return (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`team-social-btn ${cls}`}
            data-label={label}
            aria-label={label}
            title={label}
            onClick={(e) => {
              if (url === '#') e.preventDefault();
            }}
          >
            <Icon size={14} />
          </a>
        );
      })}
    </div>
  );
}

export default function Team() {
  const [teamMembers, setTeamMembers] = useState(() => {
    try {
      const saved = localStorage.getItem('sv_team_members');
      if (saved) return JSON.parse(saved);
      return [...leadersAndAdvisors, ...innovatorsAndCreators];
    } catch {
      return [...leadersAndAdvisors, ...innovatorsAndCreators];
    }
  });

  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem('sv_team_members');
        if (saved) setTeamMembers(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('sv_team_sync', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('sv_team_sync', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const leaders = teamMembers.filter((m) => m.id !== 'fullstack-dev-sazzad');
  const innovators = teamMembers.filter((m) => m.id === 'fullstack-dev-sazzad');

  return (
    <SiteLayout variant="team" main mainClassName="awards-page-main">
      {/* Ambient Eco Decorative Elements in Background - Identical to Awards & Blog */}
      <div className="awards-bg-deco" aria-hidden="true">
        <img
          src="/assets/images/recycle.png"
          alt=""
          className="awards-bg-watermark awards-watermark-1"
          loading="lazy"
        />
        <img
          src="/assets/images/recycle.png"
          alt=""
          className="awards-bg-watermark awards-watermark-2"
          loading="lazy"
        />
        <img
          src="/assets/images/recycle.png"
          alt=""
          className="awards-bg-watermark awards-watermark-3"
          loading="lazy"
        />
        <img
          src="/assets/images/recycle.png"
          alt=""
          className="awards-bg-watermark awards-watermark-4"
          loading="lazy"
        />
        <div className="awards-glow-orb awards-glow-orb--1"></div>
        <div className="awards-glow-orb awards-glow-orb--2"></div>
        <div className="awards-glow-orb awards-glow-orb--3"></div>
      </div>

      {/* Team Page Hero Header */}
      <section className="team-page-hero">
        <Reveal className="wrap team-page-hero__inner">
          <h1 className="page-title">
            The Passionate Minds Behind <span className="team-title-accent">ScrapVenture</span>
          </h1>
          <p className="page-subtitle">
            Meet the leaders, innovators, and advisors behind ScrapVenture — pioneering smart, tech-driven waste supply chains for a cleaner, circular green Bangladesh.
          </p>
        </Reveal>
      </section>

      {/* Main Team Roster Grid (Leaders & Advisors) */}
      <section className="team-content-section">
        <div className="wrap">
          <div className="team-roster-grid">
            {leaders.map((member) => (
              <Reveal as="article" className="team-card" key={member.id}>
                {/* Photo on Top with Glaze Sheen & Animated Pop-Out Social Dock */}
                <div className="team-card__media">
                  <img
                    src={member.image}
                    alt={`${member.name} - ${member.rank}`}
                    loading="lazy"
                    className="team-card__img"
                  />

                  {/* Animated Social Links Dock */}
                  <TeamSocialDock
                    socials={member.socials}
                    side={member.socialSide || 'right'}
                  />
                </div>

                {/* Name, Rank & Bio */}
                <div className="team-card__body">
                  <h3 className="team-card__name">{member.name}</h3>
                  <p className="team-card__rank">{member.rank}</p>
                  <p className="team-card__desc">{member.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The Innovators & Creators Section */}
      <section className="team-innovators-section">
        <div className="wrap">
          <Reveal className="team-section-header">
            <h2 className="team-section-title">
              The Innovators &amp; <span className="team-title-accent">Creators</span>
            </h2>
            <p className="team-section-subtitle">
              The passionate developers and tech innovators turning vision into interactive, high-performance digital reality.
            </p>
          </Reveal>

          <div className="team-innovators-grid">
            {innovators.map((member) => (
              <Reveal as="article" className="team-card" key={member.id}>
                <div className="team-card__media">
                  <img
                    src={member.image}
                    alt={`${member.name} - ${member.rank}`}
                    loading="lazy"
                    className="team-card__img"
                  />

                  <TeamSocialDock
                    socials={member.socials}
                    side={member.socialSide || 'right'}
                  />
                </div>

                <div className="team-card__body">
                  <h3 className="team-card__name">{member.name}</h3>
                  <p className="team-card__rank">{member.rank}</p>
                  <p className="team-card__desc">{member.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
