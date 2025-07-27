// Specialized calculators for Quanty AI

// Geometry calculator
function geometryCalculator(problem) {
  const lowerProblem = problem.toLowerCase();
  
  // Circle calculations
  if (lowerProblem.includes('circle') || lowerProblem.includes('radius') || lowerProblem.includes('diameter')) {
    const radiusMatch = problem.match(/radius\s*=?\s*(\d+(\.\d+)?)/i);
    const diameterMatch = problem.match(/diameter\s*=?\s*(\d+(\.\d+)?)/i);
    
    let radius = radiusMatch ? parseFloat(radiusMatch[1]) : (diameterMatch ? parseFloat(diameterMatch[1]) / 2 : null);
    
    if (radius) {
      const area = Math.PI * radius * radius;
      const circumference = 2 * Math.PI * radius;
      
      return `Geometry: Circle with radius ${radius} units\n\n` +
             `Area = π × r² = π × ${radius}² = ${area.toFixed(2)} square units\n` +
             `Circumference = 2π × r = 2π × ${radius} = ${circumference.toFixed(2)} units`;
    } else {
      return `For circle calculations, please specify the radius or diameter.\n\nExample: geometry: circle radius=5`;
    }
  }
  // Rectangle calculations
  else if (lowerProblem.includes('rectangle') || (lowerProblem.includes('length') && lowerProblem.includes('width'))) {
    const lengthMatch = problem.match(/length\s*=?\s*(\d+(\.\d+)?)/i);
    const widthMatch = problem.match(/width\s*=?\s*(\d+(\.\d+)?)/i);
    
    if (lengthMatch && widthMatch) {
      const length = parseFloat(lengthMatch[1]);
      const width = parseFloat(widthMatch[1]);
      
      const area = length * width;
      const perimeter = 2 * (length + width);
      
      return `Geometry: Rectangle with length ${length} and width ${width} units\n\n` +
             `Area = length × width = ${length} × ${width} = ${area} square units\n` +
             `Perimeter = 2 × (length + width) = 2 × (${length} + ${width}) = ${perimeter} units`;
    } else {
      return `For rectangle calculations, please specify both length and width.\n\nExample: geometry: rectangle length=10 width=5`;
    }
  }
  // Triangle calculations
  else if (lowerProblem.includes('triangle')) {
    if (lowerProblem.includes('base') && lowerProblem.includes('height')) {
      const baseMatch = problem.match(/base\s*=?\s*(\d+(\.\d+)?)/i);
      const heightMatch = problem.match(/height\s*=?\s*(\d+(\.\d+)?)/i);
      
      if (baseMatch && heightMatch) {
        const base = parseFloat(baseMatch[1]);
        const height = parseFloat(heightMatch[1]);
        
        const area = 0.5 * base * height;
        
        return `Geometry: Triangle with base ${base} and height ${height} units\n\n` +
               `Area = ½ × base × height = ½ × ${base} × ${height} = ${area} square units`;
      } else {
        return `For triangle area calculations, please specify both base and height.\n\nExample: geometry: triangle base=6 height=4`;
      }
    } else {
      return `For triangle calculations, please specify the required parameters.\n\n` +
             `For area: geometry: triangle base=6 height=4`;
    }
  }
  else {
    return `Geometry Calculator\n\nPlease specify what you want to calculate. Examples:\n` +
           `- geometry: circle radius=5\n` +
           `- geometry: rectangle length=10 width=5\n` +
           `- geometry: triangle base=6 height=4`;
  }
}

