import React from 'react';
import { EcctrlJoystick } from 'ecctrl';

/**
 * UI Overlay Component for Character Controller
 * This should be rendered outside the Canvas
 */
export default function CharacterControllerUI() {
  return (
    <>
      {/* Joystick for mobile/touch controls */}
      <EcctrlJoystick />
      
      {/* Text overlay UI */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        zIndex: 10,
        pointerEvents: 'none',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
      }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '24px', fontWeight: 'bold' }}>
          Ecctrl Floating Character Controller Demo
        </h2>
        <p style={{ margin: '0 0 5px 0', fontSize: '14px', opacity: 0.9 }}>
          by Andrew Chen
        </p>
        <div style={{ marginTop: '20px', fontSize: '16px' }}>
          <p style={{ margin: '5px 0' }}><strong>Control Keys:</strong></p>
          <p style={{ margin: '3px 0', fontSize: '14px' }}>WASD / Arrow Keys - Move</p>
          <p style={{ margin: '3px 0', fontSize: '14px' }}>Shift - Run</p>
          <p style={{ margin: '3px 0', fontSize: '14px' }}>Space - Jump</p>
          <p style={{ margin: '3px 0', fontSize: '14px' }}>Mouse - Rotate Camera</p>
        </div>
        <p style={{ marginTop: '20px', fontSize: '12px', opacity: 0.7 }}>
          Credit for Animated Uncle Pete by @KayLousberg
        </p>
      </div>
    </>
  );
}
