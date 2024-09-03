import React, { useState, useEffect, useRef } from 'react';

const AadhaarDataCollection = () => {
  const [activeTab, setActiveTab] = useState('aadhaar');
  const [inputValue, setInputValue] = useState('');
  const [eidDate, setEidDate] = useState('');
  const [eidTime, setEidTime] = useState('');
  const [interactionData, setInteractionData] = useState({
    mouse: [],
    keyboard: [],
    touch: []
  });
  const [sessionStartTime, setSessionStartTime] = useState(Date.now());
  const [deviceOrientation, setDeviceOrientation] = useState(null);
  const [deviceMotion, setDeviceMotion] = useState(null);
  const componentRef = useRef(null);

  useEffect(() => {
    const component = componentRef.current;
    if (!component) return;

    // Mouse event listeners
    const handleMouseMove = (e) => {
      setInteractionData(prev => ({
        ...prev,
        mouse: [...prev.mouse, {
          type: 'move',
          x: e.clientX,
          y: e.clientY,
          timestamp: e.timeStamp
        }]
      }));
    };

    const handleMouseDown = (e) => {
      setInteractionData(prev => ({
        ...prev,
        mouse: [...prev.mouse, {
          type: 'down',
          x: e.clientX,
          y: e.clientY,
          timestamp: e.timeStamp
        }]
      }));
    };

    const handleMouseUp = (e) => {
      setInteractionData(prev => ({
        ...prev,
        mouse: [...prev.mouse, {
          type: 'up',
          x: e.clientX,
          y: e.clientY,
          timestamp: e.timeStamp
        }]
      }));
    };

    // Keyboard event listeners
    const handleKeyDown = (e) => {
      setInteractionData(prev => ({
        ...prev,
        keyboard: [...prev.keyboard, {
          type: 'keydown',
          key: e.key,
          timestamp: e.timeStamp
        }]
      }));
    };

    const handleKeyUp = (e) => {
      setInteractionData(prev => ({
        ...prev,
        keyboard: [...prev.keyboard, {
          type: 'keyup',
          key: e.key,
          timestamp: e.timeStamp
        }]
      }));
    };

    // Touch event listeners
    const handleTouchStart = (e) => {
      const touches = Array.from(e.touches).map(touch => ({
        type: 'start',
        x: touch.clientX,
        y: touch.clientY,
        pressure: touch.force || 0,
        timestamp: e.timeStamp
      }));
      setInteractionData(prev => ({
        ...prev,
        touch: [...prev.touch, ...touches]
      }));
    };

    const handleTouchMove = (e) => {
      const touches = Array.from(e.touches).map(touch => ({
        type: 'move',
        x: touch.clientX,
        y: touch.clientY,
        pressure: touch.force || 0,
        timestamp: e.timeStamp
      }));
      setInteractionData(prev => ({
        ...prev,
        touch: [...prev.touch, ...touches]
      }));
    };

    const handleTouchEnd = (e) => {
      const touches = Array.from(e.changedTouches).map(touch => ({
        type: 'end',
        x: touch.clientX,
        y: touch.clientY,
        pressure: touch.force || 0,
        timestamp: e.timeStamp
      }));
      setInteractionData(prev => ({
        ...prev,
        touch: [...prev.touch, ...touches]
      }));
    };

    // Device orientation and motion event listeners
    const handleDeviceOrientation = (e) => {
      setDeviceOrientation({
        alpha: e.alpha,
        beta: e.beta,
        gamma: e.gamma
      });
    };

    const handleDeviceMotion = (e) => {
      setDeviceMotion({
        acceleration: e.acceleration,
        accelerationIncludingGravity: e.accelerationIncludingGravity,
        rotationRate: e.rotationRate,
        interval: e.interval
      });
    };

    window.addEventListener('deviceorientation', handleDeviceOrientation);
    window.addEventListener('devicemotion', handleDeviceMotion);

    component.addEventListener('mousemove', handleMouseMove);
    component.addEventListener('mousedown', handleMouseDown);
    component.addEventListener('mouseup', handleMouseUp);
    component.addEventListener('keydown', handleKeyDown);
    component.addEventListener('keyup', handleKeyUp);
    component.addEventListener('touchstart', handleTouchStart);
    component.addEventListener('touchmove', handleTouchMove);
    component.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      window.removeEventListener('devicemotion', handleDeviceMotion);
      component.removeEventListener('mousemove', handleMouseMove);
      component.removeEventListener('mousedown', handleMouseDown);
      component.removeEventListener('mouseup', handleMouseUp);
      component.removeEventListener('keydown', handleKeyDown);
      component.removeEventListener('keyup', handleKeyUp);
      component.removeEventListener('touchstart', handleTouchStart);
      component.removeEventListener('touchmove', handleTouchMove);
      component.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const extractFeatures = (data) => {
    const mouseFeatures = extractMouseFeatures(data.mouse);
    const keyboardFeatures = extractKeyboardFeatures(data.keyboard);
    const touchFeatures = extractTouchFeatures(data.touch);

    return {
      mouseFeatures,
      keyboardFeatures,
      touchFeatures
    };
  };

  const extractMouseFeatures = (mouseData) => {
    const N = mouseData.length;

    // Micro-Movements
    const microMovements = mouseData.reduce((sum, curr, index, arr) => {
      if (index === 0) return sum;
      const prev = arr[index - 1];
      return sum + Math.sqrt(Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2));
    }, 0) / N;

    // Path Segmentation
    const pathSegmentation = mouseData.reduce((sum, curr, index, arr) => {
      if (index === 0) return sum;
      const prev = arr[index - 1];
      return sum + Math.sqrt(Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2));
    }, 0) / N;

    // Gesture Complexity
    const gestureComplexity = mouseData.reduce((sum, curr, index, arr) => {
      if (index === 0) return sum;
      const prev = arr[index - 1];
      const angleChange = Math.atan2(curr.y - prev.y, curr.x - prev.x);
      return sum + Math.abs(angleChange);
    }, 0) / (2 * Math.PI * N);

    // Drag Pattern Variation
    const dragPatternVariation = mouseData.reduce((sum, curr, index, arr) => {
      if (index === 0) return sum;
      const prev = arr[index - 1];
      return sum + Math.sqrt(Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2));
    }, 0) / N;

    // Timing Synchronization
    const eventTimes = mouseData.map(event => event.timestamp);
    const meanEventTime = eventTimes.reduce((sum, time) => sum + time, 0) / eventTimes.length;
    const timingSync = eventTimes.reduce((sum, time) => sum + Math.abs(time - meanEventTime), 0) / eventTimes.length;

    // Time-Based Predictive Modeling
    const predictiveModel = mouseData.reduce((sum, curr, index, arr) => {
      if (index === 0) return sum;
      const prev = arr[index - 1];
      const predictedTime = prev.timestamp + (curr.timestamp - prev.timestamp);
      return sum + Math.pow(predictedTime - curr.timestamp, 2);
    }, 0) / N;

    return {
      microMovements,
      pathSegmentation,
      gestureComplexity,
      dragPatternVariation,
      timingSync,
      predictiveModel
    };
  };

  const extractKeyboardFeatures = (keyboardData) => {
    const N = keyboardData.length;

    // Sequential Timing Variance
    const keyPressIntervals = keyboardData.reduce((intervals, curr, index, arr) => {
      if (index === 0) return intervals;
      const prev = arr[index - 1];
      if (curr.type === 'keydown' && prev.type === 'keydown') {
        intervals.push(curr.timestamp - prev.timestamp);
      }
      return intervals;
    }, []);
    const averageInterval = keyPressIntervals.reduce((sum, interval) => sum + interval, 0) / keyPressIntervals.length;
    const sequentialTimingVariance = keyPressIntervals.reduce((sum, interval) => {
      return sum + Math.pow(interval - averageInterval, 2);
    }, 0) / keyPressIntervals.length;

    // Error Correction Rate
    const errorCorrectionRate = keyboardData.filter(event => event.type === 'keydown' && event.key === 'Backspace').length / N;

    // Hand Shift Delays
    const handShiftDelay = keyboardData.reduce((sum, curr, index, arr) => {
      if (index === 0) return sum;
      const prev = arr[index - 1];
      if (curr.type === 'keydown' && prev.type === 'keydown') {
        const isLeftHand = key => ['q', 'w', 'e', 'r', 't', 'a', 's', 'd', 'f', 'g', 'z', 'x', 'c', 'v', 'b'].includes(key.toLowerCase());
        if (isLeftHand(curr.key) !== isLeftHand(prev.key)) {
          sum += curr.timestamp - prev.timestamp;
        }
      }
      return sum;
    }, 0) / N;

    // Modifier Frequency
    const modifierFrequency = keyboardData.filter(event => ['Shift', 'Control', 'Alt', 'Meta'].includes(event.key)).length / N;

    return {
      sequentialTimingVariance,
      errorCorrectionRate,
      handShiftDelay,
      modifierFrequency
    };
  };

  const extractTouchFeatures = (touchData) => {
    const N = touchData.length;

    // Pressure Variability
    const pressureData = touchData.map(event => event.pressure || 0);
    const averagePressure = pressureData.reduce((sum, pressure) => sum + pressure, 0) / pressureData.length;
    const pressureVariability = pressureData.reduce((sum, pressure) => sum + Math.pow(pressure - averagePressure, 2), 0) / pressureData.length;

    // Swipe Speed Variability
    const swipeSpeeds = touchData.reduce((speeds, curr, index, arr) => {
      if (index === 0 || curr.type !== 'move') return speeds;
      const prev = arr[index - 1];
      if (prev.type === 'move') {
        const distance = Math.sqrt(Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2));
        const time = curr.timestamp - prev.timestamp;
        speeds.push(distance / time);
      }
      return speeds;
    }, []);
    const averageSpeed = swipeSpeeds.reduce((sum, speed) => sum + speed, 0) / swipeSpeeds.length;
    const swipeSpeedVariability = Math.sqrt(swipeSpeeds.reduce((sum, speed) => {
      return sum + Math.pow(speed - averageSpeed, 2);
    }, 0) / swipeSpeeds.length);

    // Multi-Touch Sync
    const multiTouchSync = touchData.reduce((sum, curr, index, arr) => {
      if (index === 0 || curr.type !== 'start') return sum;
      const prev = arr[index - 1];
      if (prev.type === 'start') {
        sum += Math.abs(curr.timestamp - prev.timestamp);
      }
      return sum;
    }, 0) / N;

    // Interval Variability
    const tapIntervals = touchData.reduce((intervals, curr, index, arr) => {
      if (index === 0 || curr.type !== 'end') return intervals;
      const prev = arr[index - 1];
      if (prev.type === 'end') {
        intervals.push(curr.timestamp - prev.timestamp);
      }
      return intervals;
    }, []);
    const averageInterval = tapIntervals.reduce((sum, interval) => sum + interval, 0) / tapIntervals.length;
    const intervalVariability = tapIntervals.reduce((sum, interval) => sum + Math.pow(interval - averageInterval, 2), 0) / tapIntervals.length;

    return {
      pressureVariability,
      swipeSpeedVariability,
      multiTouchSync,
      intervalVariability
    };
  };

  const handleSubmit = async () => {
    const features = extractFeatures(interactionData);
    const sessionDuration = Date.now() - sessionStartTime;
    const userAgent = navigator.userAgent;
    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const connectionType = connection ? connection.effectiveType : 'unknown';
    const connectionStability = connection ? connection.rtt : 'unknown';

    let ipAddress = 'unknown';
    let geolocation = 'unknown';

    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      ipAddress = data.ip;

      const geoResponse = await fetch(`https://ipapi.co/${data.ip}/json/`);
      const geoData = await geoResponse.json();
      geolocation = `${geoData.city}, ${geoData.region}, ${geoData.country}`;
    } catch (error) {
      console.error('Error fetching IP or geolocation:', error);
    }

    const payload = {
      interactionData,
      features,
      sessionDuration,
      userAgent,
      screenResolution,
      connectionType,
      connectionStability,
      ipAddress,
      geolocation,
      deviceOrientation,
      deviceMotion
    };

    console.log(JSON.stringify(payload, null, 2));

    // Send data to backend API
    fetch('https://nocaptcha.onrender.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => console.error('Error:', error));
  };

  return (
    <div ref={componentRef} className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-6">Aadhaar Data Collection</h1>
      
      <div className="mb-4">
        <div className="flex space-x-4 mb-2">
          <button
            className={`px-4 py-2 rounded ${activeTab === 'aadhaar' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('aadhaar')}
          >
            Aadhaar
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === 'enrolment' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('enrolment')}
          >
            Enrolment
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === 'virtual' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('virtual')}
          >
            Virtual ID
          </button>
        </div>
        
        {activeTab === 'aadhaar' && (
          <input
            type="text"
            placeholder="Enter Aadhaar Number"
            className="w-full p-2 border rounded"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        )}
        
        {activeTab === 'enrolment' && (
          <div>
            <input
              type="text"
              placeholder="Enter 14 digit Enrolment Number"
              className="w-full p-2 border rounded mb-2"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <input
              type="date"
              className="w-full p-2 border rounded mb-2"
              value={eidDate}
              onChange={(e) => setEidDate(e.target.value)}
            />
            <input
              type="time"
              className="w-full p-2 border rounded"
              value={eidTime}
              onChange={(e) => setEidTime(e.target.value)}
            />
          </div>
        )}
        
        {activeTab === 'virtual' && (
          <input
            type="text"
            placeholder="Enter Virtual ID Number"
            className="w-full p-2 border rounded"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        )}
      </div>
      
      <button
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        onClick={handleSubmit}
      >
        Submit
      </button>

      <div className="mt-4 p-4 bg-blue-100 border border-blue-200 rounded-md">
        <p className="text-blue-800">
          Your interaction data is being collected for analysis. This includes mouse movements, keyboard inputs, and touch interactions.
        </p>
      </div>
    </div>
  );
};

export default AadhaarDataCollection;