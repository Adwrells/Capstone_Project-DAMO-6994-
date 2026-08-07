/**
 * Data Pilot - Business Intelligence Analytics Engine
 * Enterprise-grade statistical computations & semantic models conforming to Excel, Power BI, and Tableau standards.
 */

export type ColumnRole = 'Dimension' | 'Measure';
export type AggregationType = 'Sum' | 'Average' | 'Count' | 'DistinctCount' | 'Min' | 'Max' | 'Median';

export interface SemanticField {
  column: string;
  role: ColumnRole;
  aggregation: AggregationType;
  dataType: 'numeric' | 'categorical' | 'date' | 'boolean' | 'text';
}

// 1. Semantic Data Modeling: Detect Roles & Aggregations
export function buildSemanticModel(fields: { name: string; type: string }[]): SemanticField[] {
  const dimensionKeywords = ['name', 'region', 'country', 'city', 'category', 'department', 'gender', 'customer', 'product', 'segment', 'id', 'date', 'source', 'channel', 'audience', 'status'];
  
  return fields.map(f => {
    const nameLower = f.name.toLowerCase();
    const isExplicitNumeric = f.type === 'numeric';
    
    // Default strategy
    let role: ColumnRole = 'Dimension';
    let aggregation: AggregationType = 'Count';
    
    if (isExplicitNumeric) {
      const isIdLike = dimensionKeywords.some(kw => nameLower.includes(kw));
      if (isIdLike && !nameLower.includes('spend') && !nameLower.includes('revenue') && !nameLower.includes('value') && !nameLower.includes('profit')) {
        role = 'Dimension';
        aggregation = 'DistinctCount';
      } else {
        role = 'Measure';
        aggregation = 'Sum';
        if (nameLower.includes('rate') || nameLower.includes('pct') || nameLower.includes('%') || nameLower.includes('score') || nameLower.includes('rating') || nameLower.includes('cac') || nameLower.includes('cost')) {
          aggregation = 'Average';
        }
      }
    } else {
      role = 'Dimension';
      aggregation = nameLower.includes('id') ? 'DistinctCount' : 'Count';
    }

    return {
      column: f.name,
      role,
      aggregation,
      dataType: f.type as any
    };
  });
}

// 2. Power BI Style Visual Advisor Engine
export interface VisualRecommendation {
  visual: string;
  confidence: number;
  reason: string;
}

export function recommendVisuals(fields: SemanticField[]): VisualRecommendation[] {
  const measures = fields.filter(f => f.role === 'Measure');
  const dimensions = fields.filter(f => f.role === 'Dimension');
  const hasDate = fields.some(f => f.dataType === 'date');

  const recs: VisualRecommendation[] = [];

  if (hasDate && measures.length > 0) {
    recs.push({ visual: 'Line Chart', confidence: 98, reason: 'Line chart is the gold standard for tracking metrics over temporal series.' });
    recs.push({ visual: 'Area Chart', confidence: 85, reason: 'Area chart visualizes the cumulative volume changes over dates.' });
  }

  if (dimensions.length > 0 && measures.length > 0) {
    recs.push({ visual: 'Column Chart', confidence: 95, reason: 'Ideal for comparing distinct metric magnitudes across standard categorical segments.' });
    recs.push({ visual: 'Bar Chart', confidence: 90, reason: 'Excellent for categoricals with large label text lengths or many bins.' });
  }

  if (dimensions.length > 0 && measures.length >= 2) {
    recs.push({ visual: 'Bubble Chart', confidence: 80, reason: 'Compare three attributes: dimensions on coordinates and third measure representing circle sizes.' });
  }

  if (measures.length >= 2) {
    recs.push({ visual: 'Scatter Plot', confidence: 92, reason: 'Highly effective for assessing mathematical correlations and linear clusters.' });
  }

  // Distribution
  if (measures.length > 0) {
    recs.push({ visual: 'Histogram', confidence: 88, reason: 'Evaluate core values density spreads, modal limits and distribution skewness.' });
  }

  // Part to whole
  const categoricalDims = dimensions.filter(d => d.dataType === 'categorical');
  if (categoricalDims.length > 0 && measures.length > 0) {
    recs.push({ visual: 'Donut Chart', confidence: 82, reason: 'Excellent visual representation for portion-to-whole segment breakouts.' });
    recs.push({ visual: 'Pie Chart', confidence: 75, reason: 'Standard breakdown of small cardinal divisions.' });
  }

  // Default fallbacks
  recs.push({ visual: 'Heatmap', confidence: 65, reason: 'Useful for crossing high cardinality dimension grids.' });

  return recs.sort((a, b) => b.confidence - a.confidence);
}

