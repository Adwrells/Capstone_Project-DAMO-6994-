import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Layout } from './Layout';

describe('Layout', () => {
  it('renders its children', () => {
    render(
      <Layout>
        <p>page content</p>
      </Layout>
    );
    expect(screen.getByText('page content')).toBeInTheDocument();
  });
});
