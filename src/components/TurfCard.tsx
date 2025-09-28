import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { MdSportsSoccer, MdSportsCricket, MdSportsTennis } from 'react-icons/md';

interface Turf {
  id: string;
  name: string;
  address: string;
  basePrice: number;
  rating: number;
  sports: string[];
  image: string;
  distance?: number;
}

interface TurfCardProps {
  turf: Turf;
  onClick?: () => void;
}

const getSportIcon = (sport: string) => {
  const icons: { [key: string]: JSX.Element } = {
    football: <MdSportsSoccer className="text-primary" />,
    cricket: <MdSportsCricket className="text-primary" />,
    tennis: <MdSportsTennis className="text-primary" />,
  };
  return icons[sport.toLowerCase()] || <MdSportsSoccer className="text-primary" />;
};

const TurfCard = ({ turf, onClick }: TurfCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="card-turf cursor-pointer group overflow-hidden"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image */}
      <div className="relative overflow-hidden rounded-xl mb-4">
        <img 
          src={turf.image} 
          alt={turf.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
          <FaStar className="text-sports-orange text-sm" />
          <span className="text-sm font-semibold">{turf.rating}</span>
        </div>
        {turf.distance && (
          <div className="absolute top-3 left-3 bg-primary/90 text-white rounded-lg px-2 py-1">
            <span className="text-sm font-medium">{turf.distance} km</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
            {turf.name}
          </h3>
          <div className="flex items-center gap-1 text-muted-foreground">
            <FaMapMarkerAlt className="text-xs" />
            <span className="text-sm truncate">{turf.address}</span>
          </div>
        </div>

        {/* Sports */}
        <div className="flex items-center gap-2">
          {turf.sports.slice(0, 3).map((sport, index) => (
            <motion.div
              key={sport}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.2 }}
              className="text-lg"
            >
              {getSportIcon(sport)}
            </motion.div>
          ))}
          {turf.sports.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{turf.sports.length - 3} more
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary">₹{turf.basePrice}</span>
            <span className="text-muted-foreground text-sm">/hour</span>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-sport text-sm"
          >
            Book Now
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default TurfCard;