import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, AlertTriangle, Zap, Lock, Code2 } from 'lucide-react';

function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <AlertTriangle className="w-8 h-8 text-red-400" />,
      title: "Zero-Day Detection",
      description: "Advanced AI algorithms to identify previously unknown security vulnerabilities in your code."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: "Real-Time Analysis",
      description: "Instant code analysis and vulnerability detection with detailed reporting."
    },
    {
      icon: <Lock className="w-8 h-8 text-green-400" />,
      title: "Security Patches",
      description: "AI-powered patch recommendations to fix identified vulnerabilities quickly."
    },
    {
      icon: <Code2 className="w-8 h-8 text-blue-400" />,
      title: "Multiple Languages",
      description: "Support for various programming languages and frameworks."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-violet-900 to-gray-900 text-white pt-16">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 text-center"
      >
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <Shield className="w-20 h-20 mb-8 text-violet-400" />
        </motion.div>
        
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-purple-200"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          ZeroPatch AI
        </motion.h1>

        <motion.h2 
          className="text-2xl md:text-3xl font-semibold mb-6 text-gray-300"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Zero-Day Vulnerability Detection & Patch Recommendation System
        </motion.h2>
        
        <motion.p 
          className="text-lg md:text-xl text-gray-300 max-w-2xl mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          This tool helps developers detect zero-day vulnerabilities in source code and instantly recommends patches using AI.
        </motion.p>
        
        <motion.button
          onClick={() => navigate('/analyzer')}
          className="group flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-full font-semibold transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-purple-200">
            Key Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
              >
                <div className="flex items-center gap-4 mb-4">
                  {feature.icon}
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Secure Your Code?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Start analyzing your code now and protect against zero-day vulnerabilities.
          </p>
          <motion.button
            onClick={() => navigate('/analyzer')}
            className="group inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-full font-semibold transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try It Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
}

export default LandingPage;