// 3. Mathematical & Advanced Statistical Analytics
export interface CoreStatsSummary {
  mean: number;
  median: number;
  mode: number | string;
  variance: number;
  stdDev: number;
  min: number;
  max: number;
  q1: number;
  q3: number;
  iqr: number;
  skewness: number;
  kurtosis: number;
  count: number;
}

export function calculateAdvancedStats(numbers: number[]): CoreStatsSummary {
  const count = numbers.length;
  if (count === 0) {
    return { mean: 0, median: 0, mode: '-', variance: 0, stdDev: 0, min: 0, max: 0, q1: 0, q3: 0, iqr: 0, skewness: 0, kurtosis: 0, count: 0 };
  }

  const sorted = [...numbers].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[count - 1];

  const sum = numbers.reduce((a, b) => a + b, 0);
  const mean = sum / count;

  // Median
  const mid = Math.floor(count / 2);
  const median = count % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  // Q1 & Q3 (Tukey method)
  const q1 = sorted[Math.floor(count * 0.25)];
  const q3 = sorted[Math.floor(count * 0.75)];
  const iqr = q3 - q1;

  // Variance & StdDev (sample variance to match Excel VAR.S)
  const mDiffs = numbers.map(v => v - mean);
  const sumSqDiffs = mDiffs.reduce((acc, v) => acc + v * v, 0);
  const variance = count > 1 ? sumSqDiffs / (count - 1) : 0;
  const stdDev = Math.sqrt(variance);

  // Skewness & Kurtosis
  let m3 = 0;
  let m4 = 0;
  mDiffs.forEach(d => {
    m3 += Math.pow(d, 3);
    m4 += Math.pow(d, 4);
  });
  m3 /= count;
  m4 /= count;
  const s3 = Math.pow(stdDev, 3);
  const s4 = Math.pow(stdDev, 4);
  
  const skewness = s3 !== 0 ? m3 / s3 : 0;
  const kurtosis = s4 !== 0 ? (m4 / s4) - 3 : 0; // Excess Kurtosis

  // Mode
  const freqMap: Record<string, number> = {};
  let maxFreq = 0;
  let mode: number | string = sorted[0];
  numbers.forEach(num => {
    const key = String(num);
    freqMap[key] = (freqMap[key] || 0) + 1;
    if (freqMap[key] > maxFreq) {
      maxFreq = freqMap[key];
      mode = num;
    }
  });

  return {
    mean: parseFloat(mean.toFixed(2)),
    median: parseFloat(median.toFixed(2)),
    mode,
    variance: parseFloat(variance.toFixed(2)),
    stdDev: parseFloat(stdDev.toFixed(2)),
    min,
    max,
    q1,
    q3,
    iqr,
    skewness: parseFloat(skewness.toFixed(3)),
    kurtosis: parseFloat(kurtosis.toFixed(3)),
    count
  };
}

// Linear Regression: Best fit line
export interface RegressionResult {
  slope: number;
  intercept: number;
  r2: number;
  equation: string;
}

export function calculateLinearRegression(x: number[], y: number[]): RegressionResult {
  const n = x.length;
  if (n === 0 || n !== y.length) {
    return { slope: 0, intercept: 0, r2: 0, equation: 'y = 0' };
  }

  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, sumYY = 0;
  for (let i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
    sumXY += x[i] * y[i];
    sumXX += x[i] * x[i];
    sumYY += y[i] * y[i];
  }

  const denominator = n * sumXX - sumX * sumX;
  if (denominator === 0) {
    return { slope: 0, intercept: 0, r2: 0, equation: 'y = Constant' };
  }

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  // Correlation Coefficient r
  const rNumerator = n * sumXY - sumX * sumY;
  const rDenominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
  const r = rDenominator !== 0 ? rNumerator / rDenominator : 0;
  const r2 = r * r;

  const equation = `y = ${slope.toFixed(2)}x ${intercept >= 0 ? '+' : '-'} ${Math.abs(intercept).toFixed(2)}`;

  return {
    slope,
    intercept,
    r2: parseFloat(r2.toFixed(3)),
    equation
  };
}

