import { motion } from 'framer-motion';
import { FaHandshake, FaUsers, FaBullseye, FaMapMarkerAlt } from 'react-icons/fa';
import { MdSportsSoccer } from 'react-icons/md';
import Navbar from '../components/Navbar';

const AboutUs = () => {
  const values = [
    {
      icon: <FaBullseye className="text-4xl text-primary" />,
      title: "Our Mission",
      description: "To make sports accessible to everyone by connecting players with quality turf facilities."
    },
    {
      icon: <FaUsers className="text-4xl text-secondary" />,
      title: "Community First",
      description: "Building a strong sports community where players and turf owners thrive together."
    },
    {
      icon: <FaHandshake className="text-4xl text-accent" />,
      title: "Trust & Quality",
      description: "Ensuring reliable bookings and maintaining high standards for all our partner turfs."
    },
    {
      icon: <FaMapMarkerAlt className="text-4xl text-primary" />,
      title: "Growth Focus",
      description: "Expanding to serve more cities with deep understanding of local sports culture and needs."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-20 pb-16 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-6">
              <MdSportsSoccer className="text-6xl text-primary" />
            </div>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              About PlayNest
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Your trusted partner for sports turf bookings. We're passionate about bringing the sports community together through seamless booking experiences.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-8">Our Story</h2>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                PlayNest was born from a simple observation: finding and booking quality sports turfs was unnecessarily complicated. As sports enthusiasts ourselves, we experienced the frustration of calling multiple venues, dealing with unclear pricing, and missing out on our favorite playing times.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                We envisioned a platform that would make sports more accessible to everyone - from weekend warriors to professional athletes, from small turf owners to large sports complexes. Today, PlayNest connects thousands of players with premium sports facilities.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our journey is just beginning, and we're committed to continuously improving the sports experience for our community.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-gradient-to-br from-muted/20 to-muted/10">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">What Drives Us</h2>
            <p className="text-xl text-muted-foreground">
              Our core values that shape everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-8">Built by Sports Enthusiasts</h2>
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                We're a team of sports enthusiasts, tech innovators, and community builders who understand the unique needs of the sports scene. We know the challenges players face when trying to find quality turfs.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our expertise combined with cutting-edge technology ensures that PlayNest serves the sports community exactly as it deserves - with passion, precision, and pride.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Join the PlayNest Community?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Whether you're a player looking for your next game or a turf owner ready to grow your business
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/turfs"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-sport text-lg px-8 py-4"
              >
                Find Turfs
              </motion.a>
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-outline text-lg px-8 py-4"
              >
                Contact Us
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;