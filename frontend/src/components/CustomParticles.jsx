import React, { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const CustomParticles = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container) => {
    console.log("Particles loaded.");
  };

  const options = useMemo(
    () => ({
      fullScreen: { enable: true, zIndex: -1 },
      background: {
        color: "#121212",
      },
      fpsLimit: 30,
      particles: {
        number: {
          value: 80,
          density: { enable: true, area: 1000 },
        },
        color: { value: "#71797E" },
        shape: {
          type: "circle",
        },
        opacity: {
          value: 0.3,
          anim: { enable: false },
        },
        size: {
          value: { min: 1, max: 3 },
          anim: { enable: false },
        },
        links: {
          enable: true,
          distance: 200,
          color: "#ffffff",
          opacity: 0.2,
          width: 1,
        },
        move: {
          enable: true,
          speed: 0.5,
          direction: "none",
          outModes: { default: "out" },
        },
      },
      interactivity: false,
      detectRetina: true,
    }),
    []
  );

  if (init) {
    return (
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={options}
      />
    );
  }

  return <></>;
};

export default CustomParticles;
