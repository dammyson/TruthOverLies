/**
 * @format
 */

import React from 'react';
import renderer from 'react-test-renderer';
import {renderOsisRichText} from '../src/bible/osisRichText';

describe('renderOsisRichText', () => {
  it('strips OSIS metadata and keeps readable verse text', () => {
    let tree: renderer.ReactTestRenderer;

    renderer.act(() => {
      tree = renderer.create(
        <>{renderOsisRichText('<w lemma="strong:H0121">Adam</w>, <w lemma="strong:H08352">Sheth</w>, <w lemma="strong:H0583">Enosh</w>.')}</>
      );
    });

    expect(tree!.toJSON()).toMatchSnapshot();
  });

  it('applies emphasis for hi tags and omits notes', () => {
    let tree: renderer.ReactTestRenderer;

    renderer.act(() => {
      tree = renderer.create(
        <>{renderOsisRichText('<hi rend="italic">The Lord</hi> <note type="study"><catchWord>Lord</catchWord>: a note</note> is good.')}</>
      );
    });

    expect(tree!.toJSON()).toMatchSnapshot();
  });

  it('keeps the default text styling and ignores color-only OSIS directives', () => {
    let tree: renderer.ReactTestRenderer;

    renderer.act(() => {
      tree = renderer.create(
        <>{renderOsisRichText("<hi rend='red'>red</hi> and <hi type='color' rend='blue'>blue</hi>.")}</>
      );
    });

    const textNodes = tree!.root.findAllByType(require('react-native').Text);
    expect(textNodes[0].props.style).toBeUndefined();
    expect(textNodes[1].props.style).toBeUndefined();
  });
});
