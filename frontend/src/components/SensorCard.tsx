import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';

interface SensorCardProps {
  name: string;
  value: number;
  unit: string;
  color?: string;
}

const SensorCard: React.FC<SensorCardProps>= (props) => {
    return (
        <IonCard color = {props.color || 'light'}>
            <IonCardHeader>
            <IonCardTitle>{props.name}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
            <h1>{props.value.toFixed(1)} {props.unit}</h1>
            </IonCardContent>
        </IonCard>
    );
}

export default SensorCard;