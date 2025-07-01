# TuneFlow - YouTube Music Player

A beautiful, modern music player web application built with React and TypeScript that integrates with the YouTube API to search and play music.

## Features

- 🎵 Search for songs using YouTube API
- 🎮 Full playback controls (play, pause, skip, repeat, shuffle)
- 📱 Responsive design for all devices
- 🎨 Modern UI with glass morphism effects
- 📋 Playlist management
- 🔊 Volume control
- ⏱️ Progress tracking
- ❤️ Like/favorite songs

## Setup Instructions

### Prerequisites

- Node.js 16+ installed
- A YouTube Data API v3 key

### Getting Started

1. **Clone or download the project**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Get YouTube API Key**
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the YouTube Data API v3
   - Create credentials (API Key)
   - Copy your API key

4. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Add your YouTube API key:
     ```
     VITE_YOUTUBE_API_KEY=your_actual_api_key_here
     ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Start searching for music!

## How to Use

1. **Search for Music**: Use the search bar to find songs, artists, or albums
2. **Play Songs**: Click the play button on any song card to start playing
3. **Manage Playlist**: Add songs to your playlist and manage the queue
4. **Player Controls**: Use the bottom player for playback control
5. **Navigation**: Switch between Search and Playlist tabs

## Demo Mode

The app includes mock data for demonstration purposes when no API key is provided. To use real YouTube data, make sure to set up your API key as described above.

## Technologies Used

- React 18
- TypeScript
- Tailwind CSS
- Lucide React (Icons)
- Vite
- YouTube Data API v3

## Contributing

Feel free to contribute to this project by submitting issues or pull requests.

## License

This project is open source and available under the MIT License.