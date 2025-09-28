import { motion } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaCreditCard, FaStar } from 'react-icons/fa';
import { MdSportsSoccer, MdSportsCricket, MdSportsTennis } from 'react-icons/md';
import { IoTennisball } from 'react-icons/io5';
import Navbar from '../components/Navbar';
import TurfCard from '../components/TurfCard';
import heroTurf from '../assets/hero-turf.jpg';
import cricketTurf from '../assets/cricket-turf.jpg';
import tennisTurf from '../assets/tennis-turf.jpg';
import badmintonTurf from '../assets/badminton-turf.jpg';
const Home = () => {
  // Mock data for featured turfs
  const featuredTurfs = [{
    id: '1',
    name: 'Green Valley Sports Complex',
    address: 'Dharampeth, Nagpur',
    basePrice: 800,
    rating: 4.8,
    sports: ['football', 'cricket'],
    image: cricketTurf,
    distance: 2.5
  }, {
    id: '2',
    name: 'Champions Tennis Arena',
    address: 'Civil Lines, Nagpur',
    basePrice: 600,
    rating: 4.6,
    sports: ['tennis', 'badminton'],
    image: tennisTurf,
    distance: 3.2
  }, {
    id: '3',
    name: 'Victory Badminton Hub',
    address: 'Sadar, Nagpur',
    basePrice: 400,
    rating: 4.7,
    sports: ['badminton'],
    image: badmintonTurf,
    distance: 1.8
  }];
  const howItWorksSteps = [{
    icon: <FaSearch />,
    title: 'Search & Browse',
    description: 'Find the perfect turf near you with our smart filters'
  }, {
    icon: <FaCalendarAlt />,
    title: 'Book Your Slot',
    description: 'Choose your preferred time and secure your booking'
  }, {
    icon: <FaCreditCard />,
    title: 'Pay Safely',
    description: 'Pay 50% advance through secure payment gateway'
  }, {
    icon: <MdSportsSoccer />,
    title: 'Play & Enjoy',
    description: 'Show up and enjoy your game at the booked venue'
  }];
  const sports = [{
    name: 'Football',
    icon: <MdSportsSoccer />,
    color: 'text-primary'
  }, {
    name: 'Cricket',
    icon: <MdSportsCricket />,
    color: 'text-secondary'
  }, {
    name: 'Tennis',
    icon: <MdSportsTennis />,
    color: 'text-accent'
  }, {
    name: 'Badminton',
    icon: <IoTennisball />,
    color: 'text-primary'
  }];
  return <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `url(${heroTurf})`
      }}>
          <div className="absolute inset-0 hero-gradient opacity-90" />
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <motion.h1 initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className="text-5xl md:text-7xl font-bold mb-6">
            Book Your Perfect
            <span className="block bg-gradient-to-r from-sports-orange to-yellow-400 bg-clip-text text-transparent">
              Sports Turf
            </span>
          </motion.h1>
          
          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.2
        }} className="text-xl md:text-2xl mb-8 text-white/90">
            Discover and book premium sports facilities across Nagpur. 
            From football to cricket, find your game!
          </motion.p>
          
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.4
        }} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} className="btn-hero text-lg px-8 py-4">
              <FaSearch className="inline mr-2" />
              Find Turfs Near Me
            </motion.button>
            
            <motion.button whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-primary transition-all duration-300">
              List Your Turf
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Sports Categories */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} viewport={{
          once: true
        }} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Choose Your Sport</h2>
            <p className="text-xl text-muted-foreground">Find the perfect venue for your favorite game</p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {sports.map((sport, index) => <motion.div key={sport.name} initial={{
            opacity: 0,
            scale: 0.8
          }} whileInView={{
            opacity: 1,
            scale: 1
          }} whileHover={{
            scale: 1.05,
            y: -5
          }} transition={{
            duration: 0.3,
            delay: index * 0.1
          }} viewport={{
            once: true
          }} className="bg-card rounded-2xl p-8 text-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300">
                <div className={`text-6xl mb-4 ${sport.color}`}>
                  {sport.icon}
                </div>
                <h3 className="text-xl font-semibold">{sport.name}</h3>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Featured Turfs */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} viewport={{
          once: true
        }} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Featured Turfs</h2>
            <p className="text-xl text-muted-foreground">Top-rated venues in Nagpur</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTurfs.map((turf, index) => <motion.div key={turf.id} initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: index * 0.1
          }} viewport={{
            once: true
          }}>
                <TurfCard turf={turf} />
              </motion.div>)}
          </div>
          
          <motion.div initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} transition={{
          duration: 0.6,
          delay: 0.3
        }} viewport={{
          once: true
        }} className="text-center mt-12">
            <motion.button whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} className="btn-sport text-lg px-8 py-4">
              View All Turfs
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} viewport={{
          once: true
        }} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Book your turf in 4 simple steps</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => <motion.div key={step.title} initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: index * 0.1
          }} viewport={{
            once: true
          }} className="text-center">
                <motion.div whileHover={{
              scale: 1.1,
              rotate: 5
            }} className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-6 shadow-lg">
                  {step.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} viewport={{
          once: true
        }}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Play?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join thousands of players who trust PlayNest for their sports venue bookings
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }} className="bg-white text-primary font-semibold px-8 py-4 rounded-xl hover:shadow-xl transition-all duration-300">
                Start Booking
              </motion.button>
              <motion.button whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }} className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-primary transition-all duration-300">
                List Your Venue
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-foreground via-foreground to-foreground/95 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12 lg:gap-16">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/20 rounded-xl">
                  <MdSportsSoccer className="text-3xl text-primary" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  PlayNest
                </span>
              </div>
              <p className="text-lg text-white/80 mb-6 max-w-md leading-relaxed">
                Your trusted partner for sports venue bookings. Connect with the best sports facilities and book your perfect game time.
              </p>
              
            </div>
            
            {/* For Players Section */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">For Players</h4>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-white/70 hover:text-primary transition-colors duration-200 flex items-center group">
                    <span className="w-1 h-1 bg-primary rounded-full mr-3 group-hover:w-2 transition-all duration-200"></span>
                    Find Turfs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-primary transition-colors duration-200 flex items-center group">
                    <span className="w-1 h-1 bg-primary rounded-full mr-3 group-hover:w-2 transition-all duration-200"></span>
                    Book Online
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-primary transition-colors duration-200 flex items-center group">
                    <span className="w-1 h-1 bg-primary rounded-full mr-3 group-hover:w-2 transition-all duration-200"></span>
                    My Bookings
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Company Section */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Company</h4>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-white/70 hover:text-primary transition-colors duration-200 flex items-center group">
                    <span className="w-1 h-1 bg-primary rounded-full mr-3 group-hover:w-2 transition-all duration-200"></span>
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-primary transition-colors duration-200 flex items-center group">
                    <span className="w-1 h-1 bg-primary rounded-full mr-3 group-hover:w-2 transition-all duration-200"></span>
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-primary transition-colors duration-200 flex items-center group">
                    <span className="w-1 h-1 bg-primary rounded-full mr-3 group-hover:w-2 transition-all duration-200"></span>
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="border-t border-white/20 mt-16 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white/60 text-center md:text-left">
                © 2024 PlayNest. All rights reserved. Made for sports lovers.
              </p>
              <div className="flex items-center gap-6 text-sm text-white/60">
                <a href="#" className="hover:text-white transition-colors">Contact</a>
                <span>•</span>
                <a href="#" className="hover:text-white transition-colors">Support</a>
                <span>•</span>
                <a href="#" className="hover:text-white transition-colors">Help</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>;
};
export default Home;