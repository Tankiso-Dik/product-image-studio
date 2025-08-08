/// <reference types="vitest" />

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import Hero from '../components/Hero';
import NotionDashboard from '../components/NotionDashboard';

import heroSchema from '../../schemas/hero.schema.json' assert { type: 'json' };
import notionDashboardSchema from '../../schemas/notionDashboard.schema.json' assert { type: 'json' };
import heroScene from '../../public/sceneData/hero.json' assert { type: 'json' };
import notionDashboardScene from '../../public/sceneData/notionDashboard.json' assert { type: 'json' };

describe('sample scenes', () => {
  const ajv = new Ajv();
  addFormats(ajv);

  it('hero scene validates and renders', () => {
    const validate = ajv.compile(heroSchema);
    expect(validate(heroScene)).toBe(true);

    const { type: _type, ...props } = heroScene as any;
    expect(() => render(<Hero {...(props as any)} />)).not.toThrow();
  });

  it('notion dashboard scene validates and renders', () => {
    const validate = ajv.compile(notionDashboardSchema);
    expect(validate(notionDashboardScene)).toBe(true);
    expect(() => render(<NotionDashboard scene={notionDashboardScene as any} />)).not.toThrow();
  });
});
