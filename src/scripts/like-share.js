import { db } from './firebase-client.js';
import { ref, onValue, runTransaction } from 'firebase/database';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.like-share');
  if (!container) return;

  const slug = container.getAttribute('data-slug');
  const title = container.getAttribute('data-title');
  const desc = container.getAttribute('data-desc');

  const likeBtn = document.getElementById('like-btn');
  const likeCountEl = document.getElementById('like-count');
  const shareBtn = document.getElementById('share-btn');
  const shareLabelEl = document.getElementById('share-label');

  if (!slug || !likeBtn || !likeCountEl || !shareBtn || !shareLabelEl) return;

  const localStorageKey = `hellostu_liked_${slug}`;
  let hasLiked = localStorage.getItem(localStorageKey) === 'true';

  const updateLikeButtonUI = (count) => {
    likeCountEl.textContent = `${count} like${count === 1 ? '' : 's'}`;
    likeBtn.disabled = false;
    if (hasLiked) {
      likeBtn.classList.add('is-liked');
      likeBtn.setAttribute('aria-pressed', 'true');
    } else {
      likeBtn.classList.remove('is-liked');
      likeBtn.setAttribute('aria-pressed', 'false');
    }
  };

  // --- LIKES LOGIC ---
  if (db) {
    const likesRef = ref(db, `likes/${slug}`);

    // Realtime listener for likes
    onValue(likesRef, (snapshot) => {
      const count = snapshot.val() || 0;
      updateLikeButtonUI(count);
    });

    likeBtn.addEventListener('click', async () => {
      likeBtn.disabled = true;
      hasLiked = !hasLiked;

      try {
        await runTransaction(likesRef, (currentLikes) => {
          if (hasLiked) {
            return (currentLikes || 0) + 1;
          } else {
            return Math.max(0, (currentLikes || 0) - 1);
          }
        });

        if (hasLiked) {
          localStorage.setItem(localStorageKey, 'true');
        } else {
          localStorage.removeItem(localStorageKey);
        }
      } catch (err) {
        console.error('Like transaction failed:', err);
        hasLiked = !hasLiked; // Revert locally on error
      } finally {
        likeBtn.disabled = false;
      }
    });
  } else {
    // Mock mode fallback when Firebase is not configured locally
    const mockLikesKey = `hellostu_mock_likes_${slug}`;
    let currentMockLikes = parseInt(localStorage.getItem(mockLikesKey) || '0', 10);
    
    if (!localStorage.getItem(mockLikesKey)) {
      // Seed a plausible initial mock like count
      currentMockLikes = Math.floor(Math.random() * 8) + 3;
      localStorage.setItem(mockLikesKey, currentMockLikes.toString());
    }

    updateLikeButtonUI(currentMockLikes);

    likeBtn.addEventListener('click', () => {
      hasLiked = !hasLiked;
      if (hasLiked) {
        currentMockLikes += 1;
        localStorage.setItem(localStorageKey, 'true');
      } else {
        currentMockLikes = Math.max(0, currentMockLikes - 1);
        localStorage.removeItem(localStorageKey);
      }
      localStorage.setItem(mockLikesKey, currentMockLikes.toString());
      updateLikeButtonUI(currentMockLikes);
    });
  }

  // --- SHARE LOGIC ---
  shareBtn.addEventListener('click', async () => {
    const shareData = {
      title: title || document.title,
      text: desc || '',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('Native share failed:', err);
          fallbackCopy();
        }
      }
    } else {
      fallbackCopy();
    }
  });

  function fallbackCopy() {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        shareBtn.classList.add('is-copied');
        shareLabelEl.textContent = 'Link copied! 📋';

        setTimeout(() => {
          shareBtn.classList.remove('is-copied');
          shareLabelEl.textContent = 'Share';
        }, 2000);
      })
      .catch((err) => {
        console.error('Clipboard copy failed:', err);
      });
    }
});
