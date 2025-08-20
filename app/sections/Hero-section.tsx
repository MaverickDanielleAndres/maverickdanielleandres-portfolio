"use client"


import ShinyText from "@/components/ShinyText"
import TrueFocus from "@/components/TrueFocus"

export default function() {
    return (
        <>
            <section className="relative z-10 text-center px-6 -mt-40">
            
            <ShinyText
                text="Maverick Danielle P. Andres"
                disabled={false}
                speed={3}
                className="mb-6"
                />
            
                <TrueFocus 
                sentence="Web_Developer Designer IT_Support"
                manualMode={false}
                blurAmount={2}
                borderColor="white"
                animationDuration={2}
                pauseBetweenAnimations={1.5}
                />
                
                <a
                href="#about"
                className=" mt-20 inline-block px-6 py-3 bg-white text-black font-semibold rounded-full shadow-lg hover:bg-gray-200 transition"
                >
                Get Started
                </a>
      </section>
        </>
    )
}