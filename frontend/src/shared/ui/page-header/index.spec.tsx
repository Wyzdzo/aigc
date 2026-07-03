// src/shared/ui/page-header/index.spec.tsx

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PageHeader } from './index';

describe('PageHeader', () => {
  it('should render title', () => {
    render(<PageHeader title="Test Title" />);

    expect(screen.getByText('Test Title')).toBeTruthy();
  });

  it('should render description when provided', () => {
    render(<PageHeader title="Test Title" description="Test Description" />);

    expect(screen.getByText('Test Description')).toBeTruthy();
  });

  it('should not render description when not provided', () => {
    const { container } = render(<PageHeader title="Test Title" />);

    expect(container.querySelector('.page-description')).toBeNull();
  });

  it('should render extra content when provided', () => {
    render(<PageHeader title="Test Title" extra={<button>Extra</button>} />);

    expect(screen.getByText('Extra')).toBeTruthy();
  });

  it('should not render extra content when not provided', () => {
    const { container } = render(<PageHeader title="Test Title" />);

    expect(container.querySelector('.page-header-extra')).toBeNull();
  });
});
