import * as bibleRepo from '../src/bible/bibleRepo';

describe('bible location persistence', () => {
  it('stores and restores the last read book, chapter, and translation', () => {
    bibleRepo.setLastBibleLocation({
      bookId: 'PSA',
      bookName: 'Psalm',
      chapter: 23,
      translation: 'KJV',
    });

    expect(bibleRepo.getLastBibleLocation()).toEqual({
      bookId: 'PSA',
      bookName: 'Psalm',
      chapter: 23,
      translation: 'KJV',
    });
  });
});
