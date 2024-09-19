import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DashboardEmbed: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.post('http://localhost:3000/api/token');
        setToken(response.data.token);
        console.log('res', response.data.token);
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    fetchToken();
  }, []);

  return (
    <div>
      {token ? (
        <iframe
          src={`http://192.168.50.48:30845/app/main/dashboards/66989db977face003324f1e7?token=${token}?embed=true`}
          width="100%"
          height="600px"
          title="Sisense Dashboard"
        ></iframe>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DashboardEmbed;
