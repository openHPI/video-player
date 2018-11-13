## Notes
The player offers a function to add notes to positions in the video. Notes consist of a position and a text, meaning that the user took that note on that position of the video. It's possible to have notes with an empty text that are just used to mark positions. Users can create a with a Note with empty text in the control bar of a player. The note will be shown in the progress bar. Hovering over it will display a tooltip, where users can enter a text or delete that note.

The player does not store the data permanently. Instead, if you want to use this feature, you will have to make an API available for the player that can be used to achieve permanence.  The API may store the data on the server, as a cookie or in the local storage or any other place available. If you do not care about permanence, you may also just implement void operations.

### Configuration
In order to enable this functionality, you have to set the configuration option `noteApi`. This should be a name of a global object that implements four methods:

- `load(callback)` - Should get a list of stored note objects. To allow asynchronous loading, the callback should be called with the list. A note object has an `id` (integer, unique), a `position` (integer, number in seconds from video start) and a text (string) attribute. The text may be empty, in that case, the note is just used to mark this position.
- `add(position, text, callback)` - Creates a note at the given `position` with the given `text` (may be empty). The callback should be called with the `id` of the new note.
- `remove(id)` - Removes the note with the given id.
- `setText(id, text)` - Changes the text of note `id` to `text`.
