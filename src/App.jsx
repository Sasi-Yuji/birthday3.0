import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import ReactDom from 'react-dom';
import gsap from 'gsap';
import GlobalCanvas from './components/GlobalCanvas';
import SceneIntro from './components/SceneIntro';
import DoorTransition from './components/DoorTransition';

// Lazy load heavy scene components to reduce initial bundle
const SceneBalloons = lazy(() => import('./components/SceneBalloons'));
const SceneSurprise = lazy(() => import('./components/SceneSurprise'));
const ScenePasscode = lazy(() => import('./components/ScenePasscode'));
const SceneGallery = lazy(() => import('./components/SceneGallery'));
const ScenePosters = lazy(() => import('./components/ScenePosters'));
const SceneGallery3D = lazy(() => import('./components/SceneGallery3D'));
const SceneCake = lazy(() => import('./components/SceneCake'));
const ScenePuzzle = lazy(() => import('./components/ScenePuzzle'));
const SceneGift = lazy(() => import('./components/SceneGift'));
const SceneFinale = lazy(() => import('./components/SceneFinale'));
const SceneGiftRoom = lazy(() => import('./components/SceneGiftRoom'));

const LoadingScreen = () => (
  <div className="w-full h-full flex items-center justify-center bg-black">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-purple-500 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-white text-sm">Loading Scene...</p>
    </div>
  </div>
);

const SCENES = [
  'intro',
  'balloons',
  'giftroom',
  'surprise',
  'passcode',
  'gallery',
  'gallery3d',
  'cake',
  'puzzle',
  'gift',
  'finale'
];

function App() {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(() => {
    const saved = sessionStorage.getItem('birthday_scene_idx');
    return saved !== null ? parseInt(saved, 10) : 0;
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [effectMode, setEffectMode] = useState(() => {
    const saved = sessionStorage.getItem('birthday_scene_idx');
    const idx = saved !== null ? parseInt(saved, 10) : 0;
    return SCENES[idx] === 'finale' ? 'fireworks' : 'ambient';
  });

  useEffect(() => {
    sessionStorage.setItem('birthday_scene_idx', currentSceneIdx);
  }, [currentSceneIdx]);
  const [showDoorTransition, setShowDoorTransition] = useState(false);
  const containerRef = useRef(null);

  const goToScene = (index, skipAnimation = false) => {
    if (isTransitioning || index < 0 || index >= SCENES.length) return;
    setIsTransitioning(true);

    // Cinematic Door Transition specifically from intro -> balloons (0 -> 1)
    if (currentSceneIdx === 0 && index === 1) {
      setShowDoorTransition(true);
      return;
    }

    if (skipAnimation) {
      setCurrentSceneIdx(index);
      setIsTransitioning(false);
      // Ensure styles are cleared for the next scene
      gsap.set('.scene-container', { clearProps: 'opacity,scale,filter' });
      if (SCENES[index] === 'finale') setEffectMode('fireworks');
      return;
    }

    const timeline = gsap.timeline({
      onComplete: () => {
        setCurrentSceneIdx(index);
        setIsTransitioning(false);
        if (SCENES[index] === 'finale') setEffectMode('fireworks');
      }
    });

    timeline.to('.scene-container.active', {
      opacity: 0,
      scale: 1.02,
      filter: 'blur(10px)',
      duration: 1,
      ease: "power2.inOut"
    });
  };

  const handleDoorMiddleRevert = () => {
    setCurrentSceneIdx(1);
  
    gsap.set('.scene-container', {
      opacity: 0.2,
      scale: 1.1,
      filter: 'blur(12px)'
    });

    // Smooth cinematic fade + zoom as doors open
    gsap.to('.scene-container', {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      duration: 3.5,
      delay: 0.2,
      ease: 'power2.out',
      clearProps: 'all'
    });
  };

  const handleDoorTransitionComplete = () => {
    setShowDoorTransition(false);
    setIsTransitioning(false);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isTransitioning) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;

      gsap.to('.scene-container.active .content-wrapper', {
        x: -x,
        y: -y,
        duration: 1,
        ease: "power2.out"
      });
      gsap.to('.ambient-aurora', {
        x: x * 2,
        y: y * 2,
        duration: 2,
        ease: "power2.out"
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isTransitioning]);

  return (
    <div
      className="relative mx-auto h-[100dvh] min-h-0 w-full max-w-[100vw] overflow-x-hidden overflow-y-hidden bg-[#050508] text-[#F9F6EE] font-montserrat select-none"
      ref={containerRef}
    >
      <DoorTransition
        isActive={showDoorTransition}
        onMiddleRevert={handleDoorMiddleRevert}
        onTransitionComplete={handleDoorTransitionComplete}
      />

      <GlobalCanvas effectMode={effectMode} />



      {SCENES.map((scene, idx) => (
        <section
          key={scene}
          className={`scene-container ${currentSceneIdx === idx ? 'active' : ''}`}
        >
          {currentSceneIdx === 0 && idx === 0 && <SceneIntro onStart={() => goToScene(1)} />}
          {currentSceneIdx === 1 && idx === 1 && (
            <Suspense fallback={<LoadingScreen />}>
              <SceneBalloons onComplete={() => goToScene(2)} startTrigger={!showDoorTransition} />
            </Suspense>
          )}
          {currentSceneIdx === 2 && idx === 2 && (
            <Suspense fallback={<LoadingScreen />}>
              <SceneGiftRoom onComplete={() => goToScene(3, true)} />
            </Suspense>
          )}
          {currentSceneIdx === 3 && idx === 3 && (
            <Suspense fallback={<LoadingScreen />}>
              <SceneSurprise onComplete={() => goToScene(4)} />
            </Suspense>
          )}
          {currentSceneIdx === 4 && idx === 4 && (
            <Suspense fallback={<LoadingScreen />}>
              <ScenePasscode onComplete={() => goToScene(5)} />
            </Suspense>
          )}
          {currentSceneIdx === 5 && idx === 5 && (
            <Suspense fallback={<LoadingScreen />}>
              <SceneGallery onComplete={() => goToScene(6)} />
            </Suspense>
          )}
          {currentSceneIdx === 6 && idx === 6 && (
            <Suspense fallback={<LoadingScreen />}>
              <SceneGallery3D onComplete={() => goToScene(7)} />
            </Suspense>
          )}
          {currentSceneIdx === 7 && idx === 7 && (
            <Suspense fallback={<LoadingScreen />}>
              <SceneCake onComplete={() => goToScene(8)} />
            </Suspense>
          )}
          {currentSceneIdx === 8 && idx === 8 && (
            <Suspense fallback={<LoadingScreen />}>
              <ScenePuzzle onComplete={() => goToScene(9)} />
            </Suspense>
          )}
          {currentSceneIdx === 9 && idx === 9 && (
            <Suspense fallback={<LoadingScreen />}>
              <SceneGift onComplete={() => goToScene(10)} />
            </Suspense>
          )}
          {currentSceneIdx === 10 && idx === 10 && (
            <Suspense fallback={<LoadingScreen />}>
              <SceneFinale onRestart={() => goToScene(0, true)} />
            </Suspense>
          )}
        </section>
      ))}
    </div>
  );
}

export default App;
//done