import { getDistance } from 'geolib';

export default function distance(lat1: string, lon1: string, lat2: string, lon2: string): number {
    return getDistance({ latitude: parseFloat(lat1), longitude: parseFloat(lon1) }, { latitude: parseFloat(lat2), longitude: parseFloat(lon2) });
}
