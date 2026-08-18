# 🎓 Campus Lost & Found Mobile App

A feature-rich React Native & Expo mobile application designed for university campuses to help students, faculty, and staff report, locate, and claim lost items.

---

## 📸 Screenshots & Preview

| Home Feed & Search | Report Item Form | Item Details & Contact | Profile & Live Stats |
| :---: | :---: | :---: | :---: |
| ![Home Screen](https://via.placeholder.com/250x500/1E293B/FFFFFF?text=Home+Feed+%26+Filters) | ![Report Form](https://via.placeholder.com/250x500/1E293B/FFFFFF?text=Report+Item+Form) | ![Item Details](https://via.placeholder.com/250x500/1E293B/FFFFFF?text=Item+Details+%26+Claim) | ![Profile Stats](https://via.placeholder.com/250x500/1E293B/FFFFFF?text=Profile+%26+Live+Stats) |

---

## ✨ Features Implemented

1. **🏠 Home Screen (Feed, Search & Filters)**:
   - Real-time search bar (filters by title, location, category, description).
   - Combined Category (*Electronics, Books, Clothing, Keys, Valuables, Sports, Others*) and Status (*Lost, Found, Claimed*) filter chips working together seamlessly.
   - Clean empty zero-state view with filter reset action.
   - Pull-to-refresh feeds using `RefreshControl`.

2. **📝 Report Item Form**:
   - Status toggle pill selector (*Lost* vs *Found*).
   - Form fields: Item Name, Category selector, Campus Location, Date, Detailed Description, and Contact details (Name, Phone, Email).
   - Integrated camera & gallery picker via `expo-image-picker` with live thumbnail preview and removal.
   - Form validation highlighting missing required fields.
   - Saves to local storage via `@react-native-async-storage/async-storage` and instantly updates app-wide state.

3. **🔍 Item Details Screen**:
   - High-resolution hero image header with status badge overlay.
   - Reporter contact dialog with direct call/email actions.
   - **"Mark as Claimed"** action with cross-platform confirmation modal (`customAlert`), updating status across all screens.

4. **👤 Profile & Live Stats**:
   - Live activity stats cards calculated dynamically from stored data:
     - 📊 Total Reports
     - 🔴 Active Lost Items
     - 🟢 Active Found Items
     - ✅ Claimed / Resolved Items
     - 📋 User-Submitted Reports Counter
   - Editable user profile information.
   - Option to restore default sample campus dataset.

5. **🗂️ My Reports Screen**:
   - Manage user's submitted reports with status tabs (*All*, *Active*, *Claimed*) and quick actions (*Mark Claimed*, *Delete Report*).

6. **🧭 Navigation & Layout**:
   - Bottom Tab Navigation (*Home*, *Report*, *My Reports*, *Profile*).
   - JS Stack Navigation for detail views with cross-platform web browser compatibility.

---

## 🛠️ Tech Stack & Dependencies

- **Framework**: [React Native](https://reactnative.dev/) with [Expo SDK 51](https://expo.dev/)
- **State Management**: React Context (`ItemsContext`)
- **Local Storage**: `@react-native-async-storage/async-storage`
- **Image Picker**: `expo-image-picker`
- **Navigation**: `@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/stack`
- **Icons**: `@expo/vector-icons` (`Feather`)
- **Web Support**: `react-native-web`, `react-dom`, `@expo/metro-runtime`

---

## 🚀 Setup & Installation Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/sumitwerekar-beep/campus-lost-found.git
   cd campus-lost-found
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   # Run for Web, iOS, and Android
   npx expo start

   # Or specifically for Web preview
   npx expo start --web
   ```

4. **Run on Mobile Device**:
   - Download the **Expo Go** app on iOS or Android.
   - Scan the QR code printed in the terminal.

---

## 📁 Project Structure

```text
campus-lost-found/
├── App.js                      # Application entry point with providers & web layout reset
├── app.json                    # Expo configuration manifest
├── package.json                # Dependencies & script configurations
├── assets/                     # App icons & splash screen graphics
└── src/
    ├── components/
    │   ├── EmptyState.js       # Zero-results component with filter reset
    │   ├── FilterBar.js        # Horizontal category & status selector chips
    │   ├── ItemCard.js         # Card component for list feed display
    │   └── StatusBadge.js      # Color-coded badge for Lost/Found/Claimed
    ├── context/
    │   └── ItemsContext.js     # React Context for global state & AsyncStorage sync
    ├── data/
    │   └── mockItems.js        # Initial seed dataset for campus lost & found
    ├── navigation/
    │   └── AppNavigator.js     # Bottom tabs & stack navigation container
    ├── screens/
    │   ├── HomeScreen.js       # Feed, search, category & status filters
    │   ├── ItemDetailScreen.js # Full item details & Mark as Claimed action
    │   ├── MyReportsScreen.js  # User reports management & quick actions
    │   ├── ProfileScreen.js    # User profile & live calculated stats cards
    │   └── ReportScreen.js     # Form to file lost/found report with image picker
    ├── types/
    │   └── constants.js        # Categories, statuses & styling constants
    └── utils/
        └── alert.js            # Cross-platform alert utility for Web & Mobile
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