// 4. Histogram Helper: Freedman-Diaconis or Scott automatic bin sizes
export interface HistogramBin {
  binMin: number;
  binMax: number;
  count: number;
  densityShare: number;
}

export function computeHistogramBins(numbers: number[], rule: 'Freedman' | 'Scott' | 'Sturges' = 'Freedman'): HistogramBin[] {
  const n = numbers.length;
  if (n === 0) return [];

  const sorted = [...numbers].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[n - 1];
  const range = max - min;

  if (range === 0) {
    return [{ binMin: min - 1, binMax: min + 1, count: n, densityShare: 100 }];
  }

  let binWidth = 0;

  if (rule === 'Freedman') {
    // Freedman-Diaconis Rule: binWidth = 2 * IQR / n^(1/3)
    const q1 = sorted[Math.floor(n * 0.25)];
    const q3 = sorted[Math.floor(n * 0.75)];
    const iqr = q3 - q1;
    binWidth = iqr > 0 ? (2 * iqr) / Math.pow(n, 1 / 3) : (3.5 * stdDevSample(numbers)) / Math.pow(n, 1 / 3);
  } else if (rule === 'Scott') {
    // Scott's Rule: binWidth = 3.5 * StdDev / n^(1/3)
    binWidth = (3.49 * stdDevSample(numbers)) / Math.pow(n, 1 / 3);
  } else {
    // Sturges' Rule: binCount = log2(n) + 1
    const binCount = Math.ceil(Math.log2(n) + 1);
    binWidth = range / binCount;
  }

  if (binWidth <= 0) {
    binWidth = range / 5; // Default fallback: 5 buckets
  }

  const binCountReal = Math.max(3, Math.min(30, Math.ceil(range / binWidth)));
  const step = range / binCountReal;

  const bins: HistogramBin[] = Array.from({ length: binCountReal }, (_, idx) => {
    const binMin = min + idx * step;
    const binMax = binMin + step;
    return { binMin, binMax, count: 0, densityShare: 0 };
  });

  numbers.forEach(v => {
    let placed = false;
    for (let i = 0; i < bins.length; i++) {
      if (v >= bins[i].binMin && v < bins[i].binMax) {
        bins[i].count++;
        placed = true;
        break;
      }
    }
    // Edge case for max value
    if (!placed && v === max) {
      bins[bins.length - 1].count++;
    }
  });

  return bins.map(b => ({
    ...b,
    densityShare: parseFloat(((b.count / n) * 100).toFixed(1))
  }));
}

function stdDevSample(arr: number[]): number {
  if (arr.length <= 1) return 1;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const sqDiffs = arr.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0);
  return Math.sqrt(sqDiffs / (arr.length - 1));
}

// 5. Data Cleaning Math: Outliers Model Selector
export function detectOutliersIndexes(
  numbers: number[], 
  method: 'IQR' | 'Z-Score' | 'Modified-Z' = 'IQR',
  thresholdSignificance: number = 2.2
): Set<number> {
  const outliers = new Set<number>();
  const n = numbers.length;
  if (n < 3) return outliers;

  if (method === 'IQR') {
    const sorted = [...numbers].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(n * 0.25)];
    const q3 = sorted[Math.floor(n * 0.75)];
    const iqr = q3 - q1;
    // Standard threshold: Q1 - 1.5 * IQR or Q3 + 1.5 * IQR (or significance as multiplier)
    const factor = thresholdSignificance === 2.2 ? 1.5 : thresholdSignificance;
    const low = q1 - factor * iqr;
    const high = q3 + factor * iqr;

    numbers.forEach((v, idx) => {
      if (v < low || v > high) {
        outliers.add(idx);
      }
    });
  } else if (method === 'Z-Score') {
    const sum = numbers.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    const variance = numbers.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / n;
    const std = Math.sqrt(variance);

    numbers.forEach((v, idx) => {
      if (std > 0) {
        const score = Math.abs(v - mean) / std;
        if (score > thresholdSignificance) {
          outliers.add(idx);
        }
      }
    });
  } else if (method === 'Modified-Z') {
    // Median Absolute Deviation (MAD) style: score = 0.6745 * (xi - median) / MAD
    const sorted = [...numbers].sort((a, b) => a - b);
    const median = sorted[Math.floor(n / 2)];
    const absDevs = numbers.map(v => Math.abs(v - median)).sort((a, b) => a - b);
    const mad = absDevs[Math.floor(n / 2)];

    numbers.forEach((v, idx) => {
      if (mad > 0) {
        const score = (0.6745 * Math.abs(v - median)) / mad;
        if (score > thresholdSignificance) {
          outliers.add(idx);
        }
      } else {
        // Fallback standard dev
        const std = stdDevSample(numbers);
        if (std > 0 && Math.abs(v - median) / std > thresholdSignificance) {
          outliers.add(idx);
        }
      }
    });
  }

  return outliers;
}

