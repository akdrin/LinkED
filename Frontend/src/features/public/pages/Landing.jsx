import React from "react";
import { Link } from "react-router";
import "../style/landing.scss";
import { useAuth } from "../../auth/hooks/useAuth";

const Landing = () => {
    const { user } = useAuth();

    return (
        <main className="landing-page">
            <section className="hero-card">
                <p className="pill">JUIT Community Portal</p>
                <h1>Jaypee University of Information Technology</h1>
                <p className="tagline">
                    A mentorship portal where students can connect with suitable alumni for career guidance,
                    placement preparation, and real-world insights.
                </p>
                <div className="cta-row">
                    {user ? (
                        <Link className="button primary-button" to="/portal">Go to Portal</Link>
                    ) : (
                        <>
                            <Link className="button primary-button" to="/login">Login</Link>
                            <Link className="button secondary-button" to="/register">Register</Link>
                        </>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Landing;