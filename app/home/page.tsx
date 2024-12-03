"use client"; // Esto marca el componente como Client Component

import { useEffect, useRef, useState } from "react";
import { CircleDot, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Bot } from "lucide-react";
import confetti from "canvas-confetti";
import axios from "axios";
import { motion } from "framer-motion"; // Importar Framer Motion
import { PuffLoader } from 'react-spinners';


export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [capturedFrame, setCapturedFrame] = useState<string | null>(null);
  const [isFlash, setIsFlash] = useState(false);
  const [isCapturing, setIsCapturing] = useState(true);
  const [chatMessages, setChatMessages] = useState<{ sender: string; message: string }[]>([]);
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(false); // Estado de carga

  const generateResponse = async () => {
    setLoading(true); // Activar el estado de carga
    try {
      if (!capturedFrame || !userMessage.trim()) {
        alert("Debe capturar una imagen y escribir un mensaje antes de enviar.");
        return;
      }

      // Verifica y limpia la cadena Base64 eliminando el prefijo
      const base64Image = capturedFrame.replace(/^data:image\/(png|jpeg);base64,/, "");

      // Asegúrate de que la cadena tenga una longitud adecuada y sea válida
      if (base64Image.length % 4 !== 0) {
        console.error("La cadena Base64 es inválida. Revisa el formato.");
        alert("La imagen que intentas enviar es inválida. Inténtalo de nuevo.");
        return;
      }

      const response = await axios.post('https://pingul-agentesinteligentes.hf.space/upload_info', {
        img: base64Image, // Envía la imagen sin el prefijo Base64
        text: userMessage,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      let botMessage = response.data.chat;

      // Formatear el texto eliminando '#' y '*' del mensaje
      botMessage = botMessage
        .replace(/#/g, "")  // Elimina los '#'
        .replace(/\*/g, "") // Elimina los '*'
        .replace(/###/g, "\n\n") // Opcional: Reemplazar '###' con saltos de línea adicionales para dividir secciones
        .replace(/-/g, "\n- "); // Formatear las listas correctamente

      setChatMessages((prevMessages) => [
        ...prevMessages,
        { sender: "You", message: userMessage },
        { sender: "Emoting", message: botMessage },
      ]);

      setUserMessage("");
    } catch (error) {
      console.error("Error al enviar la imagen y el texto:", error);
      alert("Hubo un error al procesar la solicitud.");
    } finally {
      setLoading(false); // Desactivar el estado de carga
    }
  };



  // Efecto para acceder a la cámara

  useEffect(() => {
    if (isCapturing && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Error al acceder a la cámara: ", err);
        });
    }
  }, [isCapturing]);

  const captureFrame = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const frame = canvas.toDataURL("image/png");
        setCapturedFrame(frame);

        // Log la imagen en base 64 en la consola
        console.log("Imagen capturada en base 64:", frame);
      }

      setIsFlash(true);
      setTimeout(() => {
        setIsFlash(false);
        setIsCapturing(false);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { x: 0.36, y: 0.9 },
          scalar: 2,
        });
      }, 200);
    }
  };


  const retryCapture = () => {
    setCapturedFrame(null);
    setIsCapturing(true);
  };

  const handleSendMessage = () => {
    if (userMessage.trim()) {
      generateResponse();
    }
  };



  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // Fade in y desde abajo
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-gray-100 min-h-screen flex items-center justify-start"
    >
      <div className=" rounded-lg overflow-hidden border-1 border-gray-300 ml-20 h-[650px] w-[940px] relative">
        {isFlash && <div className="absolute inset-0 bg-white z-50 opacity-75"></div>}
        {!capturedFrame && (
          <video
            ref={videoRef}
            className="rounded-lg absolute top-0 left-0"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
            }}
            autoPlay
          />
        )}
        {capturedFrame && (
          <img
            src={capturedFrame}
            alt="Captured frame"
            className="rounded-lg absolute top-0 left-0 w-full h-full object-cover"
          />
        )}

        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-4">
          {capturedFrame ? (
            <RefreshCw
              size={65}
              className="text-white transition-transform duration-300 ease-in-out hover:scale-125 hover:text-[#A19DFB] cursor-pointer"
              onClick={retryCapture}
            />
          ) : (
            <CircleDot
              size={65}
              className="text-white transition-transform duration-300 ease-in-out hover:scale-125 hover:text-[#A19DFB] cursor-pointer"
              onClick={captureFrame}
            />
          )}
        </div>
      </div>
      <div className="flex-grow ml-6 mr-20 h-[650px] bg-gray-300 rounded-lg shadow-lg flex flex-col justify-between p-4">
        <ScrollArea className="h-[450px] mb-0 p-4 rounded-lg">
          {chatMessages.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-full text-[#A19DFB]">
              <Bot className="h-32 w-32" />
              <h1 className="text-2xl font-bold text-center mt-2">¡Vamos a empezar!<br /> Captura una imagen <br />y escribe un mensaje.</h1>
              {/* <h1 className="text-lg font-light text-center mt-2">¡Vamos a empezar!<br /> Captura una imagen y escribe<br /> un mensaje.</h1> */}
            </div>
          ) : (
            chatMessages.map((msg, index) => (
              <div key={index} className={`mb-2 flex items-start ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
                {msg.sender === "You" && (
                  <div className="flex flex-col items-end space-x-2">
                    <div className="flex items-center space-x-2 gap-2">
                      <span className="text-white font-medium">{msg.sender}</span>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="https://github.com/shadcn.png" alt="Usuario Avatar" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="bg-white text-black max-w-xs break-words rounded-lg p-2 mt-4">
                      <span>{msg.message}</span>
                    </div>
                  </div>
                )}
                {msg.sender === "Emoting" && (
                  <div className="flex flex-col items-start space-x-2">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-8 w-8 text-[#A19DFB]" />
                      <span className="text-white font-medium">{msg.sender}</span>
                    </div>
                    <div className="bg-[#A19DFB] text-white max-w-xs break-words rounded-lg p-2 mt-4">
                      <span>{msg.message}</span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </ScrollArea>

        <div className="grid w-full gap-4">
          <Textarea
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            className="h-28 text-black bg-transparent"
            placeholder="¿Cómo te sientes el día de hoy?"
          />
          <Button onClick={handleSendMessage} className="bg-white text-black font-medium hover:bg-[#A19DFB] hover:text-white">
            {loading ? (
              <div className="flex justify-center items-center">
                <PuffLoader color="#A19DFB" loading={loading} size={24} /> {/* Spinner */}
              </div>
            ) : (
              '¡Hablemos!' // Texto cuando no está cargando
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
