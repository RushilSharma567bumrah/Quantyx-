// QUANTY ML PROCESSOR - TensorFlow.js, NumJS, DanfoJS Integration
console.log('🧠 LOADING ML LIBRARIES...');

// ML CAPABILITIES CHECKER
const mlCapabilities = {
  tensorflow: typeof tf !== 'undefined',
  matrix: typeof MLMatrix !== 'undefined', 
  dataframes: typeof dfd !== 'undefined',
  plotting: typeof Plotly !== 'undefined'
};

// ENHANCED MATH OPERATIONS WITH NUMPY-LIKE FUNCTIONALITY
class QuantyMath {
  // Matrix operations
  static createMatrix(rows, cols, fill = 0) {
    if (mlCapabilities.matrix) {
      return new MLMatrix.Matrix(rows, cols).fill(fill);
    }
    // Fallback to native arrays
    return Array(rows).fill().map(() => Array(cols).fill(fill));
  }
  
  static multiply(a, b) {
    if (mlCapabilities.matrix && a instanceof MLMatrix.Matrix) {
      return a.mmul(b);
    }
    // Basic matrix multiplication fallback
    return this.basicMatrixMultiply(a, b);
  }
  
  static basicMatrixMultiply(a, b) {
    const result = [];
    for (let i = 0; i < a.length; i++) {
      result[i] = [];
      for (let j = 0; j < b[0].length; j++) {
        let sum = 0;
        for (let k = 0; k < b.length; k++) {
          sum += a[i][k] * b[k][j];
        }
        result[i][j] = sum;
      }
    }
    return result;
  }
  
  // Statistical functions
  static mean(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }
  
  static std(arr) {
    const mean = this.mean(arr);
    const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
    return Math.sqrt(variance);
  }
  
  static linspace(start, stop, num = 50) {
    const step = (stop - start) / (num - 1);
    return Array.from({length: num}, (_, i) => start + step * i);
  }
}

// DATA PROCESSING WITH PANDAS-LIKE FUNCTIONALITY
class QuantyData {
  constructor(data) {
    if (mlCapabilities.dataframes) {
      this.df = new dfd.DataFrame(data);
    } else {
      this.data = data;
    }
  }
  
  static fromCSV(csvText) {
    if (mlCapabilities.dataframes) {
      return new QuantyData(dfd.readCSV(csvText));
    }
    // Basic CSV parsing fallback
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    const data = {};
    headers.forEach(header => data[header.trim()] = []);
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      headers.forEach((header, index) => {
        data[header.trim()].push(values[index]?.trim());
      });
    }
    return new QuantyData(data);
  }
  
  describe() {
    if (this.df) {
      return this.df.describe();
    }
    // Basic statistics fallback
    const stats = {};
    Object.keys(this.data).forEach(col => {
      const numericData = this.data[col].map(Number).filter(n => !isNaN(n));
      if (numericData.length > 0) {
        stats[col] = {
          count: numericData.length,
          mean: QuantyMath.mean(numericData),
          std: QuantyMath.std(numericData),
          min: Math.min(...numericData),
          max: Math.max(...numericData)
        };
      }
    });
    return stats;
  }
  
  head(n = 5) {
    if (this.df) {
      return this.df.head(n);
    }
    const result = {};
    Object.keys(this.data).forEach(col => {
      result[col] = this.data[col].slice(0, n);
    });
    return result;
  }
}

// TENSORFLOW.JS INTEGRATION
class QuantyML {
  static async createSimpleModel(inputShape, outputShape) {
    if (!mlCapabilities.tensorflow) {
      throw new Error('TensorFlow.js not available');
    }
    
    const model = tf.sequential({
      layers: [
        tf.layers.dense({inputShape: [inputShape], units: 64, activation: 'relu'}),
        tf.layers.dense({units: 32, activation: 'relu'}),
        tf.layers.dense({units: outputShape, activation: 'linear'})
      ]
    });
    
    model.compile({
      optimizer: 'adam',
      loss: 'meanSquaredError',
      metrics: ['mae']
    });
    
    return model;
  }
  
  static async linearRegression(x, y) {
    if (!mlCapabilities.tensorflow) {
      // Fallback to basic linear regression
      return this.basicLinearRegression(x, y);
    }
    
    const xs = tf.tensor2d(x.map(val => [val]));
    const ys = tf.tensor2d(y.map(val => [val]));
    
    const model = await this.createSimpleModel(1, 1);
    
    await model.fit(xs, ys, {
      epochs: 100,
      verbose: 0
    });
    
    return {
      model,
      predict: (input) => {
        const prediction = model.predict(tf.tensor2d([[input]]));
        return prediction.dataSync()[0];
      }
    };
  }
  
