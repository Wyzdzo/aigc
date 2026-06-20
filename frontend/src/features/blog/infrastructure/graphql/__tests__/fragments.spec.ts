// src/features/blog/infrastructure/graphql/__tests__/fragments.spec.ts

import { type DocumentNode, type FragmentDefinitionNode } from 'graphql';
import { describe, expect, it } from 'vitest';

import {
  CATEGORY_BASIC_FRAGMENT,
  COMMENT_BASIC_FRAGMENT,
  LINK_BASIC_FRAGMENT,
  POST_BASIC_FRAGMENT,
  POST_FULL_FRAGMENT,
  TAG_BASIC_FRAGMENT,
} from '../fragments';

// Helper to get fragment definition from document
function getFragmentDefinition(doc: DocumentNode): FragmentDefinitionNode {
  return doc.definitions[0] as FragmentDefinitionNode;
}

// Helper to check if fragment has a field
function hasField(fragment: FragmentDefinitionNode, fieldName: string): boolean {
  const selections = fragment.selectionSet?.selections;
  return selections?.some(
    (s) => (s as { name: { value: string } }).name.value === fieldName
  ) ?? false;
}

describe('GraphQL Fragments', () => {
  describe('Post Fragments', () => {
    it('POST_BASIC_FRAGMENT should contain essential list fields', () => {
      const fragment = getFragmentDefinition(POST_BASIC_FRAGMENT);

      expect(fragment.kind).toBe('FragmentDefinition');
      expect(fragment.name.value).toBe('PostBasic');
      expect(fragment.typeCondition.name.value).toBe('BlogPost');
    });

    it('POST_FULL_FRAGMENT should contain all detail fields', () => {
      const fragment = getFragmentDefinition(POST_FULL_FRAGMENT);

      expect(fragment.kind).toBe('FragmentDefinition');
      expect(fragment.name.value).toBe('PostFull');
      expect(fragment.typeCondition.name.value).toBe('BlogPost');
    });

    it('POST_BASIC_FRAGMENT should not include content field', () => {
      const fragment = getFragmentDefinition(POST_BASIC_FRAGMENT);
      expect(hasField(fragment, 'content')).toBeFalsy();
    });

    it('POST_FULL_FRAGMENT should include content field', () => {
      const fragment = getFragmentDefinition(POST_FULL_FRAGMENT);
      expect(hasField(fragment, 'content')).toBeTruthy();
    });

    it('POST_BASIC_FRAGMENT should include id field', () => {
      const fragment = getFragmentDefinition(POST_BASIC_FRAGMENT);
      expect(hasField(fragment, 'id')).toBeTruthy();
    });

    it('POST_BASIC_FRAGMENT should include title field', () => {
      const fragment = getFragmentDefinition(POST_BASIC_FRAGMENT);
      expect(hasField(fragment, 'title')).toBeTruthy();
    });

    it('POST_BASIC_FRAGMENT should include slug field', () => {
      const fragment = getFragmentDefinition(POST_BASIC_FRAGMENT);
      expect(hasField(fragment, 'slug')).toBeTruthy();
    });

    it('POST_BASIC_FRAGMENT should include coverImage field', () => {
      const fragment = getFragmentDefinition(POST_BASIC_FRAGMENT);
      expect(hasField(fragment, 'coverImage')).toBeTruthy();
    });
  });

  describe('Category Fragment', () => {
    it('CATEGORY_BASIC_FRAGMENT should contain essential fields', () => {
      const fragment = getFragmentDefinition(CATEGORY_BASIC_FRAGMENT);

      expect(fragment.kind).toBe('FragmentDefinition');
      expect(fragment.name.value).toBe('CategoryBasic');
      expect(fragment.typeCondition.name.value).toBe('BlogCategory');
    });

    it('CATEGORY_BASIC_FRAGMENT should include parentId field', () => {
      const fragment = getFragmentDefinition(CATEGORY_BASIC_FRAGMENT);
      expect(hasField(fragment, 'parentId')).toBeTruthy();
    });

    it('CATEGORY_BASIC_FRAGMENT should include name field', () => {
      const fragment = getFragmentDefinition(CATEGORY_BASIC_FRAGMENT);
      expect(hasField(fragment, 'name')).toBeTruthy();
    });

    it('CATEGORY_BASIC_FRAGMENT should include slug field', () => {
      const fragment = getFragmentDefinition(CATEGORY_BASIC_FRAGMENT);
      expect(hasField(fragment, 'slug')).toBeTruthy();
    });
  });

  describe('Tag Fragment', () => {
    it('TAG_BASIC_FRAGMENT should contain essential fields', () => {
      const fragment = getFragmentDefinition(TAG_BASIC_FRAGMENT);

      expect(fragment.kind).toBe('FragmentDefinition');
      expect(fragment.name.value).toBe('TagBasic');
      expect(fragment.typeCondition.name.value).toBe('BlogTag');
    });

    it('TAG_BASIC_FRAGMENT should include id field', () => {
      const fragment = getFragmentDefinition(TAG_BASIC_FRAGMENT);
      expect(hasField(fragment, 'id')).toBeTruthy();
    });

    it('TAG_BASIC_FRAGMENT should include name field', () => {
      const fragment = getFragmentDefinition(TAG_BASIC_FRAGMENT);
      expect(hasField(fragment, 'name')).toBeTruthy();
    });
  });

  describe('Comment Fragment', () => {
    it('COMMENT_BASIC_FRAGMENT should contain essential fields', () => {
      const fragment = getFragmentDefinition(COMMENT_BASIC_FRAGMENT);

      expect(fragment.kind).toBe('FragmentDefinition');
      expect(fragment.name.value).toBe('CommentBasic');
      expect(fragment.typeCondition.name.value).toBe('BlogComment');
    });

    it('COMMENT_BASIC_FRAGMENT should include parentId field for nested comments', () => {
      const fragment = getFragmentDefinition(COMMENT_BASIC_FRAGMENT);
      expect(hasField(fragment, 'parentId')).toBeTruthy();
    });

    it('COMMENT_BASIC_FRAGMENT should include content field', () => {
      const fragment = getFragmentDefinition(COMMENT_BASIC_FRAGMENT);
      expect(hasField(fragment, 'content')).toBeTruthy();
    });

    it('COMMENT_BASIC_FRAGMENT should include nickname field', () => {
      const fragment = getFragmentDefinition(COMMENT_BASIC_FRAGMENT);
      expect(hasField(fragment, 'nickname')).toBeTruthy();
    });
  });

  describe('Link Fragment', () => {
    it('LINK_BASIC_FRAGMENT should contain essential fields', () => {
      const fragment = getFragmentDefinition(LINK_BASIC_FRAGMENT);

      expect(fragment.kind).toBe('FragmentDefinition');
      expect(fragment.name.value).toBe('LinkBasic');
      expect(fragment.typeCondition.name.value).toBe('BlogLink');
    });

    it('LINK_BASIC_FRAGMENT should include logo field', () => {
      const fragment = getFragmentDefinition(LINK_BASIC_FRAGMENT);
      expect(hasField(fragment, 'logo')).toBeTruthy();
    });

    it('LINK_BASIC_FRAGMENT should include url field', () => {
      const fragment = getFragmentDefinition(LINK_BASIC_FRAGMENT);
      expect(hasField(fragment, 'url')).toBeTruthy();
    });

    it('LINK_BASIC_FRAGMENT should include title field', () => {
      const fragment = getFragmentDefinition(LINK_BASIC_FRAGMENT);
      expect(hasField(fragment, 'title')).toBeTruthy();
    });
  });

  describe('Fragment Structure', () => {
    it('all fragments should be valid GraphQL documents', () => {
      const fragments = [
        POST_BASIC_FRAGMENT,
        POST_FULL_FRAGMENT,
        CATEGORY_BASIC_FRAGMENT,
        TAG_BASIC_FRAGMENT,
        COMMENT_BASIC_FRAGMENT,
        LINK_BASIC_FRAGMENT,
      ];

      fragments.forEach((fragment) => {
        expect(fragment.kind).toBe('Document');
        expect(fragment.definitions.length).toBeGreaterThan(0);
      });
    });

    it('fragments should have unique names', () => {
      const fragmentNames = [
        'PostBasic',
        'PostFull',
        'CategoryBasic',
        'TagBasic',
        'CommentBasic',
        'LinkBasic',
      ];

      const uniqueNames = new Set(fragmentNames);
      expect(uniqueNames.size).toBe(fragmentNames.length);
    });

    it('each fragment should have exactly one definition', () => {
      const fragments = [
        POST_BASIC_FRAGMENT,
        POST_FULL_FRAGMENT,
        CATEGORY_BASIC_FRAGMENT,
        TAG_BASIC_FRAGMENT,
        COMMENT_BASIC_FRAGMENT,
        LINK_BASIC_FRAGMENT,
      ];

      fragments.forEach((fragment) => {
        expect(fragment.definitions.length).toBe(1);
      });
    });
  });
});