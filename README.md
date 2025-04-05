# Bluesky Video Feed Component

A React Native video feed component for Bluesky social platform, built with Expo. This component provides a seamless video browsing experience with features like trending videos, video grid layouts, and smooth transitions.

## Features

- Video feed with infinite scroll
- Trending videos grid
- Author-specific video feeds
- Shared element transitions
- Video thumbnail prefetching
- Support for multiple video players
- Responsive grid layouts
- Feed type filtering (trending, author, discover)

## Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npx expo start
```

## Usage

### Video Trending Grid

```tsx
import VideoTrendingGrid from "@/components/feed/video-trending-grid";

function MyComponent() {
  return (
    <VStack>
      <Text>Trending Videos</Text>
      <VideoTrendingGrid />
    </VStack>
  );
}
```

### Video Post Feed

```tsx
import VideoPostFeed from "@/components/feed/video-post-feed";

function MyComponent() {
  const context = {
    type: "feedgen",
    uri: VIDEO_FEED_URI,
    sourceInterstitial: "discover",
  };

  return <VideoPostFeed items={feedItems} context={context} />;
}
```

## Component Architecture

### Core Components

- `VideoTrendingGrid`: Displays trending videos in a grid layout
- `VideoPostFeed`: Renders a scrollable feed of video posts
- `VideoItem`: Individual video player component with controls
- `VideoFeedSourceContext`: Context provider for feed source information

### Data Flow

```
MainFeed
  └─ VideoTrendingGrid
      └─ VideoItem
          └─ VideoPlayer
```

## Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Install dependencies: `npm install`
4. Start development server: `npx expo start`

### Code Structure

```
src/
  ├─ components/
  │   ├─ feed/
  │   │   ├─ video-trending-grid.tsx
  │   │   ├─ video-post-feed.tsx
  │   │   └─ post-feed-item.tsx
  │   └─ video/
  │       ├─ video-item.tsx
  │       └─ type.ts
  └─ state/
      └─ queries/
          └─ post-feed.ts
```

### Coding Standards

- Use TypeScript for all new components
- Follow existing component patterns
- Include proper type definitions
- Add JSDoc comments for public APIs
- Use the established styling system (className props)

### Testing

```bash
npm run test
```

### Pull Request Guidelines

1. Reference any related issues
2. Update documentation as needed
3. Add tests for new features
4. Ensure all tests pass
5. Follow the existing code style
6. Keep changes focused and atomic

## API Reference

### VideoTrendingGrid

```typescript
interface VideoTrendingGridProps {
  limit?: number;
  onVideoPress?: (video: VideoItem) => void;
}
```

### VideoPostFeed

```typescript
interface VideoPostFeedProps {
  items: FeedPostSliceItem[];
  context: VideoFeedSourceContext;
}
```

### VideoFeedSourceContext

```typescript
type VideoFeedSourceContext = {
  type: "feedgen" | "author";
  uri?: string;
  did?: string;
  filter?: AuthorFilter;
  sourceInterstitial?: "discover" | "explore" | "none";
};
```

## License

MIT License - see LICENSE file for details

## Support

- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)
- Documentation: [Project Wiki](https://github.com/your-repo/wiki)

## Acknowledgments

- Built with [Expo](https://expo.dev)
- Uses [ATProto](https://atproto.com) for Bluesky integration
