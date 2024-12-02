"use client";

import Image from 'next/image';
import Hiking from '../app/public/images/hiking_landing.svg';
import { Button } from "@/components/ui/button";
import { Sticker } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Github } from 'lucide-react';
import { File } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [startAnimation, setStartAnimation] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleClick = () => {
    setStartAnimation(true);
    setTimeout(() => {
      router.push('/home');
    }, 1000);
  };

  const handlePopUp = () => {
    setShowPopup(!showPopup);
  };

  const exitAnimation = {
    hidden: {
      opacity: 0,
      y: -50,
      transition: { duration: 1 }
    }
  };

  const popupAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
  };

  const iconAnimation = {
    hidden: { opacity: 0, x: 0 },
    visible: { opacity: 1, x: 50, transition: { type: 'spring', stiffness: 100, damping: 15 } },
    exit: { opacity: 0, x: -50, transition: { type: 'spring', stiffness: 100, damping: 15 } },
  };

  const stickerAnimation = {
    hidden: { opacity: 0, scale: 1 },
    visible: { opacity: 1, scale: 1.5, transition: { type: 'spring', stiffness: 200, damping: 20 } }
  };

  return (
    <motion.div
      className="bg-gray-100 min-h-screen p-8 rounded-lg"
      initial="visible"
      animate={startAnimation ? "hidden" : "visible"}
      variants={exitAnimation}
    >
      <div className='flex flex-row justify-between items-center px-2'>
        <motion.div
          className="bg-[#A19DFB] p-4 rounded-full cursor-pointer relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: showPopup ? 1.1 : 1 }} // Expande el fondo cuando los íconos aparecen
          transition={{ duration: 0.5 }}
          onClick={() => handlePopUp()}
          variants={stickerAnimation} // Animación para expandir el fondo del sticker
        >
          <Sticker size={46} color="white" />

          {/* Íconos que saldrán desde el sticker */}
          <AnimatePresence>
            {showPopup && (
              <motion.div
                className="absolute bg-[#A19DFB] rounded-full p-4 top-2 left-1/2 transform -translate-x-1/2 space-x-4 flex"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={iconAnimation}
              >
                <Github className="text-white" size={32} />
                <File className="text-white" size={32} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          className='flex flex-row items-center'
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold">WellMinded</h1>
        </motion.div>
      </div>

      <div className="relative flex flex-row justify-between items-end mt-0 min-h-[640px] px-2">
        <motion.div
          className='flex flex-col items-left pb-4 z-10'
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="flex text-xl font-light text-left pb-4">
            ¡Hola! Soy WellMinded, tu asistente personal de salud mental.
          </h1>
          <h1 className="flex text-5xl font-bold text-left pb-6">
            Tu bienestar, nuestra prioridad.<br /> Diagnósticos con calma<br /> y confianza.
          </h1>
          <Button
            className="bg-[#A19DFB] hover:bg-[#8A83D1] text-white p-2 rounded-xl w-[200px]"
            onClick={handleClick}
          >
            ¡Vamos!
          </Button>
        </motion.div>

        <motion.div
          className="absolute top-[-50px] z-0 ml-[51%]"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src={Hiking}
            alt="Imagen de hiking"
            width={700}
            height={700}
            className="w-[700px] h-auto "
            loading="eager"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
