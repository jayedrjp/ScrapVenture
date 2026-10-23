import SiteLayout from '../components/SiteLayout.jsx';
import Reveal from '../components/Reveal.jsx';
<<<<<<< HEAD
import { leadersAndAdvisors, innovatorsAndCreators } from '../data/team.js';
=======
import team from '../data/team.js';
>>>>>>> 3fbf89bad36747bac50ac0e7c8cd9af3b3f77957
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
<<<<<<< HEAD
            <Icon size={14} />
=======
            <Icon size={15} />
>>>>>>> 3fbf89bad36747bac50ac0e7c8cd9af3b3f77957
          </a>
        );
      })}
    </div>
  );
}

export default function Team() {
  return (
<<<<<<< HEAD
    <SiteLayout variant="team" main mainClassName="awards-page-main">
      {/* Ambient Eco Decorative Elements in Background - Identical to Awards & Blog */}
      <div className="awards-bg-deco" aria-hidden="true">
        <img
          src="/assets/images/recycle.png"
          alt=""
          className="awards-bg-watermark awards-watermark-1"
=======
    <SiteLayout variant="team" main>
      {/* Ambient Eco Decorative Elements in Background */}
      <div className="team-bg-deco" aria-hidden="true">
        <img
          src="/assets/images/recycle.png"
          alt=""
          className="team-bg-watermark team-watermark-tl"
>>>>>>> 3fbf89bad36747bac50ac0e7c8cd9af3b3f77957
          loading="lazy"
        />
        <img
          src="/assets/images/recycle.png"
          alt=""
<<<<<<< HEAD
          className="awards-bg-watermark awards-watermark-2"
=======
          className="team-bg-watermark team-watermark-tr"
>>>>>>> 3fbf89bad36747bac50ac0e7c8cd9af3b3f77957
          loading="lazy"
        />
        <img
          src="/assets/images/recycle.png"
          alt=""
<<<<<<< HEAD
          className="awards-bg-watermark awards-watermark-3"
=======
          className="team-bg-watermark team-watermark-bl"
>>>>>>> 3fbf89bad36747bac50ac0e7c8cd9af3b3f77957
          loading="lazy"
        />
        <img
          src="/assets/images/recycle.png"
          alt=""
<<<<<<< HEAD
          className="awards-bg-watermark awards-watermark-4"
          loading="lazy"
        />
        <div className="awards-glow-orb awards-glow-orb--1"></div>
        <div className="awards-glow-orb awards-glow-orb--2"></div>
        <div className="awards-glow-orb awards-glow-orb--3"></div>
=======
          className="team-bg-watermark team-watermark-br"
          loading="lazy"
        />
        <div className="team-glow-orb team-glow-orb--1"></div>
        <div className="team-glow-orb team-glow-orb--2"></div>
>>>>>>> 3fbf89bad36747bac50ac0e7c8cd9af3b3f77957
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

<<<<<<< HEAD
      {/* Main Team Roster Grid (Leaders & Advisors) */}
      <section className="team-content-section">
        <div className="wrap">
          <div className="team-roster-grid">
            {leadersAndAdvisors.map((member) => (
=======
      {/* Main Team Roster Grid */}
      <section className="team-content-section">
        <div className="wrap">
          <div className="team-roster-grid">
            {team.map((member) => (
>>>>>>> 3fbf89bad36747bac50ac0e7c8cd9af3b3f77957
              <Reveal as="article" className="team-card" key={member.id}>
                {/* Photo on Top with Glaze Sheen & Animated Pop-Out Social Dock */}
                <div className="team-card__media">
                  <img
                    src={member.image}
                    alt={`${member.name} - ${member.rank}`}
                    loading="lazy"
                    className="team-card__img"
                  />

<<<<<<< HEAD
                  {/* Animated Social Links Dock */}
=======
                  {/* Animated Social Links Dock (Slides out from Left or Right on Hover) */}
>>>>>>> 3fbf89bad36747bac50ac0e7c8cd9af3b3f77957
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
<<<<<<< HEAD

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
            {innovatorsAndCreators.map((member) => (
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
=======
>>>>>>> 3fbf89bad36747bac50ac0e7c8cd9af3b3f77957
    </SiteLayout>
  );
}
