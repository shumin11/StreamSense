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
      fpsLimit: 60,
      particles: {
        number: {
          value: 120,
          density: { enable: true, area: 800 },
        },
        color: { value: "#71797E" },
        shape: {
          type: "circle",
        },
        opacity: {
          value: 0.5,
          anim: { enable: false },
        },
        size: {
          value: { min: 1, max: 5 },
          anim: { enable: false },
        },
        links: {
          enable: true,
          distance: 150,
          color: "#ffffff",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 2,
          direction: "none",
          outModes: { default: "out" },
        },
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: "grab" },
          resize: true,
        },
        modes: {
          grab: {
            distance: 200,
            links: { opacity: 0.7 },
          },
        },
      },
      detectRetina: true,
    }),
    []
  );

  if (init) {
    return <Particles id="tsparticles" particlesLoaded={particlesLoaded} options={options} />;
  }

  return <></>;
};

export default CustomParticles;
