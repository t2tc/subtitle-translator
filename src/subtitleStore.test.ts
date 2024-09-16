import { describe, it, expect } from 'vitest';
import { SubtitleStore } from './subtitleStore';

describe('SubtitleStore History', () => {
    it('should create a new store', () => {
        const store = SubtitleStore;
        expect(store).toBeDefined();
    });
});

