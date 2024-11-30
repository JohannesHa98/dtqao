'use client';
import { useEffect, useState } from "react";

export default function Home() {
  const [showMessage, setShowMessage] = useState(null);

  useEffect(() => {
    const randomChoice = Math.random() < 0.5 ? "message1" : "message2";
    setShowMessage(randomChoice);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      {showMessage === "message1" && (
        <div className="text-5xl font-bold text-gray-800 text-white">THEY QUEUED ANOTHER 😭</div>
      )}
      {showMessage === "message2" && (
        <div className="text-5xl font-bold text-gray-800 text-white">THEY RAGEQUIT 😆</div>
      )}
    </div>
  );
}
