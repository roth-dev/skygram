# SkyGram

<p align="center">
  <img src="assets/images/logo.png" alt="SkyGram Logo" width="200"/>
</p>

A modern social media application built with React Native and Expo, integrating with the Bluesky social protocol. SkyGram provides a rich media experience with advanced video features, interactive feeds, and seamless cross-platform compatibility.

## 🌟 Features

### Video Experience

- **Smart Video Feed**: Intelligent video feed with auto-play and viewport detection
- **Trending Grid**: Dynamic 3x3 grid showing trending videos with smooth transitions
- **Multi-format Support**: Support for various video formats and quality levels
- **Efficient Loading**: Smart prefetching and caching for optimal performance
- **Interactive Controls**: Custom video player with gesture controls

### Core Features

- **Cross-platform**: iOS, Android, and Web support
- **Offline Support**: View cached content without network
- **Deep Linking**: Universal links with `myapp://` and `com.skygram://` schemes
- **Authentication**: Secure ATProto-based authentication
- **Analytics**: Built-in analytics with Statsig integration

## 📱 Supported Platforms

- iOS 12.0+
- Android API 21+
- Web (Progressive Web App)

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- Xcode 13+ (for iOS development)
- Android Studio (for Android development)
- [Expo CLI](https://docs.expo.dev/workflow/expo-cli/)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/skygram.git
cd skygram
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Start the development server:

```bash
# For iOS
npm run ios

# For Android
npm run android

# For web
npm run web
```

## 🏗 Project Structure

```
skygram/
├── src/
│   ├── components/
│   │   ├── feed/
│   │   │   ├── VideoTrendingGrid.tsx
│   │   │   ├── VideoPostFeed.tsx
│   │   │   └── VideoItem.tsx
│   │   └── ui/
│   │       └── common UI components
│   ├── screens/
│   │   └── video/
│   │       ├── VideoPlayerScreen.tsx
│   │       └── VideoGridScreen.tsx
│   ├── lib/
│   │   ├── app-info.ts
│   │   └── video-utils.ts
│   ├── constants/
│   │   └── index.ts
│   └── statsig/
│       └── statsig.tsx
├── ios/
│   └── SkyGram/
├── android/
│   └── app/
└── assets/
    └── images/
```

## 💻 Development

### Environment Setup

1. iOS Development:

```bash
cd ios
pod install
cd ..
```

2. Android Development:

```bash
# Update local.properties with SDK location
echo "sdk.dir=$HOME/Library/Android/sdk" > android/local.properties
```

### Key Configuration Files

- `ios/SkyGram/Info.plist`: iOS app configuration
- `android/app/build.gradle`: Android build settings
- `app.json`: Expo configuration
- `src/constants/index.ts`: App-wide constants

### Building for Production

1. iOS:

```bash
npm run ios:build
```

2. Android:

```bash
npm run android:build
```

## 🔧 API Reference

### VideoTrendingGrid

```typescript
interface VideoTrendingGridProps {
  limit?: number;
  onVideoPress?: (video: VideoItem) => void;
  layout?: "grid" | "list";
  autoPlay?: boolean;
}

// Usage
<VideoTrendingGrid
  limit={6}
  layout="grid"
  autoPlay={true}
  onVideoPress={(video) => {
    navigation.navigate("VideoPlayer", { videoId: video.id });
  }}
/>;
```

### VideoPostFeed

```typescript
interface VideoPostFeedProps {
  items: FeedPostSliceItem[];
  context: VideoFeedSourceContext;
  onRefresh?: () => void;
  onEndReached?: () => void;
}

// Usage
<VideoPostFeed
  items={feedItems}
  context={{
    type: "feedgen",
    uri: VIDEO_FEED_URI,
    sourceInterstitial: "discover",
  }}
  onEndReached={loadMoreVideos}
/>;
```

## 🤝 Contributing

### Getting Started

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

#### Code Style

- Use TypeScript for type safety
- Follow the existing component patterns
- Use `className` props for styling
- Implement proper error handling
- Add JSDoc comments for public APIs

#### Component Guidelines

- Keep components focused and single-responsibility
- Use hooks for state management
- Implement proper loading and error states
- Add appropriate accessibility attributes
- Test across different platforms

#### Testing

```bash
# Run all tests
npm run test

# Run specific test file
npm run test VideoTrendingGrid.test.tsx

# Update snapshots
npm run test -u
```

### Pull Request Process

1. Update documentation
2. Add/update tests
3. Update changelog
4. Get review from maintainers
5. Ensure CI passes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/roth-dev/skygram/issues)
- **Discussions**: [GitHub Discussions](https://github.com/roth-dev/skygram/discussions)
- **Email**: support@skygram.app

## 🙏 Acknowledgments

- [Expo](https://expo.dev) - React Native framework
- [ATProto](https://atproto.com) - Bluesky protocol
- [Statsig](https://statsig.com) - Analytics platform
- All our contributors and supporters

## 📱 Download

- [App Store](https://apps.apple.com/app/skygram)
- [Google Play](https://play.google.com/store/apps/details?id=com.rothdev.skygram)
- [Web App](https://skygram.app)
