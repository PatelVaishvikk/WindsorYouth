import { useState } from 'react';
import ChatBot from './ChatBot';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={`chat-widget ${isOpen ? 'open' : 'closed'}`}>
        <div className="chat-header">
          <span>Chat with AI</span>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            &times;
          </button>
        </div>
        <div className="chat-body">
          <ChatBot />
        </div>
      </div>

      {/* Floating Blue Button */}
      <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
        <i className="fas fa-comment-alt"></i>
      </button>

      <style jsx>{`
        .chat-toggle {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background-color: #4e73df; /* Blue background */
          color: #fff;
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          font-size: 20px;
          cursor: pointer;
          z-index: 10000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.3s ease;
        }
        .chat-toggle:hover {
          background-color: #3a5bb8;
        }
        .chat-toggle i {
          pointer-events: none;
        }

        .chat-widget {
          position: fixed;
          bottom: 80px; /* Just above the toggle button */
          right: 20px;
          width: 350px;
          max-width: 90%;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          z-index: 10000;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        .chat-widget.closed {
          transform: translateY(120%);
          opacity: 0;
          pointer-events: none;
        }
        .chat-widget.open {
          transform: translateY(0);
          opacity: 1;
        }
        .chat-header {
          background-color: #4e73df;
          color: #fff;
          padding: 10px 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
        .close-btn {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 20px;
          cursor: pointer;
        }
        .chat-body {
          height: 400px;
          overflow-y: auto;
        }
      `}</style>
    </>
  );
}
