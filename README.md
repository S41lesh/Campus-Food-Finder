# Campus Food Finder

**Campus Food Finder** is a mobile application built with React Native, designed for efficient food management. This application allows users to manage food items by adding, editing, and deleting entries through an intuitive user interface.

## Features
- **Food Management:** Add, edit, and delete food items.
- **API Integration:** Connect to backend services using Axios.
- **Date & Time Picker:** Select dates using React Native DateTimePicker.
- **File and Image Uploads:** Manage files and images with Expo modules.

## Installation

1. **Clone the repository:**
   ```
   git clone https://github.com/S41lesh/Campus-Food-Finder.git
   cd Campus Food Finder
   ```

2. **Install dependencies:**
   ```
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**
   ```
   npm start
   # or
   yarn start
   ```

## Dependencies
Some of the core dependencies used in this project include:
- `@react-native-async-storage/async-storage`
- `@react-native-community/datetimepicker`
- `@react-navigation/native`
- `axios`
- `expo`
- `expo-file-system`
- `expo-image-picker`

## Folder Structure
```
Campus Food Finder/
│── App.js                 # Main app entry point
│── app.json               # App configuration
│── babel.config.js        # Babel configuration
│── package.json           # Project metadata and dependencies
│── screens/               # App screens
│   ├── AddFood.js
│   ├── AdminScreen.js
│   ├── EditFood.js
│   └── data.js            # Sample data or API responses
```