// Trigonometry calculator
function trigCalculator(problem) {
  const lowerProblem = problem.toLowerCase();
  
  // Sin, cos, tan calculations
  if (lowerProblem.includes('sin') || lowerProblem.includes('cos') || lowerProblem.includes('tan')) {
    const angleMatch = problem.match(/(\d+(\.\d+)?)/i);
    
    if (angleMatch) {
      const angle = parseFloat(angleMatch[1]);
      const radians = angle * Math.PI / 180;
      
      const sinValue = Math.sin(radians);
      const cosValue = Math.cos(radians);
      const tanValue = Math.tan(radians);
      
      return `Trigonometry: Values for ${angle}°\n\n` +
             `sin(${angle}°) = ${sinValue.toFixed(4)}\n` +
             `cos(${angle}°) = ${cosValue.toFixed(4)}\n` +
             `tan(${angle}°) = ${tanValue.toFixed(4)}`;
    } else {
      return `Please specify an angle in degrees.\n\nExample: trig: sin 30`;
    }
  }
  // Pythagorean theorem
  else if (lowerProblem.includes('pythag') || lowerProblem.includes('right triangle')) {
    const aMatch = problem.match(/a\s*=?\s*(\d+(\.\d+)?)/i);
    const bMatch = problem.match(/b\s*=?\s*(\d+(\.\d+)?)/i);
    const cMatch = problem.match(/c\s*=?\s*(\d+(\.\d+)?)/i);
    
    if ((aMatch && bMatch) || (aMatch && cMatch) || (bMatch && cMatch)) {
      const a = aMatch ? parseFloat(aMatch[1]) : null;
      const b = bMatch ? parseFloat(bMatch[1]) : null;
      const c = cMatch ? parseFloat(cMatch[1]) : null;
      
      if (a && b) {
        const cValue = Math.sqrt(a*a + b*b);
        return `Pythagorean Theorem: a = ${a}, b = ${b}\n\n` +
               `c² = a² + b²\n` +
               `c² = ${a}² + ${b}²\n` +
               `c² = ${a*a} + ${b*b} = ${a*a + b*b}\n` +
               `c = √${a*a + b*b} = ${cValue.toFixed(4)}`;
      } else if (a && c) {
        if (a < c) {
          const bValue = Math.sqrt(c*c - a*a);
          return `Pythagorean Theorem: a = ${a}, c = ${c}\n\n` +
                 `b² = c² - a²\n` +
                 `b² = ${c}² - ${a}²\n` +
                 `b² = ${c*c} - ${a*a} = ${c*c - a*a}\n` +
                 `b = √${c*c - a*a} = ${bValue.toFixed(4)}`;
        } else {
          return `Invalid values: In a right triangle, the hypotenuse (c) must be greater than either leg (a or b).`;
        }
      } else if (b && c) {
        if (b < c) {
          const aValue = Math.sqrt(c*c - b*b);
          return `Pythagorean Theorem: b = ${b}, c = ${c}\n\n` +
                 `a² = c² - b²\n` +
                 `a² = ${c}² - ${b}²\n` +
                 `a² = ${c*c} - ${b*b} = ${c*c - b*b}\n` +
                 `a = √${c*c - b*b} = ${aValue.toFixed(4)}`;
        } else {
          return `Invalid values: In a right triangle, the hypotenuse (c) must be greater than either leg (a or b).`;
        }
      }
    } else {
      return `For Pythagorean theorem calculations, please specify at least two sides of the right triangle.\n\n` +
             `Example: trig: pythagorean a=3 b=4\n` +
             `(where a and b are the legs and c is the hypotenuse)`;
    }
  }
  else {
    return `Trigonometry Calculator\n\nPlease specify what you want to calculate. Examples:\n` +
           `- trig: sin 30 (calculates sin, cos, tan of 30 degrees)\n` +
           `- trig: pythagorean a=3 b=4 (finds the hypotenuse using the Pythagorean theorem)`;
  }
}

