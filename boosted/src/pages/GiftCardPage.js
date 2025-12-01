import React, { useState } from 'react';

const GiftCardPage = () => {
  const [amount, setAmount] = useState(50);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Gift card for $${amount} will be sent to ${recipientEmail}`);
  };

  return (
    <div className="gift-card-page">
      <div className="container">
        <div className="gift-card-header">
          <h1>Gift Card</h1>
          <p className="subtitle">Give the gift of electric mobility</p>
        </div>

        <div className="gift-card-content">
          <div className="gift-card-form-section">
            <h2>Choose Amount</h2>
            <div className="amount-options">
              {[25, 50, 100, 200, 500].map((value) => (
                <button
                  key={value}
                  className={`amount-button ${amount === value ? 'active' : ''}`}
                  onClick={() => setAmount(value)}
                >
                  ${value}
                </button>
              ))}
            </div>
            <div className="custom-amount">
              <label>Custom Amount:</label>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                placeholder="Enter amount"
              />
            </div>
          </div>

          <div className="gift-card-form-section">
            <h2>Delivery Information</h2>
            <form onSubmit={handleSubmit} className="gift-card-form">
              <div className="form-group">
                <label>Recipient Email:</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="recipient@example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label>Your Message (Optional):</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a personal message..."
                  rows="4"
                />
              </div>
              <div className="gift-card-total">
                <div className="total-amount">
                  <span>Total:</span>
                  <span className="amount-value">${amount}.00</span>
                </div>
              </div>
              <button type="submit" className="btn-primary btn-large">
                Purchase Gift Card
              </button>
            </form>
          </div>
        </div>

        <div className="gift-card-info">
          <h2>Gift Card Terms</h2>
          <ul>
            <li>Gift cards never expire</li>
            <li>Can be used for any product on Boosted USA</li>
            <li>Gift cards are delivered via email instantly</li>
            <li>Can be combined with other gift cards</li>
            <li>Non-refundable but transferable</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GiftCardPage;

