import { Link } from "react-router-dom";
const AboutUs = () =>{
    return (
        <div className="flex flex-col w-full h-screen md:items-center">
          <div className="w-full font-Pacifico px-10 py-5 text-3xl bg-gray-200 flex justify-between items-center">
            <Link to="/">Vibie</Link>
            <div className="text-xl">#join the vibetribe</div>
          </div>
          <div className="mt-5 md:mt-[100px] px-5 font-Lexend md:max-w-[80%] w-full">
        <div className="sticky top-0 bg-white w-full py-3 border-b-2">
          <div className="text-xl md:text-3xl">About Us</div>
            </div>
            <div className="mt-5">
              Hello! Welcome to Vibie - a social media platform that matches your vibes.
             </div>
            <div>
              <ul className="list-disc px-5 py-8">
                <li className="">
                  <div className="text-lg">What makes Vibie unique?</div>
                  <ul className="list-disc px-4">
                    <li>A Place for Everyone: Vibie is designed to celebrate individuality and diversity. No matter who you are or where you come from, there’s always a tribe for you here.</li>
                    <li>Simple & Fun: We’ve made Vibie user-friendly and engaging, so you can focus on what matters most – creating and connecting.</li>
                    <li>Global Vibes: Explore and share content that resonates with people across the globe, all in one vibrant feed.</li>
                  </ul>
                </li>
                <li className="mt-5">
                  <div className="text-lg">Why Vibie?</div>
                  <p>We know how important it is to feel heard and seen. Vibie isn’t just about likes and numbers; it’s about building authentic connections, celebrating life’s moments, and being part of a community that feels like home.</p>
                </li>
                <li className="mt-5">
                  <div className="text-lg">Dev team</div>
                  <p>Vibie was developed by <a href="https://github.com/makersmecca" className="underline cursor-pointer">this</a> guy. Say hi to him if you enjoyed Vibie!</p>
                </li>
              </ul>
            </div>
          </div>
        </div>)
}
export default AboutUs;