// Physics calculator
function physicsCalculator(problem) {
  const lowerProblem = problem.toLowerCase();
  
  // Velocity calculations
  if (lowerProblem.includes('velocity') || lowerProblem.includes('speed')) {
    const distanceMatch = problem.match(/distance\s*=?\s*(\d+(\.\d+)?)/i);
    const timeMatch = problem.match(/time\s*=?\s*(\d+(\.\d+)?)/i);
    
    if (distanceMatch && timeMatch) {
      const distance = parseFloat(distanceMatch[1]);
      const time = parseFloat(timeMatch[1]);
      
      const velocity = distance / time;
      
      return `Physics: Velocity Calculation\n\n` +
             `Velocity = Distance / Time\n` +
             `Velocity = ${distance} / ${time}\n` +
             `Velocity = ${velocity.toFixed(2)} units/time`;
    } else {
      return `For velocity calculations, please specify both distance and time.\n\nExample: physics: velocity distance=100 time=20`;
    }
  }
  // Force calculations (F = ma)
  else if (lowerProblem.includes('force')) {
    const massMatch = problem.match(/mass\s*=?\s*(\d+(\.\d+)?)/i);
    const accelerationMatch = problem.match(/acceleration\s*=?\s*(\d+(\.\d+)?)/i) || problem.match(/acc\s*=?\s*(\d+(\.\d+)?)/i);
    
    if (massMatch && accelerationMatch) {
      const mass = parseFloat(massMatch[1]);
      const acceleration = parseFloat(accelerationMatch[1]);
      
      const force = mass * acceleration;
      
      return `Physics: Force Calculation (Newton's Second Law)\n\n` +
             `Force = Mass × Acceleration\n` +
             `Force = ${mass} × ${acceleration}\n` +
             `Force = ${force} N`;
    } else {
      return `For force calculations, please specify both mass and acceleration.\n\nExample: physics: force mass=10 acceleration=9.8`;
    }
  }
  // Energy calculations (E = mc²)
  else if (lowerProblem.includes('energy') && lowerProblem.includes('mass')) {
    const massMatch = problem.match(/mass\s*=?\s*(\d+(\.\d+)?)/i);
    
    if (massMatch) {
      const mass = parseFloat(massMatch[1]);
      const speedOfLight = 299792458; // m/s
      
      const energy = mass * speedOfLight * speedOfLight;
      const energyInJoules = energy;
      
      return `Physics: Energy-Mass Equivalence (E = mc²)\n\n` +
             `Energy = Mass × Speed of Light²\n` +
             `Energy = ${mass} × (299,792,458)²\n` +
             `Energy = ${energyInJoules.toExponential(4)} Joules`;
    } else {
      return `For energy-mass calculations, please specify the mass.\n\nExample: physics: energy mass=0.001`;
    }
  }
  else {
    return `Physics Calculator\n\nPlease specify what you want to calculate. Examples:\n` +
           `- physics: velocity distance=100 time=20\n` +
           `- physics: force mass=10 acceleration=9.8\n` +
           `- physics: energy mass=0.001`;
  }
}

// Chemistry calculator
function chemistryCalculator(problem) {
  const lowerProblem = problem.toLowerCase();
  
  // Molecular weight calculation
  if (lowerProblem.includes('molecular weight') || lowerProblem.includes('molar mass')) {
    // Simple molecular weight calculator for common molecules
    const molecules = {
      'h2o': { formula: 'H₂O', weight: 18.02 },
      'co2': { formula: 'CO₂', weight: 44.01 },
      'nacl': { formula: 'NaCl', weight: 58.44 },
      'c6h12o6': { formula: 'C₆H₁₂O₆', weight: 180.16 },
      'h2so4': { formula: 'H₂SO₄', weight: 98.08 },
      'nh3': { formula: 'NH₃', weight: 17.03 },
      'ch4': { formula: 'CH₄', weight: 16.04 },
      'hcl': { formula: 'HCl', weight: 36.46 },
      'naoh': { formula: 'NaOH', weight: 40.00 },
      'c2h5oh': { formula: 'C₂H₅OH', weight: 46.07 }
    };
    
    // Extract formula from the problem
    let foundMolecule = null;
    for (const [key, value] of Object.entries(molecules)) {
      if (lowerProblem.includes(key)) {
        foundMolecule = value;
        break;
      }
    }
    
    if (foundMolecule) {
      return `Chemistry: Molecular Weight Calculation\n\n` +
             `Formula: ${foundMolecule.formula}\n` +
             `Molecular Weight: ${foundMolecule.weight} g/mol`;
    } else {
      return `Please specify a valid molecular formula.\n\nExample: chemistry: molecular weight H2O\n\n` +
             `I can calculate molecular weights for common molecules like H2O, CO2, NaCl, C6H12O6, etc.`;
    }
  }
  // pH calculations
  else if (lowerProblem.includes('ph')) {
    const concentrationMatch = problem.match(/concentration\s*=?\s*(\d+(\.\d+)?e?-?\d*)/i) || 
                              problem.match(/\[h\+\]\s*=?\s*(\d+(\.\d+)?e?-?\d*)/i);
    
    if (concentrationMatch) {
      let concentration = concentrationMatch[1];
      
      // Handle scientific notation
      if (concentration.includes('e')) {
        concentration = parseFloat(concentration);
      } else {
        concentration = parseFloat(concentration);
      }
      
      if (concentration > 0) {
        const pH = -Math.log10(concentration);
        
        return `Chemistry: pH Calculation\n\n` +
               `[H⁺] = ${concentration.toExponential(2)} M\n` +
               `pH = -log₁₀[H⁺]\n` +
               `pH = -log₁₀(${concentration.toExponential(2)})\n` +
               `pH = ${pH.toFixed(2)}`;
      } else {
        return `Invalid concentration value. Concentration must be greater than 0.`;
      }
    } else {
      return `For pH calculations, please specify the hydrogen ion concentration.\n\nExample: chemistry: pH concentration=1e-7`;
    }
  }
  else {
    return `Chemistry Calculator\n\nPlease specify what you want to calculate. Examples:\n` +
           `- chemistry: molecular weight H2O\n` +
           `- chemistry: pH concentration=1e-7`;
  }
}

