import SiteLayout from '../components/SiteLayout.jsx';
import Reveal from '../components/Reveal.jsx';
import awards from '../data/awards.js';

export default function Awards() {
  return (
    <SiteLayout variant="awards" main mainClassName="awards-page-main">
      {/* Ambient Eco Decorative Elements in Background */}
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

      {/* Page Heading & Hero Intro */}
      <section className="awards-page-hero">
        <Reveal className="wrap awards-page-hero__inner">
          <h1 className="page-title">
            Honors, Awards &amp; <span className="awards-title-accent">National Recognition</span>
          </h1>
          <p className="page-subtitle">
            Recognized for pioneering digital waste management, circular innovation, and sustainable environmental impact across Bangladesh.
          </p>
        </Reveal>
      </section>

      {/* Editorial Awards Showcase with Left-Slide Image & Down-Slide Content */}
      <section className="awards-list-section">
        <div className="wrap">
          <div className="awards-list">
<<<<<<< HEAD
            {awards.map((a) => (
=======
            {awards.map((a, idx) => (
>>>>>>> 3fbf89bad36747bac50ac0e7c8cd9af3b3f77957
              <Reveal
                as="article"
                className="award-item"
                key={a.img}
              >
                <div className="award-item__media">
<<<<<<< HEAD
=======
                  <span className="award-card-tag">Milestone #{idx + 1}</span>
>>>>>>> 3fbf89bad36747bac50ac0e7c8cd9af3b3f77957
                  <img src={a.img} alt={a.title} loading="lazy" />
                </div>

                <div className="award-item__content">
                  <div className="award-item__meta">
                    <span className="award-item__tag">{a.tag}</span>
                    <span className="award-item__sep">•</span>
                    <span className="award-item__date">{a.date}</span>
                  </div>
                  <h2 className="award-item__title">{a.title}</h2>
                  <p className="award-item__desc">{a.desc}</p>
                  <div className="award-item__highlight">
<<<<<<< HEAD
                    <span>Verified Achievement</span>
=======
                    <span>Verified Milestone Achievement</span>
>>>>>>> 3fbf89bad36747bac50ac0e7c8cd9af3b3f77957
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