// 6. Value Imputer for Missing Fields
export function imputeMissingArr(
  arr: any[],
  strategy: 'mean' | 'median' | 'mode' | 'ffill' | 'bfill' | 'interpolate'
): any[] {
  const result = [...arr];
  const numericVals = arr.map(Number).filter(v => !isNaN(v) && v !== null && v !== undefined);
  if (numericVals.length === 0) return result;

  let replacement: any = 0;

  if (strategy === 'mean') {
    replacement = numericVals.reduce((a, b) => a + b, 0) / numericVals.length;
  } else if (strategy === 'median') {
    const sorted = [...numericVals].sort((a, b) => a - b);
    replacement = sorted[Math.floor(sorted.length / 2)];
  } else if (strategy === 'mode') {
    const fm: Record<string, number> = {};
    let max = 0;
    numericVals.forEach(v => {
      fm[String(v)] = (fm[String(v)] || 0) + 1;
      if (fm[String(v)] > max) {
        max = fm[String(v)];
        replacement = v;
      }
    });
  }

  for (let i = 0; i < result.length; i++) {
    const isMissing = result[i] === null || result[i] === undefined || result[i] === '';
    
    if (isMissing) {
      if (strategy === 'ffill') {
        let prev = null;
        for (let j = i - 1; j >= 0; j--) {
          if (result[j] !== null && result[j] !== undefined && result[j] !== '') {
            prev = result[j];
            break;
          }
        }
        result[i] = prev !== null ? prev : replacement;
      } else if (strategy === 'bfill') {
        let next = null;
        for (let j = i + 1; j < result.length; j++) {
          if (result[j] !== null && result[j] !== undefined && result[j] !== '') {
            next = result[j];
            break;
          }
        }
        result[i] = next !== null ? next : replacement;
      } else if (strategy === 'interpolate') {
        let prev = null;
        let prevIdx = -1;
        for (let j = i - 1; j >= 0; j--) {
          if (result[j] !== null && result[j] !== undefined && result[j] !== '') {
            prev = Number(result[j]);
            prevIdx = j;
            break;
          }
        }
        
        let next = null;
        let nextIdx = -1;
        for (let j = i + 1; j < result.length; j++) {
          if (result[j] !== null && result[j] !== undefined && result[j] !== '') {
            next = Number(result[j]);
            nextIdx = j;
            break;
          }
        }

        if (prev !== null && !isNaN(prev) && next !== null && !isNaN(next)) {
          const ratio = (i - prevIdx) / (nextIdx - prevIdx);
          result[i] = prev + ratio * (next - prev);
        } else {
          result[i] = prev !== null ? prev : (next !== null ? next : replacement);
        }
      } else {
        result[i] = replacement;
      }
    }
  }

  return result;
}

// 7. Time Intelligence Hierarchy builder
export interface DateHierarchyNode {
  year: number;
  quarter: string;
  monthName: string;
  weekNum: number;
  day: number;
  formattedString: string;
}

export function parseDateHierarchy(dateStr: string): DateHierarchyNode {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    return { year: 2026, quarter: 'Q1', monthName: 'January', weekNum: 1, day: 1, formattedString: dateStr };
  }

  const year = d.getFullYear();
  const month = d.getMonth(); // 0-11
  const day = d.getDate();

  const quarter = `Q${Math.floor(month / 3) + 1}`;
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const monthName = monthNames[month];

  // Week calculation
  const startOfYear = new Date(year, 0, 1);
  const diff = d.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const weekNum = Math.ceil((diff / oneDay + startOfYear.getDay() + 1) / 7);

  return {
    year,
    quarter,
    monthName,
    weekNum,
    day,
    formattedString: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  };
}
