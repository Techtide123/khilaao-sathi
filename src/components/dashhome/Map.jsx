'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapClient = ({ posts }) => {
  const defaultCenter = [20.295, 85.818];

  return (
    <MapContainer center={defaultCenter} zoom={6} scrollWheelZoom={false} className="h-[200px] w-full rounded-lg z-0">
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {posts.map((post) => (
        <Marker key={post._id} position={[post.lat, post.lng]}>
          <Popup>
            <strong className="text-lg">{post.title}</strong><br />
            <p>👥 {post.peopleCount}</p>{post.description}<br />
            <p> 📞 {post.contact}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapClient;
