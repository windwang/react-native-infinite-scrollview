## react-native-infinite-scrollview
ScrollView with infinte paged scrolling (no looping). The number of pages rendered before and after current page can be customized. Pages are rendered when user scrolled.

### Content
- [Installation](#installation)
- [Examples](#examples)
- [API](#api)
- [Questions?](#questions)

### Installation
```bash
npm i react-native-infinite-scrollview --save
```

### Examples
Simple Calendar example included.
![react-native-infinite-scrollview demo](https://raw.githubusercontent.com/baspellis/react-native-infinite-scrollview/master/example/video/demo.gif)

### API
- **renderPage** - Required - (Function) - Must return a component representing the page for the provided index.
- **horizontal** - Optional - (Boolean) - Scroll horizontal instead of vertical (default).
- **offScreenPages** - Optional - (Integer) - Number of pages to render before and after the current page. Default is 1 (total 3 pages are rendered).

### Questions?
Feel free to contact me via
- [Twitter](https://twitter.com/baspellis)

If you want to report a bug, please [submit an issue!](https://github.com/baspellis/react-native-infinite-scrollview/issues/new)
