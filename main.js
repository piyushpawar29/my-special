const buildCharacterSpans = (element) => {
  if (!element) return;
  element.innerHTML = `<span>${element.textContent
    .split("")
    .join("</span><span>")}</span>`;
};

let audioUnlocked = false;

const playAudioMuted = () => {
  const audio = document.getElementById("audio");
  if (!audio) return;

  audio.muted = true;
  audio.play().catch(() => {});
};

const unlockAudio = () => {
  if (audioUnlocked) return;

  const audio = document.getElementById("audio");
  if (!audio) return;

  audio.muted = false;
  audio.volume = 1;
  audio.play().catch(() => {});
  audioUnlocked = true;

  document.removeEventListener("click", unlockAudio);
  document.removeEventListener("touchstart", unlockAudio);
};

document.addEventListener("click", unlockAudio);
document.addEventListener("touchstart", unlockAudio);

const animationTimeline = () => {
  buildCharacterSpans(document.querySelector(".hbd-chatbox"));
  buildCharacterSpans(document.querySelector(".wish-hbd"));

  const ideaTextTrans = {
    opacity: 0,
    y: -20,
    rotationX: 5,
    skewX: "15deg",
  };

  const ideaTextTransLeave = {
    opacity: 0,
    y: 20,
    rotationY: 5,
    skewX: "-15deg",
  };

  const tl = new TimelineMax();

  tl.to(".container", 0.1, { visibility: "visible" })
    .from(".one", 0.7, { opacity: 0, y: 10 })
    .from(".two", 0.4, { opacity: 0, y: 10 })
    .to(".one", 0.7, { opacity: 0, y: 10 }, "+=2.5")
    .to(".two", 0.7, { opacity: 0, y: 10 }, "-=1")
    .from(".three", 0.7, { opacity: 0, y: 10 })
    .to(".three", 0.7, { opacity: 0, y: 10 }, "+=2")
    .from(".four", 0.7, { scale: 0.2, opacity: 0 })
    .from(".fake-btn", 0.3, { scale: 0.2, opacity: 0 })
    .staggerTo(".hbd-chatbox span", 0.5, { visibility: "visible" }, 0.05)
    .to(".fake-btn", 0.1, { backgroundColor: "rgb(127, 206, 248)" })
    .to(".four", 0.5, { scale: 0.2, opacity: 0, y: -150 }, "+=0.7")

    // 🎵 START AUDIO (MUTED AUTOPLAY — browser allows this)
    .call(playAudioMuted)

    .from(".idea-1", 0.7, ideaTextTrans)
    .to(".idea-1", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-2", 0.7, ideaTextTrans)
    .to(".idea-2", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-3", 0.7, ideaTextTrans)
    .to(".idea-3 strong", 0.5, {
      scale: 1.2,
      x: 10,
      backgroundColor: "rgb(21, 161, 237)",
      color: "#fff",
    })
    .to(".idea-3", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-4", 0.7, ideaTextTrans)
    .to(".idea-4", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-5", 0.7, {
      rotationX: 15,
      rotationZ: -10,
      skewY: "-5deg",
      y: 50,
      z: 10,
      opacity: 0,
    })
    .to(".idea-5 span", 0.7, { rotation: 90, x: 8 }, "+=0.4")
    .to(".idea-5", 0.7, { scale: 0.2, opacity: 0 }, "+=2")
    .staggerFrom(
      ".idea-6 span",
      0.8,
      { scale: 3, opacity: 0, rotation: 15, ease: Expo.easeOut },
      0.2
    )
    .staggerTo(
      ".idea-6 span",
      0.8,
      { scale: 3, opacity: 0, rotation: -15, ease: Expo.easeOut },
      0.2,
      "+=1"
    )
    .staggerFromTo(
      ".baloons img",
      2.5,
      { opacity: 0.9, y: 1400 },
      { opacity: 1, y: -1000 },
      0.2
    )
    .from(".girl-dp", 0.5, {
      scale: 3.5,
      opacity: 0,
      x: 25,
      y: -25,
      rotationZ: -45,
    })
    .staggerFrom(".wish-hbd span", 0.7, {
      opacity: 0,
      y: -50,
      rotation: 150,
      skewX: "30deg",
      ease: Elastic.easeOut.config(1, 0.5),
    }, 0.1)
    .from(".wish h5", 0.5, {
      opacity: 0,
      y: 10,
      skewX: "-15deg",
    })
    .to(".six", 0.5, { opacity: 0, y: 30, zIndex: "-1" })
    .staggerFrom(".nine p", 1, ideaTextTrans, 1.2)
    .to(".last-smile", 0.5, { rotation: 90 }, "+=1");

  document.getElementById("replay")?.addEventListener("click", () => {
    tl.restart();
    playAudioMuted();
  });
};

const applyCustomization = (customData) => {
  Object.entries(customData).forEach(([key, value]) => {
    if (!value) return;

    const element = document.getElementById(key);
    if (!element) return;

    if (key === "imagePath") {
      element.src = value;
      return;
    }

    element.textContent = value;
  });
};

const fetchData = async () => {
  try {
    const res = await fetch("customize.json");
    if (!res.ok) throw new Error("Failed to load customize.json");
    applyCustomization(await res.json());
  } catch (err) {
    console.error(err);
  }
};

const initializePage = async () => {
  await fetchData();
  animationTimeline();
};

initializePage();
