import SensorCard from '../components/SensorCard';
import { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import './Home.css';

interface SensorReading {
  sensor_id: number,
  sensor_type: string,
  metric_type: string;
  value: number;
  time: string;
  acceptable_max: number;
  acceptable_min: number;
  good_max: number;
  good_min: number;
}

interface Sensor {
  sensor_id: number;
  sensor_type: string;
  metadata: Record<string, any>;
}

const API_URL = 'https://thestitchpatterns.store:8080';

const fetchData = async (url: string) => {
      try {
        const response = await fetch(url);
        return await response.json();
      } catch (error) {
        console.error('Error fetching sensor data:', error);
        return null;
      }
    };

const fetchLatestReadings = async () => {
  const url = `${API_URL}/api/sensors/measurements/latest`;
  return await fetchData(url);
};

const fetchSensors = async () => {
  const url = `${API_URL}/api/sensors`;
  return await fetchData(url);
}

const getMetricColor = (metricType: string) => {
  const colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'light', 'medium', 'dark'];
  // Use metric name to pick a color consistently
  const index = metricType.length % colors.length;
  return colors[index];
};


const Home: React.FC = () => {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [latestReadings, setLatestReadings] = useState([]);

  useEffect(() => {
    const loadSensors = async () => {
      const data = await fetchSensors();
      console.info("Fetched sensors:", data);
      console.info(Object.keys(data.data[0].metadata.fields))
      setSensors(data.data);
    };
    loadSensors();

    const loadLatestReadings = async () => {
      const data = await fetchLatestReadings();
      console.info("Fetched latest readings:", data);
      setLatestReadings(data.data);
    };
    loadLatestReadings();
  
    const interval = setInterval(() => {
      loadLatestReadings();
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Group readings by sensor_id
  const groupedBySensor = latestReadings.reduce((acc: Record<number, any[]> , reading: SensorReading) => {
  if (!acc[reading.sensor_id]) {
      acc[reading.sensor_id] = [];
    }
    acc[reading.sensor_id].push(reading);
    return acc;
  }, {});

  const getUnit = (sensorId: number, metricType: string) => {
  const sensor = sensors.find(s => s.sensor_id === sensorId);
  if (!sensor || !sensor.metadata) return '';
  
   return (sensor.metadata as any).fields?.[metricType]?.unit || '';
};

  const getSensorDescription = (sensorId: number) => {
    const sensor = sensors.find(s => s.sensor_id === sensorId);
    console.info(sensor);
     if (!sensor || !sensor.metadata) return '';
     return (sensor.metadata as any).description;
  }

  const checkMetricThresholds = (reading: SensorReading) => {
    if (reading.value >= reading.good_min && 
      reading.value <= reading.good_max)
        return 'success'; // green color
    if (reading.value >= reading.acceptable_min && 
      reading.value <= reading.acceptable_max)
        return 'warning'; //yellow
    return 'danger'; //red
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sensor Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px'}}>
          {Object.entries(groupedBySensor).map(([sensorId, readings]) => (
            <IonCard key={sensorId} color='light'>
              <IonCardHeader>
                <IonCardTitle>{getSensorDescription(readings[0].sensor_id)}</IonCardTitle>
              </IonCardHeader>
            <IonCardContent>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                  {readings.map((reading: any) => (
                    <SensorCard 
                      key={reading.metric_type}
                      name={reading.metric_type}
                      value={reading.value}
                      unit={getUnit(reading.sensor_id, reading.metric_type)}
                      color={checkMetricThresholds(reading)}
                    />
                  ))}
                  </div>
            </IonCardContent>
            </IonCard>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
