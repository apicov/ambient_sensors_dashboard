from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

# Enable CORS for your React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ionic dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_CONFIG = {
    'host': os.getenv("DB_HOST"),
    'database': 'ambient_sensors_flexible',
    'user': os.getenv("DB_USER"),
    'password': os.getenv("DB_PASSWORD"),
    'port': 5432
}
@app.get("/api/sensors/measurements/latest")
def get_latest_readings():
    """Get the latest reading for each sensor and metric type with thresholds"""
    conn = psycopg2.connect(**DB_CONFIG, cursor_factory=RealDictCursor)
    cursor = conn.cursor()
    
    query = """
        SELECT DISTINCT ON (m.sensor_id, m.metric_type) 
            s.sensor_id,
            s.sensor_type,
            m.metric_type, 
            m.value, 
            m.time,
            COALESCE(t_specific.good_min, t_default.good_min) as good_min,
            COALESCE(t_specific.good_max, t_default.good_max) as good_max,
            COALESCE(t_specific.acceptable_min, t_default.acceptable_min) as acceptable_min,
            COALESCE(t_specific.acceptable_max, t_default.acceptable_max) as acceptable_max
        FROM measurements m
        JOIN sensors s ON m.sensor_id = s.sensor_id
        LEFT JOIN metric_thresholds t_specific 
            ON m.metric_type = t_specific.metric_type 
            AND m.sensor_id = t_specific.sensor_id
        LEFT JOIN metric_thresholds t_default 
            ON m.metric_type = t_default.metric_type 
            AND t_default.sensor_id IS NULL
        WHERE m.metric_type NOT LIKE '%_std'
        ORDER BY m.sensor_id, m.metric_type, m.time DESC
    """
    
    cursor.execute(query)
    results = cursor.fetchall()
    
    cursor.close()
    conn.close()

    print(results)
    
    return {"data": results}


@app.get("/api/devices")
def get_devices():
    """Get all devices"""
    conn = psycopg2.connect(**DB_CONFIG, cursor_factory=RealDictCursor)
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM devices")
    results = cursor.fetchall()
    
    cursor.close()
    conn.close()

    print(results)
    
    return {"data": results}

@app.get("/api/sensors")
def get_sensors():
    """Get all sensors"""
    conn = psycopg2.connect(**DB_CONFIG, cursor_factory=RealDictCursor)
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM sensors")
    results = cursor.fetchall()
    
    cursor.close()
    conn.close()

    print(results)
    
    return {"data": results}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8080,
        ssl_keyfile=os.getenv("SSL_KEYFILE"),
        ssl_certfile=os.getenv("SSL_CERTFILE")
    )

