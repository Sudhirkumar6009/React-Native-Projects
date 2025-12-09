# React Native Projects

A collection of React Native sample apps, starter templates, and learning projects. Each folder in this repository is an independent project demonstrating specific React Native features, patterns, or integrations (UI, navigation, state management, native modules, animations, etc.).

This repository is intended for:
- Learning React Native through focused example projects
- Using ready-made starter templates for new apps
- Comparing approaches (Expo vs. bare React Native)
- Rapid prototyping

> NOTE: Each project has its own folder. Please open the folder and check that project's README for project-specific setup and running instructions.

## Table of contents
- [What's included](#whats-included)
- [Prerequisites](#prerequisites)
- [General setup (how to run a project)](#general-setup-how-to-run-a-project)
  - [For Expo projects](#for-expo-projects)
  - [For React Native CLI (bare) projects](#for-react-native-cli-bare-projects)
- [Adding a new project to this repo](#adding-a-new-project-to-this-repo)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Contact](#contact)

## What's included
This repository contains multiple independent React Native projects and templates. Examples of project types you may find here:
- Small demos (buttons, lists, forms)
- Sample apps (Todo, Weather, Chat)
- Authentication examples (email/password, OAuth)
- Navigation and deep linking examples
- Animations and gesture-driven UIs
- Expo-managed and bare React Native templates

Open each top-level directory to see the project's README.md for exact details.

## Prerequisites
Install the following tools (versions may vary by project — check the project's README):
- Node.js (LTS recommended, v16+ recommended)
- npm or Yarn
- Git
- For Expo projects:
  - Expo CLI (optional, install globally: `npm install -g expo-cli`) or use `npx expo`
- For React Native CLI (bare) projects:
  - Android Studio + Android SDK (for Android)
  - Xcode (for iOS)
  - CocoaPods (macOS) for iOS native dependencies: `sudo gem install cocoapods`
  - JDK 11+ if building native Android

## General setup (how to run a project)
1. Clone the repo:
   git clone https://github.com/Sudhirkumar6009/React-Native-Projects.git
2. Change into the project folder:
   cd React-Native-Projects/<project-folder>
3. Install dependencies:
   - npm: `npm install`
   - yarn: `yarn`
4. Follow the project-specific run instructions in that project's README (Expo vs. bare RN directions differ — see below).

### For Expo projects
- Start the development server:
  expo start
  or
  npx expo start
- Use the Expo Go app (iOS/Android) or run on simulator:
  - Android emulator: press `a` in the Expo CLI or run `expo run:android`
  - iOS simulator (macOS): press `i` in the Expo CLI or run `expo run:ios`

### For React Native CLI (bare) projects
- Install dependencies and link pods (iOS):
  - cd ios && pod install && cd ..
- Run on Android:
  npx react-native run-android
- Run on iOS (macOS):
  npx react-native run-ios
- If you use Flipper or native modules, ensure Android SDK & Xcode are configured correctly.

## Adding a new project to this repo
To add a new project:
1. Create a new top-level directory with a descriptive name.
2. Add your project files and a project-specific README.md with:
   - Project purpose
   - Setup & run instructions
   - Dependencies
3. Add a short entry to this repository README (optional) describing the new project.
4. Open a pull request with your changes.

## Contributing
Contributions are welcome. Suggested workflow:
1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/my-new-project`
3. Add your project or improvements.
4. Ensure code and README are clear and tested.
5. Submit a pull request describing your changes.

When contributing example projects:
- Keep each project self-contained
- Add clear run instructions and list any native dependencies
- Avoid committing build artifacts (node_modules, .expo, /android/app/build, /ios/Pods, etc.)

## Troubleshooting
- If builds fail on iOS: run `cd ios && pod install`, then reopen the workspace in Xcode.
- If Android build fails: ensure ANDROID_HOME and PATH point to your Android SDK and the correct Java version is active.
- If Metro bundler isn't picking up files: try clearing cache: `npx react-native start --reset-cache` or `expo start -c`.
- If you see dependency version conflicts: check each project's package.json and use compatible Node/npm/Yarn versions.

## License
This repository is provided under the MIT License unless a specific project has a different license. See LICENSE file for details.

## Contact
Repository owner: Sudhirkumar6009  
If you find issues or want to propose improvements, please open an issue or submit a pull request.

Happy hacking — explore the projects, learn patterns, and contribute improvements!
