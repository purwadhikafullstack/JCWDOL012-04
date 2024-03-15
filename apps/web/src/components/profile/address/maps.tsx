"use client"

import { APIProvider, AdvancedMarker, Map, useMapsLibrary, MapControl, ControlPosition } from '@vis.gl/react-google-maps';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';


export type LatLng = { lat: number, lng: number }

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

export default function Maps(
    {
        onMarkerUpdated,
        initialCoordinates
    }: {
        onMarkerUpdated?: Dispatch<SetStateAction<LatLng>>,
        initialCoordinates?: LatLng
    }
) {
    const [position, setPosition] = useState<LatLng>(initialCoordinates ? initialCoordinates : { lat: - 6.175211007317426, lng: 106.82715358395524 })
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);

    useEffect(() => {
        if (!selectedPlace) return;
        const lat = selectedPlace?.geometry?.location?.lat().valueOf()
        const lng = selectedPlace?.geometry?.location?.lng().valueOf()
        setPosition({ lat, lng } as LatLng)
    }, [selectedPlace])

    useEffect(() => {
        if (onMarkerUpdated) onMarkerUpdated(position)
    }, [position])

    return (
        <APIProvider apiKey={API_KEY!} >
            <Map
                defaultCenter={position}
                center={position}
                defaultZoom={15}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                mapId={'30375e280843a302'}
            >
                <MapControl position={ControlPosition.TOP_CENTER}>
                    <AutoComplete onPlaceSelect={setSelectedPlace} />
                </MapControl>

                <AdvancedMarker
                    position={position}
                    draggable={true}
                    onDragEnd={(event) => {
                        const lat = event.latLng?.lat().valueOf()
                        const lng = event.latLng?.lng().valueOf()
                        setPosition({ lat, lng } as LatLng)
                    }}
                />
            </Map>
        </APIProvider>
    )
}

interface Props {
    onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

function AutoComplete({ onPlaceSelect }: Props) {
    const [placeAutocomplete, setPlaceAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const places = useMapsLibrary('places');

    useEffect(() => {
        if (!places || !inputRef.current) return;

        const options = {
            fields: ['geometry', 'name', 'formatted_address']
        };

        setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
    }, [places]);

    useEffect(() => {
        if (!placeAutocomplete) return;

        placeAutocomplete.addListener('place_changed', () => {
            onPlaceSelect(placeAutocomplete.getPlace());
        });
    }, [onPlaceSelect, placeAutocomplete]);

    useEffect(() => { setTimeout(() => (document.body.style.pointerEvents = ""), 0) }, [])

    return (
        <div className="autocomplete-container mt-2">
            <input ref={inputRef} className='rounded-md' />
        </div>
    )
}