// Biology calculator
function biologyCalculator(problem) {
  const lowerProblem = problem.toLowerCase();
  
  // BMI calculation
  if (lowerProblem.includes('bmi')) {
    const heightMatch = problem.match(/height\s*=?\s*(\d+(\.\d+)?)/i);
    const weightMatch = problem.match(/weight\s*=?\s*(\d+(\.\d+)?)/i);
    
    if (heightMatch && weightMatch) {
      const height = parseFloat(heightMatch[1]); // in meters
      const weight = parseFloat(weightMatch[1]); // in kg
      
      const bmi = weight / (height * height);
      
      let category;
      if (bmi < 18.5) category = 'Underweight';
      else if (bmi < 25) category = 'Normal weight';
      else if (bmi < 30) category = 'Overweight';
      else category = 'Obese';
      
      return `Biology: BMI Calculation\n\n` +
             `BMI = Weight / Height²\n` +
             `BMI = ${weight} / (${height})²\n` +
             `BMI = ${weight} / ${height*height}\n` +
             `BMI = ${bmi.toFixed(1)}\n\n` +
             `Category: ${category}`;
    } else {
      return `For BMI calculations, please specify both height (in meters) and weight (in kg).\n\nExample: biology: BMI height=1.75 weight=70`;
    }
  }
  // Calorie needs calculation
  else if (lowerProblem.includes('calorie') || lowerProblem.includes('tdee')) {
    const weightMatch = problem.match(/weight\s*=?\s*(\d+(\.\d+)?)/i);
    const heightMatch = problem.match(/height\s*=?\s*(\d+(\.\d+)?)/i);
    const ageMatch = problem.match(/age\s*=?\s*(\d+)/i);
    const genderMatch = problem.match(/gender\s*=?\s*(male|female)/i);
    
    if (weightMatch && heightMatch && ageMatch && genderMatch) {
      const weight = parseFloat(weightMatch[1]); // in kg
      const height = parseFloat(heightMatch[1]); // in cm
      const age = parseInt(ageMatch[1]);
      const gender = genderMatch[1].toLowerCase();
      
      // Harris-Benedict equation
      let bmr;
      if (gender === 'male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
      } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
      }
      
      const sedentary = bmr * 1.2;
      const lightActivity = bmr * 1.375;
      const moderateActivity = bmr * 1.55;
      const activeLifestyle = bmr * 1.725;
      const veryActive = bmr * 1.9;
      
      return `Biology: Daily Calorie Needs (TDEE)\n\n` +
             `Basal Metabolic Rate (BMR): ${Math.round(bmr)} calories/day\n\n` +
             `Total Daily Energy Expenditure (TDEE):\n` +
             `- Sedentary: ${Math.round(sedentary)} calories/day\n` +
             `- Light Activity: ${Math.round(lightActivity)} calories/day\n` +
             `- Moderate Activity: ${Math.round(moderateActivity)} calories/day\n` +
             `- Active Lifestyle: ${Math.round(activeLifestyle)} calories/day\n` +
             `- Very Active: ${Math.round(veryActive)} calories/day`;
    } else {
      return `For calorie needs calculations, please specify weight (kg), height (cm), age, and gender.\n\nExample: biology: calories weight=70 height=175 age=30 gender=male`;
    }
  }
  else {
    return `Biology Calculator\n\nPlease specify what you want to calculate. Examples:\n` +
           `- biology: BMI height=1.75 weight=70\n` +
           `- biology: calories weight=70 height=175 age=30 gender=male`;
  }
}