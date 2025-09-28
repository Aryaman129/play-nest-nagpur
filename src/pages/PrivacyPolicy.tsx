import { motion } from 'framer-motion';
import { FaShieldAlt, FaUserShield, FaLock, FaEye } from 'react-icons/fa';
import Navbar from '../components/Navbar';

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: <FaUserShield className="text-2xl text-primary" />,
      title: "Information We Collect",
      content: [
        "Personal information you provide when creating an account (name, email, phone number)",
        "Booking details and payment information for turf reservations",
        "Location data when you search for nearby turfs (with your permission)",
        "Usage data to improve our services and user experience"
      ]
    },
    {
      icon: <FaEye className="text-2xl text-secondary" />,
      title: "How We Use Your Information",
      content: [
        "Process your turf bookings and send confirmation details",
        "Communicate important updates about your reservations",
        "Improve our platform based on usage patterns and feedback",
        "Send relevant promotions and offers (you can opt-out anytime)"
      ]
    },
    {
      icon: <FaLock className="text-2xl text-accent" />,
      title: "Data Protection",
      content: [
        "All sensitive data is encrypted using industry-standard protocols",
        "Payment information is processed securely through trusted providers",
        "We never store your complete payment card details on our servers",
        "Regular security audits ensure your data remains protected"
      ]
    },
    {
      icon: <FaShieldAlt className="text-2xl text-primary" />,
      title: "Your Rights",
      content: [
        "Access and review your personal data anytime through your profile",
        "Request deletion of your account and associated data",
        "Update or correct your information whenever needed",
        "Control your communication preferences and privacy settings"
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
            <FaShieldAlt className="text-6xl text-primary mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl text-muted-foreground">
              Your privacy is important to us. Learn how we protect and use your information.
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
            <h2 className="text-3xl font-bold mb-6">Welcome to PlayNest</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              At PlayNest, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform to book sports turfs.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              By using PlayNest, you agree to the collection and use of information in accordance with this policy. We will never sell your personal data to third parties.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Privacy Sections */}
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

      {/* Additional Policies */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <h3 className="text-2xl font-bold mb-4">Third-Party Services</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              PlayNest integrates with trusted third-party services to provide you with the best experience:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• <strong>Payment Processors:</strong> We use secure payment gateways that comply with PCI DSS standards</li>
              <li>• <strong>Maps & Location:</strong> Google Maps helps you find nearby turfs with your consent</li>
              <li>• <strong>Analytics:</strong> We use anonymous analytics to improve our platform performance</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <h3 className="text-2xl font-bold mb-4">Data Retention</h3>
            <p className="text-muted-foreground leading-relaxed">
              We retain your personal information only for as long as necessary to provide you with our services and comply with legal obligations. Booking history is kept for accounting purposes, but you can request deletion of your personal data at any time by contacting our support team.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <h3 className="text-2xl font-bold mb-4">Contact Us About Privacy</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or how we handle your data, please don't hesitate to reach out to us:
            </p>
            <div className="bg-muted/20 rounded-lg p-4">
              <p className="text-sm"><strong>Email:</strong> privacy@playnest.in</p>
              <p className="text-sm"><strong>Response Time:</strong> We typically respond within 48 hours</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Back to Top */}
      <div className="py-8 bg-gradient-to-r from-primary/10 to-secondary/10 text-center">
        <motion.a
          href="/turfs"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-sport text-lg px-8 py-4"
        >
          Start Booking Turfs
        </motion.a>
      </div>
    </div>
  );
};

export default PrivacyPolicy;