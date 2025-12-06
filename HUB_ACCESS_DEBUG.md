# 🔍 Hub Access Update Debugging Guide

## Issue
`hasPremiumHubAccess` checkbox is not updating in the database, but `membershipType` is updating correctly.

## What We've Done

### ✅ **Frontend (Admin Page)**
The admin page is correctly sending the field:

```typescript
await onSave(user.id, {
  name: formData.name,
  email: formData.email,
  phone: formData.phone,
  membershipType: formData.membershipType,
  hasPremiumHubAccess: formData.hasPremiumHubAccess, // ✅ This is being sent
});
```

### ✅ **API Endpoint**
The API endpoint accepts all fields:

```typescript
const updates = await request.json();
// Don't filter out hasPremiumHubAccess
const user = await User.findByIdAndUpdate(id, updates, { new: true });
```

### ✅ **User Model**
The field is defined in the schema:

```typescript
hasPremiumHubAccess: { type: Boolean, default: false },
```

## How to Debug

### **Step 1: Check Browser Console**
1. Open admin users page: `/admin/users`
2. Click "Edit" on any user
3. Toggle the "Premium Hub Access" checkbox
4. Click "Save Changes"
5. Open browser console (F12)
6. Look for: `Saving user updates: { ... hasPremiumHubAccess: true/false ... }`

**Expected Output:**
```javascript
Saving user updates: {
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  membershipType: "Basic",
  hasPremiumHubAccess: true  // ← Should be here
}
```

### **Step 2: Check Server Logs**
Look at your terminal where `npm run dev` is running.

**Expected Output:**
```
Received updates for user: 507f1f77bcf86cd799439011 {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  membershipType: 'Basic',
  hasPremiumHubAccess: true  // ← Should be here
}

Updates after filtering: {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  membershipType: 'Basic',
  hasPremiumHubAccess: true  // ← Should still be here
}

Updated user hasPremiumHubAccess: true  // ← Final value
```

### **Step 3: Check Database**
If the logs show the field is being sent and processed, but it's not in the database:

```bash
# Connect to MongoDB
mongosh "mongodb+srv://224spy:jadoo@exam.nlshcxp.mongodb.net/fitsense_gym"

# Check a user
db.users.findOne({ email: "test@example.com" })

# Look for:
{
  ...
  hasPremiumHubAccess: true,  // ← Should be here
  premiumHubAccessStartDate: ISODate("..."),
  premiumHubAccessEndDate: ISODate("...")
}
```

## Possible Issues & Solutions

### **Issue 1: Field Not in Request**
**Symptom:** Browser console shows `hasPremiumHubAccess` is missing

**Solution:** Check if checkbox state is being captured
```typescript
// In EditUserModal, verify:
console.log('Form data before save:', formData);
// Should show: { ..., hasPremiumHubAccess: true/false }
```

### **Issue 2: Field Filtered Out**
**Symptom:** Server logs show field in "Received updates" but not in "Updates after filtering"

**Solution:** Check if field is being deleted
```typescript
// In API route, make sure these lines don't delete it:
delete updates.password;
delete updates.otp;
delete updates.otpExpiry;
// hasPremiumHubAccess should NOT be deleted
```

### **Issue 3: Schema Mismatch**
**Symptom:** Field reaches database but doesn't persist

**Solution:** Verify User schema has the field
```typescript
// In src/models/User.ts
hasPremiumHubAccess: { type: Boolean, default: false },
premiumHubAccessStartDate: Date,
premiumHubAccessEndDate: Date,
```

### **Issue 4: Mongoose Not Updating**
**Symptom:** Everything looks correct but value doesn't change

**Solution:** Try explicit field update
```typescript
// In API route, instead of:
const user = await User.findByIdAndUpdate(id, updates, { new: true });

// Try:
const user = await User.findById(id);
user.hasPremiumHubAccess = updates.hasPremiumHubAccess;
user.membershipType = updates.membershipType;
// ... other fields
await user.save();
```

## Quick Test

### **Test 1: Direct Database Update**
```javascript
// In MongoDB shell
db.users.updateOne(
  { email: "test@example.com" },
  { $set: { hasPremiumHubAccess: true } }
)

// Then check:
db.users.findOne({ email: "test@example.com" }).hasPremiumHubAccess
// Should return: true
```

If this works, the issue is in the API/frontend.

### **Test 2: API Direct Call**
```bash
# Using curl or Postman
curl -X PUT http://localhost:3000/api/admin/users/USER_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hasPremiumHubAccess": true
  }'
```

If this works, the issue is in the frontend.

## Expected Behavior

1. **User clicks checkbox** → `formData.hasPremiumHubAccess` changes
2. **User clicks Save** → POST request with `hasPremiumHubAccess: true/false`
3. **API receives request** → Logs show field in updates
4. **Mongoose updates** → `findByIdAndUpdate` saves to DB
5. **Database persists** → Field value changes
6. **Frontend refreshes** → New value shows in table

## Next Steps

1. **Check browser console** for the "Saving user updates" log
2. **Check server terminal** for the three console.log outputs
3. **Report back** what you see in the logs

If the logs show the field is being sent correctly but still not saving, we may need to:
- Add explicit field setting instead of bulk update
- Check for Mongoose middleware that might be interfering
- Verify MongoDB permissions

---

**Status**: Debugging in progress
**Last Updated**: 2025-12-06
