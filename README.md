# 🎓 Smart Campus Wallet App

A comprehensive cross-platform mobile application for managing student digital wallets, transactions, and campus services with AI-powered features

## ✨ Features

### 🏠 Home / Wallet Screen
- **Multiple Wallet Types**: Dining Dollars, Event Tickets, Laundry Credits, Print Balance
- **Total Balance Overview**: See all your funds at a glance
- **Quick Actions**: Pay, Add Funds, Scan QR, and more
- **AI Spending Insights**: Smart analysis of your spending patterns with trends
- **Payment Modals**: Quick and easy fund transfers and payments

### 🎫 Digital Student ID
- **Interactive Card**: Flip between front and back views with smooth animations
- **QR Code**: For contactless authentication and access
- **Barcode**: Additional verification method
- **Profile Information**: Student ID, Major, Year
- **Quick Access Tools**: Brightness control, Share, Lock features

### 💳 Transactions Screen
- **Complete History**: All transactions with detailed information
- **AI Fraud Detection**: Real-time ML scoring for each transaction (visible scores)
- **Fraud Alerts**: Automatic blocking of suspicious activities
- **Smart Filters**: Filter by status (All, Completed, Pending, Blocked)
- **Search Functionality**: Find transactions by merchant or category
- **Spending Summary Cards**: Visual breakdown of spending patterns
- **Location Tracking**: See where transactions occurred

### 🤖 AI Chat Assistant
- **Natural Language Understanding**: Ask questions in plain English
- **Smart Responses**: Context-aware answers about:
  - Balance inquiries
  - Transaction history
  - Campus dining locations and hours
  - Fraud alerts and security
  - Spending insights and budgeting tips
- **Quick Suggestions**: Contextual action buttons for common tasks
- **Real-time Typing Indicators**: See when AI is responding
- **Chat History**: Scrollable conversation history

### 👤 Profile Screen
- **Account Overview**: Profile photo, name, email, badges
- **Statistics**: Total balance, transaction count, savings
- **Security Settings**:
  - Biometric authentication toggle
  - Fraud alerts
  - PIN management
  - Login history
- **Notifications**: Push and email preferences
- **Preferences**: Theme, language, currency
- **Support**: Help center, feedback, privacy policy

## 🎨 Design Features

- **Mobile-First**: Optimized for mobile devices
- **Modern UI**: Clean, professional design with smooth animations
- **Accessibility**: High contrast, readable fonts, clear labels
- **Cross-Platform**: Works on both iOS and Android
- **Dark Mode Ready**: Respects system theme preferences
- **Safe Areas**: Proper handling of notches and home indicators

## 🛠️ Tech Stack

- **React Native 0.82**: Cross-platform mobile framework
- **TypeScript**: Type-safe development
- **React Navigation**: Bottom tab navigation
- **React Native Vector Icons**: Material Design icons
- **Safe Area Context**: Handle device safe areas

## 📂 Project Structure

```
src/
├── navigation/
│   └── AppNavigator.tsx      # Main navigation setup
├── screens/
│   ├── HomeScreen.tsx         # Wallet & balances
│   ├── StudentIDScreen.tsx    # Digital ID card
│   ├── TransactionsScreen.tsx # Transaction history
│   ├── ChatScreen.tsx         # AI assistant
│   └── ProfileScreen.tsx      # User profile & settings
├── types/
│   └── index.ts               # TypeScript interfaces
└── data/
    └── mockData.ts            # Mock data for demo
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 20
- npm or yarn
- Xcode (for iOS)
- Android Studio (for Android)

### Installation

1. **Install Dependencies**:
```bash
npm install @react-navigation/native @react-navigation/bottom-tabs react-native-screens react-native-gesture-handler react-native-vector-icons @types/react-native-vector-icons
```

2. **iOS Setup**:
```bash
cd ios
pod install
cd ..
```

3. **Configure Vector Icons for iOS**:
Add the following to `ios/HackFestMobileApp/Info.plist`:
```xml
<key>UIAppFonts</key>
<array>
  <string>MaterialIcons.ttf</string>
</array>
```

4. **Run the App**:
```bash
# iOS
npm run ios

# Android
npm run android
```

## 📱 Key Screens & Navigation

### Bottom Tab Bar
- **Wallet** (Home): Main wallet overview
- **ID Card**: Digital student ID
- **Activity**: Transaction history
- **AI Assistant**: Chat with AI
- **Profile**: Settings and account info

## 🔒 Security Features

### AI Fraud Detection
- Real-time transaction monitoring
- ML-based risk scoring (0-100%)
- Automatic blocking of high-risk transactions
- Detailed fraud alerts with explanations
- Manual review and approval options

### Authentication
- Biometric authentication support
- PIN protection
- Login history tracking
- Session management

## 💡 AI Capabilities

The AI assistant can help with:
- ✅ Check wallet balances
- ✅ View recent transactions
- ✅ Analyze spending patterns
- ✅ Provide budget recommendations
- ✅ Find campus dining locations
- ✅ Explain fraud alerts
- ✅ Answer policy questions
- ✅ Troubleshoot issues

## 🎯 Mock Data

The app includes comprehensive mock data:
- **Student Profile**: Sample user with photo
- **4 Wallet Types**: With realistic balances
- **8 Transactions**: Including one blocked fraud case
- **Fraud Alerts**: One high-severity alert
- **Spending Insights**: 4 category breakdowns

## 🔧 Customization

### Adding New Wallets
Edit `src/data/mockData.ts` and add to the `mockWallets` array:
```typescript
{
  id: '5',
  type: 'custom',
  name: 'Your Wallet Name',
  balance: 0.00,
  currency: '$',
  icon: 'icon-name', // Material Icons name
  color: '#HEX_COLOR',
}
```

### Customizing Themes
All colors are defined in StyleSheet objects. Key colors:
- Primary: `#6366F1` (Indigo)
- Success: `#10B981` (Green)
- Warning: `#F59E0B` (Amber)
- Error: `#EF4444` (Red)

## 📊 Features Checklist

✅ Digital student ID with QR code
✅ Multiple wallet types (4 wallets)
✅ Transaction history with search/filter
✅ AI-powered fraud detection (ML scoring)
✅ Real-time fraud alerts and blocking
✅ Interactive AI chatbot assistant
✅ Payment and add funds modals
✅ Spending insights with trends
✅ Profile management
✅ Security settings
✅ Mobile-first responsive design
✅ Cross-platform (iOS & Android)
✅ TypeScript for type safety
✅ Clean, modern UI
✅ Smooth animations

## 🐛 Known Issues & Solutions

1. **Vector Icons not showing on iOS**: Run `pod install` in the ios folder
2. **Navigation issues**: Clear metro cache with `npm start -- --reset-cache`
3. **Build errors**: Try cleaning build folders:
   - iOS: `cd ios && rm -rf build && cd ..`
   - Android: `cd android && ./gradlew clean && cd ..`

## 📝 Future Enhancements

- [ ] Real backend integration
- [ ] Actual ML fraud detection model
- [ ] Push notifications
- [ ] Offline mode with sync
- [ ] Apple Pay / Google Pay integration
- [ ] Receipt scanning with OCR
- [ ] Social features (split bills)
- [ ] Campus map integration
- [ ] Event ticket QR scanning
- [ ] Budget goal setting

## 📄 License

This project is developed for HackFest 2025.

## 👥 Contributors

Byron Gomez Jr, Joshwa Sooriar, Bella Pimentel, Hansal Devre, Hanahi Castro

Built with ❤️ for the campus community.