  static basicLinearRegression(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return {
      slope,
      intercept,
      predict: (input) => slope * input + intercept
    };
  }
}

// VISUALIZATION WITH PLOTLY
class QuantyViz {
  static async plotLine(x, y, title = 'Line Plot', containerId = 'plot') {
    if (!mlCapabilities.plotting) {
      console.log('Plotting not available - data:', {x, y});
      return `📊 **${title}**\n\nData points: ${x.length}\nX range: ${Math.min(...x)} to ${Math.max(...x)}\nY range: ${Math.min(...y)} to ${Math.max(...y)}`;
    }
    
    const trace = {
      x: x,
      y: y,
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Data'
    };
    
    const layout = {
      title: title,
      xaxis: { title: 'X' },
      yaxis: { title: 'Y' },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: { color: 'white' }
    };
    
    // Create plot container if it doesn't exist
    let plotDiv = document.getElementById(containerId);
    if (!plotDiv) {
      plotDiv = document.createElement('div');
      plotDiv.id = containerId;
      plotDiv.style.width = '100%';
      plotDiv.style.height = '400px';
      document.body.appendChild(plotDiv);
    }
    
    Plotly.newPlot(containerId, [trace], layout);
    return `📊 Plot created: ${title}`;
  }
  
  static async plotHistogram(data, title = 'Histogram', containerId = 'histogram') {
    if (!mlCapabilities.plotting) {
      const stats = {
        count: data.length,
        mean: QuantyMath.mean(data),
        std: QuantyMath.std(data),
        min: Math.min(...data),
        max: Math.max(...data)
      };
      return `📊 **${title}**\n\nStatistics:\n- Count: ${stats.count}\n- Mean: ${stats.mean.toFixed(2)}\n- Std: ${stats.std.toFixed(2)}\n- Range: ${stats.min} to ${stats.max}`;
    }
    
    const trace = {
      x: data,
      type: 'histogram',
      marker: { color: 'rgba(79, 131, 204, 0.7)' }
    };
    
    const layout = {
      title: title,
      xaxis: { title: 'Value' },
      yaxis: { title: 'Frequency' },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: { color: 'white' }
    };
    
    let plotDiv = document.getElementById(containerId);
    if (!plotDiv) {
      plotDiv = document.createElement('div');
      plotDiv.id = containerId;
      plotDiv.style.width = '100%';
      plotDiv.style.height = '400px';
      document.body.appendChild(plotDiv);
    }
    
    Plotly.newPlot(containerId, [trace], layout);
    return `📊 Histogram created: ${title}`;
  }
}

// ML COMMAND PROCESSOR
async function processMLCommand(command, data) {
  const cmd = command.toLowerCase().trim();
  
  try {
    if (cmd.startsWith('analyze:')) {
      const csvData = data || command.substring(8).trim();
      const dataset = QuantyData.fromCSV(csvData);
      const stats = dataset.describe();
      return `📊 **Data Analysis:**\n\n${JSON.stringify(stats, null, 2)}`;
    }
    
    if (cmd.startsWith('plot:')) {
      const plotData = JSON.parse(command.substring(5).trim());
      return await QuantyViz.plotLine(plotData.x, plotData.y, plotData.title);
    }
    
    if (cmd.startsWith('regression:')) {
      const regData = JSON.parse(command.substring(11).trim());
      const model = await QuantyML.linearRegression(regData.x, regData.y);
      const prediction = model.predict(regData.predict || regData.x[0]);
      return `🤖 **Linear Regression:**\n\nModel trained successfully!\nSample prediction: ${prediction.toFixed(4)}`;
    }
    
    if (cmd.startsWith('matrix:')) {
      const matrixData = JSON.parse(command.substring(7).trim());
      const result = QuantyMath.multiply(matrixData.a, matrixData.b);
      return `🔢 **Matrix Operation:**\n\nResult:\n${JSON.stringify(result, null, 2)}`;
    }
    
    return `🧠 **ML Commands Available:**\n\n• analyze: [CSV data] - Data analysis\n• plot: {"x": [1,2,3], "y": [1,4,9]} - Line plot\n• regression: {"x": [1,2,3], "y": [1,4,9]} - Linear regression\n• matrix: {"a": [[1,2]], "b": [[3],[4]]} - Matrix operations`;
    
  } catch (error) {
    return `❌ **ML Error:** ${error.message}`;
  }
}

// GLOBAL ML FUNCTIONS
window.QuantyMath = QuantyMath;
window.QuantyData = QuantyData;
window.QuantyML = QuantyML;
window.QuantyViz = QuantyViz;
window.processMLCommand = processMLCommand;

console.log('🧠 ML PROCESSOR READY');
console.log('📊 Capabilities:', mlCapabilities);
console.log('🔧 Commands: analyze:, plot:, regression:, matrix:');