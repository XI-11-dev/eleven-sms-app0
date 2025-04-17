export default function TestSMS() {
  const sendSMS = async (e) => {
    e.preventDefault();
    const from = e.target.from.value;
    const to = e.target.to.value;
    const message = e.target.message.value;

    const res = await fetch('/api/sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to, message }),
    });

    const data = await res.json();
    alert(JSON.stringify(data));
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h2>Test SMS</h2>
      <form onSubmit={sendSMS}>
        <div>
          <label>From: </label>
          <input type="text" name="from" defaultValue="+18337753445" required />
        </div>
        <div>
          <label>To: </label>
          <input type="text" name="to" defaultValue="+1234567890" required />
        </div>
        <div>
          <label>Message: </label>
          <input type="text" name="message" defaultValue="Hello from ElevenSolutions!" required />
        </div>
        <button type="submit">Send SMS</button>
      </form>
    </div>
  );
}

https://eleven-sms-app0.vercel.app/test
