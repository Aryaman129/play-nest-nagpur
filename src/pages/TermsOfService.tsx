import { motion } from 'framer-motion';
import { FaGavel, FaHandshake, FaExclamationTriangle, FaUsers } from 'react-icons/fa';
import Navbar from '../components/Navbar';

const TermsOfService = () => {
  const sections = [
    {
      icon: <FaUsers className="text-2xl text-primary" />,
      title: "User Responsibilities",
      content: [
        "Provide accurate information when creating your account",
        "Use the platform respectfully and follow community guidelines",
        "Arrive on time for your bookings and respect turf rules",
        "Report any issues or disputes promptly through our support system"
      ]
    },
    {
      icon: <FaHandshake className="text-2xl text-secondary" />,
      title: "Booking Terms",
      content: [
        "Bookings require 50% advance payment to confirm your slot",
        "Cancellations made 24+ hours in advance receive full refund",
        "No-shows or late cancellations may forfeit the advance payment",
        "Turf owners reserve the right to cancel due to weather or maintenance"
      ]
    },
    {
      icon: <FaExclamationTriangle className="text-2xl text-accent" />,
      title: "Platform Usage",
      content: [
        "PlayNest is for legitimate sports turf bookings only",
        "Creating fake accounts or manipulating reviews is prohibited",
        "Users must be 18+ or have parental consent to use the platform",
        "We reserve the right to suspend accounts for policy violations"
      ]
    },
    {
      icon: <FaGavel className="text-2xl text-primary" />,
      title: "Liability & Disputes",
      content: [
        "PlayNest facilitates bookings but is not liable for turf conditions",
        "Disputes between users and turf owners are handled through mediation",
        "Our liability is limited to the amount paid for the specific booking",
        "Users participate in sports activities at their own risk"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="pt-20 pb-16 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <FaGavel className="text-6xl text-primary mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">Terms of Service</h1>
            <p className="text-xl text-muted-foreground">
              Please read these terms carefully before using PlayNest
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Introduction */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg mb-12"
          >
            <h2 className="text-3xl font-bold mb-6">Agreement to Terms</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Welcome to PlayNest! These Terms of Service ("Terms") govern your use of our sports turf booking platform. By accessing or using PlayNest, you agree to be bound by these Terms and our Privacy Policy.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              PlayNest connects sports enthusiasts with quality turf facilities across Nagpur. We strive to provide a seamless booking experience while maintaining fair policies for all users.
            </p>
            <div className="bg-accent/10 border-l-4 border-accent p-4 rounded-r-lg">
              <p className="text-sm font-medium">
                <strong>Important:</strong> If you disagree with any part of these terms, please discontinue use of our platform immediately.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Terms Sections */}
      <div className="py-16 bg-gradient-to-br from-muted/20 to-muted/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-6">
                  {section.icon}
                  <h3 className="text-2xl font-bold">{section.title}</h3>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Terms */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <h3 className="text-2xl font-bold mb-4">Payment & Refund Policy</h3>
            <div className="space-y-4 text-muted-foreground">
              <p><strong>Payment Terms:</strong> All bookings require 50% advance payment to secure your slot. The remaining 50% is payable at the turf before your game.</p>
              <p><strong>Refund Policy:</strong></p>
              <ul className="ml-6 space-y-1">
                <li>• Cancellations 24+ hours in advance: 100% refund</li>
                <li>• Cancellations 12-24 hours in advance: 50% refund</li>
                <li>• Cancellations less than 12 hours: No refund</li>
                <li>• Weather-related cancellations by turf: Full refund</li>
              </ul>
              <p><strong>Processing:</strong> Refunds are processed within 5-7 business days to your original payment method.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <h3 className="text-2xl font-bold mb-4">Prohibited Activities</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-red-600">Not Allowed:</h4>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>• Creating multiple fake accounts</li>
                  <li>• Posting false reviews or ratings</li>
                  <li>• Using the platform for non-sports activities</li>
                  <li>• Attempting to bypass payment systems</li>
                  <li>• Harassing other users or turf owners</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-green-600">We Encourage:</h4>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>• Honest reviews and feedback</li>
                  <li>• Respectful communication</li>
                  <li>• Timely payments and attendance</li>
                  <li>• Reporting issues constructively</li>
                  <li>• Following turf rules and guidelines</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <h3 className="text-2xl font-bold mb-4">Changes to Terms</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may update these Terms of Service from time to time to reflect changes in our services or legal requirements. When we make significant changes, we will:
            </p>
            <ul className="space-y-2 text-muted-foreground ml-6">
              <li>• Notify all users via email and in-app notifications</li>
              <li>• Post the updated terms on our website with a new "Last Updated" date</li>
              <li>• Provide a 30-day notice period before major changes take effect</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Continued use of PlayNest after changes indicates your acceptance of the new terms.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <h3 className="text-2xl font-bold mb-4">Contact & Support</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Questions about these Terms? Need help with your booking? Our support team is here to assist you:
            </p>
            <div className="bg-muted/20 rounded-lg p-4 space-y-2">
              <p className="text-sm"><strong>Email:</strong> support@playnest.in</p>
              <p className="text-sm"><strong>Phone:</strong> +91-XXX-XXX-XXXX (10 AM - 8 PM)</p>
              <p className="text-sm"><strong>Address:</strong> PlayNest Support, Nagpur, Maharashtra, India</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-8 bg-gradient-to-r from-primary/10 to-secondary/10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold mb-4">Ready to Play?</h3>
          <p className="text-muted-foreground mb-6">Join thousands of players booking their favorite turfs on PlayNest</p>
          <motion.a
            href="/turfs"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-sport text-lg px-8 py-4"
          >
            Browse Turfs
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;