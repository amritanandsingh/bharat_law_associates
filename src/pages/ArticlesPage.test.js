import React from 'react';
import { renderWithProviders, screen, fireEvent, waitFor } from '../test-utils/renderWithProviders';

// src/lib/posts.js calls generateClient() from aws-amplify at module scope, which
// cannot run in jsdom — mock the whole data-access seam.
jest.mock('../lib/posts', () => ({
  listPublishedPosts: jest.fn(),
  resolveCoverUrl: jest.fn(() => Promise.resolve('')),
}));

// eslint-disable-next-line import/first
import { listPublishedPosts } from '../lib/posts';
// eslint-disable-next-line import/first
import ArticlesPage from './ArticlesPage';

const post = (id, slug, title, excerpt, body) => ({
  id,
  slug,
  sourceLang: 'en',
  publishedAt: `2026-0${id}-01T00:00:00.000Z`,
  viewCount: 4,
  translations: JSON.stringify({ en: { title, excerpt, body } }),
});

// "deposit" appears ONLY in the first body; "advocate" appears in BOTH bodies
// and in neither title nor excerpt. Both are the point of the test.
const POSTS = [
  post(
    1,
    'renting-a-home',
    'Renting a home in Kolkata',
    'What every tenant should check before signing.',
    'A landlord cannot withhold the security deposit without itemised damages. Ask an advocate before you sign.'
  ),
  post(
    2,
    'cheque-bounce',
    'Cheque bounce notices',
    'Deadlines that decide your case.',
    'Section 138 requires notice within thirty days of the memo. An advocate can draft it for you.'
  ),
];

const search = () => screen.getByRole('searchbox');
const type = (value) => fireEvent.change(search(), { target: { value } });
const titles = () =>
  screen.queryAllByRole('heading', { level: 3 }).map((h) => h.textContent);

const renderPage = async () => {
  listPublishedPosts.mockResolvedValue(POSTS);
  renderWithProviders(<ArticlesPage />, { route: '/articles' });
  await screen.findByText('Renting a home in Kolkata');
};

describe('ArticlesPage search', () => {
  beforeEach(() => jest.clearAllMocks());

  it('lists every published post before any query', async () => {
    await renderPage();
    expect(titles()).toEqual(['Renting a home in Kolkata', 'Cheque bounce notices']);
    expect(document.querySelector('.articles-count')).not.toBeInTheDocument();
  });

  it('matches a keyword that appears only in the article body', async () => {
    await renderPage();
    // Guard the premise: "deposit" is in the body only, not the card's visible text.
    expect('Renting a home in Kolkata What every tenant should check before signing.')
      .not.toMatch(/deposit/i);

    type('deposit');
    await waitFor(() => expect(titles()).toEqual(['Renting a home in Kolkata']));
    expect(screen.queryByText(/No articles match your search/)).not.toBeInTheDocument();
  });

  it('still matches on title and excerpt', async () => {
    await renderPage();
    type('bounce'); // title only
    await waitFor(() => expect(titles()).toEqual(['Cheque bounce notices']));

    type('tenant'); // excerpt only
    await waitFor(() => expect(titles()).toEqual(['Renting a home in Kolkata']));
  });

  it('shows a singular result count for one hit', async () => {
    await renderPage();
    type('deposit');
    await screen.findByText('1 article found');
  });

  it('shows a plural result count for several hits', async () => {
    await renderPage();
    type('advocate'); // in both bodies
    await screen.findByText('2 articles found');
    expect(titles()).toHaveLength(2);
  });

  it('shows the no-results message and hides the count when nothing matches', async () => {
    await renderPage();
    type('zzqqxx');
    await screen.findByText(/No articles match your search/);
    expect(titles()).toEqual([]);
    expect(document.querySelector('.articles-count')).not.toBeInTheDocument();
  });

  it('restores the full list and hides the count when the query is cleared', async () => {
    await renderPage();
    type('deposit');
    await waitFor(() => expect(titles()).toHaveLength(1));

    type('');
    await waitFor(() => expect(titles()).toHaveLength(2));
    expect(document.querySelector('.articles-count')).not.toBeInTheDocument();
  });

  it('ignores surrounding whitespace and letter case', async () => {
    await renderPage();
    type('   DePoSiT  ');
    await waitFor(() => expect(titles()).toEqual(['Renting a home in Kolkata']));
  });
});
