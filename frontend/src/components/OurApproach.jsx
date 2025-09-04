import React from "react";
import { motion } from "framer-motion";

function OurApproach() {
  return (
    <div className="flex flex-col items-center justify-center mt-20 mb-10 text-center px-4">
      <div className="w-full flex flex-col items-center justify-center">
        <h1 className="text-xl sm:text-3xl font-extrabold tracking-wide font-playfair">
          Our Approach to Fashion Design
        </h1>
        <p className="mt-4 text-xs sm:text-base text-gray-600 leading-relaxed max-w-xl">
          Minimal. Effortless. Intentional. We craft pieces that fuse clean
          design with everyday comfort—timeless silhouettes, modern energy.
        </p>
      </div>
      <motion.div
        className="w-full h-full mt-20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      ></motion.div>
    </div>
  );
}

export default OurApproach;
