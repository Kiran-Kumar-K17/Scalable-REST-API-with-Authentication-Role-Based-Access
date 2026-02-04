function Message({ message }) {
  if (!message.text) return null;

  return (
    <div className={`message ${message.type}`}>
      {message.type === "error" ? "❌" : "✅"} {message.text}
    </div>
  );
}

export default Message;
