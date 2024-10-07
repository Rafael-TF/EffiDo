import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import Stars from '../components/Stars';

const PageContainer = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-family: 'Poppins', sans-serif;
`;

const Content = styled(motion.div)`
  z-index: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
`;

const Title = styled(motion.h1)`
  font-size: 5rem;
  margin-bottom: 1rem;
  background: linear-gradient(to right, #fff, #d0e3ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled(motion.p)`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  max-width: 600px;
`;

const ButtonContainer = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const Button = styled(motion.button)`
  padding: 0.8rem 2rem;
  font-size: 1rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const LoginButton = styled(Button)`
  background-color: #4CAF50;
  color: white;
`;

const TryButton = styled(Button)`
  background-color: transparent;
  color: white;
  border: 2px solid white;
`;

const CanvasContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Stars />
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </>
  );
}

function LandingPage() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <CanvasContainer>
        <Canvas>
          <Scene />
        </Canvas>
      </CanvasContainer>
      <Content
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Title
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          EffiDo
        </Title>
        <Subtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Gestiona tus tareas de manera eficiente y efectiva
        </Subtitle>
        <ButtonContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <LoginButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
          >
            Iniciar Sesión
          </LoginButton>
          <TryButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/demo')}
          >
            Probar App
          </TryButton>
        </ButtonContainer>
      </Content>
    </PageContainer>
  );
}

export default LandingPage;
