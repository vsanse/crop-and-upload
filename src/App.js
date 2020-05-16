import React from 'react';
import Uploader from './components/uploader';

// React Notification
import 'react-notifications/lib/notifications.css';
import { NotificationContainer } from 'react-notifications';

function App() {
  return (
    <div className="App">
      <Uploader/>
      <NotificationContainer />
    </div>
  );
}

export default App;
