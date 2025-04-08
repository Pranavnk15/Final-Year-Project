import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import CodeAnalyzer from '../components/CodeAnalyzer';

function AnalyzerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-violet-900 to-gray-900 text-white pt-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-purple-200">
            Code Analysis & Patch Generator
          </h1>
          <p className="text-gray-300 mb-8">
            Paste your code below to analyze for vulnerabilities and generate security patches.
          </p>
          <CodeAnalyzer />
        </motion.div>
      </div>
    </div>
  );
}

export default AnalyzerPage;