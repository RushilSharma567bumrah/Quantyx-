// Simple equation solver for Quanty AI

function solveLinearEquation(equation) {
  // Remove spaces
  equation = equation.replace(/\s+/g, '');
  
  // Split by equals sign
  const parts = equation.split('=');
  if (parts.length !== 2) {
    return "Invalid equation format. Please use the format 'ax+by=cx+dy'";
  }
  
  const leftSide = parts[0];
  const rightSide = parts[1];
  
  // Initialize coefficients
  let leftX = 0;
  let leftY = 0;
  let rightX = 0;
  let rightY = 0;
  let leftConst = 0;
  let rightConst = 0;
  
  // Helper function to parse terms
  function parseTerms(side, isLeft) {
    // Add + at the beginning if needed for easier parsing
    if (side[0] !== '+' && side[0] !== '-') {
      side = '+' + side;
    }
    
    // Find all terms (coefficient and variable)
    const terms = side.match(/[+-][^+-]*/g) || [];
    
    for (const term of terms) {
      if (term.includes('x')) {
        // Handle x terms
        const coef = term.replace('x', '');
        let value;
        
        if (coef === '+') value = 1;
        else if (coef === '-') value = -1;
        else value = parseFloat(coef);
        
        if (isLeft) leftX += value;
        else rightX += value;
      } 
      else if (term.includes('y')) {
        // Handle y terms
        const coef = term.replace('y', '');
        let value;
        
        if (coef === '+') value = 1;
        else if (coef === '-') value = -1;
        else value = parseFloat(coef);
        
        if (isLeft) leftY += value;
        else rightY += value;
      }
      else {
        // Handle constants
        let value = parseFloat(term);
        if (isLeft) leftConst += value;
        else rightConst += value;
      }
    }
  }
  
  // Parse both sides
  parseTerms(leftSide, true);
  parseTerms(rightSide, false);
  
  // Move everything to the left side
  const finalX = leftX - rightX;
  const finalY = leftY - rightY;
  const finalConst = rightConst - leftConst;
  
  // Format the simplified equation
  let simplifiedEq = '';
  
  if (finalX !== 0) {
    simplifiedEq += finalX === 1 ? 'x' : (finalX === -1 ? '-x' : finalX + 'x');
  }
  
  if (finalY !== 0) {
    const sign = finalY < 0 ? '-' : (simplifiedEq !== '' ? '+' : '');
    const absY = Math.abs(finalY);
    simplifiedEq += sign + (absY === 1 ? 'y' : absY + 'y');
  }
  
  if (finalConst !== 0) {
    const sign = finalConst < 0 ? '-' : (simplifiedEq !== '' ? '+' : '');
    simplifiedEq += sign + Math.abs(finalConst);
  }
  
  if (simplifiedEq === '') {
    simplifiedEq = '0';
  }
  
  simplifiedEq += '=0';
  
  // Generate some points that satisfy the equation
  let points = [];
  
  // If we have a valid equation with x and y
  if (finalX !== 0 && finalY !== 0) {
    // Point 1: x = 0
    const y0 = finalConst / finalY;
    points.push(`(0, ${y0})`);
    
    // Point 2: y = 0
    const x0 = finalConst / finalX;
    points.push(`(${x0}, 0)`);
    
    // Point 3: x = 1
    const y1 = (finalConst - finalX) / finalY;
    points.push(`(1, ${y1})`);
  }
  else if (finalX !== 0) {
    // Only x terms
    const x0 = finalConst / finalX;
    points.push(`x = ${x0}`);
  }
  else if (finalY !== 0) {
    // Only y terms
    const y0 = finalConst / finalY;
    points.push(`y = ${y0}`);
  }
  
  return {
    original: equation,
    simplified: simplifiedEq,
    coefficients: {
      x: finalX,
      y: finalY,
      constant: finalConst
    },
    points: points
  };
}

// Export the function
if (typeof module !== 'undefined') {
  module.exports = { solveLinearEquation };
}