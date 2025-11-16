# 🚀 Quick Test Guide - Fiserv Cards

## ⚡ Get Started in 3 Steps

### **1. Install & Run**
```bash
npm install
cd ios && pod install && cd ..
npm start
npm run ios
```

### **2. Add Your First Card**
1. Open app → Wallet tab
2. Tap **"View Cards"** (credit card icon, first quick action)
3. Tap **"Add Your First Card"**
4. Enter:
   - Card Number: `4111111111111111`
   - Expiry: `12/25`
   - Name: `JOHN DOE`
   - Nickname: `Test Card`
   - Balance: `100`
5. Tap **"Add Card to Wallet"**
6. ✅ Done!

### **3. Test Features**
- ✅ See card in list
- ✅ Set as default
- ✅ Load $50 balance
- ✅ Add 2 more cards
- ✅ See badge count update

---

## 🎯 What to Test

| Feature | How to Test | Expected Result |
|---------|-------------|-----------------|
| View Cards | Tap "View Cards" in Wallet | Opens Cards screen |
| Card Badge | Add/remove cards | Badge shows count |
| Add Card | Fill form & submit | Card appears in list |
| Default Card | Tap "Set Default" | Badge shows on card |
| Load Balance | Tap "Load", enter amount | Balance increases |
| Remove Card | Tap "Remove", confirm | Card deleted |

---

## 📋 Test Cards

```
Visa Test:
4111111111111111
12/25

Mastercard Test:
5454545454545454
12/25

Amex Test:
371449635392376
12/25
```

---

## ✅ Success = All These Work

- [ ] "View Cards" button shows in Wallet
- [ ] Can navigate to Cards screen
- [ ] Can add a card
- [ ] Card appears with correct details
- [ ] Can set card as default
- [ ] Can load balance
- [ ] Can remove card
- [ ] Badge updates automatically

---

**Ready? Run `npm install && npm run ios` and test!** 🎉

