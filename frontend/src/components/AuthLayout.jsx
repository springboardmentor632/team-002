import React from "react";

/**
 * Shared shell for every auth screen (Login / Signup / OTP).
 * Left: a live "decision card" — the same compare-and-vote mechanic
 *       the product itself is built around.
 * Right: whatever form is passed in as children.
 */
export default function AuthLayout({ children }) {
  return (
    <div className="auth-root">
      <div className="auth-layout">
        <section className="decision-panel">
          <div className="brand-mark">
            <span className="dot-a">●</span>
            <span>DecisionHub</span>
          </div>

          <div className="decision-copy">
            <h1>Weigh it. Vote it. Decide it together.</h1>
            <p>
              Create a decision board, invite people whose opinion you trust,
              and let the votes settle the argument.
            </p>
          </div>

          <div className="vote-card" aria-hidden="true">
            <p className="vote-card__title">Live poll — MBA vs. new job offer</p>

            <div className="vote-row">
              <span className="vote-row__label">MBA</span>
              <div className="vote-track">
                <div
                  className="vote-fill vote-fill--a"
                  style={{ "--target": "64%" }}
                />
              </div>
              <span className="vote-row__pct">64%</span>
            </div>

            <div className="vote-row">
              <span className="vote-row__label">New job</span>
              <div className="vote-track">
                <div
                  className="vote-fill vote-fill--b"
                  style={{ "--target": "36%" }}
                />
              </div>
              <span className="vote-row__pct">36%</span>
            </div>
          </div>

          <p className="decision-footer">128 people have voted on this board</p>
        </section>

        <section className="form-panel">
          <div className="auth-card">{children}</div>
        </section>
      </div>
    </div>
  );
}
