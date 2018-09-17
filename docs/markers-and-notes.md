## Markers and Notes
The player offers a function to add markers and notes to positions in the video. Notes consist of a position and a text, meaning that the user took that note on that position of the video. Marks are notes where the text is not used and thus null. Users can create both with a button in the control bar of a player. If they choose to create a note, they will be presented a text field where they can enter a text. If they just want a marker at the current position, they can click the marker button, which will create a marker.

The player does not store the data permanently. Instead, if you want to use this feature, you will have to make an API available for the player that can be used to achieve permanence.  The API may store the data on the server, as a cookie or in the local storage or any other place available. If you do not care about permanence, you may also just implement void operations.

### Configuration
In order to enable this functionality, you have to set the configuration option `noteApi`. This should be a name of a global object that implements four methods:

- `load()` - Returns a list of stored note objects. A note object has an `id` (integer, unique), a `position` (integer, number in seconds from video start) and a text (string) attribute. The text may also be null, in that case, the note is just used as a marker for the position without text.
- `add(position, text)` - Creates a note at the given `position` with the given `text` (may be null) and returns its `id`.
- `remove(id)` - Removes the note with the given id.
- `setText(id, text)` - Changes the text of note `id` to `text`. You may assume that the player will not call this function with text = null for a note id or with any marker id
