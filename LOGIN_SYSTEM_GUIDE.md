# 🔐 RU Broke - Login System Guide

## 🎉 What's New

Your app now has:
1. ✅ **Login/Logout System** with AsyncStorage database
2. ✅ **Renamed to "RU Broke"** in iOS simulator
3. ✅ **Beautiful Splash Screen** on app launch

---

## 📱 Demo Accounts

The app uses your sample student data for authentication. Here are the demo accounts:

### Account 1: Alex Rivera
- **Email:** `alex.rivera@rutgers.edu`
- **Password:** `Alex2001`
- **Student ID:** STU-2027-001
- **Balances:** $456.50 Dining, $1200 Meal Plan, $123.75 Campus Card

### Account 2: Maya Patel
- **Email:** `maya.patel@rutgers.edu`
- **Password:** `Maya2002`
- **Student ID:** STU-2027-002
- **Balances:** $234.00 Dining, $1200 Meal Plan, $87.50 Campus Card

### Account 3: Jordan Chen
- **Email:** `jordan.chen@rutgers.edu`
- **Password:** `Jordan2003`

### Account 4: Taylor Kim
- **Email:** `taylor.kim@rutgers.edu`
- **Password:** `Taylor2004`

### Account 5: Sam Rodriguez
- **Email:** `sam.rodriguez@rutgers.edu`
- **Password:** `Sam2005`

### Password Format
All passwords follow the pattern: **FirstName + Last4OfStudentID**

---

## 🚀 How It Works

### 1. **Splash Screen**
- Shows for 2 seconds on app launch
- Red theme with animated logo
- "RU Broke" branding

### 2. **Login Screen**
- Beautiful modern design
- Email and password fields
- Show/hide password toggle
- "View Demo Accounts" button for quick access

### 3. **Authentication State**
- Login state persisted in AsyncStorage
- Stays logged in even after app restart
- Secure session management

### 4. **Logout**
- Go to **Profile** tab
- Scroll to bottom
- Tap **Log Out** button
- Confirm logout

### 5. **Multi-User Support**
- Each user has their own data
- Transaction history linked to user ID
- Personal wallet balances
- Individual profile information

---

## 📋 Installation Steps

### 1. Install AsyncStorage

```bash
npm install @react-native-async-storage/async-storage
```

### 2. Install iOS Pods

```bash
cd ios && pod install && cd ..
```

### 3. Clear Cache & Restart

```bash
# Stop Metro bundler
pkill -f "metro"

# Clear cache
npm start -- --reset-cache
```

### 4. Run iOS App

In a new terminal:

```bash
npm run ios
```

---

## 🎨 App Name Change

The app is now branded as **"RU Broke"** and will appear with this name on your iPhone simulator home screen.

### Files Updated:
- `app.json` - Changed name to "RUBroke" and displayName to "RU Broke"
- `ios/HackFestMobileApp/Info.plist` - Updated CFBundleDisplayName to "RU Broke"

---

## 🔄 Testing the Login Flow

### First Launch:
1. ✅ See splash screen (2 seconds)
2. ✅ See login screen
3. ✅ Enter demo credentials
4. ✅ Access full app

### After Logout:
1. ✅ Tap logout in Profile tab
2. ✅ Confirm logout
3. ✅ Return to login screen
4. ✅ Can login with different account

### After App Restart:
1. ✅ See splash screen
2. ✅ Automatically logged in (if previously logged in)
3. ✅ Go directly to app

---

## 🛠️ Technical Implementation

### AuthContext (`src/context/AuthContext.tsx`)
- Manages authentication state
- Handles login/logout
- Persists session in AsyncStorage
- Provides user data to app

### DataContext Integration
- Now uses authenticated user from AuthContext
- Falls back to default user if not authenticated
- All transactions linked to current user

### App.tsx Flow
```
App Launch
    ↓
Splash Screen (2s)
    ↓
Check Auth State
    ↓
┌─────────────┬─────────────┐
│ Not Auth    │ Authenticated│
│   ↓         │      ↓      │
│ Login       │   Main App  │
│ Screen      │  Navigator  │
└─────────────┴─────────────┘
```

---

## 🎯 Key Features

### Login Screen
- ✅ Email/password authentication
- ✅ Show/hide password toggle
- ✅ Demo accounts button
- ✅ Loading state during login
- ✅ Error handling
- ✅ Beautiful modern UI

### Splash Screen
- ✅ Animated logo
- ✅ Brand colors (red theme)
- ✅ Loading progress bar
- ✅ Professional appearance

### Session Management
- ✅ Persistent login (AsyncStorage)
- ✅ Auto-login on app restart
- ✅ Secure logout
- ✅ Multi-user support

---

## 🔐 Security Notes

### Current Implementation (Demo):
- Passwords stored in plain text in code (for demo only)
- Simple password format for easy testing
- No backend authentication

### Production Recommendations:
1. **Hash passwords** - Use bcrypt or similar
2. **Backend API** - Authenticate against real server
3. **JWT tokens** - Use secure tokens instead of storing user ID
4. **Biometric auth** - Add Face ID/Touch ID support
5. **2FA** - Add two-factor authentication
6. **Password reset** - Implement email-based reset
7. **Session expiry** - Auto-logout after inactivity

---

## 📊 Database Structure

### AsyncStorage Keys:
```typescript
'@ru_broke_auth' // Stores current user_id
```

### User Data:
All user data comes from `src/data/sampleData.ts`:
- User profiles
- Transaction history
- Wallet balances
- Campus events

---

## 🐛 Troubleshooting

### "Cannot resolve module @react-native-async-storage/async-storage"
```bash
npm install @react-native-async-storage/async-storage
cd ios && pod install && cd ..
npm start -- --reset-cache
```

### "App name still shows HackFestMobileApp"
```bash
# Clean iOS build
cd ios
rm -rf build/
xcodebuild clean
cd ..

# Rebuild app
npm run ios
```

### "Login state not persisting"
- Check AsyncStorage is properly installed
- Check AuthContext is wrapping the app in App.tsx
- Check console logs for errors

### "Can't login with demo accounts"
- Check email is exactly matching (case-insensitive)
- Check password format: FirstName + Last4OfStudentID
- Use "View Demo Accounts" button to see credentials

---

## 🎉 Success!

Your RU Broke app now has:
1. ✅ Professional splash screen
2. ✅ Secure login/logout system
3. ✅ Multi-user support with sample data
4. ✅ Persistent authentication
5. ✅ Branded as "RU Broke"

**Ready to demo!** 🚀

---

## 📝 Next Steps (Optional Enhancements)

1. **Add registration flow** - Allow new users to sign up
2. **Add forgot password** - Email-based password reset
3. **Add biometric auth** - Face ID/Touch ID
4. **Add profile editing** - Update user information
5. **Add backend API** - Connect to real authentication server
6. **Add social login** - Google, Apple, Facebook
7. **Add email verification** - Verify student email addresses
8. **Add role-based access** - Student vs. Admin accounts

---

Need help? Check the code comments or reach out! 💪

