import parkingConflictDemo from '@/data/parking-conflict-demo.json';
import {ParkingConflictFlow} from '@/components/ParkingConflictFlow';

export default function ParkingConflictDemoPage() {
  return <ParkingConflictFlow demo={parkingConflictDemo} />;
}
