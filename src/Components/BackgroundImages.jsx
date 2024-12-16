import bg1 from "/bgImg/bg1.jpeg";
import bg2 from "/bgImg/bg2.jpeg";
import bg3 from "/bgImg/bg3.jpeg";
import bg4 from "/bgImg/bg4.jpeg";
import bg5 from "/bgImg/bg5.jpeg";
import bg6 from "/bgImg/bg6.jpeg";
import bg7 from "/bgImg/bg7.jpeg";
import bg8 from "/bgImg/bg8.jpeg";
import bg9 from "/bgImg/bg9.jpeg";
import bg10 from "/bgImg/bg10.jpeg";
const BackgroundImages = () => {
  return (
    <div className="flex flex-row gap-2 md:justify-center h-full">
      {/* widescreen images */}
      <div className="hidden md:block relative -top-10">
        <img src={bg2} className="h-[250px] w-[150px] rounded-lg mt-2" />
        <img src={bg3} className="h-[250px] w-[150px] rounded-lg mt-2" />
        <img src={bg4} className="h-[250px] w-[150px] rounded-lg mt-2" />
        <img src={bg1} className="h-[250px] w-[150px] rounded-lg mt-2" />
      </div>
      <div className="hidden md:block relative -top-24">
        <img src={bg9} className="h-[250px] w-[150px] rounded-lg mt-2" />
        <img src={bg1} className="h-[250px] w-[150px] rounded-lg mt-2" />
        <img src={bg8} className="h-[250px] w-[150px] rounded-lg mt-2" />
        <img src={bg1} className="h-[250px] w-[150px] rounded-lg mt-2" />
      </div>
      {/* smallscreen images */}
      <div className="relative -top-24 -left-2">
        <img src={bg1} className="h-[250px] w-[150px] rounded-lg mt-2" />
        <img src={bg2} className="h-[250px] w-[150px] rounded-lg mt-2" />
      </div>
      <div className="relative -top-5 -left-2">
        <img src={bg8} className="h-[250px] w-[200px] rounded-lg mt-2" />
        <img src={bg4} className="h-[250px] w-[200px] rounded-lg mt-2" />
      </div>
      <div className="relative -top-32 -left-2">
        <img src={bg5} className="h-[250px] w-[200px] rounded-lg mt-2" />
        <img src={bg6} className="h-[250px] w-[200px] rounded-lg mt-2" />
      </div>
      {/* widescreen images */}
      <div className="hidden md:block relative -top-24">
        <img src={bg6} className="h-[250px] w-[150px] rounded-lg mt-2" />
        <img src={bg4} className="h-[250px] w-[150px] rounded-lg mt-2" />
        <img src={bg9} className="h-[250px] w-[150px] rounded-lg mt-2" />
        <img src={bg10} className="h-[250px] w-[150px] rounded-lg mt-2" />
      </div>
      <div className="hidden md:block relative -top-24">
        <img src={bg7} className="h-[250px] w-[150px] rounded-lg mt-2" />
        <img src={bg10} className="h-[250px] w-[150px] rounded-lg mt-2" />
        <img src={bg5} className="h-[250px] w-[150px] rounded-lg mt-2" />
        <img src={bg2} className="h-[250px] w-[150px] rounded-lg mt-2" />
      </div>
    </div>
  );
};

export default BackgroundImages;
