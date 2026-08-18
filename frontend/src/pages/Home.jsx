import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">

      {/* HERO SECTION */}
      <section className="home-hero">

        <div className="home-hero-content">
          <p className="home-eyebrow">CAMPUS LOST & FOUND</p>

          <h1>
            Lost something?
            <br />
            <span>Find it on Campus.</span>
          </h1>

          <p>
            CampusCrate makes it easier for students to report lost items,
            post found belongings, and reconnect items with their rightful
            owners — all in one place.
          </p>

          <div className="home-actions">
            <Link to="/items" className="home-primary-btn">
              Browse Items
            </Link>

            <Link to="/post/lost" className="home-secondary-btn">
              Report Lost Item
            </Link>
          </div>
        </div>

        {/* HERO VISUAL */}
        <div className="home-visual">
          <div className="home-visual-inner">

            <div className="home-visual-icon">
              🔎
            </div>

            <h2>Find what you're looking for</h2>

            <p>
              Search lost and found items across your campus.
            </p>

            <div className="home-mini-stats">
              <div>
                <strong>Lost</strong>
                <span>Report an item</span>
              </div>

              <div>
                <strong>Found</strong>
                <span>Help someone find it</span>
              </div>
            </div>

          </div>
        </div>

      </section>


      {/* FEATURES */}
      <section className="home-features">

        <div className="home-feature-card">
          <div className="home-feature-icon">📍</div>

          <h3>Easy to Search</h3>

          <p>
            Find items using categories, locations, status and keywords
            instead of searching through endless posts.
          </p>
        </div>


        <div className="home-feature-card">
          <div className="home-feature-icon">🔐</div>

          <h3>Secure Claims</h3>

          <p>
            Verification questions help item owners make sure belongings
            are being claimed by the right person.
          </p>
        </div>


        <div className="home-feature-card">
          <div className="home-feature-icon">🤝</div>

          <h3>Reconnect Items</h3>

          <p>
            From reporting a lost item to marking it as returned,
            CampusCrate keeps the entire process organised.
          </p>
        </div>

      </section>


      {/* HOW IT WORKS */}
      <section className="home-how">

        <div className="home-section-heading">
          <p className="home-eyebrow">HOW IT WORKS</p>

          <h2>
            Lost or found something?
          </h2>

          <p>
            CampusCrate keeps the process simple.
          </p>
        </div>


        <div className="home-steps">

          <div className="home-step">
            <span>01</span>
            <h3>Post</h3>
            <p>
              Report a lost item or post something you've found.
            </p>
          </div>

          <div className="home-step">
            <span>02</span>
            <h3>Search</h3>
            <p>
              Browse listings and use filters to find a matching item.
            </p>
          </div>

          <div className="home-step">
            <span>03</span>
            <h3>Claim</h3>
            <p>
              Submit a verification answer to claim a found item.
            </p>
          </div>

          <div className="home-step">
            <span>04</span>
            <h3>Return</h3>
            <p>
              Once reunited, the item can be marked as returned.
            </p>
          </div>

        </div>

      </section>


      {/* FINAL CTA */}
      <section className="home-cta">

        <h2>
          Ready to find your lost item?
        </h2>

        <p>
          Browse the latest lost and found posts on your campus.
        </p>

        <Link to="/items" className="home-primary-btn">
          Browse CampusCrate
        </Link>

      </section>

    </div>
  );
}

export default Home;