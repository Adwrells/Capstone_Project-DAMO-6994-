import { describe, expect, it } from 'vitest';
import { buildSemanticModel, calculateAdvancedStats, calculateLinearRegression } from './biEngine';

describe('buildSemanticModel', () => {
  it('classifies a numeric revenue-like column as a summed Measure', () => {
    const [field] = buildSemanticModel([{ name: 'total_revenue', type: 'numeric' }]);
    expect(field.role).toBe('Measure');
    expect(field.aggregation).toBe('Sum');
  });

  it('classifies a numeric id-like column as a distinct-count Dimension', () => {
    const [field] = buildSemanticModel([{ name: 'customer_id', type: 'numeric' }]);
    expect(field.role).toBe('Dimension');
    expect(field.aggregation).toBe('DistinctCount');
  });

  it('classifies a non-numeric column as a Dimension counted by row', () => {
    const [field] = buildSemanticModel([{ name: 'region', type: 'categorical' }]);
    expect(field.role).toBe('Dimension');
    expect(field.aggregation).toBe('Count');
  });
});

describe('calculateAdvancedStats', () => {
  it('computes mean, median, and count for a simple sample', () => {
    const stats = calculateAdvancedStats([1, 2, 3, 4, 5]);
    expect(stats.count).toBe(5);
    expect(stats.mean).toBe(3);
    expect(stats.median).toBe(3);
    expect(stats.min).toBe(1);
    expect(stats.max).toBe(5);
  });

  it('returns a zeroed summary for an empty sample instead of throwing', () => {
    const stats = calculateAdvancedStats([]);
    expect(stats.count).toBe(0);
    expect(stats.mean).toBe(0);
  });
});

describe('calculateLinearRegression', () => {
  it('recovers an exact slope and intercept for a perfectly linear series', () => {
    const x = [0, 1, 2, 3, 4];
    const y = [1, 3, 5, 7, 9]; // y = 2x + 1
    const { slope, intercept, r2 } = calculateLinearRegression(x, y);
    expect(slope).toBeCloseTo(2, 5);
    expect(intercept).toBeCloseTo(1, 5);
    expect(r2).toBeCloseTo(1, 5);
  });

  it('does not throw on mismatched-length input', () => {
    const result = calculateLinearRegression([1, 2], [1]);
    expect(result.equation).toBe('y = 0');
  });
});
