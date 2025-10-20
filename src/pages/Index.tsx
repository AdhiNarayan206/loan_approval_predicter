import ThreeScene from '@/components/ThreeScene';
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="relative w-screen h-screen bg-gray-100 overflow-hidden">
      <div className="absolute top-0 left-0 w-full p-8 z-10 text-center pointer-events-none">
        <h1 className="text-4xl font-bold text-gray-800">3D Portfolio Viewer</h1>
        <p className="text-lg text-gray-600 mt-2">Click and drag to rotate the object</p>
      </div>
      <ThreeScene />
      <div className="absolute bottom-0 left-0 w-full z-10">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;