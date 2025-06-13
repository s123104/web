### Background
- Chart.js CDN may fail to load, causing JavaScript execution to stop before event listeners are registered. Users could not interact with the loyalty card grid.

### Impact
- Grid cells were not clickable, blocking updates on mobile/desktop.

### Test
- Manual verification in browser console: grid remains responsive even if Chart.js fails to load.

### Rollback
- Revert `Resignation.html` and `version.txt` to previous commit.
